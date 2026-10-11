"""
ResearchRadar: Citation Service & Epistemic Lineage Resolver
"""

import json
from pathlib import Path
from typing import Any, Dict, Optional, Tuple
from research_radar.app.services.dataset_service import resolve_output_dir

_CITATION_CACHE: Dict[str, Tuple[float, Dict[str, Any]]] = {}


def get_citation_data(dataset: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Retrieves SPLC citation lineage, milestone anchors, and bibliographic overlap cards with in-memory caching."""
    if not dataset:
        return None
    target_dir = resolve_output_dir(dataset=dataset)
    if not target_dir:
        return None

    data_file = target_dir / "citation_data.json"
    if not data_file.exists():
        return None

    try:
        mtime = data_file.stat().st_mtime
        cache_key = str(data_file.resolve())
        if cache_key in _CITATION_CACHE:
            cached_mtime, cached_data = _CITATION_CACHE[cache_key]
            if cached_mtime == mtime:
                return cached_data

        data = json.loads(data_file.read_text(encoding="utf-8"))
        _CITATION_CACHE[cache_key] = (mtime, data)
        return data
    except Exception:
        return None

