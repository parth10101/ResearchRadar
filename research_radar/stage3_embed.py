"""
Stage 3: Semantic Embedding & Dense Vector Representation
==========================================================
Structured Bibliographic Encoding + Abstract → Dense Vector via Bi-Encoders.
Literature Standards:
  - Cohan et al. (ACL 2020) SPECTER: Scientific Document Embeddings via Citation Graphs
  - Beltagy et al. (EMNLP 2019) SciBERT: Pretrained Language Model for Scientific Text
  - Su et al. (2021) Whitening Sentence Representations for Better Isotropy
  - Roy & Vetterli (2007) Dimensionality and Effective Rank of Random Signals

NOTE ON STAGE 2 BYPASS
-----------------------
This stage reads raw title + abstract directly from each paper dict — it does
NOT use Stage 2's lemmatized token lists. This is intentional.

Sentence-transformers are fine-tuned on natural-language prose sentences.
Feeding them a bag of stripped lemmas ("neural network train classif...") would
break their contextual understanding and degrade embedding quality.
Stage 2 tokens are used by Stage 4 (c-TF-IDF / topic keywords), not here.

Storage (three files per embedding run):
  {prefix}.npy           — embedding matrix, shape (N, D), float32
  {prefix}_ids.json      — parallel paper ID list (row i ↔ IDs[i])
  {prefix}_meta.json     — model name, dimension, paper count, timestamp,
                           and scientometric diagnostics (effective rank, isotropy)
"""

from __future__ import annotations

import json
import time
from pathlib import Path

import numpy as np

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None   # graceful fallback — checked before use


__all__ = [
    "MODEL_CHOICES",
    "generate_embeddings",
    "apply_whitening",
    "compute_embedding_diagnostics",
    "save_embeddings",
    "load_embeddings",
    "load_metadata",
    "cosine_topk",
    "save_similarity_groups",
    "inspect_sample_transformation",
]

MODEL_CHOICES: dict[str, str] = {
    "bge":      "BAAI/bge-small-en-v1.5",              # 384-d, ~130 MB, SOTA MTEB benchmark, 5-7x faster than SPECTER on CPU
    "gte":      "thenlper/gte-small",                  # 384-d, ~130 MB, high accuracy & lightweight
    "fast":     "all-MiniLM-L6-v2",                    # 384-d, ~80 MB, ultra-fast (~6s for 300 papers on CPU)
    "scibert":  "allenai/scibert-scivocab-uncased",    # 768-d, ~440 MB, scientific domain vocabulary
    "specter":  "allenai/specter",                     # 768-d, citation-graph tuned (heavy, slower on CPU)
    "specter2": "allenai/specter2_base",                # 768-d, multi-format scientific representation
    "accurate": "BAAI/bge-small-en-v1.5",              # Best balanced speed + semantic clustering accuracy
}

# HOW: Module-level cache so the model is only downloaded + loaded once per
# Python session, even if generate_embeddings() is called multiple times.
_MODEL_CACHE: dict[str, "SentenceTransformer"] = {}


def _resolve_device() -> str:
    """
    Auto-detects optimal compute device with guaranteed cross-platform safety:
    - If CUDA GPU is available with >= 1.5GB FREE VRAM: returns 'cuda'
    - Otherwise (CPU-only laptop, Intel Iris, AMD, Apple Silicon): returns 'cpu'
    Never throws exceptions or crashes on lower-spec hardware.
    """
    try:
        import torch
        if torch.cuda.is_available():
            idx = torch.cuda.current_device()
            free_mem, _ = torch.cuda.mem_get_info(idx)
            if free_mem >= 1.5 * (1024**3):
                return "cuda"
    except Exception:
        pass
    return "cpu"


def _get_model(model_key: str = "fast", device: str | None = None) -> "SentenceTransformer":
    if SentenceTransformer is None:
        raise ImportError(
            "sentence-transformers is not installed. "
            "Run: pip install sentence-transformers"
        )
    if device is None:
        device = _resolve_device()
    model_name = MODEL_CHOICES.get(model_key, model_key)
    cache_key = f"{model_name}_{device}"
    if cache_key not in _MODEL_CACHE:
        _MODEL_CACHE[cache_key] = SentenceTransformer(model_name, device=device)
    return _MODEL_CACHE[cache_key]


