import sys
import os
sys.path.insert(0, os.path.abspath("."))
from pathlib import Path
from research_radar.app.services.live_query_synthesizer import synthesize_live_query_corpus
import json

query = '"Deep Learning" AND "CNN"'
out_dir = Path("data/output_deep_learning_and_cnn_300")
print(f"Starting genuine synthesis for '{query}' with 300 papers...", flush=True)

synthesize_live_query_corpus(
    query=query,
    out_path=out_dir,
    max_papers=300,
    progress_callback=lambda stage, name, pct, msg: print(f"[{pct}%] {name}: {msg}", flush=True)
)

print("\n--- SYNTHESIS VERIFICATION ---", flush=True)
papers = json.loads((out_dir / "papers.json").read_text(encoding="utf-8"))
gaps = json.loads((out_dir / "detected_gaps.json").read_text(encoding="utf-8"))["gaps"]
clusters = json.loads((out_dir / "cluster_3d_points.json").read_text(encoding="utf-8"))["clusters"]
citations = json.loads((out_dir / "citation_data.json").read_text(encoding="utf-8"))["cards"]

print(f"Total Papers Fetched: {len(papers)}")
print(f"Total 3D Clusters: {len(clusters)}")
print(f"Total Citation Cards: {len(citations)}")
print(f"Total Grounded Gaps: {len(gaps)}")
for idx, g in enumerate(gaps, 1):
    print(f"\nGap #{idx}: {g['title']}")
    print(f"  Method (M)    : {g['method']}")
    print(f"  Substrate (D) : {g['dataset']}")
    print(f"  Limitation (L): {g['limitation']}")

print("\nGENUINE PRESET DATASET GENERATION 100% COMPLETE!", flush=True)
