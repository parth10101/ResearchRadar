import json

path = "data/output_hyperspectral_40/papers.json"
with open(path, "r", encoding="utf-8") as f:
    papers = json.load(f)

print(f"Total papers in {path}: {len(papers)}")
title_matches = []
for idx, p in enumerate(papers):
    t = (p.get('title') or '').lower()
    has_dl = "deep learning" in t
    has_hip = "hyperspectral image processing" in t
    has_hsi = "hyperspectral" in t
    if has_dl and has_hip:
        title_matches.append((idx, p.get('title'), p.get('year'), p.get('citation_count')))
    print(f"#{idx+1} [{p.get('year')}] (cites: {p.get('citation_count')}) DL in title: {has_dl} | HIP in title: {has_hip} | Hyperspectral in title: {has_hsi}")
    print(f"    Title: {p.get('title')}")

print(f"\nPapers with BOTH DL and HIP in TITLE: {len(title_matches)}")
for m in title_matches:
    print(m)