# ---------------------------------------------------------------------------
# Structured Academic Input Construction & Head-Tail Truncation
# ---------------------------------------------------------------------------

def _build_input_string(
    paper: dict,
    max_words: int = 512,
    tokenizer=None,
    max_tokens: int = 480,
) -> str:
    """
    Builds the multi-signal structured string fed to the embedding model for one paper.

    Scientometric Structure:
      "Title: {title}. Summary: {tldr}. Abstract: {abstract} Fields: {fos}."

    Literature Standards:
      - Cohan et al. (ACL 2020) SPECTER: Clean section demarcation avoids attention smearing.
      - Head-Tail Truncation: Retains both the opening context (problem/methods) and
        concluding sentences (empirical results/contributions) of the abstract,
        preventing information loss under the transformer subword token budget.
    """
    title    = (paper.get("title")    or "").strip()
    tldr     = (paper.get("tldr")     or "").strip()
    abstract = (paper.get("abstract") or "").strip()
    fos_list = paper.get("s2_fields_of_study") or []
    fos      = ", ".join(f for f in fos_list if f)

    # Build structured document sections with clean punctuation boundaries
    sections = []
    if title:
        clean_title = title.rstrip(".")
        sections.append(f"Title: {clean_title}.")
    if tldr:
        clean_tldr = tldr.rstrip(".")
        sections.append(f"Summary: {clean_tldr}.")
    if abstract:
        sections.append(f"Abstract: {abstract}")
    if fos:
        sections.append(f"Fields: {fos}.")

    combined = " ".join(sections).strip()

    if tokenizer is not None:
        # Measure subword token length
        token_ids = tokenizer.encode(combined, add_special_tokens=False)
        if len(token_ids) <= max_tokens:
            return tokenizer.decode(token_ids, skip_special_tokens=True, clean_up_tokenization_spaces=True)

        # Head-tail truncation to preserve conclusion and findings
        header_sections = []
        if title:
            header_sections.append(f"Title: {title.rstrip('.')}.")
        if tldr:
            header_sections.append(f"Summary: {tldr.rstrip('.')}.")
        if fos:
            header_sections.append(f"Fields: {fos}.")
        header_str = " ".join(header_sections)
        header_toks = tokenizer.encode(header_str, add_special_tokens=False)

        # Ensure header leaves sufficient budget for abstract
        max_header_tokens = max(10, int(max_tokens * 0.40))
        if len(header_toks) > max_header_tokens:
            header_toks = header_toks[:max_header_tokens]
            header_str = tokenizer.decode(header_toks, skip_special_tokens=True, clean_up_tokenization_spaces=True)

        # Remaining subword budget allocated to abstract
        abstract_prefix = " Abstract: "
        prefix_toks = tokenizer.encode(abstract_prefix, add_special_tokens=False)
        remaining_budget = max(8, max_tokens - len(header_toks) - len(prefix_toks))
        abs_toks = tokenizer.encode(abstract, add_special_tokens=False)

        if len(abs_toks) <= remaining_budget:
            truncated_abs_toks = abs_toks
        else:
            # 50% budget to opening (methods/problem), 50% budget to closing (findings/results)
            head_budget = max(4, int(remaining_budget * 0.50))
            tail_budget = max(4, remaining_budget - head_budget)
            truncated_abs_toks = abs_toks[:head_budget] + abs_toks[-tail_budget:]

        truncated_abstract = tokenizer.decode(
            truncated_abs_toks, skip_special_tokens=True, clean_up_tokenization_spaces=True
        )

        final_str = f"{header_str} Abstract: {truncated_abstract}".strip()
        final_ids = tokenizer.encode(final_str, add_special_tokens=False)
        if len(final_ids) > max_tokens:
            final_ids = final_ids[:max_tokens]
        return tokenizer.decode(final_ids, skip_special_tokens=True, clean_up_tokenization_spaces=True)
    else:
        # Word-level fallback
        words = combined.split()
        if len(words) <= max_words:
            return combined
        head_words = int(max_words * 0.65)
        tail_words = max_words - head_words
        return " ".join(words[:head_words] + words[-tail_words:])



