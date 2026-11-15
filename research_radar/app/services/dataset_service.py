"""
ResearchRadar: Dataset Management & Resolution Service
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Optional
from research_radar.app.core.config import settings
from research_radar.app.models.schemas import DatasetInfo, DatasetListResponse


METADATA_REGISTRY: Dict[str, Dict[str, Any]] = {
    "output_cnn_hyperspectral_40": {
        "name": "Hyperspectral CNN Classification",
        "description": "40 papers — 100% Title-Match Conjunction: 'Convolutional Neural Networks' AND 'Hyperspectral Image Classification'. Both phrases in 100% of titles.",
        "query": '"Convolutional Neural Networks" AND "Hyperspectral Image Classification"',
        "papers": 40,
    },
    "output_fed_diffpriv_40": {
        "name": "Private Federated Learning",
        "description": "40 papers — 100% Title-Match Conjunction with Negation: 'Federated Learning' AND 'Differential Privacy' NOT 'Blockchain'. Both in 100% of titles.",
        "query": '("Federated Learning" AND "Differential Privacy") NOT "Blockchain"',
        "papers": 40,
    },
    "output_vit_mae_40": {
        "name": "Vision Transformers & MAE",
        "description": "40 papers — 100% Title-Match Disjunction: 'Vision Transformer' OR 'Masked Autoencoder'. 100% of titles contain target phrases.",
        "query": '"Vision Transformer" OR "Masked Autoencoder"',
        "papers": 40,
    },
    "output_gnn_kg_40": {
        "name": "Knowledge Graph GNNs",
        "description": "40 papers — 100% Title-Match Conjunction with Survey Purge: 'Graph Neural Networks' AND 'Knowledge Graphs' NOT 'Survey'. Both in 100% of titles.",
        "query": '("Graph Neural Networks" AND "Knowledge Graphs") NOT "Survey"',
        "papers": 40,
    },
    "output_live_100_4bar": {
        "name": "Deep Learning Medical Segmentation & Transformer [4-Bar 100-Papers]",
        "description": "100 papers — Live 4-Bar Multi-Operator Boolean Query: ('Deep Learning' AND 'Medical Image Segmentation' OR 'Transformer') NOT 'Review'. Verified live via Semantic Scholar API.",
        "query": '("Deep Learning" AND "Medical Image Segmentation" OR "Transformer") NOT "Review"',
        "papers": 100,
    },
    "output_diffusion_models_and_me": {
        "name": "Diffusion Models & Medical Segmentation",
        "description": "70 papers -- 100% Title-Match Conjunction with Survey Purge: 'Diffusion Models' AND 'Medical Image Segmentation' NOT 'Survey'. Both in 100% of titles.",
        "query": '"Diffusion Models" AND "Medical Image Segmentation" NOT "Survey"',
        "papers": 70,
    },
    "output_neural_networks_and_flu": {
        "name": "Neural Networks & Fluid Dynamics",
        "description": "100 papers -- 100% Title-Match Conjunction: 'Neural Networks' AND 'Fluid Dynamics'. OpenAlex verified live academic corpus with 3D clusters, citation network, and C_obs=0 gap analysis.",
        "query": '"Neural Networks" AND "Fluid Dynamics"',
        "papers": 100,
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
            if not c.paper_count or c.paper_count <= 0:
                continue
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

            if actual_count is not None and actual_count <= 0:
                continue

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

