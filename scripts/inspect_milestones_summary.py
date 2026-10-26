import json
from pathlib import Path

p = Path("data/output_fed_diffpriv_40/citation_data.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

milestones = d.get("milestones", [])
print(f"Total milestones: {len(milestones)}")
for i, m in enumerate(milestones):
    paper = m.get("paper", {})
    print(f"\nMilestone {i+1} ({paper.get('year')}): {paper.get('title')}")
    print(f"  TLDR: {paper.get('tldr')}")
    print(f"  Breakthrough: {m.get('breakthrough')}")