# ---------------------------------------------------------------------------
# Whitening Transformation (Su et al. 2021)
# ---------------------------------------------------------------------------

def apply_whitening(
    embeddings: np.ndarray,
    target_dim: int | None = None,
    eps: float = 1e-7,
) -> tuple[np.ndarray, dict]:
    """
    Applies SVD-based Whitening transformation to dense embeddings (Su et al. 2021).
    Transforms anisotropic embedding space (narrow cone) into an isotropic hypersphere
    where covariance is the identity matrix I.

    Args:
        embeddings: np.ndarray of shape (N, D), float32
        target_dim: Optional reduced dimension (PCA-style dimensionality reduction)
        eps: Regularization factor to prevent division by near-zero singular values

    Returns:
        whitened_embeddings: np.ndarray of shape (N, D) or (N, target_dim), L2-normalized
        transform_info: dict containing 'mean' vector and 'whitening_matrix'
    """
    n, d = embeddings.shape
    if n < 2:
        return embeddings.copy(), {"mean": np.zeros(d, dtype=np.float32), "whitening_matrix": np.eye(d, dtype=np.float32)}

    # 1. Empirical mean centering
    mu = np.mean(embeddings, axis=0, keepdims=True)
    centered = embeddings - mu

    # 2. Empirical covariance matrix
    cov = (centered.T @ centered) / (n - 1)

    # 3. SVD: cov = U @ diag(S) @ V^T
    u, s, _ = np.linalg.svd(cov)

    # 4. Whitening transformation matrix: W = U @ diag(1 / sqrt(s + eps))
    inv_sqrt_s = 1.0 / np.sqrt(s + eps)
    if target_dim is not None and target_dim < d:
        u = u[:, :target_dim]
        inv_sqrt_s = inv_sqrt_s[:target_dim]

    whitening_matrix = (u @ np.diag(inv_sqrt_s)).astype(np.float32)

    # 5. Transform and re-normalize onto unit hypersphere
    whitened = centered @ whitening_matrix
    norms = np.linalg.norm(whitened, axis=1, keepdims=True)
    norms[norms < 1e-9] = 1.0
    normalized_whitened = (whitened / norms).astype(np.float32)

    return normalized_whitened, {
        "mean": mu.squeeze(0).astype(np.float32),
        "whitening_matrix": whitening_matrix,
    }


# ---------------------------------------------------------------------------
# Scientometric Diagnostics Suite (Roy & Vetterli 2007)
# ---------------------------------------------------------------------------

def compute_embedding_diagnostics(embeddings: np.ndarray) -> dict:
    """
    Computes rigorous scientometric and information-theoretic diagnostics:
    1. Mean off-diagonal cosine similarity (hyperspherical isotropy / clustering propensity)
    2. Effective rank (Roy & Vetterli 2007) via spectral entropy: exp(-sum p_k ln p_k)
    3. Dimensional variance & dead dimensions count (identifies representation collapse)
    4. Isotropy score (condition ratio: sigma_min / sigma_max)
    """
    n, d = embeddings.shape
    if n == 0 or d == 0:
        return {}

    norms = np.linalg.norm(embeddings, axis=1)
    avg_norm = float(np.mean(norms))

    # 1. Off-diagonal cosine similarity
    if n > 1:
        if n <= 1500:
            S = embeddings @ embeddings.T
            np.fill_diagonal(S, 0.0)
            mean_off_diag = float(np.sum(S) / (n * (n - 1)))
        else:
            # Monte Carlo sampling of pairs for memory safety on large N
            rng = np.random.default_rng(42)
            sample_size = 2000
            idx1 = rng.integers(0, n, size=sample_size)
            idx2 = rng.integers(0, n, size=sample_size)
            mask = idx1 != idx2
            idx1, idx2 = idx1[mask], idx2[mask]
            pair_sims = np.sum(embeddings[idx1] * embeddings[idx2], axis=1)
            mean_off_diag = float(np.mean(pair_sims))
    else:
        mean_off_diag = 1.0

    # 2. Singular Value Decomposition & Effective Rank
    s = np.linalg.svd(embeddings, compute_uv=False)
    s_sum = float(np.sum(s))
    if s_sum > 1e-9:
        p = s / s_sum
        p_nonzero = p[p > 1e-12]
        entropy = -float(np.sum(p_nonzero * np.log(p_nonzero)))
        effective_rank = float(np.exp(entropy))
    else:
        effective_rank = 1.0

    # 3. Isotropy score: ratio of min to max singular values
    max_s = float(np.max(s)) if len(s) > 0 else 1.0
    min_s = float(np.min(s)) if len(s) > 0 else 0.0
    isotropy_score = float(min_s / (max_s + 1e-9))

    # 4. Dimensional variance and dead dimension detection
    dim_vars = np.var(embeddings, axis=0)
    dead_dims = int(np.sum(dim_vars < 1e-7))

    return {
        "paper_count": n,
        "embedding_dimension": d,
        "avg_l2_norm": round(avg_norm, 4),
        "mean_off_diagonal_cosine": round(mean_off_diag, 4),
        "effective_rank": round(effective_rank, 2),
        "effective_rank_ratio": round(effective_rank / max(1, min(n, d)), 4),
        "isotropy_score": round(isotropy_score, 6),
        "dead_dimensions": dead_dims,
    }


