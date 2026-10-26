import json
from pathlib import Path

datasets = [
    "output_cnn_hyperspectral_40",
    "output_fed_diffpriv_40",
    "output_vit_mae_40",
    "output_gnn_kg_40",
    "output_live_100_4bar",
]

for ds in datasets:
    p_path = Path(f"data/{ds}/papers.json")
    if not p_path.exists():
        continue
    with open(p_path, "r", encoding="utf-8") as f:
        papers = json.load(f)
    has_abstract = [p for p in papers if p.get("abstract") and len(p.get("abstract").strip()) > 30]
    has_tldr = [p for p in papers if p.get("tldr") and len(str(p.get("tldr")).strip()) > 10]
    print(f"{ds:30s}: Total={len(papers)} | Has Abstract={len(has_abstract)} ({len(has_abstract)/len(papers)*100:.1f}%) | Has TLDR={len(has_tldr)}")
