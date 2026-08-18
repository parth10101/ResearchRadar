"""
Stage 4 Quality & Validation Suite
==================================
Implements metrics and pre-clustering quality gates backed by peer-reviewed research:
  1. Quality Gate / Pre-filtering: Abstract length + near-duplicate removal
  2. Topic Coherence (NPMI & C_v): Röder et al. (WSDM 2015, DOI:10.1145/2684822.2685324)
  3. Silhouette Cluster Validation: Rousseeuw (1987, DOI:10.1016/0377-0427(87)90125-7)
  4. Density-Based Cluster Validation (DBCV): Moulavi et al. (SIAM SDM 2014)
  5. Topic Diversity: Proportion of unique keywords across topics (Grootendorst 2022)
"""

from __future__ import annotations

import math
from collections import Counter
from pathlib import Path
from typing import Any
import numpy as np
from sklearn.metrics import silhouette_score
from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances


# ---------------------------------------------------------------------------
# Phase 0: Pre-clustering Quality Gate
# ---------------------------------------------------------------------------

def run_quality_gate(
    papers: list[dict],
    min_abstract_words: int = 25,
    near_duplicate_threshold: float = 0.98,
    embeddings: np.ndarray | None = None,
) -> tuple[list[dict], list[dict], list[int]]:
    """
    Filters unviable papers before embedding or topic modeling.

    Returns:
        valid_papers   : list of accepted paper dicts
        flagged_reports: list of audit records detailing why papers were excluded
        keep_indices   : list of original indices kept
    """
    valid_papers: list[dict] = []
    flagged_reports: list[dict] = []
    keep_indices: list[int] = []

    # 1. Abstract word count filter
    length_passed_papers = []
    length_passed_indices = []

    for i, p in enumerate(papers):
        abstract = (p.get("abstract") or "").strip()
        words = abstract.split()
        if len(words) < min_abstract_words:
            flagged_reports.append({
                "paper_id": p.get("id", f"paper_{i}"),
                "title": p.get("title", ""),
                "reason": f"Abstract too short ({len(words)} words < {min_abstract_words} required threshold)",
            })
        else:
            length_passed_papers.append(p)
            length_passed_indices.append(i)

    # 2. Near-duplicate filter (if embeddings are provided)
    if embeddings is not None and len(length_passed_indices) > 1:
        sub_emb = embeddings[length_passed_indices]
        sim_mat = cosine_similarity(sub_emb)
        n = len(length_passed_indices)
        seen_duplicates: set[int] = set()

        for i in range(n):
            if i in seen_duplicates:
                continue
            orig_i = length_passed_indices[i]
            valid_papers.append(papers[orig_i])
            keep_indices.append(orig_i)

            for j in range(i + 1, n):
                if j in seen_duplicates:
                    continue
                if sim_mat[i, j] >= near_duplicate_threshold:
                    orig_j = length_passed_indices[j]
                    flagged_reports.append({
                        "paper_id": papers[orig_j].get("id", f"paper_{orig_j}"),
                        "title": papers[orig_j].get("title", ""),
                        "reason": (
                            f"Near-duplicate (cosine similarity {sim_mat[i, j]:.4f} >= {near_duplicate_threshold} "
                            f"with {papers[orig_i].get('id')})"
                        ),
                    })
                    seen_duplicates.add(j)
    else:
        valid_papers = length_passed_papers
        keep_indices = length_passed_indices

    return valid_papers, flagged_reports, keep_indices


# ---------------------------------------------------------------------------
# Topic Coherence (NPMI & C_v) — Pure Python / Vectorized Implementation
# Reference: Röder et al. (WSDM 2015) "Exploring the Space of Topic Coherence Measures"
# ---------------------------------------------------------------------------

def compute_topic_coherence_npmi(
    topic_keywords: dict[int, list[str]],
    tokenized_corpus: list[list[str]],
    top_n: int = 10,
    eps: float = 1e-12,
) -> float:
    """
    Computes Normalized Pointwise Mutual Information (NPMI) topic coherence across all topics.
    Ranges from -1 (never co-occur) to +1 (perfect co-occurrence). Higher is better.
    """
    if not topic_keywords or not tokenized_corpus:
        return 0.0

    total_docs = len(tokenized_corpus)
    if total_docs == 0:
        return 0.0

    doc_sets = [set(doc) for doc in tokenized_corpus]

    def doc_freq(word: str) -> int:
        return sum(1 for s in doc_sets if word in s)

    def co_doc_freq(w1: str, w2: str) -> int:
        return sum(1 for s in doc_sets if w1 in s and w2 in s)

    topic_npmi_scores = []

    for tid, words in topic_keywords.items():
        if tid == -1 or not words:
            continue
        words_eval = words[:top_n]
        k = len(words_eval)
        if k < 2:
            continue

        pair_scores = []
        for i in range(k):
            w_i = words_eval[i].lower()
            p_i = (doc_freq(w_i) + 1.0) / (total_docs + 2.0)

            for j in range(i + 1, k):
                w_j = words_eval[j].lower()
                p_j = (doc_freq(w_j) + 1.0) / (total_docs + 2.0)
                # D2-fix: joint probability has 4 binary states (both/neither/only-i/only-j)
                # → correct Laplace denominator is total_docs+4, not total_docs+2
                p_ij = (co_doc_freq(w_i, w_j) + 1.0) / (total_docs + 4.0)

                pmi = math.log((p_ij / (p_i * p_j)) + eps)
                npmi = pmi / (-math.log(p_ij + eps))
                npmi = max(-1.0, min(1.0, npmi))
                pair_scores.append(npmi)

        if pair_scores:
            topic_npmi_scores.append(float(np.mean(pair_scores)))

    if not topic_npmi_scores:
        return 0.0
    return float(np.mean(topic_npmi_scores))


