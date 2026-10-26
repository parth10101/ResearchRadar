import json

with open('data/audit_160_papers_report.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

v_rep = data['corpora']['output_vit_mae_40']['papers_audit']
for p in v_rep:
    if not p['passed']:
        print(f"Index {p['index']}: {p['title']}")
        print(f"  Reasons: {p['reasons']}")
