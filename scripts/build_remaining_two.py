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
from research_radar.stage1_ingest import _s2_paper_to_schema
from research_radar.export_3d import process_directory
from research_radar.stage5_citations import run_stage5

TARGETS = [
    {
        "id": "output_gnn_kg_40",
        "name": "Knowledge Graph GNNs [AND NOT]",
        "query": '("Graph Neural Networks" AND "Knowledge Graphs") NOT "Survey"',
        "bool_type": "AND + NOT (Survey Purge)",
        "must": ["graph neural networks", "knowledge graphs"],
        "must_not": ["survey"],
        "should": []
    }
]

client = SemanticScholarClient()

for cfg in TARGETS:
    ds_id = cfg["id"]
    name = cfg["name"]
    query = cfg["query"]
    target = 40
    out_dir = ROOT / "data" / ds_id
    out_dir.mkdir(parents=True, exist_ok=True)
    corpus_file = out_dir / "papers.json"

    print(f"\n{'='*75}")
    print(f"  BUILDING 100% TITLE-MATCH CORPUS: {name}")
    print(f"  Query: {query}")
    print(f"{'='*75}")

    parsed = parse_boolean_query(query)
    must_pats = [_build_phrase_regex(m) for m in cfg["must"]]
    must_not_pats = [_build_phrase_regex(mn) for mn in cfg["must_not"]]
    should_pats = [_build_phrase_regex(s) for s in cfg["should"]]

    raw_list = client.search_bulk(query=parsed['clean_s2_query'], limit=400)
    print(f"  Retrieved {len(raw_list)} raw candidates from S2.")

    verified_papers = []
    seen_titles = set()

    for r in raw_list:
        if len(verified_papers) >= target:
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

        # Check NOT in full paper
        if any(mn_pat.search(full_text) for mn_pat in must_not_pats):
            continue

        # Strict 100% TITLE check
        if cfg["must"]:
            if not all(m_pat.search(title) for m_pat in must_pats):
                continue
        elif cfg["should"]:
            if not any(s_pat.search(title) for s_pat in should_pats):
                continue

        if paper.get("year") is None:
            paper["year"] = 2024

        paper["_title_match_score"] = 50
        verified_papers.append(paper)
        seen_titles.add(title.lower())

    print(f"  Selected {len(verified_papers)} / {target} papers with 100% TITLE MATCH!")
    if len(verified_papers) < target:
        print(f"  [ERROR] Found only {len(verified_papers)} papers!")
        sys.exit(1)

    # Sort by citation count while retaining 100% title match
    verified_papers.sort(key=lambda p: (p.get("citation_count") or 0), reverse=True)

    # Hydrate references
    verified_papers = client._hydrate_paper_batch_details(verified_papers)

    # Overwrite papers.json directly
    with open(corpus_file, "w", encoding="utf-8") as f:
        json.dump(verified_papers, f, indent=2, ensure_ascii=False)
    print(f"  Saved {len(verified_papers)} papers to {corpus_file}")

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

    # Run Stage 5
    run_stage5(verified_papers, out_dir=out_dir)

    # Export 3D WebGL
    process_directory(out_dir)
    print(f"  Exported 3D point cloud artifacts for {ds_id}/")

print("\nREMAINING TWO CORPORA 100% TITLE-MATCH COMPLETE!")
