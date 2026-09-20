"""
ResearchRadar: Database Models (SQLModel / SQLAlchemy ORM)
Compatible with both Supabase (PostgreSQL + pgvector) and Local SQLite for 100% offline failover.
"""

from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column, Text
import json


class CorpusRecord(SQLModel, table=True):
    __tablename__ = "corpora"

    id: str = Field(primary_key=True, index=True)  # e.g., "quantum_computing_2026"
    name: str = Field(index=True)
    description: Optional[str] = Field(default="")
    query: Optional[str] = Field(default="")
    source: str = Field(default="preset")  # "preset" | "live_search" | "upload"
    paper_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PaperRecord(SQLModel, table=True):
    __tablename__ = "papers"

    id: str = Field(primary_key=True, index=True)  # ArXiv ID or S2AG ID
    corpus_id: str = Field(index=True)
    title: str = Field(sa_column=Column(Text, nullable=False))
    abstract: str = Field(sa_column=Column(Text, default=""))
    authors_json: str = Field(sa_column=Column(Text, default="[]"))  # JSON array of authors
    year: Optional[int] = Field(default=None, index=True)
    citation_count: int = Field(default=0)
    cluster_id: Optional[int] = Field(default=None, index=True)
    cluster_name: Optional[str] = Field(default=None)
    x: Optional[float] = Field(default=0.0)
    y: Optional[float] = Field(default=0.0)
    z: Optional[float] = Field(default=0.0)
    doi: Optional[str] = Field(default=None)
    url: Optional[str] = Field(default=None)

    @property
    def authors(self) -> List[str]:
        try:
            return json.loads(self.authors_json)
        except Exception:
            return []


class TopicClusterRecord(SQLModel, table=True):
    __tablename__ = "topic_clusters"

    id: Optional[int] = Field(default=None, primary_key=True)
    corpus_id: str = Field(index=True)
    cluster_id: int = Field(index=True)
    name: str = Field(index=True)
    description: Optional[str] = Field(default="")
    size: int = Field(default=0)
    color: str = Field(default="#00f0ff")
    top_terms_json: str = Field(sa_column=Column(Text, default="[]"))  # JSON array of strings
    centroid_x: float = Field(default=0.0)
    centroid_y: float = Field(default=0.0)
    centroid_z: float = Field(default=0.0)

    @property
    def top_terms(self) -> List[str]:
        try:
            return json.loads(self.top_terms_json)
        except Exception:
            return []


class CitationEdgeRecord(SQLModel, table=True):
    __tablename__ = "citation_edges"

    id: Optional[int] = Field(default=None, primary_key=True)
    corpus_id: str = Field(index=True)
    source_id: str = Field(index=True)
    target_id: str = Field(index=True)
    weight: float = Field(default=1.0)
    edge_type: str = Field(default="citation")  # "citation", "co_citation", "similarity"


class ResearchGapRecord(SQLModel, table=True):
    __tablename__ = "research_gaps"

    id: str = Field(primary_key=True, index=True)  # e.g., "gap_1" or UUID
    corpus_id: str = Field(index=True)
    title: str = Field(sa_column=Column(Text, nullable=False))
    description: str = Field(sa_column=Column(Text, default=""))
    topic_a_name: str = Field(default="")
    topic_b_name: str = Field(default="")
    novelty_score: float = Field(default=0.0)
    feasibility_score: float = Field(default=0.0)
    impact_score: float = Field(default=0.0)
    evidence_text: str = Field(sa_column=Column(Text, default=""))
    recommended_methodology: str = Field(sa_column=Column(Text, default=""))
    suggested_title: str = Field(sa_column=Column(Text, default=""))
    grant_proposal_md: Optional[str] = Field(sa_column=Column(Text, default=""))


class PipelineJobRecord(SQLModel, table=True):
    __tablename__ = "pipeline_jobs"

    job_id: str = Field(primary_key=True, index=True)
    query: str = Field(default="")
    status: str = Field(default="pending")  # pending, running, completed, failed
    stage: str = Field(default="Stage 0: Initialized")
    progress: float = Field(default=0.0)
    error_message: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)
