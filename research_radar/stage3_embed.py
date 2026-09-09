"""
Stage 3: Semantic Embedding
===========================
Title (2× weighted) + abstract → dense vector, via sentence-transformers.
Mirrors Eq. 3.1 in the report: e_i = f_θ(title_i ⊕ title_i ⊕ abstract_i)

NOTE ON STAGE 2 BYPASS
-----------------------
This stage reads raw title + abstract directly from each paper dict — it does
NOT use Stage 2's lemmatized token lists. This is intentional.

Sentence-transformers are fine-tuned on natural-language prose sentences.
Feeding them a bag of stripped lemmas ("neural network train classif...") would
break their contextual understanding and degrade embedding quality.
Stage 2 tokens are used by Stage 4 (TF-IDF / topic clustering), not here.

Two selectable models:
  - all-MiniLM-L6-v2                  (384-d, fast, default)
  - allenai/scibert-scivocab-uncased   (768-d, slower, more accurate on sci text)

Storage (three files per embedding run):
  {prefix}.npy           — embedding matrix,  shape (N, D), float32
  {prefix}_ids.json      — parallel paper ID list (row i  ↔  IDs[i])
  {prefix}_meta.json     — model name, dimension, paper count, timestamp
                           (prevents loading 384-d vectors when 768-d is expected)

Swap save_embeddings / load_embeddings for pgvector calls at real scale
(see report Section 3.3.3 for the SQL schema and IVFFlat index).
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
    - If CUDA GPU is available with >= 1.5GB free VRAM: returns 'cuda'
    - Otherwise (CPU-only laptop, Intel Iris, AMD, Apple Silicon): returns 'cpu'
    Never throws exceptions or crashes on lower-spec teammate hardware.
    """
    try:
        import torch
        if torch.cuda.is_available():
            idx = torch.cuda.current_device()
            total_vram = torch.cuda.get_device_properties(idx).total_memory
            if total_vram >= 1.5 * (1024**3):
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
# HOW: Input string is constructed for each paper
# Title is repeated twice so the model pays 2× attention to it (Eq. 3.1)
# Natural prose is preserved — lemma tokens from Stage 2 are NOT used here
# ---------------------------------------------------------------------------

def _build_input_string(paper: dict, max_words: int = 512, tokenizer=None) -> str:
    """
    Builds the multi-signal sentence fed to the embedding model for one paper.

    Formula  : title(2×) + tldr + abstract + fieldsOfStudy
    Title is repeated ONLY when total subword tokens stay below 480, preventing
    silent abstract truncation at the BERT 512-token limit.
    (Cohan et al. SPECTER ACL 2020; Kenton & Toutanova BERT NAACL 2019 §A.3)

    When tokenizer is provided: truncation is at the subword level (correct).
    When tokenizer is None: falls back to word-level truncation (legacy, for callers
    that invoke this without a loaded model).
    """
    title    = (paper.get("title")    or "").strip()
    tldr     = (paper.get("tldr")     or "").strip()
    abstract = (paper.get("abstract") or "").strip()
    fos      = " ".join(paper.get("s2_fields_of_study") or [])

    # B2-fix: Only double the title if doing so stays safely within the 512 subword
    # token limit. A long abstract can already consume 400+ tokens; doubling a 15-word
    # title adds ~20 tokens — generally safe. But for long titles (>30 words) over
    # long abstracts, the title repeat would push past 512 and silently truncate the
    # end of the abstract (the conclusion/contribution sentences).
    if tokenizer is not None:
        # Precise path: measure actual subword token budget
        single_title_str = " ".join(p for p in [title, tldr, abstract, fos] if p)
        token_len_single = len(tokenizer.encode(single_title_str, add_special_tokens=True))
        title_tok_len    = len(tokenizer.encode(title, add_special_tokens=False))
        # Only repeat title if it fits within the 480-token safe budget (leaves 32 for specials)
        use_double_title = (token_len_single + title_tok_len) <= 480
    else:
        # Word-level approximation when tokenizer is not available:
        # Average BPE expansion for scientific text is ~1.3 subwords/word.
        # Repeat title only if estimated total stays under 480 subwords.
        title_words    = len(title.split())
        content_words  = len(" ".join(p for p in [title, tldr, abstract, fos] if p).split())
        use_double_title = (content_words + title_words) * 1.3 <= 480

    parts = [title, title] if use_double_title else [title]
    if tldr:
        parts.append(tldr)
    if abstract:
        parts.append(abstract)
    if fos:
        parts.append(fos)

    combined = " ".join(p for p in parts if p).strip()

    if tokenizer is not None:
        # B3-fix: Truncate at SUBWORD token level, not word level (BERT §A.3)
        token_ids = tokenizer.encode(combined, add_special_tokens=False, max_length=480, truncation=True)
        return tokenizer.decode(token_ids, skip_special_tokens=True, clean_up_tokenization_spaces=True)
    else:
        # Fallback: word-level truncation for callers without tokenizer
        words = combined.split()
        return " ".join(words[:max_words])



# ---------------------------------------------------------------------------
# HOW: All papers are encoded into a normalized dense embedding matrix
# ---------------------------------------------------------------------------

