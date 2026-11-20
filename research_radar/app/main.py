"""
ResearchRadar: Production FastAPI Application Entrypoint
"""

import time
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from contextlib import asynccontextmanager
from research_radar.app.api.router import api_router
from research_radar.app.core.config import settings
from research_radar.app.core.database import init_db, get_active_backend
from research_radar.app.services.db_service import get_corpora, sync_directory_to_db
from research_radar.app.services.dataset_service import METADATA_REGISTRY


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database & Seed presets if needed
    try:
        init_db()
        backend = get_active_backend()
        corpora = get_corpora()
        if len(corpora) == 0:
            data_dir = settings.DATA_DIR
            if data_dir.exists():
                for key, meta in METADATA_REGISTRY.items():
                    dir_path = data_dir / key
                    if dir_path.exists() and dir_path.is_dir():
                        sync_directory_to_db(corpus_id=key, dir_path=dir_path, metadata=meta)
        print(f"[DB] Initialized database. Active backend: {backend} ({len(get_corpora())} corpora ready)", flush=True)
    except Exception as e:
        print(f"[DB ERROR] Failed database initialization: {e}", flush=True)
    
    yield
    # Shutdown
    pass


def create_application() -> FastAPI:
    """FastAPI Application Factory."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.DESCRIPTION,
        version=settings.VERSION,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Logging Middleware
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
            elif "/pipeline/run" in path: desc = "-> [PIPELINE EXECUTION TRIGGERED]"
            elif "/datasets" in path: desc = "-> Loading Datasets Inventory"

            if desc:
                print(f"[UI ACTION] {request.method} {path}{q_str} {desc}", flush=True)

        response = await call_next(request)
        return response

    # Health Check
    @app.get("/api/health", tags=["Health & Diagnostics"])
    def health_check():
        return {
            "status": "healthy",
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "database_backend": get_active_backend(),
            "corpora_count": len(get_corpora()),
            "timestamp": time.time(),
        }

    # Mount API Router
    app.include_router(api_router)

    # Static mount for built frontend
    frontend_dist = settings.ROOT_DIR / "frontend" / "dist"
    if frontend_dist.exists():
        app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")

    @app.exception_handler(404)
    async def spa_404_handler(request, exc):
        if request.url.path.startswith("/api"):
            return JSONResponse(status_code=404, content={"detail": f"API endpoint '{request.url.path}' not found"})
        index_file = frontend_dist / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return JSONResponse(status_code=404, content={"detail": "Not found"})

    return app


app = create_application()


if __name__ == "__main__":
    import uvicorn
    print("\nStarting ResearchRadar Production API on http://127.0.0.1:8000 ...")
    uvicorn.run("research_radar.app.main:app", host="127.0.0.1", port=8000, reload=True)
