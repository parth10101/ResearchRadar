"""
ResearchRadar: High-Performance Async Pipeline Runner & SSE Streaming Engine
"""

import asyncio
import json
import os
import re
import subprocess
import sys
import threading
import time
import uuid
from pathlib import Path
from typing import Any, AsyncGenerator, Dict, Optional

from research_radar.app.core.config import settings
from research_radar.app.models.schemas import PipelineProgressEvent, PipelineRunRequest, PipelineStatusResponse

# In-memory pipeline registry
JOBS: Dict[str, Dict[str, Any]] = {}
RUNNING_PROCS: Dict[str, subprocess.Popen] = {}


def create_pipeline_job(req: PipelineRunRequest) -> str:
    """Allocates a new tracking job."""
    job_id = str(uuid.uuid4())[:8]
    JOBS[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "stage": 0,
        "stage_name": "Initializing",
        "progress_pct": 0,
        "elapsed_seconds": 0.0,
        "message": "Job queued for processing.",
        "dataset_id": None,
        "events": [],
        "created_at": time.time(),
        "is_terminal": False,
        "error": None,
        "req": req.model_dump(),
    }
    return job_id


def get_job_status(job_id: str) -> Optional[PipelineStatusResponse]:
    """Retrieves status for a job ID."""
    job = JOBS.get(job_id)
    if not job:
        return None
    return PipelineStatusResponse(
        job_id=job["job_id"],
        status=job["status"],
        stage=job["stage"],
        stage_name=job["stage_name"],
        progress_pct=job["progress_pct"],
        elapsed_seconds=job.get("elapsed_seconds", 0.0),
        message=job["message"],
        dataset_id=job.get("dataset_id"),
        is_terminal=job.get("is_terminal", False),
        error=job.get("error"),
    )


def cancel_pipeline_job(job_id: str) -> bool:
    """Cancels and terminates a running job."""
    job = JOBS.get(job_id)
    if not job:
        return False
    proc = RUNNING_PROCS.get(job_id)
    if proc:
        try:
            proc.terminate()
            proc.kill()
        except Exception:
            pass
        RUNNING_PROCS.pop(job_id, None)

    job["status"] = "cancelled"
    job["is_terminal"] = True
    job["message"] = "Job cancelled by user."
    job["events"].append({
        "stage": job["stage"],
        "stage_name": "Cancelled",
        "progress_pct": job["progress_pct"],
        "message": "Pipeline cancelled.",
        "timestamp": time.time(),
        "is_terminal": True,
        "status": "cancelled",
    })
    return True


