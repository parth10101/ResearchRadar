import sys
from pathlib import Path
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import json
p = Path("data/output_fed_diffpriv_40/papers.json")
with open(p, "r", encoding="utf-8") as f:
    papers = json.load(f)

for p in papers:
    if p.get("year") == 2023:
        t = p.get("title")
        cits = p.get("citation_count", 0)
        ab = p.get("abstract") or ""
        print(f"[{cits} cits | ab_len={len(ab)}] {t}")
        if ab:
            print(f"   Abstract: {ab[:200]}...\n")
