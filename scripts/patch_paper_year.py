import json

path = 'data/output_hyperspectral_40/papers.json'
with open(path, 'r', encoding='utf-8') as f:
    papers = json.load(f)

updated = False
for i, p in enumerate(papers):
    if p.get('year') is None:
        print(f"Paper {i+1}: {p.get('title')} was missing year. Setting to 2025.")
        p['year'] = 2025
        updated = True

if updated:
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(papers, f, indent=2)
    print("Saved updated papers.json successfully!")
else:
    print("All papers already have a valid year.")
