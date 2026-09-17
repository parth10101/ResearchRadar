"""
Unit tests for Stage 3 Scientometric Rigor & Numerical Architecture Overhaul
===========================================================================
Verifies that Stage 3 semantic embedding, input string construction, whitening,
diagnostics, and memory-bounded similarity group export adhere strictly to
doctoral examination committee standards:
  - Structured academic input formatting (no duplicate title attention distortion)
  - Head-tail subword truncation preserving abstract conclusions/findings
  - SVD whitening transformation restoring hyperspherical isotropy
  - Scientometric diagnostics: effective spectral rank and mean off-diagonal cosine
  - Memory-bounded chunked similarity matching full dense matrix calculations
  - Hardware device safety and empty input guards
"""

import unittest
import tempfile
import json
from pathlib import Path
import numpy as np

from research_radar.stage3_embed import (
    _build_input_string,
    _resolve_device,
    apply_whitening,
    compute_embedding_diagnostics,
    save_similarity_groups,
    generate_embeddings,
    cosine_topk,
)


class MockTokenizer:
    """Deterministic whitespace subword tokenizer for rigorous unit testing without network weights."""
    def encode(self, text, add_special_tokens=False, max_length=None, truncation=False):
        toks = text.split()
        if truncation and max_length is not None:
            toks = toks[:max_length]
        return toks

    def decode(self, token_ids, skip_special_tokens=True, clean_up_tokenization_spaces=True):
        return " ".join(token_ids)


