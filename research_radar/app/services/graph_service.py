"""
ResearchRadar: Graph Services (3D Points, Epistemic Archipelago, Cytoscape)
"""

import json
from pathlib import Path
from typing import Any, Dict, Optional
from research_radar.app.services.dataset_service import resolve_output_dir


def get_points3d_data(dataset: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Retrieves 3D cluster points for WebGL particle simulation with auto-export guarantee."""
    if not dataset:
        return None
    target_dir = resolve_output_dir(dataset=dataset)
    if not target_dir:
        return None

    points_file = target_dir / "cluster_3d_points.json"
    if not points_file.exists():
        try:
            from research_radar.export_3d import process_directory
            process_directory(target_dir)
        except Exception as e:
            print(f"[3D EXPORT ON DEMAND ERROR]: {e}", flush=True)

    if points_file.exists():
        try:
            return json.loads(points_file.read_text(encoding="utf-8"))
        except Exception:
            return None
    return None


def get_archipelago_data(dataset: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Retrieves macro-cluster archipelago coordinates."""
    if not dataset:
        return None
    target_dir = resolve_output_dir(dataset=dataset)
    if not target_dir:
        return None

    arch_file = target_dir / "archipelago_data.json"
    if not arch_file.exists():
        try:
            from research_radar.stage6_archipelago import run_stage6
            run_stage6(out_dir=str(target_dir))
        except Exception:
            pass

    if arch_file.exists():
        try:
            return json.loads(arch_file.read_text(encoding="utf-8"))
        except Exception:
            return None
    return None


def get_cytoscape_data(dataset: Optional[str] = None, out_dir: Optional[str] = None) -> Dict[str, Any]:
    """Retrieves cytoscape graph representation."""
    target_dir = resolve_output_dir(dataset=dataset, out_dir=out_dir)
    if not target_dir:
        return {"elements": {"nodes": [], "edges": []}}

    stats_file = target_dir / "knowledge_graph_stats.json"
    if not stats_file.exists():
        return {"elements": {"nodes": [], "edges": []}}
    try:
        stats = json.loads(stats_file.read_text(encoding="utf-8"))
        nodes = []
        edges = []
        for m in stats.get("methods", [])[:20]:
            nodes.append({"data": {"id": f"m_{m}", "label": m, "type": "method"}})
        for d in stats.get("datasets", [])[:20]:
            nodes.append({"data": {"id": f"d_{d}", "label": d, "type": "dataset"}})
        for g in stats.get("research_gaps", [])[:5]:
            gid = f"g_{g.get('method')}_{g.get('dataset')}"
            nodes.append({"data": {"id": gid, "label": f"Gap: {g.get('method')} × {g.get('dataset')}", "type": "gap"}})
        return {"elements": {"nodes": nodes, "edges": edges}}
    except Exception:
        return {"elements": {"nodes": [], "edges": []}}
