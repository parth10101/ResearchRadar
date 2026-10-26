import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from research_radar.stage5_citations import run_stage5

datasets = [
    "output_cnn_hyperspectral_40",
    "output_fed_diffpriv_40",
    "output_vit_mae_40",
    "output_gnn_kg_40",
    "output_live_100_4bar",
]

for ds in datasets:
    out_dir = ROOT / "data" / ds
    p_file = out_dir / "papers.json"
    if not p_file.exists():
        continue
    with open(p_file, "r", encoding="utf-8") as f:
        papers = json.load(f)
    print(f"Re-running Stage 5 for {ds} ({len(papers)} papers)...")
    run_stage5(papers, out_dir=out_dir)

print("All datasets updated with full abstract fields in citation_data.json!")
