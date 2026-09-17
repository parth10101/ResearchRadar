---
name: react-force-graph
description: React wrapper for 2D, 3D, and VR force-directed graphs. Use for seamless React integration of citation graphs, co-citation companion rings, and epistemic clustering.
---

# React Force Graph: Interactive Citation Networks

Seamless React component for embedding high-fps 2D Canvas and 3D WebGL force-directed graphs into dashboards and analytics studios.

## Integration Architecture
- `<ForceGraph3D>` component with props for `graphData`, `nodeColor`, `nodeLabel`, `linkWidth`, `onNodeClick`.
- Automatic node clustering by topic, community detection (Louvain/HDBSCAN), and citation count scaling.
- Custom node Three.js object rendering for badges, icons, and glowing rings.