# ---------------------------------------------------------------------------
# Batch Encoding with Dynamic Hardware Throttling
# ---------------------------------------------------------------------------

def generate_embeddings(
    papers:            list[dict],
    model_key:         str = "fast",
    batch_size:        int = 128,
    show_progress_bar: bool = False,
    normalize_mode:    str = "l2",
) -> tuple[list[str], np.ndarray]:
    """
    Encodes all papers into dense semantic representations.

    Args:
        papers            : list of paper dicts (must have 'title', 'abstract', 'id' keys)
        model_key         : key from MODEL_CHOICES ('fast', 'bge', 'specter2', etc.)
        batch_size        : target batch size (automatically throttled to available VRAM)
        show_progress_bar : whether to display progress bar (default False)
        normalize_mode    : 'l2' (standard unit norm), 'centered' (mean centered + L2),
                            or 'whitened' (SVD whitened isotropic hypersphere)

    Returns:
        ids        : list[str]   paper IDs, aligned row-for-row with embeddings
        embeddings : np.ndarray  shape (N, D), float32, normalized per normalize_mode
    """
    if not papers:
        raise ValueError(
            "generate_embeddings received an empty papers list. "
            "Ensure the corpus contains at least one paper."
        )

    device = _resolve_device()
    model = _get_model(model_key, device=device)
    tokenizer = getattr(model, "tokenizer", None)

    ids   = [p.get("id") or f"paper_{i}" for i, p in enumerate(papers)]
    texts = [_build_input_string(p, tokenizer=tokenizer) for p in papers]

    n_papers = len(papers)
    adaptive_batch = min(256, max(32, n_papers // 12))

    import torch
    if device == "cuda":
        try:
            free_mem, _ = torch.cuda.mem_get_info()
            if free_mem >= 4.0 * (1024**3):
                encode_batch = min(128, batch_size)
            elif free_mem >= 2.0 * (1024**3):
                encode_batch = min(64, batch_size)
            else:
                encode_batch = min(32, batch_size)
        except Exception:
            encode_batch = 32
    else:
        encode_batch = adaptive_batch
        try:
            import os
            optimal_threads = min(12, os.cpu_count() or 4)
            torch.set_num_threads(optimal_threads)
        except Exception:
            pass

    # Safe inference with automatic CUDA OOM fallback
    try:
        with torch.inference_mode():
            raw_embeddings = model.encode(
                texts,
                batch_size=encode_batch,
                show_progress_bar=show_progress_bar,
                convert_to_numpy=True,
                normalize_embeddings=False,
            )
    except (torch.cuda.OutOfMemoryError, RuntimeError) as e:
        if "CUDA out of memory" in str(e) or isinstance(e, getattr(torch.cuda, "OutOfMemoryError", ())):
            torch.cuda.empty_cache()
            cpu_model = _get_model(model_key, device="cpu")
            with torch.inference_mode():
                raw_embeddings = cpu_model.encode(
                    texts,
                    batch_size=adaptive_batch,
                    show_progress_bar=show_progress_bar,
                    convert_to_numpy=True,
                    normalize_embeddings=False,
                )
        else:
            raise e

    # Apply requested normalization mode
    if normalize_mode == "whitened" and len(papers) >= 2:
        embeddings, _ = apply_whitening(raw_embeddings)
    elif normalize_mode == "centered" and len(papers) >= 2:
        centered = raw_embeddings - np.mean(raw_embeddings, axis=0, keepdims=True)
        norms = np.linalg.norm(centered, axis=1, keepdims=True)
        norms[norms < 1e-9] = 1.0
        embeddings = (centered / norms).astype(np.float32)
    else:
        norms = np.linalg.norm(raw_embeddings, axis=1, keepdims=True)
        norms[norms < 1e-9] = 1.0
        embeddings = (raw_embeddings / norms).astype(np.float32)

    return ids, embeddings




# ---------------------------------------------------------------------------
# HOW: Embeddings are saved to three files — matrix, ID index, metadata
# ---------------------------------------------------------------------------

def save_embeddings(
    ids:        list[str],
    embeddings: np.ndarray,
    model_key:  str = "fast",
    out_dir:    str | Path = "data",
    prefix:     str = "embeddings",
    save_extra: bool = False,
) -> None:
    """
    Saves the embedding matrix to disk as a numpy .npy file.
    If save_extra is True, also saves {prefix}_ids.json and {prefix}_meta.json
    with comprehensive scientometric diagnostics (effective rank, isotropy).
    """
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Save the raw float32 matrix as a binary .npy file (fast, compact)
    np.save(out_dir / f"{prefix}.npy", embeddings)

    if save_extra:
        # Save the ID list as JSON so rows can be looked up by paper ID
        (out_dir / f"{prefix}_ids.json").write_text(json.dumps(ids))

        # Save metadata with scientometric diagnostics
        diagnostics = compute_embedding_diagnostics(embeddings)
        meta = {
            "model_key":   model_key,
            "model_name":  MODEL_CHOICES.get(model_key, model_key),
            "dimension":   embeddings.shape[1],
            "paper_count": embeddings.shape[0],
            "created_at":  time.strftime("%Y-%m-%dT%H:%M:%S"),
            "diagnostics": diagnostics,
        }
        (out_dir / f"{prefix}_meta.json").write_text(json.dumps(meta, indent=2))


# ---------------------------------------------------------------------------
# HOW: Embeddings are loaded back from disk into Python memory
# ---------------------------------------------------------------------------

def load_embeddings(
    in_dir: str | Path = "data",
    prefix: str = "embeddings",
) -> tuple[list[str], np.ndarray]:
    """Loads the ID list and embedding matrix from disk."""
    in_dir     = Path(in_dir)
    ids_path   = in_dir / f"{prefix}_ids.json"
    ids        = json.loads(ids_path.read_text()) if ids_path.exists() else []
    embeddings = np.load(in_dir / f"{prefix}.npy")
    return ids, embeddings


def load_metadata(
    in_dir: str | Path = "data",
    prefix: str = "embeddings",
) -> dict:
    """Loads embedding metadata (model name, dimension, count, timestamp).
    Returns an empty dict if the metadata file does not exist."""
    meta_path = Path(in_dir) / f"{prefix}_meta.json"
    if not meta_path.exists():
        return {}
    return json.loads(meta_path.read_text())


# ---------------------------------------------------------------------------
# HOW: Top-k most similar papers are found via brute-force cosine search
# ---------------------------------------------------------------------------

def cosine_topk(
    query_vec:  np.ndarray,
    ids:        list[str],
    embeddings: np.ndarray,
    k:          int = 10,
) -> list[tuple[str, float]]:
    """
    Brute-force cosine top-k search over the embedding matrix.

    The stored embeddings are pre-normalized by generate_embeddings(), so
    cosine similarity reduces to a simple dot product (embeddings @ q).
    The query vector is re-normalized defensively in case it comes from
    an external source that did not normalize it.

    At real scale, swap this for the pgvector IVFFlat ANN query described
    in report Section 3.3.3 — the API (ids, score) stays identical.

    Returns:
        list of (paper_id, cosine_score) tuples, sorted descending by score
    """
    # HOW: Defensive re-normalization of the query vector
    q       = query_vec / (np.linalg.norm(query_vec) + 1e-9)
    # HOW: Dot product of every stored embedding with query = cosine similarity
    sims    = embeddings @ q
    # HOW: argsort(-sims) gives indices sorted highest-to-lowest
    top_idx = np.argsort(-sims)[:k]
    return [(ids[i], float(sims[i])) for i in top_idx]


# ---------------------------------------------------------------------------
# HOW: Pedagogical transformation inspector — extracts subwords, token IDs,
# PyTorch tensor shapes, and layer details for a single paper sample
# ---------------------------------------------------------------------------

def inspect_sample_transformation(paper: dict, model_key: str = "fast") -> dict:
    """
    Extracts intermediate representations for a single paper sample so
    pipeline.py can display all subword tokens and token IDs.
    """
    model = _get_model(model_key)
    tokenizer = model.tokenizer

    input_str = _build_input_string(paper, tokenizer=tokenizer)
    tokens = tokenizer.tokenize(input_str)
    encoded = tokenizer(input_str, return_tensors="pt")

    token_ids = encoded["input_ids"][0].tolist()

    return {
        "input_str":       input_str,
        "word_count":      len(input_str.split()),
        "subword_tokens":  tokens,       # ALL subword tokens
        "total_subwords":  len(tokens),
        "token_ids":       token_ids,    # ALL token IDs
    }


# ---------------------------------------------------------------------------
# Full Pairwise Cosine Similarity JSON Exporter for Stage 4
# ---------------------------------------------------------------------------

def save_similarity_groups(
    ids:        list[str],
    embeddings: np.ndarray,
    papers:     list[dict],
    out_dir:    str | Path = "data",
    prefix:     str = "cosine_similarity_groups",
    top_k:      int = 5,
    chunk_size: int = 1024,
) -> Path:
    """
    Computes pairwise cosine top-K similarity in memory-bounded chunks and exports
    a sparse JSON mapping every paper to its Top-K most similar papers in the corpus.

    Complexity & Memory Boundary:
      Instead of allocating an O(N²) dense matrix in memory (which exhausts RAM at large N),
      this processes rows in blocks of chunk_size (default 1024), capping peak RAM at O(C · N).
    """
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    id_to_title = {p.get("id"): (p.get("title") or "") for p in papers}
    n = len(ids)

    kp1 = min(top_k + 1, n)
    groups = []

    # Process in row chunks to prevent O(N²) memory allocation
    for start_idx in range(0, n, chunk_size):
        end_idx = min(start_idx + chunk_size, n)
        S_chunk = embeddings[start_idx:end_idx] @ embeddings.T

        top_idx_chunk = np.argpartition(-S_chunk, kth=kp1 - 1, axis=1)[:, :kp1]

        for row_in_chunk, i in enumerate(range(start_idx, end_idx)):
            p_id = ids[i]
            cand_idx = top_idx_chunk[row_in_chunk]
            cand_scores = S_chunk[row_in_chunk, cand_idx]
            sorted_order = np.argsort(-cand_scores)

            similar_list = []
            for order_idx in sorted_order:
                j = cand_idx[order_idx]
                if j == i:
                    continue   # Skip self
                other_id = ids[j]
                similar_list.append({
                    "paper_id": other_id,
                    "title": id_to_title.get(other_id, ""),
                    "similarity_score": round(float(S_chunk[row_in_chunk, j]), 4),
                })
                if len(similar_list) >= top_k:
                    break

            groups.append({
                "query_paper_id": p_id,
                "query_title": id_to_title.get(p_id, ""),
                "similar_papers": similar_list,
            })

    output_path = out_dir / f"{prefix}.json"
    data = {
        "similarity_metric": "cosine",
        "top_k_per_paper": top_k,
        "total_papers": n,
        "groups": groups,
    }
    output_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return output_path


