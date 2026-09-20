"""
ResearchRadar: Pipeline Endpoints (/api/pipeline)
"""

from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from fastapi.responses import StreamingResponse

from research_radar.app.models.schemas import PipelineRunRequest, PipelineStatusResponse
from research_radar.app.services.pipeline_runner import (
    cancel_pipeline_job,
    create_pipeline_job,
    execute_pipeline_task,
    get_job_status,
    stream_job_events,
)

router = APIRouter(prefix="/pipeline", tags=["Pipeline Execution"])


@router.post("/run", response_model=PipelineStatusResponse)
async def trigger_pipeline_run(req: PipelineRunRequest, background_tasks: BackgroundTasks):
    """Initiates an asynchronous 8-stage scientometric pipeline run."""
    job_id = create_pipeline_job(req)
    background_tasks.add_task(execute_pipeline_task, job_id, req)
    status_resp = get_job_status(job_id)
    if not status_resp:
        raise HTTPException(status_code=500, detail="Failed to initialize pipeline job.")
    return status_resp


@router.get("/status/{job_id}", response_model=PipelineStatusResponse)
def get_pipeline_job_status(job_id: str):
    """Poll the live status of a running pipeline job."""
    status_resp = get_job_status(job_id)
    if not status_resp:
        raise HTTPException(status_code=404, detail=f"Job ID '{job_id}' not found.")
    return status_resp


@router.get("/stream/{job_id}")
async def stream_pipeline_progress(job_id: str):
    """Server-Sent Events (SSE) streaming endpoint for live stage progress."""
    status_resp = get_job_status(job_id)
    if not status_resp:
        raise HTTPException(status_code=404, detail=f"Job ID '{job_id}' not found.")
    return StreamingResponse(stream_job_events(job_id), media_type="text/event-stream")


@router.post("/cancel/{job_id}")
def cancel_pipeline(job_id: str):
    """Cancel a running pipeline job."""
    success = cancel_pipeline_job(job_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Job ID '{job_id}' not found.")
    return {"message": f"Job '{job_id}' cancelled successfully.", "job_id": job_id}
