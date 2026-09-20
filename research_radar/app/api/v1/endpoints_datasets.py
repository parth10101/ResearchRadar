"""
ResearchRadar: Datasets Endpoints (/api/datasets)
"""

from fastapi import APIRouter
from research_radar.app.models.schemas import DatasetListResponse
from research_radar.app.services.dataset_service import list_datasets

router = APIRouter(prefix="/datasets", tags=["Datasets Inventory"])


@router.get("", response_model=DatasetListResponse)
def get_all_datasets():
    """Returns list of all available computed datasets and their stage completion flags."""
    return list_datasets()
