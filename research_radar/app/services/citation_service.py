"""
ResearchRadar: Citation Service & Epistemic Lineage Resolver
"""

import json
from pathlib import Path
from typing import Any, Dict, Optional
from research_radar.app.services.dataset_service import resolve_output_dir


def get_citation_data(dataset: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Retrieves SPLC citation lineage, milestone anchors, and bibliographic overlap cards."""
    if not dataset:
        return None
    target_dir = resolve_output_dir(dataset=dataset)
    if not target_dir:
        return None

    data_file = target_dir / "citation_data.json"
    if data_file.exists():
        try:
            return json.loads(data_file.read_text(encoding="utf-8"))
        except Exception:
            pass

    html_file = target_dir / "citation_graph.html"
    if html_file.exists():
        try:
            html = html_file.read_text(encoding="utf-8")
            idx = html.find("const DATA = ")
            if idx != -1:
                end_idx = html.find(";\n", idx)
                if end_idx != -1:
                    return json.loads(html[idx + len("const DATA = "):end_idx])
        except Exception:
            pass

    return None
