"""
ResearchRadar: Graph Endpoints (/api/graph)
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from research_radar.app.services.citation_service import get_citation_data
from research_radar.app.services.graph_service import (
    get_archipelago_data,
    get_cytoscape_data,
    get_points3d_data,
)

router = APIRouter(prefix="/graph", tags=["Knowledge & Citation Graphs"])


@router.get("/points3d")
def get_3d_points(dataset: Optional[str] = Query(None)):
    """Retrieves 3D cluster points for WebGL particle simulation."""
    if not dataset or dataset.strip() == "":
        return {"total_points": 0, "clusters": [], "gaps_3d": [], "bounds": {"min_x": 0, "max_x": 0, "min_y": 0, "max_y": 0, "min_z": 0, "max_z": 0}}
    
    data = get_points3d_data(dataset=dataset)
    if data:
        return data
    raise HTTPException(status_code=404, detail=f"3D cluster points not found for dataset '{dataset}'")


@router.get("/archipelago")
def get_archipelago(dataset: Optional[str] = Query(None)):
    """Retrieves 2D epistemic archipelago layout and macro-filaments."""
    if not dataset or dataset.strip() == "":
        return {"macro_clusters": [], "macro_filaments": [], "gaps": []}

    data = get_archipelago_data(dataset=dataset)
    if data:
        return data
    raise HTTPException(status_code=404, detail=f"Archipelago data not found for dataset '{dataset}'")


@router.get("/citation")
def get_citation(dataset: Optional[str] = Query(None)):
    """Retrieves citation lineage, milestone anchors, and connected prior art."""
    if not dataset or dataset.strip() == "":
        return {"cards": [], "milestones": []}

    data = get_citation_data(dataset=dataset)
    if data:
        return data
    raise HTTPException(status_code=404, detail=f"Citation data not found for dataset '{dataset}'")


@router.get("/cytoscape")
def get_cytoscape(dataset: Optional[str] = Query(None), out_dir: Optional[str] = Query("data/output")):
    """Retrieves Cytoscape graph nodes and edges."""
    return get_cytoscape_data(dataset=dataset, out_dir=out_dir)
