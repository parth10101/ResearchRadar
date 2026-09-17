"""
Unit tests for Stage 1 Scientometric Rigor Overhaul
====================================================
Verifies that Stage 1 ingestion, language validation, purifier filtering,
and client resilience adhere strictly to doctoral examination committee standards:
  - Math & diacritic-aware language gate (zero false rejections of theoretical papers)
  - Metadata-driven purifier (preserves Wiley/Cambridge journals & seminal tutorials)
  - Absolute ban on fabricated citation edges and pseudo-SciCite keyword tags
  - Vector smearing prevention (no synthetic template strings in missing abstracts)
  - Resilient unauthenticated public mode (no RuntimeError on missing API key)
  - Strict preservation of the temporal constraint (Flaw 6)
"""

import unittest
from research_radar.stage1_ingest import (
    is_english_paper,
    _generate_fallback_tldr,
    _s2_paper_to_schema,
    sanitize_references,
    _empty_paper,
)
from research_radar.s2_client import SemanticScholarClient


class TestStage1ScientometricRigor(unittest.TestCase):

    # -------------------------------------------------------------------------
    # Flaw 3 Tests: Math & Diacritic-Aware Language Gate
    # -------------------------------------------------------------------------
    def test_math_heavy_abstract_passes_language_gate(self):
        """Mathematical abstracts containing dense Unicode symbols and LaTeX equations must pass."""
        title = "Spectral Bounds for Riemannian Laplacians with Dirichlet Conditions"
        abstract = (
            "Let $M$ be a compact Riemannian manifold with smooth boundary $\\partial M$. "
            "We prove that $\\forall x \\in M$, the eigenvalue sequence satisfies "
            "$\\lambda_k \\ge C_n (k / \\text{vol}(M))^{2/n}$. In particular, "
            "$\\int_M |\\nabla u|^2 d\\mu \\ge \\sum_{i=1}^m \\alpha_i \\beta_i \\le \\gamma$. "
            "Our approach establishes a sharp Sobolev inequality and bounds the heat trace asymptotics."
        )
        self.assertTrue(
            is_english_paper(title, abstract),
            "Math-heavy abstract with Unicode operators and LaTeX equations was incorrectly rejected!"
        )

    def test_global_scholars_and_affiliations_pass_language_gate(self):
        """Papers citing European scholars (Poincaré, Schrödinger) or global institutions must pass."""
        title = "Analysis of Van der Waals Forces in 2D Heterostructures"
        abstract = (
            "Researchers at Universidade de São Paulo and Ludwig-Maximilians-Universität München "
            "investigate the dispersion interactions using the method of Henri Poincaré and "
            "Erwin Schrödinger. We present novel numerical results demonstrating stability."
        )
        self.assertTrue(
            is_english_paper(title, abstract),
            "Paper with global institution names (São Paulo, München, Poincaré) was incorrectly rejected!"
        )

    def test_genuine_non_english_rejected(self):
        """Abstracts entirely written in non-English European languages must be filtered out."""
        portuguese_abstract = (
            "Este artigo apresenta uma nova abordagem metodológica para a otimização "
            "de sistemas distribuídos. Os resultados demonstram melhorias significativas na eficiência."
        )
        self.assertFalse(
            is_english_paper("Metodologia de Sistemas", portuguese_abstract),
            "Portuguese abstract was not rejected by the language gate!"
        )

        german_abstract = (
            "Diese Arbeit untersucht die mathematischen Eigenschaften von tiefen neuronalen Netzen "
            "unter Berücksichtigung der asymptotischen Stabilität und Konvergenzgeschwindigkeit."
        )
        self.assertFalse(
            is_english_paper("Untersuchung Neuronaler Netze", german_abstract),
            "German abstract was not rejected by the language gate!"
        )

    # -------------------------------------------------------------------------
    # Flaw 4 Tests: Metadata-Driven Purifier
    # -------------------------------------------------------------------------
    def test_purifier_preserves_wiley_and_cambridge_journals(self):
        """Peer-reviewed journal articles published by Wiley or Cambridge must NOT be blocked."""
        wiley_raw = {
            "paperId": "wiley1234567890abcdef1234567890abcdef12",
            "title": "Machine Learning for High-Throughput Materials Discovery",
            "abstract": "We present a transformer-based framework for materials property prediction.",
            "venue": "Advanced Materials (Wiley-VCH)",
            "publicationTypes": ["JournalArticle"],
            "year": 2022,
            "citationCount": 180,
        }
        paper = _s2_paper_to_schema(wiley_raw)
        self.assertTrue(bool(paper), "Wiley journal article was incorrectly rejected by the purifier!")
        self.assertEqual(paper.get("venue"), "Advanced Materials (Wiley-VCH)")

        cambridge_raw = {
            "paperId": "cambridge1234567890abcdef1234567890abc",
            "title": "Cognitive Architectures and the Structure of Mind",
            "abstract": "This article explores the formal computational structures of biological cognition.",
            "venue": "Behavioral and Brain Sciences (Cambridge University Press)",
            "publicationTypes": ["JournalArticle"],
            "year": 2021,
            "citationCount": 240,
        }
        cam_paper = _s2_paper_to_schema(cambridge_raw)
        self.assertTrue(bool(cam_paper), "Cambridge journal article was incorrectly rejected by the purifier!")

    def test_purifier_preserves_foundational_tutorial_papers(self):
        """Seminal tutorials and guides (e.g. Hinton's Guide to RBMs, Kingma's Intro to VAE) must pass."""
        hinton_raw = {
            "paperId": "hinton1234567890abcdef1234567890abcdef",
            "title": "A Practical Guide to Training Restricted Boltzmann Machines",
            "abstract": "We describe practical recipes and heuristics for training restricted Boltzmann machines.",
            "venue": "Neural Networks: Tricks of the Trade",
            "publicationTypes": ["JournalArticle", "Review"],
            "year": 2012,
            "citationCount": 4500,
        }
        paper = _s2_paper_to_schema(hinton_raw)
        self.assertTrue(bool(paper), "Foundational tutorial 'A Practical Guide to...' was incorrectly rejected!")

        kingma_raw = {
            "paperId": "kingma1234567890abcdef1234567890abcdef",
            "title": "An Introduction to Variational Autoencoders",
            "abstract": "Variational autoencoders provide a principled probabilistic formulation for latent variables.",
            "venue": "Foundations and Trends in Machine Learning",
            "publicationTypes": ["JournalArticle", "Review"],
            "year": 2019,
            "citationCount": 5200,
        }
        k_paper = _s2_paper_to_schema(kingma_raw)
        self.assertTrue(bool(k_paper), "Foundational tutorial 'An Introduction to...' was incorrectly rejected!")

    def test_purifier_rejects_actual_books(self):
        """Objects explicitly classified as non-research Books or Handbooks must be filtered."""
        book_raw = {
            "paperId": "book1234567890abcdef1234567890abcdef12",
            "title": "Mastering Bitcoin: Programming the Open Blockchain",
            "abstract": "A complete technical guide to the Bitcoin protocol and cryptocurrency mechanics.",
            "venue": "O'Reilly Media",
            "publicationTypes": ["Book"],
            "year": 2017,
        }
        paper = _s2_paper_to_schema(book_raw)
        self.assertEqual(paper, {}, "Commercial non-research Book was not rejected by the purifier!")

    # -------------------------------------------------------------------------
    # Flaw 1 Tests: Zero Citation Edge Fabrication
    # -------------------------------------------------------------------------
    def test_no_synthetic_citation_edge_fabrication(self):
        """Papers must never have fake citation references injected based on abstract keyword matches."""
        client = SemanticScholarClient(api_key="mock_key_for_test")
        papers = [
            _empty_paper(
                id="paper_a",
                title="Attention Mechanisms in Deep Neural Networks",
                abstract="We investigate transformer attention mechanism models in vision.",
                references=[],
            ),
            _empty_paper(
                id="paper_b",
                title="Deep Neural Networks for Visual Classification",
                abstract="This paper explores convolutional networks on visual tasks.",
                references=[],
            )
        ]
        processed = client._synthesize_cocitation_references(papers)
        # Verify Paper A has 0 references manufactured
        self.assertEqual(
            len(processed[0].get("references", [])), 0,
            "Fabricated citation edges were injected into Paper A!"
        )
        self.assertEqual(
            len(processed[1].get("references", [])), 0,
            "Fabricated citation edges were injected into Paper B!"
        )

    # -------------------------------------------------------------------------
    # Flaw 2 Tests: Ban on Pseudo-SciCite Keyword Intent Attribution
    # -------------------------------------------------------------------------
    def test_no_pseudo_scicite_keyword_attribution(self):
        """Unindexed references must NOT be tagged with fake methodology/result intents from title keywords."""
        client = SemanticScholarClient(api_key="mock_key_for_test")
        papers = [
            _empty_paper(
                id="paper_1",
                title="A Study of Learning Systems",
                abstract="We evaluate the accuracy of algorithms on benchmarks.",
                references=[
                    {"paperId": "ref_1", "title": "Statistical Model for Inference", "year": 2020}
                ]
            )
        ]
        hydrated = client._hydrate_reference_intents(papers)
        refs = hydrated[0].get("references", [])
        self.assertEqual(len(refs), 1)
        # Intents should NOT contain fabricated ["methodology"] or ["result"]
        intents = refs[0].get("intents") or []
        self.assertNotIn(
            "methodology", intents,
            "Pseudo-SciCite regex injected fake 'methodology' intent from title keyword 'Model'!"
        )

    # -------------------------------------------------------------------------
    # Flaw 7 Tests: Vector Smearing Prevention
    # -------------------------------------------------------------------------
    def test_missing_abstract_does_not_inject_synthetic_phrase(self):
        """When abstract is missing, the system must not inject synthetic boilerplate sentences."""
        fallback = _generate_fallback_tldr("", title="Deep Reinforcement Learning for Quantum Control")
        self.assertNotIn(
            "This paper investigates", fallback,
            "Synthetic attractor phrase 'This paper investigates' was injected!"
        )

        raw = {
            "paperId": "s2_paywalled_1234567890abcdef1234567890",
            "title": "Quantum Control Optimization",
            "abstract": None,
            "tldr": None,
            "year": 2023,
            "publicationTypes": ["JournalArticle"],
        }
        paper = _s2_paper_to_schema(raw)
        self.assertNotIn(
            "This paper investigates", paper.get("abstract", ""),
            "Synthetic boilerplate phrase was injected into missing abstract field!"
        )

    # -------------------------------------------------------------------------
    # Flaw 9 Tests: Client Resilience Without API Key
    # -------------------------------------------------------------------------
    def test_s2_client_unauthenticated_initialization(self):
        """SemanticScholarClient must initialize gracefully in public mode without throwing RuntimeError."""
        import os
        from unittest.mock import patch
        with patch.dict(os.environ, {}, clear=False), patch("research_radar.s2_client._load_env_file"):
            os.environ.pop("S2_API_KEY", None)
            try:
                client = SemanticScholarClient(api_key=None)
                self.assertIsNone(client.api_key)
                self.assertGreaterEqual(client.min_delay, 1.5)
                headers = client._get_headers()
                self.assertNotIn("x-api-key", headers)
                self.assertIn("User-Agent", headers)
            except RuntimeError as e:
                self.fail(f"SemanticScholarClient crashed on missing API key: {e}")

    # -------------------------------------------------------------------------
    # Flaw 6 Tests: Strict Preservation of Temporal Constraint
    # -------------------------------------------------------------------------
    def test_chronological_filter_preserved(self):
        """Verify that user-requested Flaw 6 preservation (ref_year > paper_year filtered) is maintained."""
        refs = [
            {"title": "Valid Historical Reference", "year": 2018},
            {"title": "Future Reference Artifact", "year": 2025},
        ]
        cleaned = sanitize_references(refs, paper_title="Test Paper", paper_year=2021)
        self.assertEqual(len(cleaned), 1)
        self.assertEqual(cleaned[0]["title"], "Valid Historical Reference")


if __name__ == "__main__":
    unittest.main()
