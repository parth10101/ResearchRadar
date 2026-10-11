"""
OpenAlex Universal Concept Normalizer
=====================================
Disambiguates and canonicalizes scientific entities using OpenAlex's
hierarchical concept graph (65,000+ concepts across 19 fields of science).
"""

from __future__ import annotations

import json
import urllib.parse
from pathlib import Path
from typing import Dict, Optional, Any
import requests


class OpenAlexConceptNormalizer:
    """
    Universal Scientific Concept Disambiguator.
    Maps fragmented surface strings to canonical, unambiguous scientific concepts.
    """
    CONCEPTS_URL = "https://api.openalex.org/concepts"

    def __init__(self, cache_path: Optional[Path | str] = None, timeout_sec: float = 3.0):
        self.timeout_sec = timeout_sec
        self.cache_path = Path(cache_path) if cache_path else Path("data/cache/openalex_concepts_cache.json")
        self.cache: Dict[str, Dict[str, Any]] = self._load_cache()
        self._builtin_synonyms = self._init_builtins()

    def _load_cache(self) -> Dict[str, Dict[str, Any]]:
        if self.cache_path.exists():
            try:
                return json.loads(self.cache_path.read_text(encoding="utf-8"))
            except Exception:
                return {}
        return {}

    def _save_cache(self) -> None:
        try:
            self.cache_path.parent.mkdir(parents=True, exist_ok=True)
            self.cache_path.write_text(json.dumps(self.cache, indent=2, ensure_ascii=False), encoding="utf-8")
        except Exception:
            pass

    def _init_builtins(self) -> Dict[str, str]:
        return {
            "cnn": "Convolutional Neural Network (CNN)",
            "convolutional neural network": "Convolutional Neural Network (CNN)",
            "vit": "Vision Transformer (ViT)",
            "vision transformer": "Vision Transformer (ViT)",
            "u-net": "U-Net",
            "unet": "U-Net",
            "swin": "Swin Transformer",
            "swin-transformer": "Swin Transformer",
            "gat": "Graph Attention Network (GAT)",
            "gcn": "Graph Convolutional Network (GCN)",
            "gnn": "Graph Neural Network (GNN)",
            "random forest": "Random Forest",
            "svm": "Support Vector Machine (SVM)",
            "support vector machine": "Support Vector Machine (SVM)",
            "differential privacy": "Differential Privacy",
            "pinns": "Physics-Informed Neural Networks (PINNs)",
            "pinn": "Physics-Informed Neural Networks (PINNs)",
        }

    def canonicalize(self, raw_term: str, entity_type: str = "method") -> Dict[str, Any]:
        """
        Returns a dict with canonical_name, concept_id, and display_name.
        """
        clean = raw_term.strip()
        lower = clean.lower()

        # 1. Fast built-in synonym check
        if lower in self._builtin_synonyms:
            canon = self._builtin_synonyms[lower]
            return {
                "canonical_name": canon,
                "concept_id": "builtin",
                "display_name": canon,
                "source": "builtin_synonyms"
            }

        # 2. Cached check
        if lower in self.cache:
            return self.cache[lower]

        # 3. Query OpenAlex Concepts API (only if explicitly enabled via env var)
        import os
        if os.environ.get("OPENALEX_LIVE_CONCEPTS", "0") == "1":
            headers = {
                "User-Agent": "ResearchRadar-Academic/3.0 (mailto:audit@researchradar.org)",
                "Accept": "application/json",
            }
            q = urllib.parse.quote(clean)
            url = f"{self.CONCEPTS_URL}?search={q}&per_page=1"
            try:
                res = requests.get(url, headers=headers, timeout=self.timeout_sec)
                if res.status_code == 200:
                    data = res.json()
                    results = data.get("results") or []
                    if results:
                        top = results[0]
                        canon = top.get("display_name") or clean.title()
                        rec = {
                            "canonical_name": canon,
                            "concept_id": top.get("id"),
                            "display_name": canon,
                            "level": top.get("level"),
                            "wikidata": top.get("wikidata"),
                            "source": "openalex_concepts"
                        }
                        self.cache[lower] = rec
                        self._save_cache()
                        return rec
            except Exception:
                pass

        # 4. Fallback: clean title
        fallback_rec = {
            "canonical_name": clean.title() if not clean.isupper() else clean,
            "concept_id": "none",
            "display_name": clean,
            "source": "local_normalization"
        }
        self.cache[lower] = fallback_rec
        return fallback_rec
