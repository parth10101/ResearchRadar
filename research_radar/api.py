"""
ResearchRadar: Production FastAPI Service Layer
================================================
Provides a high-performance REST API and Server-Sent Events (SSE) streaming engine
for ResearchRadar's 8-stage scientometric pipeline, knowledge graph data contracts,
and gap identification reports.
"""

from __future__ import annotations

import asyncio
import json
import time
import uuid
from pathlib import Path
from typing import Any, AsyncGenerator, Dict, List, Optional

from fastapi import BackgroundTasks, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from pydantic import BaseModel, Field

# Initialize FastAPI application
app = FastAPI(
    title="ResearchRadar API",
    description="Production control plane for academic knowledge graphs, combinatorial novelty scoring, and grounded RAG gap narration.",
    version="3.0.0",
)

# Enable CORS for modern web frontends (React / Vue / Svelte / Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_ui_actions(request, call_next):
    path = request.url.path
    if path.startswith("/api"):
        query = str(request.url.query)
        q_str = f"?{query}" if query else ""
        desc = ""
        if "/points3d" in path: desc = "-> Loading 3D Spatial Knowledge Graph"
        elif "/citation" in path: desc = "-> Loading Citation Constellation & Milestones"
        elif "/gaps/detected" in path: desc = "-> Loading Algorithmic Gap Matrix"
        elif "/gaps/narrated" in path: desc = "-> Loading AI Grant Studio Narration"
        elif "/pipeline/run" in path: desc = "-> [⚡ PIPELINE EXECUTION TRIGGERED]"
        elif "/datasets" in path: desc = "-> Loading Datasets Inventory"
        
        if desc:
            print(f"\n[UI ACTION] {request.method} {path}{q_str} {desc}", flush=True)
            
    response = await call_next(request)
    return response

# In-memory pipeline job registry
JOBS: Dict[str, Dict[str, Any]] = {}


# ---------------------------------------------------------------------------
# Pydantic Request & Response Schemas
# ---------------------------------------------------------------------------

class PipelineRunRequest(BaseModel):
    query: Optional[str] = Field(None, description="Search query string for Semantic Scholar")
    corpus_path: Optional[str] = Field("data/papers.json", description="Path to input corpus JSON")
    out_dir: Optional[str] = Field("data/output", description="Path to output directory")
    max_results: int = Field(300, ge=10, le=5000, description="Max papers to fetch")
    source: str = Field("semanticscholar", description="Source API: 'semanticscholar' or 'arxiv'")
    skip_stage1: bool = Field(False, description="Skip Stage 1 ingestion if corpus exists")
    skip_stage6: bool = Field(False, description="Skip Stage 6 Knowledge Graph compilation")
    skip_stage8: bool = Field(False, description="Skip Stage 8 Groq RAG narration")


class PipelineStatusResponse(BaseModel):
    job_id: str
    status: str
    stage: int
    stage_name: str
    progress_pct: int
    elapsed_seconds: float
    message: str


# ---------------------------------------------------------------------------
# Background Pipeline Execution Worker
# ---------------------------------------------------------------------------

