"""
ResearchRadar: Gap Endpoints (/api/gaps)
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from research_radar.app.services.gap_service import (
    get_detected_gaps,
    get_master_report,
    get_narrated_gaps,
)

router = APIRouter(prefix="/gaps", tags=["Research Gaps & AI Grant Studio"])


@router.get("/detected")
def get_gaps_detected(dataset: Optional[str] = Query(None), out_dir: Optional[str] = Query(None)):
    """Retrieves algorithmic research gap detections."""
    if not dataset and not out_dir:
        return {"total_gaps": 0, "gaps": []}

    data = get_detected_gaps(dataset=dataset, out_dir=out_dir)
    if data:
        return data
    raise HTTPException(status_code=404, detail=f"Detected gaps not found for dataset '{dataset or out_dir}'")


@router.get("/narrated")
def get_gaps_narrated(dataset: Optional[str] = Query(None), out_dir: Optional[str] = Query(None)):
    """Retrieves AI Grant Studio operational hypotheses."""
    if not dataset and not out_dir:
        return {"total_narrated": 0, "gaps": []}

    data = get_narrated_gaps(dataset=dataset, out_dir=out_dir)
    if data:
        return data
    raise HTTPException(status_code=404, detail=f"Narrated gaps not found for dataset '{dataset or out_dir}'")


@router.get("/report")
def get_gap_report(dataset: Optional[str] = Query(None), out_dir: Optional[str] = Query(None)):
    """Retrieves master gap markdown report."""
    if not dataset and not out_dir:
        return {"report_markdown": ""}

    report = get_master_report(dataset=dataset, out_dir=out_dir)
    if report is not None:
        return {"report_markdown": report}
    raise HTTPException(status_code=404, detail=f"Master gap report not found for dataset '{dataset or out_dir}'")
