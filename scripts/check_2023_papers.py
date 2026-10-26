import json
from pathlib import Path

p = Path("data/output_fed_diffpriv_40/papers.json")
with open(p, "r", encoding="utf-8") as f:
    papers = json.load(f)

print("2023 papers in output_fed_diffpriv_40:")
for i, paper in enumerate(papers):
    if paper.get("year") == 2023:
        ab = paper.get("abstract") or ""
        print(f"\n{i+1}. {paper.get('title')}")
        print(f"   Citations: {paper.get('citation_count', 0)}")
        print(f"   Abstract length: {len(ab)}")
        print(f"   Abstract preview: {ab[:180]}...")