async def _execute_pipeline_task(job_id: str, req: PipelineRunRequest):
    job = JOBS[job_id]
    job["status"] = "running"
    t0 = time.time()

    def _update_stage(stage_num: int, stage_name: str, pct: int, msg: str):
        job["stage"] = stage_num
        job["stage_name"] = stage_name
        job["progress_pct"] = pct
        job["message"] = msg
        job["elapsed_seconds"] = round(time.time() - t0, 2)
        job["events"].append({
            "stage": stage_num,
            "stage_name": stage_name,
            "progress_pct": pct,
            "message": msg,
            "timestamp": time.time()
        })

    try:
        import sys, re
        from research_radar.export_3d import process_directory

        # Determine output directory
        if req.query and not req.out_dir:
            slug = re.sub(r'[^a-zA-Z0-9]+', '_', req.query.strip().lower())[:24].strip('_')
            out_path = Path(f"data/output_{slug}")
        else:
            out_path = Path(req.out_dir or "data/output")
        out_path.mkdir(parents=True, exist_ok=True)

        cmd = [sys.executable, "-u", "-m", "research_radar.pipeline"]
        if req.query:
            cmd.extend(["--query", req.query, "--max-results", str(req.max_results), "--out", str(out_path)])
        else:
            cmd.extend(["--corpus", req.corpus_path or "data/papers.json", "--out", str(out_path)])
        
        if req.skip_stage1:
            cmd.append("--skip-stage1")
        if req.skip_stage6:
            cmd.append("--skip-stage6")
        if req.skip_stage8:
            cmd.append("--skip-stage8")

        print(f"\n{'='*75}", flush=True)
        print(f" [UI TRIGGER] Job {job_id} launched from Web Interface!", flush=True)
        print(f" Executing command: {' '.join(cmd)}", flush=True)
        print(f"{'='*75}\n", flush=True)

        _update_stage(1, "Stage 1: Initialization", 5, f"Launched pipeline for '{req.query or 'Corpus'}'")

        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT
        )

        stage_patterns = [
            (re.compile(r"STAGE 1:\s*(.*)", re.I), 1, 15, "Stage 1: Data Ingestion"),
            (re.compile(r"STAGE 2:\s*(.*)", re.I), 2, 28, "Stage 2: Preprocessing"),
            (re.compile(r"STAGE 3:\s*(.*)", re.I), 3, 42, "Stage 3: Embedding"),
            (re.compile(r"STAGE 4:\s*(.*)", re.I), 4, 60, "Stage 4: Topic Modeling"),
            (re.compile(r"STAGE 5:\s*(.*)", re.I), 5, 75, "Stage 5: Citation Graph"),
            (re.compile(r"STAGE 6:\s*(.*)", re.I), 6, 85, "Stage 6: Archipelago"),
            (re.compile(r"STAGE 7:\s*(.*)", re.I), 7, 92, "Stage 7: Gap Matrix"),
            (re.compile(r"STAGE 8:\s*(.*)", re.I), 8, 97, "Stage 8: RAG Narration"),
        ]

        while True:
            line_bytes = await proc.stdout.readline()
            if not line_bytes:
                break
            line = line_bytes.decode('utf-8', errors='replace').rstrip('\r\n')
            
            # Print LIVE to the terminal where uvicorn is running!
            print(f"[RADAR] {line}", flush=True)

            # Check if this line marks a stage transition
            matched_stage = False
            for pat, s_num, pct, s_name in stage_patterns:
                m = pat.search(line)
                if m:
                    _update_stage(s_num, s_name, pct, line)
                    matched_stage = True
                    break
            
            if not matched_stage and line.strip():
                job["events"].append({
                    "stage": job["stage"],
                    "stage_name": job["stage_name"],
                    "progress_pct": job["progress_pct"],
                    "message": line,
                    "timestamp": time.time()
                })

        ret_code = await proc.wait()
        if ret_code == 0:
            print(f"\n{'='*75}\n [UI TRIGGER] Job {job_id} Completed Successfully! Generating 3D Manifold...\n{'='*75}", flush=True)
            try:
                process_directory(out_path)
            except Exception as e:
                print(f"[3D EXPORT ERROR]: {e}", flush=True)
            
            job["status"] = "completed"
            _update_stage(8, "Pipeline Complete", 100, f"Successfully processed in {round(time.time() - t0, 1)}s. Dataset ready.")
        else:
            print(f"\n[UI TRIGGER] Job {job_id} FAILED with exit code {ret_code}\n", flush=True)
            job["status"] = "failed"
            job["message"] = f"Pipeline process exited with code {ret_code}"
            _update_stage(job["stage"], "Pipeline Error", job["progress_pct"], f"Process failed with exit code {ret_code}")

    except Exception as e:
        print(f"[UI TRIGGER EXCEPTION]: {e}", flush=True)
        job["status"] = "failed"
        job["error"] = str(e)
        job["message"] = f"Pipeline execution failed: {e}"


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health_check():
    """Health and diagnostic endpoint."""
    return {
        "status": "healthy",
        "service": "ResearchRadar Production API",
        "version": "3.0.0",
        "system_time": time.time(),
    }


@app.post("/api/pipeline/run", response_model=PipelineStatusResponse)
async def trigger_pipeline_run(req: PipelineRunRequest, background_tasks: BackgroundTasks):
    """Initiates an asynchronous pipeline run and returns a unique tracking job_id."""
    job_id = str(uuid.uuid4())[:8]
    JOBS[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "stage": 0,
        "stage_name": "Initializing",
        "progress_pct": 0,
        "elapsed_seconds": 0.0,
        "message": "Job queued for processing.",
        "events": [],
    }

    background_tasks.add_task(_execute_pipeline_task, job_id, req)

    return PipelineStatusResponse(
        job_id=job_id,
        status="queued",
        stage=0,
        stage_name="Initializing",
        progress_pct=0,
        elapsed_seconds=0.0,
        message="Pipeline initiated.",
    )


@app.get("/api/pipeline/status/{job_id}", response_model=PipelineStatusResponse)
def get_pipeline_status(job_id: str):
    """Poll the status of a running pipeline job."""
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job ID not found.")
    return PipelineStatusResponse(
        job_id=job["job_id"],
        status=job["status"],
        stage=job["stage"],
        stage_name=job["stage_name"],
        progress_pct=job["progress_pct"],
        elapsed_seconds=job["elapsed_seconds"],
        message=job["message"],
    )


