import json

for ds in ['output_hyperspectral_40', 'output_fed_diffpriv_40', 'output_vit_mae_40', 'output_gnn_mol_40']:
    print(f"=== DATASET: {ds} ===")
    path = f"data/{ds}/citation_data.json"
    with open(path, "r", encoding="utf-8") as f:
        cdata = json.load(f)
    milestones = cdata.get("milestones", [])
    print(f"Total milestones: {len(milestones)}")
    for i, m in enumerate(milestones):
        title = m.get('title')
        year = m.get('year')
        cites = m.get('citation_count')
        print(f"  {i+1}. [{year}] (cites: {cites}) {title}")
    print()
