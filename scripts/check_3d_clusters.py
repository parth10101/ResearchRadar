import json
from pathlib import Path

datasets = [
    "output_cnn_hyperspectral_40",
    "output_fed_diffpriv_40",
    "output_vit_mae_40",
    "output_gnn_kg_40",
    "output_live_100_4bar",
]

for ds in datasets:
    p = Path(f"data/{ds}/cluster_3d_points.json")
    if not p.exists():
        print(f"Missing cluster_3d_points.json for {ds}")
        continue
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    pts = data.get("total_points", 0)
    clusters = data.get("clusters", [])
    c_names = [c.get("name") for c in clusters[:3]]
    print(f"\n{ds}:")
    print(f"  Total points: {pts}")
    print(f"  Clusters count: {len(clusters)}")
    print(f"  Sample cluster names: {c_names}")
    if clusters and "points" in clusters[0]:
        print(f"  Cluster 0 point 0: {clusters[0]['points'][0].get('title')[:60]}... (x={clusters[0]['points'][0].get('x')}, y={clusters[0]['points'][0].get('y')})")