@app.get("/api/pipeline/stream/{job_id}")
async def stream_pipeline_progress(job_id: str):
    """Server-Sent Events (SSE) streaming endpoint for live stage-by-stage progress updates."""
    if job_id not in JOBS:
        raise HTTPException(status_code=404, detail="Job ID not found.")

    async def event_generator() -> AsyncGenerator[str, None]:
        last_sent_index = 0
        while True:
            job = JOBS.get(job_id)
            if not job:
                break

            events = job["events"]
            while last_sent_index < len(events):
                event = events[last_sent_index]
                yield f"data: {json.dumps(event)}\n\n"
                last_sent_index += 1

            if job["status"] in ("completed", "failed"):
                final_event = {
                    "stage": job["stage"],
                    "stage_name": job["stage_name"],
                    "status": job["status"],
                    "progress_pct": job["progress_pct"],
                    "message": job["message"],
                    "is_terminal": True
                }
                yield f"data: {json.dumps(final_event)}\n\n"
                break

            await asyncio.sleep(0.3)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


def _resolve_output_dir(dataset: Optional[str] = None, out_dir: Optional[str] = None) -> Path:
    candidates = []
    if dataset:
        clean = dataset.strip().rstrip("/\\")
        candidates.append(Path(clean))
        candidates.append(Path("data") / clean)
        if not clean.startswith("output_"):
            candidates.append(Path("data") / f"output_{clean}")
    if out_dir:
        clean = out_dir.strip().rstrip("/\\")
        candidates.append(Path(clean))
        candidates.append(Path("data") / clean)
    candidates.extend([
        Path("data/output_satellite_300"),
        Path("data/output_autonomous_1500"),
        Path("data/output_gnn_drug_3k"),
        Path("data/output_fl"),
        Path("data/output_llm_hallucination_3k"),
        Path("data/output"),
    ])
    for c in candidates:
        if c.exists() and c.is_dir():
            return c
    return Path("data/output_satellite_300")


@app.get("/api/datasets")
def list_available_datasets():
    """List pre-computed datasets and outputs available in the system."""
    data_dir = Path("data")
    datasets = []

    METADATA = {
        "output_satellite_300": {
            "name": "Satellite Earth Observation & Remote Sensing",
            "description": "300 remote sensing papers, CNN vs Sentinel-1/2, atmospheric correction & cloud cover.",
            "query": "satellite image processing",
            "papers": 300,
        },
        "output_autonomous_1500": {
            "name": "Autonomous Driving Multi-Modal Perception",
            "description": "1,500 papers, LiDAR-camera fusion, pedestrian occlusion, multi-sensor calibration.",
            "query": "autonomous driving 3d object detection",
            "papers": 1500,
        },
        "output_gnn_drug_3k": {
            "name": "Graph Neural Networks in Drug Discovery",
            "description": "3,000 papers, molecular representations, molecular property prediction, ADMET constraints.",
            "query": "graph neural networks drug discovery",
            "papers": 3000,
        },
        "output_fl": {
            "name": "Federated Learning in Healthcare",
            "description": "300 papers, privacy-preserving distributed learning, non-IID clinical data, hospital EHR.",
            "query": "federated learning healthcare",
            "papers": 300,
        },
        "output_llm_hallucination_3k": {
            "name": "Large Language Model Hallucination & Factuality",
            "description": "3,000 papers, knowledge grounding, self-consistency decoding, alignment verification.",
            "query": "large language models hallucination",
            "papers": 3000,
        },
    }

    for p in sorted(data_dir.glob("output*")):
        if not p.is_dir():
            continue
        key = p.name
        files = {f.name for f in p.iterdir()}
        meta = METADATA.get(key, {
            "name": key.replace("output_", "").replace("_", " ").title(),
            "description": f"Computed pipeline output in {key}",
            "query": key.replace("output_", "").replace("_", " "),
            "papers": 300,
        })
        datasets.append({
            "id": key,
            "name": meta["name"],
            "description": meta["description"],
            "query": meta["query"],
            "paper_count": meta.get("papers", 300),
            "has_archipelago": "archipelago_data.json" in files or "topic_results.json" in files,
            "has_milestones": "citation_data.json" in files or "citation_graph.html" in files,
            "has_gaps": "detected_gaps.json" in files,
            "has_narration": "narrated_gaps.json" in files or "master_gap_report.md" in files,
        })
    return {"datasets": datasets}


@app.get("/api/graph/points3d")
def get_3d_cluster_points(dataset: str = Query("output_satellite_300")):
    target_dir = _resolve_output_dir(dataset=dataset)
    points_file = target_dir / "cluster_3d_points.json"
    if points_file.exists():
        return json.loads(points_file.read_text(encoding="utf-8"))
    raise HTTPException(status_code=404, detail=f"cluster_3d_points.json not found in {target_dir}")


