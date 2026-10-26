import json

datasets = [
    ("output_hyperspectral_40", "Hyperspectral DL"),
    ("output_fed_diffpriv_40", "FedAvg DiffPriv"),
    ("output_vit_mae_40", "ViT / MAE"),
    ("output_gnn_mol_40", "GNN MolProp"),
]

for ds_id, name in datasets:
    print(f"\n==========================================")
    print(f"DATASET: {name} ({ds_id})")
    print(f"==========================================")
    path = f"data/{ds_id}/citation_data.json"
    with open(path, "r", encoding="utf-8") as f:
        cdata = json.load(f)
    
    milestones = cdata.get("milestones", [])
    for idx, m in enumerate(milestones):
        p = m.get("paper") or {}
        print(f"[{m.get('year')}] (cites: {p.get('global_cits')}) {p.get('title')}")
