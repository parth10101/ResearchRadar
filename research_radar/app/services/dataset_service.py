"""
ResearchRadar: Dataset Management & Resolution Service
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Optional
from research_radar.app.core.config import settings
from research_radar.app.models.schemas import DatasetInfo, DatasetListResponse


METADATA_REGISTRY: Dict[str, Dict[str, Any]] = {
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
    "output_transformer_models_for_m": {
        "name": "Transformer Models for Medical Image Segmentation",
        "description": "1,000 papers — Vision Transformers, Swin-UNet, UNETR, MedSAM applied to BraTS, ACDC, Synapse benchmarks.",
        "query": "Transformer models for medical image segmentation",
        "papers": 1000,
    },
}


def resolve_output_dir(dataset: Optional[str] = None, out_dir: Optional[str] = None) -> Optional[Path]:
    """Resolves target output directory cleanly from dataset id or path."""
    if not dataset and not out_dir:
        return None

    data_dir = settings.DATA_DIR
    candidates = []
    
    if dataset:
        clean = dataset.strip().rstrip("/\\")
        if clean:
            candidates.append(Path(clean))
            candidates.append(data_dir / clean)
            if not clean.startswith("output_"):
                candidates.append(data_dir / f"output_{clean}")
                
    if out_dir:
        clean = out_dir.strip().rstrip("/\\")
        if clean:
            candidates.append(Path(clean))
            candidates.append(data_dir / clean)

    for c in candidates:
        if c.exists() and c.is_dir():
            return c

    return None


def list_datasets() -> DatasetListResponse:
    """Returns list of all available computed datasets from database and disk inventory."""
    datasets: List[DatasetInfo] = []
    seen_ids = set()

    # 1. First query Database (Supabase / SQLite)
    try:
        from research_radar.app.services.db_service import get_corpora, get_corpus_gaps, get_corpus_clusters, get_corpus_edges
        db_corpora = get_corpora()
        for c in db_corpora:
            seen_ids.add(c.id)
            datasets.append(DatasetInfo(
                id=c.id,
                name=c.name,
                description=c.description or "",
                query=c.query or "",
                paper_count=c.paper_count,
                has_archipelago=True,
                has_milestones=True,
                has_gaps=True,
                has_narration=True,
            ))
    except Exception as e:
        pass

    # 2. Augment / fallback with disk scan and auto-sync to DB
    data_dir = settings.DATA_DIR
    if data_dir.exists():
        for p in sorted(data_dir.glob("output*")):
            if not p.is_dir() or p.name in seen_ids:
                continue
            key = p.name
            files = {f.name for f in p.iterdir()}

            # Extract actual paper count from papers.json if available
            actual_count = None
            papers_file = p / "papers.json"
            if papers_file.exists():
                try:
                    raw = papers_file.read_text(encoding="utf-8", errors="replace")
                    parsed = json.loads(raw)
                    actual_count = len(parsed) if isinstance(parsed, list) else 0
                except Exception:
                    actual_count = 0

            # Derive clean editorial name
            default_name = key.replace("output_", "").replace("_", " ").title()
            meta = METADATA_REGISTRY.get(key, {
                "name": default_name,
                "description": f"Computed pipeline synthesis for {default_name}",
                "query": key.replace("output_", "").replace("_", " "),
                "papers": actual_count,
            })

            # Auto-register to SQLite database if missing
            if "detected_gaps.json" in files or papers_file.exists():
                try:
                    from research_radar.app.services.db_service import sync_directory_to_db
                    sync_directory_to_db(corpus_id=key, dir_path=p, metadata={
                        "name": meta["name"],
                        "query": meta["query"],
                        "description": meta["description"],
                    })
                except Exception:
                    pass

            datasets.append(DatasetInfo(
                id=key,
                name=meta["name"],
                description=meta["description"],
                query=meta["query"],
                paper_count=actual_count if actual_count is not None else meta.get("papers"),
                has_archipelago="archipelago_data.json" in files or "topic_results.json" in files,
                has_milestones="citation_data.json" in files,
                has_gaps="detected_gaps.json" in files,
                has_narration="narrated_gaps.json" in files or "master_gap_report.md" in files,
            ))
            seen_ids.add(key)

    return DatasetListResponse(datasets=datasets)

