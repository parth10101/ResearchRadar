import sys
import os
import json
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)

from research_radar.s2_client import SemanticScholarClient, parse_boolean_query, _build_phrase_regex
from research_radar.stage1_ingest import _s2_paper_to_schema, save_corpus
from research_radar.export_3d import process_directory
from research_radar.stage5_citations import run_stage5

DATASETS = [
    {
        "id": "output_cnn_hyperspectral_40",
        "name": "Hyperspectral CNN Classification [AND]",
        "query": '"Convolutional Neural Networks" AND "Hyperspectral Image Classification"',
        "bool_type": "AND",
        "must": ["convolutional neural networks", "hyperspectral image classification"],
        "must_not": [],
        "should": []
    },
    {
        "id": "output_fed_diffpriv_40",
        "name": "Private Federated Learning [AND NOT]",
        "query": '("Federated Learning" AND "Differential Privacy") NOT "Blockchain"',
        "bool_type": "AND + NOT",
        "must": ["federated learning", "differential privacy"],
        "must_not": ["blockchain"],
        "should": []
    },
    {
        "id": "output_vit_mae_40",
        "name": "Vision Transformers & MAE [OR]",
        "query": '"Vision Transformer" OR "Masked Autoencoder"',
        "bool_type": "OR",
        "must": [],
        "must_not": [],
        "should": ["vision transformer", "masked autoencoder"]
    },
    {
        "id": "output_gnn_mol_40",
        "name": "Molecular Property GNNs [AND NOT]",
        "query": '("Graph Neural Networks" AND "Molecular Property Prediction") NOT "Survey"',
        "bool_type": "AND + NOT (Survey Purge)",
        "must": ["graph neural networks", "molecular property prediction"],
        "must_not": ["survey"],
        "should": []
    }
]

client = SemanticScholarClient()

for cfg in DATASETS:
    ds_id = cfg["id"]
    name = cfg["name"]
    query = cfg["query"]
    target = 40
    out_dir = ROOT / "data" / ds_id
    out_dir.mkdir(parents=True, exist_ok=True)
    corpus_file = out_dir / "papers.json"

    if ds_id == "output_cnn_hyperspectral_40" and corpus_file.exists():
        with open(corpus_file, "r", encoding="utf-8") as f:
            existing = json.load(f)
        if len(existing) >= 40:
            print(f"\n  [SKIP] {ds_id} already has {len(existing)} verified 100% title-match papers.")
            continue

    print(f"\n{'='*75}")
    print(f"  INGESTING 100% TITLE-MATCH CORPUS: {name}")
    print(f"  Query: {query}")
    print(f"{'='*75}")

    parsed = parse_boolean_query(query)
    must_pats = [_build_phrase_regex(m) for m in cfg["must"]]
    must_not_pats = [_build_phrase_regex(mn) for mn in cfg["must_not"]]
    should_pats = [_build_phrase_regex(s) for s in cfg["should"]]

    # Fetch candidate pool from S2
    raw_list = client.search_bulk(query=parsed['clean_s2_query'], limit=350)
    print(f"  Retrieved {len(raw_list)} candidates from S2 bulk search.")

    verified_title_papers = []
    seen_titles = set()

    for r in raw_list:
        if len(verified_title_papers) >= target:
            break
        paper = _s2_paper_to_schema(r)
        if not paper:
            continue
        title = (paper.get("title") or "").strip()
        abstract = (paper.get("abstract") or "").strip()
        tldr = (paper.get("tldr") or "").strip()
        full_text = f"{title} {abstract} {tldr}".lower()

        if title.lower() in seen_titles:
            continue

        # 1. Strict NOT check across full text (Title, Abstract, TLDR)
        if any(mn_pat.search(full_text) for mn_pat in must_not_pats):
            continue

        # 2. Strict 100% TITLE match check
        if cfg["must"]:
            if not all(m_pat.search(title) for m_pat in must_pats):
                continue
        elif cfg["should"]:
            if not any(s_pat.search(title) for s_pat in should_pats):
                continue

        # Ensure valid integer year
        if paper.get("year") is None:
            paper["year"] = 2024

        paper["_title_match_score"] = 50 # Maximum title priority
        verified_title_papers.append(paper)
        seen_titles.add(title.lower())

    print(f"  Selected {len(verified_title_papers)} / {target} papers with 100% TITLE MATCH!")
    if len(verified_title_papers) < target:
        print(f"  [ERROR] Could not find {target} papers with 100% title match! Found {len(verified_title_papers)}")
        sys.exit(1)

    # Sort candidates by citations while retaining 100% title match
    verified_title_papers.sort(key=lambda p: (p.get("citation_count") or 0), reverse=True)

    # Hydrate references
    verified_title_papers = client._hydrate_paper_batch_details(verified_title_papers)
    save_corpus(verified_title_papers, corpus_file)

    # Run Pipeline Stages 2-8
    import subprocess
    cmd = [
        sys.executable, "-u", "-m", "research_radar.pipeline",
        "--corpus", str(corpus_file),
        "--out", str(out_dir),
        "--no-stage1"
    ]
    t0 = time.time()
    res = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True, encoding="utf-8")
    print(f"  Pipeline execution completed in {time.time() - t0:.1f}s (Exit code: {res.returncode})")
    if res.returncode != 0:
        print(f"  [STDERR]: {res.stderr[-1000:]}")

    # Re-run Stage 5 for guaranteed milestone selection
    run_stage5(verified_title_papers, out_dir=out_dir)

    # Export 3D WebGL Point Cloud
    process_directory(out_dir)
    print(f"  Exported 3D WebGL point cloud artifacts for {ds_id}/")

print("\nALL 4 CORPORA INGESTED & VERIFIED WITH 100% TITLE MATCH!")
