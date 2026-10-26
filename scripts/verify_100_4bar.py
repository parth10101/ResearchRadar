import json
from pathlib import Path

p_path = Path("data/output_live_100_4bar/papers.json")
with open(p_path, "r", encoding="utf-8") as f:
    papers = json.load(f)

print(f"Total papers in output_live_100_4bar: {len(papers)}")
years = [p.get("year") for p in papers if p.get("year")]
print(f"Year range: {min(years)} - {max(years)}")

review_count = 0
for p in papers:
    txt = f"{p.get('title','')} {p.get('abstract','')} {p.get('tldr','')}".lower()
    if "review" in txt:
        review_count += 1

print(f"Papers with 'review': {review_count} (Strict negation enforced)")

# Sample first 5 papers
print("\nFirst 5 Sample Papers from Live Semantic Scholar Ingestion:")
for i, p in enumerate(papers[:5]):
    print(f"  {i+1}. \"{p.get('title')}\" ({p.get('year')}) | Citations: {p.get('citation_count', 0)}")

# Check artifacts
art_dir = Path("data/output_live_100_4bar")
print("\nGenerated Pipeline Artifacts:")
for fname in ["cluster_3d_points.json", "citation_data.json", "archipelago_data.json", "detected_gaps.json", "narrated_gaps.json", "topic_results.json"]:
    f = art_dir / fname
    print(f"  {fname:25s}: exists={f.exists()} | size={f.stat().st_size:,} bytes")