async def execute_pipeline_task(job_id: str, req: PipelineRunRequest):
    """Executes the 8-stage scientometric pipeline in a non-blocking background worker."""
    job = JOBS.get(job_id)
    if not job:
        return

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
            "timestamp": time.time(),
            "status": "running",
            "is_terminal": False,
        })

    try:
        from research_radar.export_3d import process_directory

        # Determine target output folder dynamically from query hash
        if req.query:
            import hashlib
            q_hash = hashlib.md5(req.query.strip().encode('utf-8')).hexdigest()[:6]
            slug = re.sub(r'[^a-zA-Z0-9]+', '_', req.query.strip().lower())[:18].strip('_')
            out_path = settings.DATA_DIR / f"output_{slug}_{q_hash}"
        else:
            out_path = Path(req.out_dir) if req.out_dir else settings.DATA_DIR / "output"

        out_path.mkdir(parents=True, exist_ok=True)

        # Cache check: if dataset already fully computed and verified on disk
        if not getattr(req, "force_fetch", False) and (out_path / "detected_gaps.json").exists() and (out_path / "cluster_3d_points.json").exists():
            print(f"[PIPELINE RUNNER] Precomputed verified dataset '{out_path.name}' found on disk.", flush=True)
            _update_stage(8, "Pipeline Complete", 100, f"Synthesized research space ready ({out_path.name})")
            job["dataset_id"] = out_path.name
            job["status"] = "completed"
            job["is_terminal"] = True
            return

        # Dynamic live query synthesis path: authentic OpenAlex retrieval and SVD manifold projection
        if req.query:
            from research_radar.app.services.live_query_synthesizer import synthesize_live_query_corpus
            print(f"[PIPELINE RUNNER] Dynamically processing scientific space for query: '{req.query}'", flush=True)

            def _live_progress(stage_num: int, stage_name: str, pct: int, msg: str):
                _update_stage(stage_num, stage_name, pct, msg)

            await asyncio.to_thread(
                synthesize_live_query_corpus,
                req.query,
                out_path,
                max_papers=req.max_results or 50,
                progress_callback=_live_progress,
            )
            _update_stage(8, "Pipeline Complete", 100, f"Synthesized research space ready ({out_path.name})")
            job["dataset_id"] = out_path.name
            job["status"] = "completed"
            job["is_terminal"] = True
            return

        # Resolve correct python executable
        root_dir = settings.ROOT_DIR
        python_candidates = [
            root_dir / "venv_gpu" / "Scripts" / "python.exe",
            root_dir / "venv311" / "Scripts" / "python.exe",
            root_dir / "venv_gpu" / "bin" / "python",
            root_dir / "venv311" / "bin" / "python",
        ]
        py_bin = sys.executable
        for cand in python_candidates:
            if cand.exists():
                py_bin = str(cand)
                break

        cmd = [py_bin, "-u", "-m", "research_radar.pipeline"]
        if req.query:
            cmd.extend([
                "--query", req.query,
                "--corpus", str(out_path / "papers.json"),
                "--max-results", str(req.max_results),
                "--out", str(out_path)
            ])
        else:
            cmd.extend([
                "--corpus", req.corpus_path or str(settings.DATA_DIR / "papers.json"),
                "--out", str(out_path)
            ])

        if getattr(req, "year", None):
            cmd.extend(["--year", req.year])
        if getattr(req, "force_fetch", False):
            cmd.append("--force-fetch")
        if req.skip_stage1:
            cmd.append("--no-stage1")
        if req.skip_stage6:
            cmd.append("--no-stage6")
        if req.skip_stage8:
            cmd.append("--no-stage8")
        if getattr(req, "skip_clustering", False):
            cmd.append("--skip-clustering")

        print(f"\n{'='*75}\n [PIPELINE RUNNER] Launching Job {job_id} for '{req.query or 'Corpus'}'\n Executing: {' '.join(cmd)}\n{'='*75}\n", flush=True)

        _update_stage(1, "Stage 1: Initialization", 5, f"Launched pipeline for '{req.query or 'Corpus'}'")

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

        ret_code_holder = [None]
        done_event = threading.Event()

        def _run_thread():
            env = os.environ.copy()
            env["PYTHONPATH"] = str(root_dir) + (os.pathsep + env["PYTHONPATH"] if "PYTHONPATH" in env else "")
            proc = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                bufsize=1,
                universal_newlines=False,
                cwd=str(root_dir),
                env=env,
            )
            RUNNING_PROCS[job_id] = proc

            for raw_line in proc.stdout:
                line = raw_line.decode("utf-8", errors="replace").rstrip("\r\n")
                try:
                    print(f"[RADAR] {line}", flush=True)
                except Exception:
                    try:
                        safe_line = line.encode("ascii", errors="replace").decode("ascii")
                        print(f"[RADAR] {safe_line}", flush=True)
                    except Exception:
                        pass

                matched = False
                for pat, s_num, pct, s_name in stage_patterns:
                    if pat.search(line):
                        _update_stage(s_num, s_name, pct, line)
                        matched = True
                        break

                if not matched and line.strip():
                    job["events"].append({
                        "stage": job["stage"],
                        "stage_name": job["stage_name"],
                        "progress_pct": job["progress_pct"],
                        "message": line,
                        "timestamp": time.time(),
                        "status": "running",
                        "is_terminal": False,
                    })

            proc.wait()
            ret_code_holder[0] = proc.returncode
            RUNNING_PROCS.pop(job_id, None)
            done_event.set()

        t = threading.Thread(target=_run_thread, daemon=True)
        t.start()

        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, done_event.wait)

        ret_code = ret_code_holder[0]
        if ret_code == 0:
            print(f"\n{'='*75}\n [PIPELINE RUNNER] Job {job_id} Completed Successfully! Generating 3D Manifold...\n{'='*75}", flush=True)
            try:
                process_directory(out_path)
            except Exception as ex:
                print(f"[3D EXPORT ERROR]: {ex}", flush=True)

            try:
                from research_radar.app.services.db_service import sync_directory_to_db
                sync_directory_to_db(corpus_id=out_path.name, dir_path=out_path, metadata={
                    "name": (req.query or out_path.name).title(),
                    "query": req.query or "",
                    "description": f"Computed pipeline synthesis for '{req.query or out_path.name}'",
                })
                print(f"[DB] Synced pipeline run '{out_path.name}' into Database successfully.", flush=True)
            except Exception as db_ex:
                print(f"[DB SYNC ERROR]: {db_ex}", flush=True)

            job["dataset_id"] = out_path.name
            job["status"] = "completed"
            job["is_terminal"] = True
            _update_stage(8, "Pipeline Complete", 100,
                          f"Successfully synthesized in {round(time.time() - t0, 1)}s. Dataset {out_path.name} ready.")
        else:
            job["status"] = "failed"
            job["is_terminal"] = True
            job["message"] = f"Pipeline process exited with code {ret_code}"
            _update_stage(job["stage"], "Pipeline Error", job["progress_pct"],
                          f"Process failed with exit code {ret_code}")

    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print(f"[PIPELINE RUNNER EXCEPTION]: {e}\n{tb}", flush=True)
        job["status"] = "failed"
        job["is_terminal"] = True
        job["error"] = str(e)
        job["message"] = f"Pipeline execution failed: {e}"


async def stream_job_events(job_id: str) -> AsyncGenerator[str, None]:
    """Generates SSE stream yielding live progress events."""
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

        if job.get("is_terminal") or job.get("status") in ("completed", "failed", "cancelled"):
            final_event = {
                "stage": job["stage"],
                "stage_name": job["stage_name"],
                "status": job["status"],
                "progress_pct": job["progress_pct"],
                "message": job["message"],
                "dataset_id": job.get("dataset_id"),
                "is_terminal": True,
                "timestamp": time.time(),
            }
            yield f"data: {json.dumps(final_event)}\n\n"
            break

        await asyncio.sleep(0.25)
