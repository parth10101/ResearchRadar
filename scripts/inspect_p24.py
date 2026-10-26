import json

with open("data/output_hyperspectral_40/papers.json", "r", encoding="utf-8") as f:
    papers = json.load(f)

p24 = papers[23]
print("Title:", p24.get("title"))
print("TLDR:", p24.get("tldr"))
print("Abstract:", p24.get("abstract"))
