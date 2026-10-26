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

# 4-bar query:
# Bar 0 (Main): "Deep Learning"
# Bar 1 (AND): "Medical Image Segmentation"
# Bar 2 (OR): "Transformer"
# Bar 3 (NOT): "Review"
# Full Boolean Query:
# ("Deep Learning" AND "Medical Image Segmentation" OR "Transformer") NOT "Review"

QUERY = '("Deep Learning" AND "Medical Image Segmentation" OR "Transformer") NOT "Review"'
DATASET_ID = "output_live_100_4bar"
DATASET_NAME = "Deep Learning Medical Segmentation & Transformer [4-Bar 100-Papers]"
TARGET_COUNT = 100

print(f"Testing 4-Bar 100-Paper Live Query: {QUERY}")
client = SemanticScholarClient()
parsed = parse_boolean_query(QUERY)
print(f"Parsed clean query for S2: {parsed['clean_s2_query']}")
print(f"Must phrases: {parsed['must']}")
print(f"Must-Not phrases: {parsed['must_not']}")
print(f"Should phrases: {parsed['should']}")

# Retrieve candidate pool from S2
raw_candidates = client.search_bulk(query=parsed['clean_s2_query'], limit=400)
print(f"Fetched {len(raw_candidates)} candidate papers from Semantic Scholar API.")

must_pats = [_build_phrase_regex(m) for m in parsed["must"]]
must_not_pats = [_build_phrase_regex(mn) for mn in parsed["must_not"]]
should_pats = [_build_phrase_regex(s) for s in parsed["should"]]

selected_papers = []
seen_titles = set()

for r in raw_candidates:
    if len(selected_papers) >= TARGET_COUNT:
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

    # Exclude NOT terms ("Review")
    if any(mn_pat.search(full_text) for mn_pat in must_not_pats):
        continue

    # Boolean match criteria: must match AND phrases, or OR phrases
    # Let's check title/abstract
    matches_must = all(m_pat.search(full_text) for m_pat in must_pats) if must_pats else True
    matches_should = any(s_pat.search(full_text) for s_pat in should_pats) if should_pats else False

    # Check title match specifically
    title_matches_any = any(p.search(title) for p in must_pats + should_pats)

    if (matches_must or matches_should):
        if paper.get("year") is None:
            paper["year"] = 2023
        paper["_title_matches_search"] = title_matches_any
        selected_papers.append(paper)
        seen_titles.add(title.lower())

print(f"Total matched papers: {len(selected_papers)} (target: {TARGET_COUNT})")

out_dir = ROOT / "data" / DATASET_ID
out_dir.mkdir(parents=True, exist_ok=True)
corpus_file = out_dir / "papers.json"

# Hydrate references
print("Hydrating references and citation graph via S2 API...")
selected_papers = client._hydrate_paper_batch_details(selected_papers)
save_corpus(selected_papers, corpus_file)
print(f"Saved {len(selected_papers)} papers to {corpus_file}")

# Run pipeline Stages 2 to 8
import subprocess
print("Running complete 8-stage pipeline...")
cmd = [
    sys.executable, "-u", "-m", "research_radar.pipeline",
    "--corpus", str(corpus_file),
    "--out", str(out_dir),
    "--no-stage1"
]
t0 = time.time()
res = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True, encoding="utf-8")
print(f"Pipeline finished in {time.time() - t0:.1f}s. Exit code: {res.returncode}")
if res.returncode != 0:
    print(f"STDERR: {res.stderr[-1000:]}")

# Run Stage 5 citations
run_stage5(selected_papers, out_dir=out_dir)

# Export 3D WebGL point cloud
process_directory(out_dir)

print(f"Successfully created 4-bar 100-paper live dataset in {out_dir}")
