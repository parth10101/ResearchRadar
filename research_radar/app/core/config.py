"""
ResearchRadar: Core Application Settings & Configuration
"""

from pathlib import Path
from typing import List
from pydantic import BaseModel


class Settings(BaseModel):
    PROJECT_NAME: str = "ResearchRadar API"
    VERSION: str = "3.0.0"
    DESCRIPTION: str = "Production control plane for academic knowledge graphs, combinatorial novelty scoring, and grounded RAG gap narration."
    
    # Base paths
    ROOT_DIR: Path = Path(__file__).resolve().parent.parent.parent.parent
    DATA_DIR: Path = Path(__file__).resolve().parent.parent.parent.parent / "data"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # Database Configuration (Supabase PostgreSQL with local SQLite offline auto-failover)
    DATABASE_URL: str = ""  # e.g., postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
    SQLITE_PATH: Path = Path(__file__).resolve().parent.parent.parent.parent / "data" / "research_radar.db"
    DUCKDB_PATH: Path = Path(__file__).resolve().parent.parent.parent.parent / "data" / "analytics.duckdb"

    # Pipeline defaults
    DEFAULT_MAX_RESULTS: int = 300
    DEFAULT_CORPUS: str = "data/papers.json"


settings = Settings()

