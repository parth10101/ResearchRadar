import json
from pathlib import Path

p = Path("data/output_fed_diffpriv_40/papers.json")
with open(p, "r", encoding="utf-8") as f:
    papers = json.load(f)

print(f"Total papers: {len(papers)}")
by_year = {}
for p in papers:
    yr = p.get("year", 0)
    by_year.setdefault(yr, []).append(p)

for yr in sorted(by_year.keys()):
    plist = by_year[yr]
    print(f"\n--- Year {yr} ({len(plist)} papers) ---")
    for paper in plist:
        t = paper.get("title")
        cits = paper.get("citation_count", 0)
        ab_len = len(paper.get("abstract") or "")
        tldr_txt = str(paper.get("tldr") or "")
        print(f"  * [{cits:3d} cits | ab={ab_len:4d}] {t}")