def compute_topic_coherence_cv(
    topic_keywords: dict[int, list[str]],
    tokenized_corpus: list[list[str]],
    top_n: int = 10,
    eps: float = 1e-12,
) -> float:
    """
    Computes confirmation-based C_v coherence approximation using cosine similarity of NPMI profiles.
    Reference: Röder et al. (WSDM 2015) Section 4.3.
    """
    if not topic_keywords or not tokenized_corpus:
        return 0.0

    total_docs = len(tokenized_corpus)
    doc_sets = [set(doc) for doc in tokenized_corpus]

    def doc_freq(word: str) -> int:
        return sum(1 for s in doc_sets if word in s)

    def co_doc_freq(w1: str, w2: str) -> int:
        return sum(1 for s in doc_sets if w1 in s and w2 in s)

    cv_scores = []

    for tid, words in topic_keywords.items():
        if tid == -1 or not words:
            continue
        words_eval = [w.lower() for w in words[:top_n]]
        k = len(words_eval)
        if k < 2:
            continue

        vectors = np.zeros((k, k), dtype=np.float32)
        for i in range(k):
            w_i = words_eval[i]
            p_i = (doc_freq(w_i) + 1.0) / (total_docs + 2.0)
            for j in range(k):
                w_j = words_eval[j]
                p_j = (doc_freq(w_j) + 1.0) / (total_docs + 2.0)
                # D2-fix: joint probability denominator is +4 (4 binary states)
                p_ij = (co_doc_freq(w_i, w_j) + 1.0) / (total_docs + 4.0)

                pmi = math.log((p_ij / (p_i * p_j)) + eps)
                npmi = pmi / (-math.log(p_ij + eps))
                vectors[i, j] = max(-1.0, min(1.0, npmi))

        norms = np.linalg.norm(vectors, axis=1, keepdims=True) + eps
        vectors = vectors / norms

        cos_matrix = np.dot(vectors, vectors.T)
        triu_indices = np.triu_indices(k, k=1)
        sims = cos_matrix[triu_indices]
        if len(sims) > 0:
            cv_scores.append(float(np.mean(sims)))

    if not cv_scores:
        return 0.0
    return float(np.mean(cv_scores))


# ---------------------------------------------------------------------------
# Silhouette & Density-Based Validation (Rousseeuw 1987 / Moulavi et al. 2014)
# ---------------------------------------------------------------------------

def compute_silhouette(
    features: np.ndarray,
    topics: list[int] | np.ndarray,
) -> float:
    """
    Computes standard Silhouette score over non-noise points (-1 excluded).
    Range: [-1, +1]. Values > 0.25 indicate well-separated cluster geometry.
    """
    topics_arr = np.array(topics)
    non_noise_mask = topics_arr != -1
    valid_labels = topics_arr[non_noise_mask]

    if len(valid_labels) < 2 or len(set(valid_labels)) < 2:
        return 0.0

    score = silhouette_score(
        features[non_noise_mask],
        valid_labels,
        metric="cosine",  # B2-fix: match UMAP training metric (cosine); euclidean
                          # would mismatch the geometry of the cosine-UMAP embedding space
    )
    return float(score)


def compute_dbcv_index(
    features: np.ndarray,
    topics: list[int] | np.ndarray,
) -> float:
    """
    Computes Density-Based Clustering Validation (DBCV) approximation (Moulavi et al. SIAM SDM 2014).
    Compares intra-cluster density sparseness against inter-cluster density separation.
    Range: [-1, +1]. Higher is better.
    """
    topics_arr = np.array(topics)
    unique_labels = sorted([t for t in set(topics_arr) if t != -1])
    if len(unique_labels) < 2:
        return 0.0

    cluster_centroids = []
    intra_spreads = []

    for label in unique_labels:
        mask = topics_arr == label
        pts = features[mask]
        centroid = np.mean(pts, axis=0)
        cluster_centroids.append(centroid)
        # Average distance to centroid (intra-cluster dispersion)
        spread = np.mean(np.linalg.norm(pts - centroid, axis=1))
        intra_spreads.append(spread)

    cluster_centroids = np.array(cluster_centroids)
    inter_dists = euclidean_distances(cluster_centroids)
    np.fill_diagonal(inter_dists, np.inf)
    min_inter_dists = np.min(inter_dists, axis=1)

    validity_scores = []
    for i in range(len(unique_labels)):
        d_sep = min_inter_dists[i]
        d_com = intra_spreads[i]
        val = (d_sep - d_com) / max(d_sep, d_com, 1e-9)
        validity_scores.append(val)

    return float(np.mean(validity_scores))


# ---------------------------------------------------------------------------
# Topic Diversity Metric (Grootendorst 2022)
# ---------------------------------------------------------------------------

def compute_topic_diversity(
    topic_keywords: dict[int, list[str]],
    top_n: int = 10,
) -> float:
    """
    Computes proportion of unique keywords in the top-N across all topics.
    Range: [0, 1]. Values > 0.60 show non-redundant, distinct topic representations.
    """
    all_words: list[str] = []
    for tid, words in topic_keywords.items():
        if tid == -1:
            continue
        # D1-fix: decompose bigrams into unigrams before measuring diversity.
        # CountVectorizer uses ngram_range=(1,2), so keywords may be bigrams like
        # "federated learning". Treating bigrams as atomic tokens means "federated
        # learning" and "federated" are counted as different items, biasing diversity
        # upward. Decomposing to unigrams ensures fair comparison (Lau & Baldwin 2016).
        for w in words[:top_n]:
            all_words.extend(w.lower().strip().split())

    if not all_words:
        return 0.0

    unique_words = set(all_words)
    return float(len(unique_words) / len(all_words))
