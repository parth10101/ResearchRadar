"""
Stage 3: Semantic Embedding Generation
========================================
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


# ---------------------------------------------------------------------------
# HOW: Model is fetched from cache or loaded from disk/HuggingFace hub
# ---------------------------------------------------------------------------

def _get_model(model_key: str = "fast") -> "SentenceTransformer":
    if SentenceTransformer is None:
        raise ImportError(
            "sentence-transformers is not installed. "
            "Run: pip install sentence-transformers"
        )
    model_name = MODEL_CHOICES.get(model_key, model_key)
    if model_name not in _MODEL_CACHE:
        _MODEL_CACHE[model_name] = SentenceTransformer(model_name)
    return _MODEL_CACHE[model_name]


# ---------------------------------------------------------------------------
# HOW: Input string is constructed for each paper
# Title is repeated twice so the model pays 2× attention to it (Eq. 3.1)
# Natural prose is preserved — lemma tokens from Stage 2 are NOT used here
# ---------------------------------------------------------------------------

def _build_input_string(paper: dict, max_words: int = 512) -> str:
    """
    Builds the sentence fed to the embedding model for one paper.

    Formula  : title  title  abstract   (title weighted 2×)
    Truncated: to max_words (default 512) to stay within transformer limits.

    Uses raw title + abstract (natural language), NOT Stage 2 lemma tokens.
    Sentence-transformers are trained on prose — lemma bags degrade quality.
    """
    title    = (paper.get("title")    or "").strip()
    abstract = (paper.get("abstract") or "").strip()
    combined = f"{title} {title} {abstract}"   # HOW: title repeated for 2× weighting
    words    = combined.split()
    return " ".join(words[:max_words])         # HOW: hard-truncate at max_words


# ---------------------------------------------------------------------------
# HOW: All papers are encoded into a normalized dense embedding matrix
# ---------------------------------------------------------------------------

def generate_embeddings(
    papers:            list[dict],
    model_key:         str = "fast",
    batch_size:        int = 64,
    show_progress_bar: bool = False,
) -> tuple[list[str], np.ndarray]:
    """
    Encodes all papers into L2-normalized dense vectors.

    Args:
        papers            : list of paper dicts (must have 'title', 'abstract', 'id' keys)
        model_key         : 'fast' (all-MiniLM-L6-v2, 384-d) or
                            'accurate' (scibert, 768-d)
        batch_size        : how many papers are encoded in one GPU/CPU pass
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

    model = _get_model(model_key)

    # HOW: Safe ID fallback — if a paper somehow has id=None (e.g. title-less
    # entry from Stage 1), we generate a positional placeholder instead of
    # storing None in the ID list, which would silently corrupt the index.
    ids   = [p.get("id") or f"paper_{i}" for i, p in enumerate(papers)]
    texts = [_build_input_string(p) for p in papers]

    embeddings = model.encode(
        texts,
        batch_size=batch_size,
        show_progress_bar=show_progress_bar,
        convert_to_numpy=True,
        normalize_embeddings=True,   # HOW: L2-normalize so cosine sim == dot product
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
    Computes full pairwise similarity matrix S = E @ E.T and exports
    a structured JSON dataset mapping every paper ID and title to its Top-K
    most similar papers in the corpus for Stage 4 consumption.
    """
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    id_to_title = {p.get("id"): (p.get("title") or "") for p in papers}

    groups = []
    for i, p_id in enumerate(ids):
        query_vec = embeddings[i]
        sims = embeddings @ query_vec
        # Sort scores highest to lowest
        top_indices = np.argsort(-sims)
        similar_list = []
        for idx in top_indices:
            other_id = ids[idx]
            if other_id == p_id:
                continue  # Skip self
            similar_list.append({
                "paper_id": other_id,
                "title": id_to_title.get(other_id, ""),
                "similarity_score": round(float(sims[idx]), 4),
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
        "total_papers": len(ids),
        "groups": groups,
    }
    output_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return output_path

