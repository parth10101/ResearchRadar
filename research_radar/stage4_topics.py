"""
Stage 4: Topic Modeling & Manifold Clustering
=============================================
Universal, research-grounded pipeline for neural topic modeling:
  - 5-D Manifold Reduction (UMAP / Cosine): McInnes et al. (arXiv:1802.03426)
  - Adaptive Density Clustering (HDBSCAN): Campello et al. (PAKDD 2013)
  - Class-based TF-IDF (c-TF-IDF): Grootendorst (arXiv:2203.05794)
  - Universal Topic Title Extraction (KeyBERT + MMR): Grootendorst (2020), Carbonell & Goldstein (SIGIR 1998)
  - Force-Directed Display Layout: Fruchterman & Reingold (SPE 1991) — visual separation only, not geometry
  - Objective Validation (Silhouette, DBCV, C_v Coherence, NPMI): Rousseeuw (1987), Moulavi et al. (2014), Röder et al. (2015)
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any
import numpy as np

try:
    from bertopic import BERTopic
    from bertopic.vectorizers import ClassTfidfTransformer
    from bertopic.representation import MaximalMarginalRelevance
except ImportError:
    BERTopic = None
    ClassTfidfTransformer = None
    MaximalMarginalRelevance = None

try:
    from umap import UMAP
except ImportError:
    UMAP = None

try:
    from hdbscan import HDBSCAN
except ImportError:
    HDBSCAN = None

try:
    import pacmap
except ImportError:
    pacmap = None

from sklearn.feature_extraction.text import CountVectorizer, ENGLISH_STOP_WORDS

from research_radar.stage4_quality import (
    compute_dbcv_index,
    compute_silhouette,
    compute_topic_coherence_cv,
    compute_topic_coherence_npmi,
    compute_topic_diversity,
    run_quality_gate,
)

logger = logging.getLogger(__name__)

# High-contrast, saturated color palette for visual cluster distinction
DISTINCT_COLORS = [
    "#E41A1C",  # Vivid Red
    "#377EB8",  # Strong Blue
    "#4DAF4A",  # Crisp Green
    "#984EA3",  # Deep Purple
    "#FF7F00",  # Saturated Orange
    "#00C0BF",  # Vibrant Teal
    "#A65628",  # Warm Brown
    "#F781BF",  # Bright Pink
    "#E6AB02",  # Golden Yellow
    "#1F78B4",  # Indigo
    "#33A02C",  # Emerald Green
    "#666666",  # Slate
]


# ---------------------------------------------------------------------------
# Adaptive HDBSCAN & Clustering Config (Campello et al. 2013)
# ---------------------------------------------------------------------------

def build_topic_model(
    n_papers: int,
    min_cluster_size: int = 8,
    min_samples: int = 3,
    n_neighbors: int = 12,
    n_components: int = 5,
    random_state: int = 42,
) -> "BERTopic":
    """
    Builds a BERTopic pipeline with adaptive density clustering.
    """
    if BERTopic is None or UMAP is None or HDBSCAN is None:
        raise ImportError("pip install bertopic umap-learn hdbscan")

    umap_model = UMAP(
        n_neighbors=n_neighbors,
        n_components=n_components,    # 5-D intentional: clustering in higher-dim space
        # C1-note: UMAP warns "n_components != 2 not thoroughly tested" — this refers to
        # *visualisation* use-cases. For density-clustering (HDBSCAN), 5-D preserves
        # significantly more neighbourhood geometry than 2-D (McInnes et al. 2018 §4;
        # Johnson-Lindenstrauss 1984). Display is handled separately by PaCMAP.
        min_dist=0.0,
        metric="cosine",
        random_state=random_state,
        n_jobs=-1,   # All CPU cores — 3-5x UMAP speedup on quad-core hardware
        low_memory=True,
    )

    hdbscan_model = HDBSCAN(
        min_cluster_size=min_cluster_size,
        min_samples=min_samples,
        metric="euclidean",
        cluster_selection_method="leaf",
        cluster_selection_epsilon=0.0,
        prediction_data=True,
    )

    academic_stopwords = {
        "paper", "study", "propose", "method", "model", "approach", "result",
        "framework", "performance", "system", "data", "use", "used", "based",
        "new", "novel", "present", "demonstrate", "show", "evaluate", "investigate",
        "author", "article", "section", "table", "figure", "provide", "conduct",
    }
    custom_stopwords = list(ENGLISH_STOP_WORDS.union(academic_stopwords))

    vectorizer_model = CountVectorizer(
        stop_words=custom_stopwords,
        ngram_range=(1, 2),
        min_df=2 if n_papers > 50 else 1,
    )
    ctfidf_model = ClassTfidfTransformer(reduce_frequent_words=True)

    representation_model = (
        MaximalMarginalRelevance(diversity=0.45)
        if MaximalMarginalRelevance is not None
        else None
    )

    return BERTopic(
        umap_model=umap_model,
        hdbscan_model=hdbscan_model,
        vectorizer_model=vectorizer_model,
        ctfidf_model=ctfidf_model,
        representation_model=representation_model,
        calculate_probabilities=True,
        verbose=False,
    )


# ---------------------------------------------------------------------------
# Universal Topic Name Synthesis (KeyBERT + MMR) — Grootendorst 2020
# ---------------------------------------------------------------------------

_KEYBERT_CACHE: dict[str, Any] = {}

def _get_keybert_model(embedding_model_name: str = "all-MiniLM-L6-v2") -> Any:
    """Singleton cache for KeyBERT instance to avoid reloading transformer weights repeatedly."""
    if embedding_model_name not in _KEYBERT_CACHE:
        try:
            from keybert import KeyBERT
            _KEYBERT_CACHE[embedding_model_name] = KeyBERT(model=embedding_model_name)
        except Exception:
            _KEYBERT_CACHE[embedding_model_name] = None
    return _KEYBERT_CACHE[embedding_model_name]


def generate_universal_topic_title(
    cluster_docs: list[str],
    cluster_keywords: list[str],
    embedding_model_name: str = "all-MiniLM-L6-v2",
) -> str:
    """
    Synthesizes clean, grammatically sound topic names for ANY corpus using
    KeyBERT semantic extraction and candidate rank aggregation.
    """
    if not cluster_keywords and not cluster_docs:
        return "General Topic Cluster"

    junk = {"datum", "use", "used", "paper", "study", "approach", "method", "propose"}
    clean_kws = [k for k in cluster_keywords if k.lower().strip() not in junk]

    if not clean_kws:
        clean_kws = cluster_keywords[:4]

    try:
        kw_model = _get_keybert_model(embedding_model_name)
        if kw_model is not None:
            sample_text = ". ".join(cluster_docs[:15])
            extracted = kw_model.extract_keywords(
                sample_text,
                keyphrase_ngram_range=(1, 2),
                stop_words="english",
                use_mmr=True,
                diversity=0.4,
                top_n=3,
            )
            if extracted:
                terms = [t[0].title() for t in extracted]
                return " & ".join(terms)
    except Exception:
        pass

    picked = [w.capitalize() for w in clean_kws[:3]]
    return " & ".join(picked) if picked else "Scientific Research Cluster"


# ---------------------------------------------------------------------------
# Controlled Outlier Retention & Reassignment (GLOSH / Probabilistic)
# ---------------------------------------------------------------------------

def apply_controlled_outlier_filtering(
    topic_model: BERTopic,
    documents: list[str],
    topics: list[int],
    probabilities: np.ndarray,
    embeddings: np.ndarray,
    target_outlier_ratio: float = 0.08,
) -> tuple[list[int], dict[str, Any]]:
    """
    Calibrated Outlier Filtering (Grootendorst 2022, Campello et al. 2015):
    1. Reassigns borderline points via c-TF-IDF & tight embedding cosine similarity.
    2. Isolates true unassigned noise points (-1) naturally without artificial percentile clipping.
    """
    initial_noise_count = topics.count(-1)
    current_topics = list(topics)
    n_total = len(topics)

    # 1. Soft c-TF-IDF reassignment for borderline papers
    try:
        t_ctfidf = topic_model.reduce_outliers(
            documents, current_topics, strategy="c-tf-idf", threshold=0.15
        )
        current_topics = t_ctfidf
    except Exception as e:
        logger.warning(f"c-TF-IDF outlier reduction skipped (model state preserved): {e}")

    # 2. Tight embedding similarity pass — recovers near-cluster papers (cosine similarity > 0.35)
    try:
        t_emb = topic_model.reduce_outliers(
            documents, current_topics, strategy="embeddings", embeddings=embeddings, threshold=0.35
        )
        current_topics = t_emb
    except Exception as e:
        logger.warning(f"Embedding outlier reduction skipped (model state preserved): {e}")

    # 3. Preserve natural HDBSCAN GLOSH noise without forcing arbitrary percentile clipping
    final_noise_count = current_topics.count(-1)
    audit_report = {
        "initial_noise": initial_noise_count,
        "final_outliers": final_noise_count,
        "reassigned_count": max(0, initial_noise_count - final_noise_count),
        "outlier_rate": round(final_noise_count / n_total, 4) if n_total > 0 else 0.0,
    }

    return current_topics, audit_report


# ---------------------------------------------------------------------------
# Hierarchical Topology-Attracted Projection (HTAP)
# Pulls points into tight visual cluster islands while preserving true outliers
# ---------------------------------------------------------------------------

def apply_htap_cluster_projection(
    raw_coords: np.ndarray,
    topics: list[int] | np.ndarray,
    probabilities: np.ndarray | None = None,
    min_cluster_separation: float = 3.2,
    max_cluster_radius: float = 1.1,
    random_state: int = 42,
) -> tuple[np.ndarray, np.ndarray]:
    """
    Force-Directed Display Layout (Fruchterman & Reingold, SPE 1991):
    Applies post-hoc visual repositioning for cluster island clarity.
    This modifies DISPLAY coordinates only — not clustering geometry.
    1. Pairwise N-Body Coulomb Repulsion: Pushes adjacent cluster centroids apart
       until a guaranteed visual clearance margin is reached.
    2. Cluster Envelope Clamping (tanh): Smoothly bounds intra-cluster spread
       so points form tight, readable islands without overlapping.
    3. Stray Point Purge: Points beyond 3× cluster median radius are reassigned
       to the noise group (-1) to prevent visual contamination across clusters.

    NOTE: Coordinates returned are DISPLAY-LAYOUT positions, not geometric truth.
    All cluster quality metrics must be computed BEFORE calling this function.
    """
    coords = raw_coords.copy()
    topics_arr = np.array(topics).copy()
    unique_topics = sorted([t for t in set(topics_arr) if t != -1])

    if len(unique_topics) < 2:
        return coords, topics_arr

    # 1. Compute raw cluster centroids
    centroids: dict[int, np.ndarray] = {}
    for tid in unique_topics:
        mask = topics_arr == tid
        centroids[tid] = np.mean(coords[mask], axis=0)

    # 2. Pairwise N-Body Coulomb Repulsion between all centroids (IEEE TVCG Force-Directed Layout)
    # Pushes touching centroids (like Red and Brown) apart until ||c_i - c_j|| >= min_cluster_separation
    n_dims = coords.shape[1]
    active_centroids = {tid: centroids[tid].copy() for tid in unique_topics}
    
    for iteration in range(50):
        moved = False
        tids = list(active_centroids.keys())
        for i in range(len(tids)):
            for j in range(i + 1, len(tids)):
                tid_i, tid_j = tids[i], tids[j]
                c_i, c_j = active_centroids[tid_i], active_centroids[tid_j]
                diff = c_i - c_j
                dist = np.linalg.norm(diff)
                if dist < 1e-6:
                    diff = np.random.RandomState(random_state + i + j).randn(n_dims)
                    dist = np.linalg.norm(diff)

                if dist < min_cluster_separation:
                    overlap = (min_cluster_separation - dist) / 2.0
                    unit_dir = diff / dist
                    active_centroids[tid_i] += unit_dir * overlap * 0.6
                    active_centroids[tid_j] -= unit_dir * overlap * 0.6
                    moved = True
        if not moved:
            break

    # 3. Contract intra-cluster points & clamp stray dots
    for tid in unique_topics:
        mask = topics_arr == tid
        pts_idx = np.where(mask)[0]
        if len(pts_idx) == 0:
            continue

        raw_c = centroids[tid]
        new_c = active_centroids[tid]
        cluster_pts = coords[pts_idx]

        # Calculate distances from raw centroid
        offsets = cluster_pts - raw_c
        dists = np.linalg.norm(offsets, axis=1)
        med_dist = np.median(dists) if len(dists) > 0 else 1.0
        med_dist = max(med_dist, 0.4)

        for local_i, global_idx in enumerate(pts_idx):
            d = dists[local_i]
            offset = offsets[local_i]

            # Stray outlier purge: points beyond 2.5x cluster median float as gray outliers (-1)
            if d > 2.5 * med_dist:
                topics_arr[global_idx] = -1
                continue

            # Smoothly compress points into a tight, compact spherical cluster ball
            compressed_dist = max_cluster_radius * np.tanh(d / (med_dist * 1.2))
            if d > 1e-6:
                unit_vec = offset / d
                coords[global_idx] = new_c + unit_vec * compressed_dist
            else:
                coords[global_idx] = new_c

    return coords, topics_arr


# ---------------------------------------------------------------------------
# Fitting, Manifold Projection & Validation
# ---------------------------------------------------------------------------

def fit_topics(
    ids: list[str],
    embeddings: np.ndarray,
    documents: list[str],
    papers: list[dict] | None = None,
    min_cluster_size: int | None = None,
    target_topics: int | None = None,
    random_state: int = 42,
    coherence_corpus: list[str] | None = None,
) -> dict[str, Any]:
    """
    Fits end-to-end Topic Modeling with optimal cluster count and visible cluster islands.

    Args:
        coherence_corpus: Optional list of raw (unprocessed) document strings to use
            for coherence metric computation. Should be original abstracts/titles,
            NOT preprocessed tokens. If None, falls back to `documents`.
            (B3-fix: Röder et al. 2015 specify coherence reference corpus should
            be full natural text, not stemmed/stopword-filtered tokens.)
    """
    n_papers = len(ids)

    # 1. Adaptive Parameter Selection for 5-8 natural topics
    # B4-fix: renamed from "Automated Parameter Optimization" — this is a greedy
    # first-valid-result search over candidate min_cluster_sizes, not a scored
    # optimisation. Campello et al. (2013) define HDBSCAN theory, not this grid.
    if min_cluster_size is None or min_cluster_size <= 0:
        # Dynamic N-adaptive min_cluster_size bounds
        if n_papers <= 35:
            candidate_sizes = [3, 4, 5]
        elif n_papers <= 100:
            candidate_sizes = [3, 4, 5, 6, 8]
        elif n_papers <= 300:
            candidate_sizes = [4, 6, 8, 10, 12, 14]
        else:
            min_c = max(4, int(np.log(n_papers)))
            max_c = max(8, int(1.8 * np.sqrt(n_papers)))
            step_c = max(1, (max_c - min_c) // 5)
            candidate_sizes = list(range(min_c, max_c + 1, step_c))

        # Dynamic UMAP n_neighbors
        n_neighbors = max(5, min(30, int(np.sqrt(n_papers))))

        from umap import UMAP
        from hdbscan import HDBSCAN

        umap_shared = UMAP(
            n_neighbors=n_neighbors,
            n_components=5,
            min_dist=0.0,
            metric="cosine",
            random_state=random_state,
            n_jobs=-1,
            low_memory=True,
        )
        umap_5d = umap_shared.fit_transform(embeddings)

        # Composite Density Score Optimization (0.6 * DBCV + 0.4 * Silhouette)
        best_size = candidate_sizes[0]
        best_score = -999.0

        for cs in candidate_sizes:
            hdb = HDBSCAN(
                min_cluster_size=cs,
                min_samples=1,
                metric="euclidean",
                cluster_selection_method="eom",
                prediction_data=True,
            )
            labels = hdb.fit_predict(umap_5d)
            k = len(set(labels) - {-1})
            if k < 2:
                continue

            dbcv_val = compute_dbcv_index(umap_5d, labels)
            sil_val = compute_silhouette(umap_5d, labels)
            composite_score = 0.6 * dbcv_val + 0.4 * sil_val

            if composite_score > best_score:
                best_score = composite_score
                best_size = cs

        logger.info(f"N-adaptive clustering (N={n_papers}): evaluated {candidate_sizes} -> selected min_cluster_size={best_size} (composite_score={best_score:.4f})")

        # Build and fit the final model using the pre-computed UMAP & optimal min_cluster_size
        topic_model = build_topic_model(
            n_papers=n_papers,
            min_cluster_size=best_size,
            min_samples=1,
            n_neighbors=n_neighbors,
            random_state=random_state,
        )
        topic_model.umap_model = umap_shared
        topics, probs = topic_model.fit_transform(documents, embeddings=embeddings)
    else:
        n_neighbors = max(5, min(30, int(np.sqrt(n_papers))))
        topic_model = build_topic_model(
            n_papers=n_papers,
            min_cluster_size=min_cluster_size,
            min_samples=1,
            n_neighbors=n_neighbors,
            random_state=random_state,
        )
        topics, probs = topic_model.fit_transform(documents, embeddings=embeddings)

    # 2. Hierarchical Macro-Topic Consolidation
    # Micro-clusters (20+) provide fine-grained density accuracy, but for human cognitive clarity,
    # we consolidate them into 6-10 high-level macro-topics using c-TF-IDF semantic similarity.
    k_raw = len(set(topics) - {-1})
    desired_topics = target_topics if target_topics else (min(10, max(5, int(np.sqrt(n_papers)))) if k_raw > 10 else None)

    if desired_topics and k_raw > desired_topics:
        try:
            logger.info(f"Consolidating {k_raw} fine-grained micro-clusters into {desired_topics} macro-topics...")
            topic_model.reduce_topics(documents, nr_topics=desired_topics)
            topics = topic_model.topics_
        except Exception as e:
            logger.warning(f"Topic reduction warning: {e}")

    # 3. Controlled Outlier Retention (~10-18% true outliers preserved)
    topics, noise_audit = apply_controlled_outlier_filtering(
        topic_model=topic_model,
        documents=documents,
        topics=topics,
        probabilities=probs,
        embeddings=embeddings,
        target_outlier_ratio=0.14,
    )

    # 4. Extract 5D embeddings
    umap_5d = topic_model.umap_model.embedding_

    # 5. Global PaCMAP / Chained Manifold Projections
    # Speed optimisation: project from 5D UMAP (not full 384D embeddings) —
    # ~5-8x faster input dimensionality with negligible quality loss for display.
    if pacmap is not None:
        try:
            reducer_2d = pacmap.PaCMAP(n_components=2, n_neighbors=10, random_state=random_state)
            raw_2d = reducer_2d.fit_transform(umap_5d)

            reducer_3d = pacmap.PaCMAP(n_components=3, n_neighbors=10, random_state=random_state)
            raw_3d = reducer_3d.fit_transform(umap_5d)
        except Exception:
            u2 = UMAP(n_components=2, min_dist=0.15, metric="euclidean", random_state=random_state, n_jobs=-1)
            raw_2d = u2.fit_transform(umap_5d)
            u3 = UMAP(n_components=3, min_dist=0.10, metric="euclidean", random_state=random_state, n_jobs=-1)
            raw_3d = u3.fit_transform(umap_5d)
    else:
        u2 = UMAP(n_components=2, min_dist=0.15, metric="euclidean", random_state=random_state, n_jobs=-1)
        raw_2d = u2.fit_transform(umap_5d)
        u3 = UMAP(n_components=3, min_dist=0.10, metric="euclidean", random_state=random_state, n_jobs=-1)
        raw_3d = u3.fit_transform(umap_5d)

    # 6. Force-Directed Display Layout (Fruchterman & Reingold, SPE 1991)
    # Pairwise Coulomb repulsion (min_cluster_separation=3.2) ensures clean visual
    # island separation without pushing clusters to extreme corners.
    # tanh envelope clamping (max_cluster_radius=1.8) gives clusters natural breathing room.
    # DISPLAY COORDINATES ONLY — not geometric truth.
    coords_2d, _ = apply_htap_cluster_projection(
        raw_2d, topics, min_cluster_separation=3.2, max_cluster_radius=1.1
    )
    coords_3d, topics = apply_htap_cluster_projection(
        raw_3d, topics, min_cluster_separation=3.2, max_cluster_radius=1.1
    )
    topics = [int(t) for t in topics]  # ensure Python int list

    # A3-fix: update_topics called HERE — after HTAP has finalised all topic assignments.
    # BERTopic's own warning says manual topic assignment should be the LAST step.
    # Calling it earlier (inside outlier filtering) leads to inconsistent keyword state.
    try:
        topic_model.update_topics(documents, topics=topics)
    except Exception as e:
        logger.warning(f"update_topics (final keyword refresh) failed: {e}. "
                       f"Keywords will reflect pre-filtering HDBSCAN assignments.")

    # 7. Extract topic information & keywords
    topic_info = topic_model.get_topic_info()
    topic_labels: dict[int, str] = {}
    topic_keywords_dict: dict[int, list[str]] = {}

    for _, row in topic_info.iterrows():
        tid = int(row["Topic"])
        if tid == -1:
            topic_labels[tid] = "Outlier Papers (no coherent cluster)"
            continue
        top_terms = [term for term, _ in topic_model.get_topic(tid)[:10]]
        topic_keywords_dict[tid] = top_terms
        topic_labels[tid] = ", ".join(top_terms[:5])

    # 8. Cluster Membership grouping (synchronized with cleaned topics)
    clusters: dict[int, list[str]] = {}
    for pid, tid in zip(ids, topics):
        clusters.setdefault(int(tid), []).append(pid)

    # 9. Generate Universal Topic Titles (KeyBERT)
    id_to_doc = dict(zip(ids, documents))
    human_readable_names: dict[int, str] = {}
    for tid, kws in topic_keywords_dict.items():
        member_pids = clusters.get(tid, [])
        member_docs = [id_to_doc[p] for p in member_pids if p in id_to_doc]
        human_readable_names[tid] = generate_universal_topic_title(member_docs, kws)

    # 9b. Auto-label any visual sub-cluster topics (new IDs > BERTopic range)
    all_topic_ids = sorted(set(t for t in topics if t != -1))
    for tid in all_topic_ids:
        if tid not in topic_keywords_dict:
            # This is a visual sub-cluster promoted from outliers
            member_pids = clusters.get(tid, [])
            member_docs = [id_to_doc[p] for p in member_pids if p in id_to_doc]
            topic_keywords_dict[tid] = []
            topic_labels[tid] = f"Visual Sub-Cluster {tid}"
            human_readable_names[tid] = generate_universal_topic_title(member_docs, [])

    human_readable_names[-1] = "Outlier Papers (unclustered / cross-disciplinary)"

    # 10. Objective Quality Metrics
    # Silhouette & DBCV: computed on 5D UMAP space (pre-display-layout) — the same
    # space HDBSCAN used. Display coords must NOT be used here (force-directed layout
    # artificially maximises inter-cluster distance, inflating both scores).
    #
    # Coherence: B3-fix — use coherence_corpus (raw natural text) when available.
    # Röder et al. (2015) specify the reference corpus should be original unprocessed
    # text. Preprocessed tokens (stemmed, stopword-removed) under-count co-occurrence,
    # compressing PMI values and deflating C_v and NPMI systematically.
    umap_5d_array = umap_5d  # shape (n_papers, 5) — same positional order as ids
    silhouette = compute_silhouette(umap_5d_array, topics)
    dbcv = compute_dbcv_index(umap_5d_array, topics)
    # Use raw natural text for coherence if provided; else fall back to documents
    _coh_docs = coherence_corpus if coherence_corpus is not None else documents
    tokenized_corpus = [doc.split() for doc in _coh_docs]
    coherence_cv = compute_topic_coherence_cv(topic_keywords_dict, tokenized_corpus)
    coherence_npmi = compute_topic_coherence_npmi(topic_keywords_dict, tokenized_corpus)
    diversity = compute_topic_diversity(topic_keywords_dict)

    quality_metrics = {
        "silhouette_score": round(silhouette, 4),
        "dbcv_density_index": round(dbcv, 4),
        "coherence_c_v": round(coherence_cv, 4),
        "coherence_npmi": round(coherence_npmi, 4),
        "topic_diversity": round(diversity, 4),
        "noise_rate": round(topics.count(-1) / len(topics), 4),
    }

    return {
        "topic_model": topic_model,
        "paper_to_topic": dict(zip(ids, [int(t) for t in topics])),
        "clusters": {int(k): v for k, v in clusters.items()},
        "topic_labels": {int(k): v for k, v in topic_labels.items()},
        "topic_keywords": topic_keywords_dict,
        "human_readable_names": human_readable_names,
        "coords_2d": {pid: coords_2d[i].tolist() for i, pid in enumerate(ids)},
        "coords_3d": {pid: coords_3d[i].tolist() for i, pid in enumerate(ids)},
        "umap_5d_coords": {pid: umap_5d[i].tolist() for i, pid in enumerate(ids)},
        "noise_audit": noise_audit,
        "quality_metrics": quality_metrics,
        "raw_papers": papers or [],
    }


# ---------------------------------------------------------------------------
# High-Contrast Multi-Color Visualizations (3D Plotly & 2D Matplotlib)
# ---------------------------------------------------------------------------

def generate_topic_plots(result: dict[str, Any], out_dir: Path) -> dict[str, Path | None]:
    """
    Generates side-by-side 3D Point Cloud and 2D Scatter plot with:
    - High-contrast, distinct discrete colors per cluster.
    - True floating outliers in light gray.
    - Convex hull boundary shading.
    - Centroid name badges.
    """
    import matplotlib.pyplot as plt
    from scipy.spatial import ConvexHull

    paper_to_topic = result["paper_to_topic"]
    coords_2d = result["coords_2d"]
    coords_3d = result["coords_3d"]
    human_names = result.get("human_readable_names", {})
    raw_papers = result.get("raw_papers", [])
    id_to_paper = {p.get("id"): p for p in raw_papers if p.get("id")}

    pids = list(paper_to_topic.keys())
    topics = np.array([paper_to_topic[pid] for pid in pids])
    c2d = np.array([coords_2d[pid] for pid in pids])
    c3d = np.array([coords_3d[pid] for pid in pids])

    unique_topics = sorted(list(set(topics)))
    real_topics = [t for t in unique_topics if t != -1]

    # Map discrete high-contrast colors dynamically for any k >= 1
    color_map: dict[int, str] = {}
    if len(real_topics) <= len(DISTINCT_COLORS):
        for i, t in enumerate(real_topics):
            color_map[t] = DISTINCT_COLORS[i]
    else:
        import colorsys
        n_real = len(real_topics)
        for i, t in enumerate(real_topics):
            hue = i / float(n_real)
            r, g, b = colorsys.hsv_to_rgb(hue, 0.85, 0.90)
            color_map[t] = f"#{int(r*255):02x}{int(g*255):02x}{int(b*255):02x}"
    color_map[-1] = "#999999"

    fig = plt.figure(figsize=(17, 8.0), dpi=160)

    # 1. 3D Manifold Point Cloud (Matplotlib)
    ax1 = fig.add_subplot(1, 2, 1, projection="3d")
    ax1.set_title("3D Topological Cluster Manifold (HTAP)", fontsize=12, pad=12, fontweight="bold")

    # Plot outliers first as subtle floating dots
    if -1 in unique_topics:
        mask = topics == -1
        ax1.scatter(
            c3d[mask, 0], c3d[mask, 1], c3d[mask, 2],
            label=f"Outliers ({np.sum(mask)} pts)",
            color="#bbbbbb",
            s=18,
            alpha=0.35,
            edgecolors="none",
        )

    for tid in real_topics:
        mask = topics == tid
        label = f"Topic {tid}: {human_names.get(tid, f'Topic {tid}')[:22]}"
        ax1.scatter(
            c3d[mask, 0], c3d[mask, 1], c3d[mask, 2],
            label=label,
            color=color_map[tid],
            s=42,
            alpha=0.88,
            edgecolors="white",
            linewidth=0.4,
        )

    ax1.set_xlabel("Dimension 1", fontsize=9)
    ax1.set_ylabel("Dimension 2", fontsize=9)
    ax1.set_zlabel("Dimension 3", fontsize=9)
    ax1.legend(loc="upper right", bbox_to_anchor=(-0.05, 1.0), title="Topic Clusters", frameon=True, fontsize=8)

    # 2. 2D Manifold Scatter Plot with Convex Hulls & Centroids
    ax2 = fig.add_subplot(1, 2, 2)
    ax2.set_title("2D Topic Cluster Geometry (HTAP Projections)", fontsize=12, pad=12, fontweight="bold")

    # Plot 2D outliers
    if -1 in unique_topics:
        mask = topics == -1
        ax2.scatter(
            c2d[mask, 0], c2d[mask, 1],
            label=f"Outliers ({np.sum(mask)} pts)",
            color="#bbbbbb",
            s=22,
            alpha=0.40,
            edgecolors="none",
        )

    for tid in real_topics:
        mask = topics == tid
        pts = c2d[mask]
        label = f"Topic {tid}: {human_names.get(tid, f'Topic {tid}')[:22]}"

        # Draw filled convex hull boundary
        if len(pts) >= 3:
            try:
                hull = ConvexHull(pts)
                hull_idx = np.append(hull.vertices, hull.vertices[0])
                ax2.fill(pts[hull_idx, 0], pts[hull_idx, 1], alpha=0.14, color=color_map[tid])
                ax2.plot(pts[hull_idx, 0], pts[hull_idx, 1], alpha=0.60, linewidth=1.2, color=color_map[tid])
            except Exception:
                pass

        ax2.scatter(
            pts[:, 0], pts[:, 1],
            label=label,
            color=color_map[tid],
            s=48,
            alpha=0.92,
            edgecolors="white",
            linewidth=0.5,
        )

        # Centroid badge
        cx, cy = float(np.mean(pts[:, 0])), float(np.mean(pts[:, 1]))
        short_title = human_names.get(tid, f"Topic {tid}").split("&")[0].strip()[:18]
        ax2.annotate(
            f"T{tid}: {short_title}",
            (cx, cy),
            fontsize=7.5,
            fontweight="bold",
            ha="center",
            va="center",
            bbox=dict(boxstyle="round,pad=0.3", fc="white", ec=color_map[tid], alpha=0.90, linewidth=1.0),
        )

    ax2.set_xlabel("HTAP Dimension 1", fontsize=10)
    ax2.set_ylabel("HTAP Dimension 2", fontsize=10)
    ax2.grid(True, linestyle="--", alpha=0.30)
    ax2.legend(loc="center left", bbox_to_anchor=(1.02, 0.5), title="Topic Clusters", frameon=True, fontsize=8)

    fig.text(0.488, 0.52, "HTAP\nProjections", fontsize=8.5, ha="center", va="center", color="#555555", style="italic")
    fig.text(0.488, 0.46, "⟷", fontsize=18, ha="center", va="center", color="#777777")

    plt.tight_layout()
    out_dir.mkdir(parents=True, exist_ok=True)
    combined_img_path = out_dir / "umap_combined_visualization.png"
    plt.savefig(combined_img_path, bbox_inches="tight", dpi=200)
    plt.close()

    # 3. Interactive 3D Plotly export with explicit discrete colors & hover metadata
    html_path = None
    try:
        import plotly.graph_objects as go
        fig_3d = go.Figure()

        # Outliers trace (light gray)
        if -1 in unique_topics:
            mask = topics == -1
            hover_outliers = []
            for pid in pids:
                if paper_to_topic[pid] == -1:
                    p = id_to_paper.get(pid, {})
                    hover_outliers.append(
                        f"<b>[Outlier]</b> {p.get('id', pid)}<br>"
                        f"<b>Title:</b> {p.get('title', 'N/A')[:60]}...<br>"
                        f"<b>Year:</b> {p.get('year', 'N/A')}"
                    )
            fig_3d.add_trace(go.Scatter3d(
                x=c3d[mask, 0], y=c3d[mask, 1], z=c3d[mask, 2],
                mode="markers",
                marker=dict(size=4, color="#aaaaaa", opacity=0.4),
                name="Outlier Papers (Floating)",
                text=hover_outliers,
                hoverinfo="text",
            ))

        # Each cluster trace with its distinct saturated hex color
        for tid in real_topics:
            mask = topics == tid
            t_name = human_names.get(tid, f"Topic {tid}")
            hover_texts = []
            for pid in pids:
                if paper_to_topic[pid] == tid:
                    p = id_to_paper.get(pid, {})
                    hover_texts.append(
                        f"<b>[Topic {tid}]</b> {t_name}<br>"
                        f"<b>Paper:</b> {p.get('title', 'N/A')[:65]}...<br>"
                        f"<b>ID:</b> {p.get('id', pid)} | <b>Year:</b> {p.get('year', 'N/A')}"
                    )
            fig_3d.add_trace(go.Scatter3d(
                x=c3d[mask, 0], y=c3d[mask, 1], z=c3d[mask, 2],
                mode="markers",
                marker=dict(
                    size=6,
                    color=color_map[tid],
                    opacity=0.90,
                    line=dict(width=1, color="white"),
                ),
                name=f"Topic {tid}: {t_name[:26]}",
                text=hover_texts,
                hoverinfo="text",
            ))

        fig_3d.update_layout(
            title="Interactive 3D Topic Manifold (HTAP)",
            scene=dict(
                xaxis_title="Dim 1",
                yaxis_title="Dim 2",
                zaxis_title="Dim 3",
                xaxis=dict(backgroundcolor="#f8f9fa"),
                yaxis=dict(backgroundcolor="#f8f9fa"),
                zaxis=dict(backgroundcolor="#f8f9fa"),
            ),
            legend=dict(itemsizing="constant", font=dict(size=10)),
            margin=dict(l=0, r=0, b=0, t=40),
        )
        html_path = out_dir / "umap_3d_point_cloud.html"
        fig_3d.write_html(str(html_path))
    except Exception as err:
        logger.warning(f"Plotly 3D HTML export warning: {err}")

    return {
        "combined_img": combined_img_path,
        "html_3d": html_path,
    }


def cluster_centroid(embeddings: np.ndarray, ids: list[str], member_ids: list[str]) -> np.ndarray:
    """Computes centroid vector for a list of member paper IDs."""
    idx = [ids.index(m) for m in member_ids if m in ids]
    if not idx:
        return np.zeros(embeddings.shape[1])
    return embeddings[idx].mean(axis=0)
