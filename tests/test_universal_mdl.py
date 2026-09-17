"""
Unit and Regression Tests for Universal Grounded MDL Architecture
==================================================================
Tests:
  1. Span-grounding assertion (0% hallucination)
  2. Discourse zoning (prior-art baselines separated from contributions)
  3. Universal concept normalizer (OpenAlex concept graph)
  4. Live OpenAlex literature verifier (real hit counts)
"""

import unittest
from research_radar.entities.schema import ExtractedSpan, PaperMDLRecord
from research_radar.entities.openalex_normalizer import OpenAlexConceptNormalizer
from research_radar.entities.universal_extractor import UniversalMDLExtractor
from research_radar.literature_verifier import LiteratureVerifier


class TestUniversalMDL(unittest.TestCase):

    def test_span_grounding_assertion(self):
        """Verify that PaperMDLRecord rejects ungrounded hallucinated strings."""
        raw_text = "In this paper, we introduce Dual-State Virtual Purified Decoherence."
        
        # Authentic span
        valid_record = PaperMDLRecord(
            paper_id="p1",
            title="Test Title",
            proposed_methods=[
                ExtractedSpan(
                    canonical_name="Dual-State Virtual Purified Decoherence",
                    verbatim_text="Dual-State Virtual Purified Decoherence",
                    start_char=24,
                    end_char=66,
                    discourse_role="CONTRIBUTION"
                )
            ]
        )
        self.assertTrue(valid_record.verify_grounding(raw_text))

        # Hallucinated span (not present in raw_text)
        invalid_record = PaperMDLRecord(
            paper_id="p2",
            title="Test Title",
            proposed_methods=[
                ExtractedSpan(
                    canonical_name="Quantum Neural Network",
                    verbatim_text="Quantum Neural Network",
                    start_char=0,
                    end_char=22,
                    discourse_role="CONTRIBUTION"
                )
            ]
        )
        self.assertFalse(invalid_record.verify_grounding(raw_text))

    def test_discourse_zoning_baseline_separation(self):
        """Verify that comparative baseline methods are not tagged as proposed methods."""
        extractor = UniversalMDLExtractor()
        paper = {
            "id": "paper_quantum_1",
            "title": "Dual-State Virtual Purified Decoherence for Quantum Processors",
            "abstract": "While Richardson extrapolation reduces zero-noise errors, it amplifies variance. In this paper, we introduce Dual-State Virtual Purified Decoherence and evaluate on IBM Falcon Benchmark. However, coherent phase calibration drift creates uncorrectable noise.",
        }
        rec = extractor.extract_deterministic(paper)
        
        # Contribution must contain proposed method
        self.assertTrue(any("Decoherence" in m.canonical_name for m in rec.proposed_methods))
        
        # Baseline must contain Richardson extrapolation
        self.assertTrue(any("Richardson" in b.verbatim_text for b in rec.baseline_methods))
        
        # Richardson extrapolation must NOT be in proposed_methods
        self.assertFalse(any("Richardson" in m.canonical_name for m in rec.proposed_methods))
        
        # Dataset and Limitation must be captured
        self.assertTrue(any("Falcon" in d.canonical_name for d in rec.evaluation_datasets))
        self.assertTrue(any("Drift" in l.canonical_name or "Calibration" in l.canonical_name for l in rec.identified_limitations))

    def test_openalex_normalizer(self):
        """Verify concept canonicalization across diverse scientific domains."""
        normalizer = OpenAlexConceptNormalizer()
        
        # Built-in concepts
        res_cnn = normalizer.canonicalize("cnn", "method")
        self.assertIn("Convolutional", res_cnn["canonical_name"])

        res_dp = normalizer.canonicalize("differential privacy", "method")
        self.assertEqual(res_dp["canonical_name"], "Differential Privacy")

    def test_live_openalex_verifier(self):
        """Verify live OpenAlex API query returns real hit count and valid URLs."""
        verifier = LiteratureVerifier()
        
        # Query a known saturated topic: Object Detection + Landsat
        res_sat = verifier.verify_gap_novelty("Object Detection", "Landsat", "Cloud Cover")
        self.assertIn("openalex", res_sat["verification_urls"])
        self.assertGreater(res_sat["global_hit_count"], 0)
        # Object detection on Landsat has thousands of papers, so it should NOT be an unexplored gap
        self.assertFalse(res_sat["is_unexplored"])
        self.assertIn("Saturated", res_sat["literature_tier"])

        # Query a known nonexistent combination
        res_rare = verifier.verify_gap_novelty("Dual-State Virtual Purified Decoherence", "Sycamore 53-Qubit", "Extreme Latency Delay")
        self.assertTrue(res_rare["is_unexplored"])
        self.assertEqual(res_rare["global_hit_count"], 0)
        self.assertIn("Empirically Verified White Space", res_rare["literature_tier"])


if __name__ == "__main__":
    unittest.main()
