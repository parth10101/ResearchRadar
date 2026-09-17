"""
Unit tests for Stage 4 Scientometric Rigor & Numerical Architecture Overhaul
===========================================================================
Verifies that Stage 4 neural topic modeling, manifold projection,
coherence calculation, and validation metrics adhere to doctoral standards:
  - Bigram and multi-word phrase coherence detection (no zero-frequency penalty)
  - True metric-space cluster validation on unit embeddings
  - Visual layout decoupling (HTAP preserves ground-truth cluster assignments)
  - Statistical homonym gating safeguarding legitimate interdisciplinary topics
  - Strict preservation of fit_topics data contract (all 13 keys preserved)
"""

import unittest
import numpy as np

from research_radar.stage4_quality import (
    compute_topic_coherence_npmi,
    compute_topic_coherence_cv,
    compute_silhouette,
    compute_dbcv_index,
    compute_topic_diversity,
    run_quality_gate,
)
from research_radar.stage4_topics import (
    apply_htap_cluster_projection,
    generate_topic_representation,
    fit_topics,
)


class TestStage4ScientometricRigor(unittest.TestCase):

    # -------------------------------------------------------------------------
    # Test 1: Multi-Word N-Gram Coherence Detection
    # -------------------------------------------------------------------------
    def test_bigram_phrase_coherence_detection(self):
        """Coherence metrics must accurately match bigram phrases in document text."""
        tokenized_corpus = [
            ["graph", "neural", "networks", "for", "molecular", "property", "prediction"],
            ["graph", "neural", "network", "architectures", "and", "benchmarks"],
            ["deep", "learning", "with", "graph", "neural", "networks"],
            ["convolutional", "neural", "networks", "for", "computer", "vision"],
        ]
        # Topic containing unigrams and bigrams
        topic_keywords = {
            0: ["graph neural", "networks", "molecular", "architectures"],
            1: ["convolutional", "vision"],
        }

        npmi = compute_topic_coherence_npmi(topic_keywords, tokenized_corpus)
        cv = compute_topic_coherence_cv(topic_keywords, tokenized_corpus)

        # "graph neural" appears in 3 out of 4 documents -> must have positive coherence
        self.assertGreater(npmi, 0.0, f"NPMI was non-positive ({npmi}) due to bigram mismatch!")
        self.assertGreater(cv, 0.0, f"C_v was non-positive ({cv}) due to bigram mismatch!")
        self.assertLessEqual(npmi, 1.0)
        self.assertLessEqual(cv, 1.0)

    # -------------------------------------------------------------------------
    # Test 2: Metric-Space Cluster Validation (Silhouette & DBCV)
    # -------------------------------------------------------------------------
    def test_metric_space_validation(self):
        """Silhouette and DBCV must compute mathematically valid bounded scores on unit embeddings."""
        rng = np.random.default_rng(42)
        n, d = 60, 32
        # Create two distinct well-separated clusters on unit hypersphere
        c1 = rng.normal(loc=1.0, scale=0.2, size=(30, d))
        c2 = rng.normal(loc=-1.0, scale=0.2, size=(30, d))
        features = np.vstack([c1, c2])
        features = features / np.linalg.norm(features, axis=1, keepdims=True)

        topics = [0] * 30 + [1] * 30

        sil = compute_silhouette(features, topics)
        dbcv = compute_dbcv_index(features, topics)

        # Two tight separated clusters should have positive silhouette and dbcv
        self.assertGreater(sil, 0.40, f"Silhouette score ({sil}) was too low for well-separated clusters!")
        self.assertGreater(dbcv, 0.0, f"DBCV score ({dbcv}) was non-positive for well-separated clusters!")
        self.assertLessEqual(sil, 1.0)
        self.assertLessEqual(dbcv, 1.0)

        # Ensure noise points (-1) are safely excluded without error
        topics_with_noise = list(topics)
        topics_with_noise[0] = -1
        topics_with_noise[30] = -1
        sil_noise = compute_silhouette(features, topics_with_noise)
        self.assertGreater(sil_noise, 0.30)

    # -------------------------------------------------------------------------
    # Test 3: Visual Layout Decoupling (No Data Dredging)
    # -------------------------------------------------------------------------
    def test_visual_layout_does_not_mutate_topic_assignments(self):
        """HTAP force-directed display layout must NOT reassign points to noise (-1)."""
        rng = np.random.default_rng(99)
        n = 40
        # 2D coordinates with some peripheral points
        raw_coords = rng.normal(loc=0.0, scale=1.0, size=(n, 2))
        # Add deliberate peripheral outliers
        raw_coords[0] = [10.0, 10.0]
        raw_coords[1] = [-10.0, -10.0]

        topics = [0] * 20 + [1] * 20
        original_topics = list(topics)

        new_coords, new_topics = apply_htap_cluster_projection(
            raw_coords, topics, min_cluster_separation=2.0, max_cluster_radius=1.0
        )

        # Coordinates are repositioned/clamped for visual display
        self.assertFalse(np.allclose(new_coords, raw_coords))
        # But cluster assignments MUST remain identical (no visual data dredging)
        self.assertEqual(list(new_topics), original_topics, "HTAP mutated cluster assignments based on screen distance!")

    # -------------------------------------------------------------------------
    # Test 4: Topic Diversity Decomposition
    # -------------------------------------------------------------------------
    def test_topic_diversity(self):
        """Topic diversity must correctly decompose phrases into unigrams."""
        topic_keywords = {
            0: ["graph neural", "molecular representation", "gnn"],
            1: ["transformer architecture", "attention mechanism", "self attention"],
        }
        div = compute_topic_diversity(topic_keywords)
        self.assertGreater(div, 0.70)
        self.assertLessEqual(div, 1.0)

    # -------------------------------------------------------------------------
    # Test 5: End-to-End Contract & Key Verification
    # -------------------------------------------------------------------------
    def test_fit_topics_full_data_contract(self):
        """fit_topics must return all 13 canonical keys with valid non-crashing execution."""
        n, d = 25, 16
        rng = np.random.default_rng(77)
        raw = rng.standard_normal((n, d))
        embeddings = (raw / np.linalg.norm(raw, axis=1, keepdims=True)).astype(np.float32)

        ids = [f"p_{i}" for i in range(n)]
        documents = [
            f"Paper {i} investigates graph neural networks, molecular property prediction, and node embeddings."
            if i % 2 == 0 else
            f"Paper {i} examines transformer self attention, language modeling, and natural language understanding."
            for i in range(n)
        ]
        papers = [{"id": pid, "title": f"Title of Paper {pid}", "abstract": doc} for pid, doc in zip(ids, documents)]

        result = fit_topics(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            papers=papers,
            min_cluster_size=3,
        )

        expected_keys = [
            "topic_model",
            "paper_to_topic",
            "clusters",
            "topic_labels",
            "topic_keywords",
            "human_readable_names",
            "topic_representations",
            "coords_2d",
            "coords_3d",
            "umap_5d_coords",
            "noise_audit",
            "quality_metrics",
            "raw_papers",
        ]

        for key in expected_keys:
            self.assertIn(key, result, f"Expected key '{key}' missing from fit_topics output!")

        # Quality metrics must have all 6 indicators
        qm = result["quality_metrics"]
        for q_key in ["silhouette_score", "dbcv_density_index", "coherence_c_v", "coherence_npmi", "topic_diversity", "noise_rate"]:
            self.assertIn(q_key, qm, f"Quality metric '{q_key}' missing!")


if __name__ == "__main__":
    unittest.main()
