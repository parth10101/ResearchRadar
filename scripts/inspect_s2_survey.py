import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)

from research_radar.s2_client import SemanticScholarClient
import json

client = SemanticScholarClient()
p = Path("data/output_fed_diffpriv_40/papers.json")
with open(p, "r", encoding="utf-8") as f:
    papers = json.load(f)

for paper in papers:
    if "Systematic Survey" in paper.get("title", ""):
        pid = paper.get("paper_id") or paper.get("id")
        print(f"Paper ID: {pid}")
        print(f"DOI: {paper.get('doi')}")
        print(f"URL: {paper.get('url')}")
        # Fetch directly from S2 paper endpoint
        details = client.get_paper_details(pid)
        print("S2 details abstract:", details.get("abstract"))
        print("S2 details tldr:", details.get("tldr"))
