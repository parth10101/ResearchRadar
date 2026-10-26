import json

with open('data/output_vit_mae_40/papers.json', 'r', encoding='utf-8') as f:
    papers = json.load(f)

for idx in [33, 39]: # 0-indexed for 34 and 40
    p = papers[idx]
    print(f"=== Index {idx+1}: {p.get('title')} ===")
    print("TLDR:", p.get('tldr'))
    print("Abstract:", p.get('abstract'))
    print()
