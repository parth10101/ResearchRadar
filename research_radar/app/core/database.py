"""
ResearchRadar: Database Engine & Hybrid Connection Manager
Supports Supabase / PostgreSQL with automatic offline failover to local SQLite.
"""

import os
import logging
from pathlib import Path
from typing import Generator
from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy import text
from research_radar.app.core.config import settings

logger = logging.getLogger("research_radar.database")

# Global engine and state
_engine = None
_active_backend = "unknown"


def _create_sqlite_engine():
    global _active_backend
    settings.SQLITE_PATH.parent.mkdir(parents=True, exist_ok=True)
    sqlite_url = f"sqlite:///{settings.SQLITE_PATH.as_posix()}"
    engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False},
        echo=False
    )
    _active_backend = "sqlite_offline"
    logger.info(f"[DB] Operating in Local Offline SQLite mode: {sqlite_url}")
    return engine


def get_engine():
    global _engine, _active_backend
    if _engine is not None:
        return _engine

    db_url = os.getenv("DATABASE_URL", settings.DATABASE_URL).strip()
    
    if db_url and (db_url.startswith("postgresql://") or db_url.startswith("postgres://")):
        # Ensure psycopg2 or standard postgresql dialect prefix
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        
        try:
            logger.info("[DB] Attempting connection to Supabase / PostgreSQL...")
            candidate_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=300,
                connect_args={"connect_timeout": 10}
            )
            # Test connectivity with ping
            with candidate_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            
            _engine = candidate_engine
            _active_backend = "supabase_postgresql"
            logger.info("[DB] Successfully connected to Supabase / PostgreSQL cloud database!")
            return _engine
        except Exception as e:
            logger.warning(
                f"[DB] Cloud Supabase/PostgreSQL connection failed ({e}). "
                f"Auto-falling back to Local Offline SQLite resilience mode."
            )
            _engine = _create_sqlite_engine()
            return _engine
    else:
        _engine = _create_sqlite_engine()
        return _engine


def get_active_backend() -> str:
    global _active_backend
    if _engine is None:
        get_engine()
    return _active_backend


def init_db():
    """Initializes all database tables across the active engine."""
    engine = get_engine()
    SQLModel.metadata.create_all(engine)
    logger.info(f"[DB] Initialized all database tables on backend: {get_active_backend()}")


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency to yield a database session."""
    engine = get_engine()
    with Session(engine) as session:
        yield session