class TestStage3ScientometricRigor(unittest.TestCase):

    def setUp(self):
        self.sample_paper = {
            "id": "p001",
            "title": "Attention Is All You Need",
            "tldr": "Transformer model replaces recurrence with multi-head self-attention.",
            "abstract": (
                "The dominant sequence transduction models are based on complex recurrent or "
                "convolutional neural networks. We propose the Transformer, a model architecture "
                "eschewing recurrence and relying entirely on an attention mechanism. Experiments "
                "on two machine translation tasks show these models to be superior in quality "
                "while being more parallelizable and requiring significantly less time to train."
            ),
            "s2_fields_of_study": ["Computer Science", "Artificial Intelligence"],
        }

    # -------------------------------------------------------------------------
    # Test 1: Structured Input Formatting (No Token Duplication)
    # -------------------------------------------------------------------------
    def test_structured_input_string_no_title_duplication(self):
        """Input string must have explicit section markers and no duplicate title tokens."""
        formatted = _build_input_string(self.sample_paper)

        self.assertTrue(formatted.startswith("Title: Attention Is All You Need."))
        self.assertIn("Summary: Transformer model replaces recurrence with multi-head self-attention.", formatted)
        self.assertIn("Abstract: The dominant sequence transduction models", formatted)
        self.assertIn("Fields: Computer Science, Artificial Intelligence.", formatted)

        # Ensure title is NOT duplicated verbatim
        title_count = formatted.count("Attention Is All You Need")
        self.assertEqual(title_count, 1, f"Title was duplicated {title_count} times! Should appear exactly once.")

    # -------------------------------------------------------------------------
    # Test 2: Head-Tail Truncation Preserves Conclusions Under Budget
    # -------------------------------------------------------------------------
    def test_head_tail_truncation_preserves_abstract_conclusions(self):
        """Under tight subword budgets, head-tail truncation must retain both opening and conclusions."""
        tokenizer = MockTokenizer()
        opening = "We initiate the investigation of graph spectral clustering on manifolds."
        middle = " ".join([f"intermediate_step_{i}" for i in range(100)])
        conclusion = "Our empirical benchmarks achieve a breakthrough 99.4 percent top-1 accuracy on ImageNet."
        long_abstract = f"{opening} {middle} {conclusion}"

        paper = {
            "id": "p_long",
            "title": "Graph Spectral Manifold Clustering",
            "tldr": "New clustering paradigm.",
            "abstract": long_abstract,
            "s2_fields_of_study": ["Mathematics"],
        }

        # Truncate to a tight budget of 40 tokens
        truncated_str = _build_input_string(paper, tokenizer=tokenizer, max_tokens=40)

        # Crucial: The conclusion words must be preserved in the truncated output
        self.assertIn("accuracy", truncated_str, "Conclusion sentence was truncated away!")
        self.assertIn("Title: Graph Spectral Manifold Clustering", truncated_str)
        self.assertIn("Abstract:", truncated_str)

    # -------------------------------------------------------------------------
    # Test 3: SVD Whitening Restores Hyperspherical Isotropy
    # -------------------------------------------------------------------------
    def test_svd_whitening_transformation(self):
        """Whitening must zero the mean vector and normalize representations to unit sphere."""
        rng = np.random.default_rng(42)
        n, d = 100, 32
        anisotropic_raw = rng.normal(loc=5.0, scale=0.5, size=(n, d)).astype(np.float32)

        whitened, info = apply_whitening(anisotropic_raw)

        # 1. Output shape preserved
        self.assertEqual(whitened.shape, (n, d))

        # 2. All vectors must be unit norm
        norms = np.linalg.norm(whitened, axis=1)
        np.testing.assert_allclose(norms, 1.0, atol=1e-5, err_msg="Whitened vectors are not unit norm!")

        # 3. Covariance of centered whitened vectors prior to normalization is identity
        mu = info["mean"]
        centered = anisotropic_raw - mu
        w_mat = info["whitening_matrix"]
        cov_whitened = ((centered @ w_mat).T @ (centered @ w_mat)) / (n - 1)
        np.testing.assert_allclose(cov_whitened, np.eye(d), atol=1e-4, err_msg="Whitened covariance is not identity!")

    # -------------------------------------------------------------------------
    # Test 4: Scientometric Diagnostics (Effective Rank & Degeneracy Detection)
    # -------------------------------------------------------------------------
    def test_compute_embedding_diagnostics(self):
        """Diagnostics must accurately compute effective rank and detect dimensional collapse."""
        n, d = 50, 16
        # Case A: High-dimensional isotropic orthogonal vectors
        rng = np.random.default_rng(123)
        q, _ = np.linalg.qr(rng.standard_normal((n, d)))
        q_norm = q / np.linalg.norm(q, axis=1, keepdims=True)

        diag_healthy = compute_embedding_diagnostics(q_norm)
        self.assertEqual(diag_healthy["paper_count"], n)
        self.assertEqual(diag_healthy["embedding_dimension"], d)
        self.assertGreater(diag_healthy["effective_rank"], 10.0, "Orthogonal embeddings should have high effective rank!")
        self.assertLess(diag_healthy["mean_off_diagonal_cosine"], 0.35, "Orthogonal embeddings should have low off-diagonal cosine!")

        # Case B: Completely degenerate rank-1 matrix (all papers identical)
        single_vec = np.ones((1, d), dtype=np.float32) / np.sqrt(d)
        degenerate = np.repeat(single_vec, n, axis=0)

        diag_degen = compute_embedding_diagnostics(degenerate)
        self.assertAlmostEqual(diag_degen["effective_rank"], 1.0, places=1, msg="Degenerate matrix must have effective rank ~ 1.0!")
        self.assertAlmostEqual(diag_degen["mean_off_diagonal_cosine"], 1.0, places=3, msg="Identical vectors must have off-diagonal cosine == 1.0!")

    # -------------------------------------------------------------------------
    # Test 5: Chunked Similarity Matches Full Dense Matrix Computation
    # -------------------------------------------------------------------------
    def test_chunked_similarity_matches_dense_computation(self):
        """Memory-bounded chunked similarity export must give identical top-k to dense matrix."""
        n, d, top_k = 20, 8, 4
        rng = np.random.default_rng(99)
        raw = rng.standard_normal((n, d)).astype(np.float32)
        embeddings = raw / np.linalg.norm(raw, axis=1, keepdims=True)
        ids = [f"paper_{i}" for i in range(n)]
        papers = [{"id": pid, "title": f"Title {pid}"} for pid in ids]

        with tempfile.TemporaryDirectory() as tmpdir:
            # Run with tiny chunk_size=3 to force multiple block splits
            json_path = save_similarity_groups(
                ids=ids,
                embeddings=embeddings,
                papers=papers,
                out_dir=tmpdir,
                prefix="test_sims",
                top_k=top_k,
                chunk_size=3,
            )

            data = json.loads(Path(json_path).read_text(encoding="utf-8"))
            self.assertEqual(data["total_papers"], n)
            self.assertEqual(len(data["groups"]), n)

            # Ground-truth comparison using dense cosine_topk for each paper
            for group in data["groups"]:
                q_id = group["query_paper_id"]
                q_idx = ids.index(q_id)
                dense_top = cosine_topk(embeddings[q_idx], ids, embeddings, k=top_k + 1)
                # Remove self-match
                dense_filtered = [t for t in dense_top if t[0] != q_id][:top_k]

                group_ids = [s["paper_id"] for s in group["similar_papers"]]
                dense_ids = [t[0] for t in dense_filtered]
                self.assertEqual(group_ids, dense_ids, f"Mismatch in top-{top_k} similarity ranking for {q_id}!")

    # -------------------------------------------------------------------------
    # Test 6: Safety Boundaries (Device Resolution & Empty Input Guard)
    # -------------------------------------------------------------------------
    def test_safety_boundaries_and_empty_guard(self):
        """_resolve_device must return valid string and generate_embeddings must reject empty list."""
        device = _resolve_device()
        self.assertIn(device, ["cuda", "cpu"])

        with self.assertRaises(ValueError):
            generate_embeddings([])


if __name__ == "__main__":
    unittest.main()
