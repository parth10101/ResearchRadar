import json

path = "data/output_hyperspectral_40/citation_data.json"
with open(path, "r", encoding="utf-8") as f:
    cdata = json.load(f)

milestones = cdata.get("milestones", [])
print(f"Total milestone buckets: {len(milestones)}")
for idx, m in enumerate(milestones):
    print(f"\n--- Bucket {idx+1}: Year {m.get('year')} ---")
    # Check paper field in milestone
    paper = m.get('paper') or m
    print("Paper title:", paper.get('title'))
    print("Direct title match?", "deep learning" in str(paper.get('title')).lower(), "hyperspectral image processing" in str(paper.get('title')).lower())