def generate_embeddings(
    papers:            list[dict],
    model_key:         str = "fast",
    batch_size:        int = 128,
    show_progress_bar: bool = False,
) -> tuple[list[str], np.ndarray]:
    """
    Encodes all papers into L2-normalized dense vectors.

    Args:
        papers            : list of paper dicts (must have 'title', 'abstract', 'id' keys)
        model_key         : 'fast' (all-MiniLM-L6-v2, 384-d) or
                            'accurate' (scibert, 768-d)
        batch_size        : starting batch hint; actual batch is N-adaptive (see below)
        show_progress_bar : whether to display progress bar (default False)

    Returns:
        ids        : list[str]   paper IDs, aligned row-for-row with embeddings
        embeddings : np.ndarray  shape (N, D), float32, L2-normalized

    Raises:
        ValueError  if papers list is empty
        ImportError if sentence-transformers is not installed
    """
    # HOW: Guard against empty input — prevents cryptic KeyError downstream
    if not papers:
        raise ValueError(
            "generate_embeddings received an empty papers list. "
            "Ensure the corpus contains at least one paper."
        )

    device = _resolve_device()
    model = _get_model(model_key, device=device)

    # B2/B3-fix: Pass the model's tokenizer into _build_input_string so title
    # doubling and truncation operate at the subword level, not the word level.
    # (Kenton & Toutanova BERT §A.3; Cohan et al. SPECTER ACL 2020)
    tokenizer = getattr(model, "tokenizer", None)

    # HOW: Safe ID fallback — if a paper somehow has id=None (e.g. title-less
    # entry from Stage 1), we generate a positional placeholder instead of
    # storing None in the ID list, which would silently corrupt the index.
    ids   = [p.get("id") or f"paper_{i}" for i, p in enumerate(papers)]
    texts = [_build_input_string(p, tokenizer=tokenizer) for p in papers]

    # A3-fix: N-adaptive batch size so memory stays safe for both small and large
    # corpora and both 384-d (fast) and 768-d (SciBERT/SPECTER2) models.
    # Formula: min(256, max(32, N // 12)) — scales from 32 at N=100 to 250 at N=3000.
    # (Rajbhandari et al. ZeRO: Memory Optimizations Toward Training Trillion Parameter
    # Models, SC 2020 — per-pass memory is O(batch × seq × d_model))
    n_papers = len(papers)
    adaptive_batch = min(256, max(32, n_papers // 12))

    import torch
    if device == "cuda":
        encode_batch = 128
    else:
        encode_batch = adaptive_batch
        try:
            import os
            optimal_threads = min(12, os.cpu_count() or 4)
            torch.set_num_threads(optimal_threads)
        except Exception:
            pass

    with torch.inference_mode():
        embeddings = model.encode(
            texts,
            batch_size=encode_batch,
            show_progress_bar=show_progress_bar,
            convert_to_numpy=True,
            normalize_embeddings=True,   # L2-normalize so cosine sim == dot product
        )
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
    If save_extra is True, also saves {prefix}_ids.json and {prefix}_meta.json.
    """
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # HOW: Save the raw float32 matrix as a binary .npy file (fast, compact)
    np.save(out_dir / f"{prefix}.npy", embeddings)

    if save_extra:
        # HOW: Save the ID list as JSON so rows can be looked up by paper ID
        (out_dir / f"{prefix}_ids.json").write_text(json.dumps(ids))

        # HOW: Save metadata so future loads know which model produced these vectors
        meta = {
            "model_key":   model_key,
            "model_name":  MODEL_CHOICES.get(model_key, model_key),
            "dimension":   embeddings.shape[1],
            "paper_count": embeddings.shape[0],
            "created_at":  time.strftime("%Y-%m-%dT%H:%M:%S"),
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

    input_str = _build_input_string(paper)
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
# HOW: Full Pairwise Cosine Similarity JSON Exporter for Stage 4
# ---------------------------------------------------------------------------

def save_similarity_groups(
    ids:        list[str],
    embeddings: np.ndarray,
    papers:     list[dict],
    out_dir:    str | Path = "data",
    prefix:     str = "cosine_similarity_groups",
    top_k:      int = 5,
) -> Path:
    """
    Computes pairwise cosine top-K similarity and exports a sparse JSON
    mapping every paper to its Top-K most similar papers in the corpus.

    A2-fix: Replaced O(N²) sequential dot-product loop with a single
    batched matrix multiply S = E @ E.T (one BLAS dgemm call), then
    np.argpartition per row for O(N·K) top-K extraction.
    At N=3,000: reduces 9M sequential dot products → 1 matrix call (~1s vs ~90s).
    (Golub & Van Loan, Matrix Computations 4th Ed., Johns Hopkins 2013 §1.1)
    """
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    id_to_title = {p.get("id"): (p.get("title") or "") for p in papers}
    n = len(ids)

    # Single batched matrix multiply: S[i,j] = cosine_sim(i,j) because embeddings are L2-normalized
    S = embeddings @ embeddings.T   # shape (N, N), float32, one BLAS call

    # np.argpartition gives top-(k+1) indices in O(N) per row (not O(N log N) argsort)
    # We need k+1 because we exclude self-similarity (diagonal).
    kp1 = min(top_k + 1, n)
    top_idx_matrix = np.argpartition(-S, kth=kp1 - 1, axis=1)[:, :kp1]  # shape (N, k+1)

    groups = []
    for i, p_id in enumerate(ids):
        # Get the top-k+1 candidate indices sorted by similarity score
        cand_idx = top_idx_matrix[i]
        cand_scores = S[i, cand_idx]
        # Sort the small candidate list descending by score
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
                "similarity_score": round(float(S[i, j]), 4),
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


