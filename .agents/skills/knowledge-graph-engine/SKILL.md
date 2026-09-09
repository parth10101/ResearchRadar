---
name: knowledge-graph-engine
description: >-
  Solves large-scale academic knowledge graph bottlenecks using Level of Detail (LOD) hierarchical zoom,
  bipartite projection matrices, faceted filtering, and headless Cytoscape graph exports.
---

# Knowledge Graph Engine & Visualization Bottleneck Skill

This skill eliminates the common academic knowledge graph "hairball" problem (where 3,000 papers and 14,000 links freeze the browser and become unreadable) by replacing static canvas plots with structured, high-performance scientometric projections.

---

## 1. The 3-Level Semantic LOD (Level of Detail) Contract

Rather than rendering all $N$ papers simultaneously, the interface implements **hierarchical semantic zooming**:

```
┌────────────────────────────────────────────────────────────────────────┐
│  LEVEL 1: MACRO (Clusters & Macro Structure)                          │
│  • 5–6 consolidated macro-clusters in perimeter orbital tracks.       │
│  • Mutual citation density bridges between fields. Zero label overlap. │
├────────────────────────────────────────────────────────────────────────┤
│  LEVEL 2: MESO (Gaps Landscape)                                        │
│  • Background clusters dim to 20% opacity.                             │
│  • Top 3–5 priority gaps illuminate in center with breakthrough scores. │
├────────────────────────────────────────────────────────────────────────┤
│  LEVEL 3: MICRO (Deep Evidence Alignment)                              │
│  • Side-by-side Anchor Paper 1 (Method) vs Anchor Paper 2 (Benchmark). │
│  • Abstract sentence alignment & 1-click DOI / BibTeX actions.         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Bipartite Co-Occurrence Matrix Heatmap Projection

In addition to node-link diagrams, always provide the **Method $\times$ Dataset Matrix Projection**:
* **Rows:** Top validated methods ($M_1, M_2, \dots$).
* **Columns:** Top benchmark datasets ($D_1, D_2, \dots$).
* **Cells:** 
  - Shaded cells represent published paper counts.
  - **Empty white-space cells with negative Uzzi $z$-scores** highlight immediate research voids.
  - Allows researchers to spot untapped opportunities in **under 2 seconds**.

---

## 3. Headless Graph Data Contract (Cytoscape.js / Sigma.js)

Decouple graph computation from rendering. The backend must expose a clean JSON API endpoint returning nodes and edges with layout coordinates:

```json
{
  "elements": {
    "nodes": [
      {
        "data": {
          "id": "node_01",
          "label": "Convolutional Neural Networks",
          "type": "method",
          "frequency": 22,
          "cluster": 0
        },
        "position": { "x": 120.5, "y": 340.2 }
      }
    ],
    "edges": [
      {
        "data": {
          "id": "e_01",
          "source": "node_01",
          "target": "node_02",
          "weight": 8,
          "type": "co_citation"
        }
      }
    ]
  }
}
```

---

## 4. Subgraph Ego-Neighborhood Spotlight

When a user selects any node or gap:
1. **Dimming:** All unrelated nodes transition to `opacity: 0.08` with `transition: 240ms ease`.
2. **Spotlight:** The selected node and its direct 1-hop and 2-hop causal predecessors/successors remain fully opaque (`opacity: 1.0`).
3. **Inspector Drawer:** An elevated sheet (`--surface-l3-sheet`) slides out on the right side with paper abstracts, author lists, and DOI links without altering central zoom alignment.
