"""
Unit tests for Stage 2 Scientometric Rigor Overhaul
====================================================
Verifies that Stage 2 text preprocessing, transliteration, and lemmatization
adhere strictly to doctoral examination committee standards:
  - Scientific Greek and mathematical character transliteration (no ASCII stripping)
  - Universal multi-disciplinary compound preservation (Genomics, Physics, Economics, Materials Science, Medicine)
  - Morphological guardrails for scientific vocabulary ("data", "bayes", "basis")
  - Polysemy-preserving domain filtering ("potential", "base", "lead", "observe")
  - 100% feature symmetry across all corpus papers
"""

import unittest
from research_radar.stage2_preprocess import (
    clean_text,
    tokenize_and_lemmatize,
    preprocess_paper,
    preprocess_corpus,
    assemble_paper_text,
    DOMAIN_STOPWORDS,
    SCIENTIFIC_LEMMA_OVERRIDES,
)


class TestStage2ScientometricRigor(unittest.TestCase):

    # -------------------------------------------------------------------------
    # Flaw 4 Tests: Greek & Mathematical Symbol Transliteration
    # -------------------------------------------------------------------------
    def test_greek_and_math_symbol_preservation(self):
        """Greek symbols and mathematical notation must be transliterated, not deleted."""
        raw_text = (
            "Analysis of beta-amyloid and alpha-synuclein oligomers using chi^2 distribution "
            "and l1-norm regularisation at 50 micrometers."
        )
        cleaned = clean_text(raw_text)

        self.assertIn("beta", cleaned, "Greek character 'beta' was dropped or corrupted!")
        self.assertIn("alpha", cleaned, "Greek character 'alpha' was dropped or corrupted!")
        self.assertIn("chi_squared", cleaned, "Mathematical pattern 'chi^2' was not transliterated!")
        self.assertIn("l1_norm", cleaned, "Mathematical norm 'l1-norm' was not transliterated!")

        # Also test with literal Greek unicode characters
        unicode_text = "Aggregation of β-amyloid fibrils and α-helix structures with χ² goodness of fit."
        u_cleaned = clean_text(unicode_text)
        self.assertIn("beta", u_cleaned, "Literal Greek 'β' was deleted rather than transliterated!")
        self.assertIn("alpha", u_cleaned, "Literal Greek 'α' was deleted rather than transliterated!")
        self.assertIn("chi_squared", u_cleaned, "Literal Greek 'χ²' was deleted rather than transliterated!")

    # -------------------------------------------------------------------------
    # Flaw 3 Tests: Universal Multi-Disciplinary Compound Preservation
    # -------------------------------------------------------------------------
    def test_universal_multidisciplinary_compounding(self):
        """Cross-disciplinary scientific compounds must be preserved as underscore-joined tokens."""
        # Genomics
        genomics_text = "We perform Single-Cell RNA-Sequencing and CRISPR-Cas9 genome editing."
        gen_cleaned = clean_text(genomics_text)
        self.assertIn("single_cell_rna_sequencing", gen_cleaned, "Genomics compound was not preserved!")
        self.assertIn("crispr_cas9", gen_cleaned, "CRISPR-Cas9 compound was not preserved!")

        # Materials Science & Physics
        physics_text = "Electronic bandstructure calculated via Density Functional Theory and Transmission Electron Microscopy."
        phys_cleaned = clean_text(physics_text)
        self.assertIn("density_functional_theory", phys_cleaned, "Physics compound was not preserved!")
        self.assertIn("transmission_electron_microscopy", phys_cleaned, "Materials science compound was not preserved!")

        # Economics
        econ_text = "Causal estimation using Difference-in-Differences and Instrumental Variables."
        econ_cleaned = clean_text(econ_text)
        self.assertIn("difference_in_differences", econ_cleaned, "Economics compound was not preserved!")
        self.assertIn("instrumental_variable", econ_cleaned, "Economics compound was not preserved!")

        # Dynamic Hyphenated Terms
        dynamic_text = "A physics-informed state-of-the-art framework."
        dyn_cleaned = clean_text(dynamic_text)
        self.assertIn("physics_informed", dyn_cleaned, "Hyphenated compound was not joined!")

    # -------------------------------------------------------------------------
    # Flaw 5 Tests: Scientific Lemmatization Guardrails
    # -------------------------------------------------------------------------
    def test_scientific_lemmatization_guardrails(self):
        """High-frequency scientific vocabulary must not be distorted by web/news lemmatizers."""
        text = "We analyze experimental data using bayes rule, bayesian networks, and orthogonal basis functions."
        tokens = tokenize_and_lemmatize(clean_text(text))

        self.assertIn("data", tokens, "'data' was incorrectly lemmatized to 'datum'!")
        self.assertNotIn("datum", tokens, "'datum' contaminated the scientific vocabulary!")

        self.assertTrue("bayes" in tokens and "bayesian" in tokens, "'bayes' or 'bayesian' was mutated!")
        self.assertNotIn("bay", tokens, "'bay' contaminated the scientific vocabulary!")

        self.assertIn("basis", tokens, "'basis' was mutated to 'basi'!")
        self.assertNotIn("basi", tokens, "'basi' contaminated the scientific vocabulary!")

    # -------------------------------------------------------------------------
    # Flaw 6 Tests: Polysemy-Preserving Stopword Filtering
    # -------------------------------------------------------------------------
    def test_polysemy_preservation(self):
        """Fundamental scientific nouns like potential, base, and lead must not be blacklisted."""
        self.assertNotIn("potential", DOMAIN_STOPWORDS, "'potential' is blacklisted (destroys action potential)!")
        self.assertNotIn("base", DOMAIN_STOPWORDS, "'base' is blacklisted (destroys base pairs)!")
        self.assertNotIn("lead", DOMAIN_STOPWORDS, "'lead' is blacklisted (destroys lead compound / lead poisoning)!")

        paper = {
            "title": "Action Potential Propagation and Nitrogenous Base Pairing",
            "abstract": "We investigate the membrane potential of neurons and lead optimization in drug discovery.",
        }
        tokens = preprocess_paper(paper)
        self.assertIn("potential", tokens, "'potential' was wiped from the tokens!")
        self.assertIn("base", tokens, "'base' was wiped from the tokens!")
        self.assertIn("lead", tokens, "'lead' was wiped from the tokens!")

    # -------------------------------------------------------------------------
    # Flaw 2 Tests: Pipeline Feature Symmetry
    # -------------------------------------------------------------------------
    def test_pipeline_feature_symmetry(self):
        """Paper 0 and Papers 1..N must produce identical token lists when given identical metadata."""
        paper1 = {
            "id": "paper_001",
            "title": "Variational Autoencoders in Single-Cell Genomics",
            "tldr": "We propose a variational autoencoder for single-cell analysis.",
            "abstract": "We develop a probabilistic latent space representation for single-cell genomics.",
            "s2_fields_of_study": ["Computer Science", "Biology"],
        }
        paper2 = {
            "id": "paper_002",
            "title": "Variational Autoencoders in Single-Cell Genomics",
            "tldr": "We propose a variational autoencoder for single-cell analysis.",
            "abstract": "We develop a probabilistic latent space representation for single-cell genomics.",
            "s2_fields_of_study": ["Computer Science", "Biology"],
        }

        # Single-paper processing (used for Paper 0 diagnostic)
        tokens_single = preprocess_paper(paper1)

        # Batch processing (used for Papers 1..N)
        corpus_results = preprocess_corpus([paper1, paper2])
        tokens_batch1 = corpus_results["paper_001"]
        tokens_batch2 = corpus_results["paper_002"]

        self.assertEqual(
            tokens_single, tokens_batch1,
            "Single-paper processing produced different tokens than batch processing!"
        )
        self.assertEqual(
            tokens_batch1, tokens_batch2,
            "Corpus batch processing produced inconsistent tokens for identical papers!"
        )


if __name__ == "__main__":
    unittest.main()
