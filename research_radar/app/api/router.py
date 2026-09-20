"""
ResearchRadar: API Router Hub (v1)
"""

from fastapi import APIRouter
from research_radar.app.api.v1.endpoints_datasets import router as datasets_router
from research_radar.app.api.v1.endpoints_gaps import router as gaps_router
from research_radar.app.api.v1.endpoints_graphs import router as graphs_router
from research_radar.app.api.v1.endpoints_pipeline import router as pipeline_router

api_router = APIRouter(prefix="/api")

api_router.include_router(pipeline_router)
api_router.include_router(datasets_router)
api_router.include_router(graphs_router)
api_router.include_router(gaps_router)
