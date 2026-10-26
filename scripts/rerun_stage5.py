import json
import sys
sys.path.insert(0, ".")
from research_radar.stage5_citations import run_stage5

datasets = [
    "output_hyperspectral_40",
    "output_fed_diffpriv_40",
    "output_vit_mae_40",
    "output_gnn_mol_40"
]

for ds in datasets:
    path = f"data/{ds}/papers.json"
    with open(path, "r", encoding="utf-8") as f:
        papers = json.load(f)
    print(f"\n==========================================")
    print(f"RUNNING STAGE 5 ON: {ds}")
    print(f"==========================================")
    run_stage5(papers, out_dir=f"data/{ds}")
    
    with open(f"data/{ds}/citation_data.json", "r", encoding="utf-8") as f:
        cdata = json.load(f)
    print(f"--- Top Milestones ({ds}) ---")
    for m in cdata["milestones"]:
        p = m.get("paper") or {}
        print(f"[{m.get('year')}] score:{p.get('title_match_score')} cites:{p.get('global_cits')} | {p.get('title')}")
