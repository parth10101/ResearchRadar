"""
ResearchRadar: Pydantic v2 Schemas for API Requests, Responses & Pipeline Data Contracts
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Pipeline Job Schemas
# ---------------------------------------------------------------------------

class PipelineRunRequest(BaseModel):
    query: Optional[str] = Field(None, description="Search query string for Semantic Scholar")
    corpus_path: Optional[str] = Field("data/papers.json", description="Path to input corpus JSON")
    out_dir: Optional[str] = Field(None, description="Path to output directory")
    max_results: int = Field(300, ge=10, le=5000, description="Max papers to fetch")
    source: str = Field("semanticscholar", description="Source API: 'semanticscholar'")
    year: Optional[str] = Field(None, description="Publication year filter (e.g. '-2023' for temporal holdout validation, '2020-2023')")
    force_fetch: bool = Field(False, description="Force fresh download bypassing existing cache")
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
    dataset_id: Optional[str] = None
    is_terminal: bool = False
    error: Optional[str] = None


class PipelineProgressEvent(BaseModel):
    stage: int
    stage_name: str
    progress_pct: int
    message: str
    timestamp: float
    status: Optional[str] = None
    dataset_id: Optional[str] = None
    is_terminal: bool = False


# ---------------------------------------------------------------------------
# Dataset Schemas
# ---------------------------------------------------------------------------

class DatasetInfo(BaseModel):
    id: str
    name: str
    description: str
    query: str
    paper_count: Optional[int] = None
    has_archipelago: bool = False
    has_milestones: bool = False
    has_gaps: bool = False
    has_narration: bool = False


class DatasetListResponse(BaseModel):
    datasets: List[DatasetInfo]


# ---------------------------------------------------------------------------
# 3D Graph & Cluster Schemas
# ---------------------------------------------------------------------------

class Point3D(BaseModel):
    id: str
    x: float
    y: float
    z: float
    cluster_id: int
    cluster_name: str
    color: str
    title: str
    authors: List[str]
    year: int
    citations: int
    venue: str
    tldr: str
    abstract: Optional[str] = ""
    doi: Optional[str] = None


class Cluster3D(BaseModel):
    cluster_id: int
    name: str
    color: str
    point_count: int
    centroid: Dict[str, float]
    points: List[Point3D]


class Gap3D(BaseModel):
    gap_id: str
    rank: int
    title: str
    method: str
    dataset: str
    limitation: str
    score: float
    uzzi_z_score: float
    description: str
    source_cluster: int
    target_cluster: int
    centroid: Dict[str, float]


class Bounds3D(BaseModel):
    min_x: float
    max_x: float
    min_y: float
    max_y: float
    min_z: float
    max_z: float


class Points3DData(BaseModel):
    total_points: int
    clusters: List[Cluster3D]
    gaps_3d: List[Gap3D]
    bounds: Bounds3D


# ---------------------------------------------------------------------------
# Citation Lineage & Milestone Schemas
# ---------------------------------------------------------------------------

class SharedRef(BaseModel):
    title: str
    authors: Optional[str] = ""
    year: Optional[int] = None
    venue: Optional[str] = ""
    citationCount: Optional[int] = None
    url: Optional[str] = "#"
    pdf_url: Optional[str] = None
    doi_url: Optional[str] = None
    s2_url: Optional[str] = None
    scholar_url: Optional[str] = None


class RelatedPaper(BaseModel):
    id: str
    title: str
    authors: str
    venue: str
    year: int
    global_cits: int
    shared_count: int
    relationship: str
    why_key: Optional[str] = ""
    shared_refs_list: List[SharedRef] = []


class CitationCard(BaseModel):
    id: str
    title: str
    year: int
    authors: str
    venue: str
    global_cits: int
    ref_count: int
    tldr: str
    arxiv_url: str
    action_label: Optional[str] = None
    action_class: Optional[str] = None
    ref_status_label: Optional[str] = None
    authority_score: Optional[float] = None
    journey_foundation: Optional[bool] = False
    journey_frontier: Optional[bool] = False
    badge_label: Optional[str] = "Top Cited"
    badge_class: Optional[str] = "top_cited"
    related_papers: List[RelatedPaper] = []


class CitationData(BaseModel):
    cards: List[CitationCard]
    milestones: List[Dict[str, Any]] = []


# ---------------------------------------------------------------------------
# Research Gap & Narration Schemas
# ---------------------------------------------------------------------------

class OperationalHypothesis(BaseModel):
    task: str
    task_plain: Optional[str] = None
    methodology: str
    method_plain: Optional[str] = None
    dataset: str
    dataset_plain: Optional[str] = None
    constraint: str
    constraint_plain: Optional[str] = None
    epistemic_boundary: str
    epistemic_plain: Optional[str] = None
    hypothesis_statement: str
    specificity_score: float = 0.95
    is_admissible: bool = True
    specificity_evaluation: Optional[Dict[str, Any]] = None


class EvidencePaper(BaseModel):
    index: int
    id: str
    title: str
    year: int
    venue: Optional[str] = None
    url: Optional[str] = None


class ResearchGap(BaseModel):
    gap_type: str
    title: str
    method: str
    dataset: str
    limitation: str
    score: float
    specificity_score: Optional[float] = None
    literature_tier: Optional[str] = None
    operational_hypothesis: Optional[OperationalHypothesis] = None
    uzzi_z_score: float = -1.45
    expected_cooccur: float = 0.05
    description: str
    description_plain: Optional[str] = None
    papers_involved: List[str] = []
    scientific_basis: Optional[Dict[str, Any]] = None
    global_verification: Optional[Dict[str, Any]] = None
    evidence_papers: Optional[List[EvidencePaper]] = []


class NarratedGap(ResearchGap):
    llm_narration: str = ""
    llm_model: str = "groq/llama-3.3-70b-versatile"
    llm_provider: str = "Groq LPU Scientometric Synthesizer"


class NarratedGapsResponse(BaseModel):
    total_narrated: int
    source: Optional[str] = "detected_gaps"
    gaps: List[NarratedGap]
