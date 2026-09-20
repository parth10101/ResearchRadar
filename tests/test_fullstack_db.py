"""
ResearchRadar: Fullstack Database & Offline Resilience Test Suite
Tests:
- Database schema initialization
- Supabase offline fallback resilience
- Database CRUD persistence for Corpora, Papers, Clusters, and Gaps
- FastAPI endpoints for zero-state and populated states
"""

import sys
import unittest
from pathlib import Path

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from fastapi.testclient import TestClient
from research_radar.app.core.database import init_db, get_active_backend, get_engine
from research_radar.app.main import app
from research_radar.app.services.db_service import (
    get_corpora,
    get_corpus,
    get_corpus_papers,
    get_corpus_clusters,
    get_corpus_gaps,
    save_corpus,
    save_papers,
    save_gaps,
)


class TestFullstackDatabase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)

    def test_01_active_backend_and_health(self):
        backend = get_active_backend()
        self.assertIn(backend, ["sqlite_offline", "supabase_postgresql"])
        
        resp = self.client.get("/api/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["database_backend"], backend)
        self.assertGreaterEqual(data["corpora_count"], 0)

    def test_02_corpora_inventory(self):
        corpora = get_corpora()
        self.assertIsInstance(corpora, list)
        self.assertGreater(len(corpora), 0, "Database should contain seeded preset corpora")

        resp = self.client.get("/api/datasets")
        self.assertEqual(resp.status_code, 200)
        datasets = resp.json().get("datasets", [])
        self.assertGreater(len(datasets), 0)
        
        # Verify preset presence
        dataset_ids = [d["id"] for d in datasets]
        self.assertIn("output_satellite_300", dataset_ids)
        self.assertIn("output_gnn_drug_3k", dataset_ids)

    def test_03_zero_state_initialization(self):
        """When no dataset is selected, endpoints must return empty zero-state payloads without throwing 500."""
        resp = self.client.get("/api/graph/points3d")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json().get("total_points"), 0)

        resp = self.client.get("/api/graph/archipelago")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json().get("macro_clusters"), [])

        resp = self.client.get("/api/graph/citation")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json().get("cards"), [])

        resp = self.client.get("/api/gaps/detected")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json().get("total_gaps"), 0)

        resp = self.client.get("/api/gaps/narrated")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json().get("total_narrated"), 0)

    def test_04_query_dataset_data(self):
        """Querying a valid preset dataset returns rich 3D points, citation graph, and research gaps."""
        resp = self.client.get("/api/graph/points3d?dataset=output_satellite_300")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("clusters", resp.json())

        resp = self.client.get("/api/graph/citation?dataset=output_satellite_300")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("cards", resp.json())

        resp = self.client.get("/api/gaps/narrated?dataset=output_satellite_300")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("gaps", resp.json())

    def test_05_dynamic_crud_persistence(self):
        """Test storing a dynamic new pipeline run in the database and querying it."""
        test_corpus_id = "test_synthetic_2026"
        save_corpus(
            corpus_id=test_corpus_id,
            name="Synthetic Intelligence Dynamics",
            description="Test corpus for database persistence",
            query="synthetic intelligence",
            source="live_search",
            paper_count=2
        )
        save_papers(test_corpus_id, [
            {
                "id": "syn_001",
                "title": "Quantum Error Mitigation in Synthetic Neurons",
                "abstract": "We present novel methods for quantum error mitigation...",
                "authors": ["Alice Turing", "Bob Shannon"],
                "year": 2026,
                "citation_count": 42,
                "x": 1.2, "y": -0.5, "z": 0.8
            }
        ])
        save_gaps(test_corpus_id, [
            {
                "id": "gap_syn_1",
                "title": "Decoherence Void in Neural Lattice Simulation",
                "topic_a_name": "Quantum Computing",
                "topic_b_name": "Neuromorphic AI",
                "novelty_score": 0.94,
                "feasibility_score": 0.88,
                "impact_score": 0.96,
                "description": "Lack of empirical benchmarks connecting superconducting qubits to neuromorphic spikes.",
                "suggested_title": "Bridging Superconducting Qubits and Neuromorphic Spikes"
            }
        ])

        # Verify from DB functions
        record = get_corpus(test_corpus_id)
        self.assertIsNotNone(record)
        self.assertEqual(record.name, "Synthetic Intelligence Dynamics")

        papers = get_corpus_papers(test_corpus_id)
        self.assertEqual(len(papers), 1)
        self.assertEqual(papers[0].title, "Quantum Error Mitigation in Synthetic Neurons")
        self.assertIn("Alice Turing", papers[0].authors)

        gaps = get_corpus_gaps(test_corpus_id)
        self.assertEqual(len(gaps), 1)
        self.assertEqual(gaps[0].novelty_score, 0.94)


if __name__ == "__main__":
    unittest.main()