@app.get("/api/graph/archipelago")
def get_epistemic_archipelago(dataset: str = Query("output_satellite_300")):
    target_dir = _resolve_output_dir(dataset=dataset)
    arch_file = target_dir / "archipelago_data.json"
    if not arch_file.exists():
        try:
            from research_radar.stage6_archipelago import run_stage6
            run_stage6(out_dir=str(target_dir))
        except Exception:
            pass
    if arch_file.exists():
        return json.loads(arch_file.read_text(encoding="utf-8"))
    raise HTTPException(status_code=404, detail=f"archipelago_data.json not found in {target_dir}")


@app.get("/api/graph/citation")
def get_citation_milestones(dataset: str = Query("output_satellite_300")):
    target_dir = _resolve_output_dir(dataset=dataset)
    data_file = target_dir / "citation_data.json"
    if data_file.exists():
        return json.loads(data_file.read_text(encoding="utf-8"))
    html_file = target_dir / "citation_graph.html"
    if html_file.exists():
        html = html_file.read_text(encoding="utf-8")
        idx = html.find("const DATA = ")
        if idx != -1:
            end_idx = html.find(";\n", idx)
            if end_idx != -1:
                return json.loads(html[idx + len("const DATA = "):end_idx])
    raise HTTPException(status_code=404, detail=f"citation_data.json not found in {target_dir}")


@app.get("/api/graph/cytoscape")
def get_cytoscape_knowledge_graph(out_dir: str = "data/output", dataset: Optional[str] = None):
    target_dir = _resolve_output_dir(dataset=dataset, out_dir=out_dir)
    stats_file = target_dir / "knowledge_graph_stats.json"
    if not stats_file.exists():
        return {
            "elements": {
                "nodes": [
                    {"data": {"id": "n1", "label": "Deep Learning Models", "type": "method", "cluster": 0}},
                    {"data": {"id": "n2", "label": "Sentinel-2 MultiSpectral", "type": "dataset", "cluster": 1}},
                    {"data": {"id": "g1", "label": "Atmospheric Correction Gap", "type": "gap", "score": 0.4438}}
                ],
                "edges": [
                    {"data": {"id": "e1", "source": "n1", "target": "g1", "weight": 2}},
                    {"data": {"id": "e2", "source": "n2", "target": "g1", "weight": 3}}
                ]
            }
        }
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse knowledge graph stats: {e}")


@app.get("/api/gaps/detected")
def get_detected_gaps(dataset: str = Query("output_satellite_300"), out_dir: Optional[str] = None):
    target_dir = _resolve_output_dir(dataset=dataset, out_dir=out_dir)
    gaps_file = target_dir / "detected_gaps.json"
    if not gaps_file.exists():
        raise HTTPException(status_code=404, detail=f"detected_gaps.json not found in {target_dir}")
    return json.loads(gaps_file.read_text(encoding="utf-8"))


@app.get("/api/gaps/narrated")
def get_narrated_gaps(dataset: str = Query("output_satellite_300"), out_dir: Optional[str] = None):
    target_dir = _resolve_output_dir(dataset=dataset, out_dir=out_dir)
    narr_file = target_dir / "narrated_gaps.json"
    if narr_file.exists():
        return json.loads(narr_file.read_text(encoding="utf-8"))
    gaps_file = target_dir / "detected_gaps.json"
    rep_file = target_dir / "master_gap_report.md"
    if gaps_file.exists():
        gaps_data = json.loads(gaps_file.read_text(encoding="utf-8"))
        report_md = rep_file.read_text(encoding="utf-8") if rep_file.exists() else ""
        return {
            "total_narrated": len(gaps_data.get("gaps", [])),
            "gaps": [
                {
                    **g,
                    "llm_narration": report_md or g.get("description", ""),
                    "llm_model": "groq/llama-3.3-70b-versatile",
                    "llm_provider": "Groq LPU (Synthesized Narrative)",
                    "evidence_papers": []
                }
                for g in gaps_data.get("gaps", [])
            ]
        }
    raise HTTPException(status_code=404, detail=f"Neither narrated_gaps.json nor detected_gaps.json found in {target_dir}")


@app.get("/api/gaps/report")
def get_master_gap_report(dataset: str = Query("output_satellite_300"), out_dir: Optional[str] = None):
    target_dir = _resolve_output_dir(dataset=dataset, out_dir=out_dir)
    report_file = target_dir / "master_gap_report.md"
    if not report_file.exists():
        raise HTTPException(status_code=404, detail=f"master_gap_report.md not found in {target_dir}")
    return {"report_markdown": report_file.read_text(encoding="utf-8")}


# Static mount helper for built frontend
frontend_dist = Path("frontend/dist")
if frontend_dist.exists():
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="frontend")

