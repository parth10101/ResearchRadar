import json
from pathlib import Path

papers_path = Path("data/acl_2024_40_papers.json")
papers = json.loads(papers_path.read_text(encoding="utf-8"))

for i, p in enumerate(papers):
    title = p.get("title", "")
    pid = p.get("paper_id", "")
    abstract = p.get("abstract", "")
    first_two = ". ".join(abstract.split(". ")[:2])
    print(f"[{i+1}] {pid}: {title}")
    print(f"    Excerpt: {first_two}\n")
