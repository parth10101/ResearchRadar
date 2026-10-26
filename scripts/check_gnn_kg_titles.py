import json
from pathlib import Path

p_path = Path("data/output_gnn_kg_40/papers.json")
with open(p_path, "r", encoding="utf-8") as f:
    papers = json.load(f)

print(f"Total papers in output_gnn_kg_40: {len(papers)}")
missing_gnn = 0
missing_kg = 0

for i, p in enumerate(papers):
    t = p.get("title", "")
    t_lower = t.lower()
    has_gnn = "graph neural" in t_lower or "gnn" in t_lower
    has_kg = "knowledge graph" in t_lower or "kg" in t_lower
    if not has_gnn:
        missing_gnn += 1
    if not has_kg:
        missing_kg += 1
    if i < 15:
        print(f'{i+1}. "{t}"')
        print(f'    -> GNN in title: {has_gnn} | KG in title: {has_kg}')

print(f"\nPapers missing GNN in title: {missing_gnn} / {len(papers)}")
print(f"Papers missing KG in title: {missing_kg} / {len(papers)}")
