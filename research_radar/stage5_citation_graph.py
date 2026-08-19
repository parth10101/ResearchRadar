"""
Stage 5: Citation Graph
=======================
Builds an interactive directed citation network over the ResearchRadar corpus,
layered on top of Stage 4's topic clustering layout.

Design decisions:
  · Nodes positioned using Stage 4 PaCMAP 2D coordinates (visual continuity)
  · In-corpus edges only — no ghost nodes for clarity
  · Dark theme (#0d1117) throughout
  · Left sidebar: topic legend, graph stats, filter controls, top papers
  · Node size ∝ log(in-degree) — larger = more cited = more influential
  · Node color = Stage 4 topic cluster color (matches Stage 4 visualisations)

Inputs  (auto-resolved from default output dir):
  · data/output/papers.json        — enriched papers with references[]
  · data/output/topic_results.json — Stage 4 topic clusters + PaCMAP 2D coords

Outputs:
  · data/output/citation_graph.html   — standalone Pyvis interactive network
  · data/output/citation_stats.json   — graph analytics

Run standalone:
    python -m research_radar.stage5_citation_graph
    python -m research_radar.stage5_citation_graph \\
        --papers   data/output/papers.json \\
        --topics   data/output/topic_results.json \\
        --out      data/output
"""

from __future__ import annotations

import argparse
import json
import re
import time
from pathlib import Path
from typing import Any


# ---------------------------------------------------------------------------
# Palette — MUST match DISTINCT_COLORS in stage4_topics.py exactly
# ---------------------------------------------------------------------------

DISTINCT_COLORS: list[str] = [
    "#E41A1C",  # Vivid Red
    "#377EB8",  # Strong Blue
    "#4DAF4A",  # Crisp Green
    "#984EA3",  # Deep Purple
    "#FF7F00",  # Saturated Orange
    "#00C0BF",  # Vibrant Teal
    "#A65628",  # Warm Brown
    "#F781BF",  # Bright Pink
    "#E6AB02",  # Golden Yellow
    "#1F78B4",  # Indigo
    "#33A02C",  # Emerald Green
    "#666666",  # Slate
]
NOISE_COLOR = "#888888"
DARK_BG = "#0d1117"


# ---------------------------------------------------------------------------
# ID helpers
# ---------------------------------------------------------------------------

def _normalize_arxiv_id(pid: str | None) -> str | None:
    """Strip arXiv prefix and version suffixes.  '2207.02337v1' → '2207.02337'"""
    if not pid:
        return None
    cleaned = re.sub(r"^(arxiv:\s*|arXiv:\s*)", "", pid.strip(), flags=re.IGNORECASE)
    cleaned = re.sub(r"v\d+$", "", cleaned)
    return cleaned.strip() or None


def _build_id_map(papers: list[dict]) -> tuple[set[str], dict[str, str]]:
    """
    Returns (corpus_ids, id_map) where:
      · corpus_ids — the exact canonical IDs as they appear in papers.json
      · id_map     — maps any variant form (arXiv:xxx, xxx, xxxv1 …) → canonical
    """
    corpus_ids: set[str] = set()
    id_map: dict[str, str] = {}

    for p in papers:
        pid = p.get("id", "")
        if not pid:
            continue
        corpus_ids.add(pid)
        norm = _normalize_arxiv_id(pid)
        if norm:
            # Register several variant spellings
            for variant in (norm, f"arXiv:{norm}", f"arxiv:{norm}", f"ARXIV:{norm}"):
                id_map.setdefault(variant, pid)
        id_map.setdefault(pid, pid)

    return corpus_ids, id_map


def _resolve_ref(ref_id: str, corpus_ids: set[str], id_map: dict[str, str]) -> str | None:
    """Return the canonical corpus paper ID for ref_id, or None if not in corpus."""
    if ref_id in corpus_ids:
        return ref_id
    if ref_id in id_map:
        return id_map[ref_id]
    norm = _normalize_arxiv_id(ref_id)
    if norm:
        if norm in corpus_ids:
            return norm
        if norm in id_map:
            return id_map[norm]
    return None


# ---------------------------------------------------------------------------
# Graph construction (NetworkX)
# ---------------------------------------------------------------------------

def build_citation_graph(papers: list[dict], topic_results: dict) -> "nx.DiGraph":
    """
    Build a NetworkX directed graph.
    Nodes = corpus papers  |  Edges = in-corpus citations only.
    Node attributes: title, authors, year, topic, topic_name, color, size,
                     in_degree (filled post-build), out_refs_count, arxiv_url, coords.
    """
    import networkx as nx

    paper_to_topic: dict = topic_results.get("paper_to_topic", {})
    human_names: dict     = topic_results.get("human_readable_names", {})
    coords_2d: dict       = topic_results.get("coords_2d", {})

    corpus_ids, id_map = _build_id_map(papers)

    G: nx.DiGraph = nx.DiGraph()

    # ---- Add nodes --------------------------------------------------------
    for paper in papers:
        pid    = paper.get("id", "")
        topic  = paper_to_topic.get(pid, -1)
        t_str  = str(topic)
        color  = DISTINCT_COLORS[topic % len(DISTINCT_COLORS)] if topic >= 0 else NOISE_COLOR
        h_name = (
            human_names.get(t_str)
            or human_names.get(str(topic))
            or (f"Topic {topic}" if topic >= 0 else "Outlier / Unclustered")
        )
        coords  = coords_2d.get(pid, [0.0, 0.0])
        authors = paper.get("authors") or []
        a_str   = ", ".join(authors[:3]) + (" …" if len(authors) > 3 else "")
        refs    = paper.get("references") or []
        raw_id  = _normalize_arxiv_id(pid) or pid
        arxiv_url = (
            f"https://arxiv.org/abs/{raw_id}"
            if paper.get("source", "arxiv") == "arxiv"
            else ""
        )

        G.add_node(
            pid,
            title       = paper.get("title", pid),
            authors     = a_str,
            year        = paper.get("year", "N/A"),
            topic       = topic,
            topic_name  = h_name,
            color       = color,
            coords      = coords,
            arxiv_url   = arxiv_url,
            out_refs_count = len(refs),
        )

    # ---- Add in-corpus edges ----------------------------------------------
    for paper in papers:
        pid  = paper.get("id", "")
        refs = paper.get("references") or []
        for ref in refs:
            target = _resolve_ref(str(ref), corpus_ids, id_map)
            if target and target != pid and target in G:
                G.add_edge(pid, target)

    # ---- Compute in-degree & derive node sizes ----------------------------
    for node in G.nodes():
        in_deg = G.in_degree(node)
        # log-scale: min 12, max 55 — makes influential papers visually distinct
        size = int(12 + min(43, 14 * (in_deg + 1) ** 0.55))
        G.nodes[node]["in_degree"] = in_deg
        G.nodes[node]["size"]      = size

    return G


# ---------------------------------------------------------------------------
# Graph analytics
# ---------------------------------------------------------------------------

def compute_graph_stats(
    G: "nx.DiGraph",
    papers_by_id: dict[str, dict],
    topic_results: dict,
) -> dict:
    """
    Compute citation graph analytics:
      · most_influential_papers  — highest in-degree (most cited within corpus)
      · hub_papers               — highest out-degree (cite the most others)
      · bridge_papers            — papers with edges crossing topic clusters
      · isolated_papers_count    — nodes with no edges at all
      · inter/intra_cluster_edge_count
    """
    human_names = topic_results.get("human_readable_names", {})

    def _summary(pid: str, extra_key: str, extra_val: Any) -> dict:
        p = papers_by_id.get(pid, {})
        t = G.nodes[pid].get("topic", -1)
        return {
            "id":         pid,
            "title":      p.get("title", pid),
            "year":       p.get("year"),
            "topic_name": human_names.get(str(t), f"Topic {t}"),
            extra_key:    extra_val,
        }

    inter_edges = 0
    intra_edges = 0
    bridge_set: set[str] = set()

    for src, tgt in G.edges():
        st = G.nodes[src].get("topic", -1)
        tt = G.nodes[tgt].get("topic", -1)
        if st != tt:
            inter_edges += 1
            bridge_set.add(src)
            bridge_set.add(tgt)
        else:
            intra_edges += 1

    in_degs  = sorted(G.in_degree(),  key=lambda x: x[1], reverse=True)
    out_degs = sorted(G.out_degree(), key=lambda x: x[1], reverse=True)
    isolated = [n for n in G.nodes() if G.in_degree(n) == 0 and G.out_degree(n) == 0]

    return {
        "total_nodes":                 G.number_of_nodes(),
        "total_edges":                 G.number_of_edges(),
        "papers_with_outgoing_edges":  sum(1 for n in G.nodes() if G.out_degree(n) > 0),
        "papers_with_incoming_edges":  sum(1 for n in G.nodes() if G.in_degree(n) > 0),
        "inter_cluster_edge_count":    inter_edges,
        "intra_cluster_edge_count":    intra_edges,
        "isolated_papers_count":       len(isolated),
        "most_influential_papers":     [_summary(pid, "in_citations", c)
                                        for pid, c in in_degs[:10]  if c > 0],
        "hub_papers":                  [_summary(pid, "out_citations", c)
                                        for pid, c in out_degs[:10] if c > 0],
        "bridge_papers":               [_summary(pid, "degree", G.degree(pid))
                                        for pid in list(bridge_set)[:20]],
    }


# ---------------------------------------------------------------------------
# Coordinate scaling — reuse Stage 4 PaCMAP layout
# ---------------------------------------------------------------------------

def _scale_coords(
    coords_2d: dict[str, list[float]],
    spread: float = 1800.0,
) -> dict[str, tuple[float, float]]:
    """
    Centre the Stage 4 PaCMAP coordinates around (0, 0) and scale so the
    widest dimension spans `spread` canvas units (~1800 px).
    """
    if not coords_2d:
        return {}
    xs = [v[0] for v in coords_2d.values()]
    ys = [v[1] for v in coords_2d.values()]
    cx, cy   = sum(xs) / len(xs), sum(ys) / len(ys)
    max_span = max(max(xs) - min(xs), max(ys) - min(ys), 1.0)
    scale    = spread / max_span
    return {
        pid: ((v[0] - cx) * scale, (v[1] - cy) * scale)
        for pid, v in coords_2d.items()
    }


# ---------------------------------------------------------------------------
# Tooltip HTML (rendered by vis.js on node hover)
# ---------------------------------------------------------------------------

def _make_tooltip(pid: str, data: dict) -> str:
    topic_color = data.get("color", NOISE_COLOR)
    arxiv_link  = (
        f'<a href="{data["arxiv_url"]}" target="_blank" '
        f'style="color:#58a6ff;font-size:11px;text-decoration:none;">🔗 Open on arXiv →</a>'
        if data.get("arxiv_url") else ""
    )
    title_esc = (data.get("title") or pid).replace("<", "&lt;").replace(">", "&gt;")
    return (
        f'<div style="background:#161b22;border:1px solid #30363d;border-radius:8px;'
        f'padding:12px 14px;max-width:310px;font-family:Segoe UI,sans-serif;line-height:1.5;">'
        f'<div style="color:#e6edf3;font-weight:600;font-size:12px;margin-bottom:8px;">'
        f'{title_esc}</div>'
        f'<div style="color:#8b949e;font-size:11px;">👥 {data.get("authors","N/A")}</div>'
        f'<div style="color:#8b949e;font-size:11px;">📅 {data.get("year","N/A")}</div>'
        f'<div style="margin:6px 0;font-size:11px;display:inline-block;padding:2px 8px;'
        f'border-radius:12px;background:{topic_color}33;color:{topic_color};'
        f'border:1px solid {topic_color}66;">🏷️ {data.get("topic_name","N/A")}</div><br>'
        f'<div style="display:flex;gap:16px;margin:4px 0;">'
        f'<span style="color:#e6edf3;font-size:11px;">📥 Cited by: '
        f'<b style="color:#58a6ff;">{data.get("in_degree",0)}</b></span>'
        f'<span style="color:#e6edf3;font-size:11px;">📤 Cites: '
        f'<b style="color:#58a6ff;">{data.get("out_refs_count",0)}</b></span>'
        f'</div>'
        f'{arxiv_link}'
        f'</div>'
    )


# ---------------------------------------------------------------------------
# Sidebar HTML / CSS / JS builders
# ---------------------------------------------------------------------------

_SIDEBAR_CSS = """
<style id="rr-styles">
* { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  background: #0d1117;
  color: #e6edf3;
  font-family: 'Segoe UI', system-ui, sans-serif;
  height: 100%;
  overflow: hidden;
}
#rr-layout {
  display: flex;
  height: 100vh;
  width: 100%;
}
#rr-sidebar {
  width: 272px; min-width: 272px;
  background: #161b22;
  border-right: 1px solid #21262d;
  display: flex; flex-direction: column;
  overflow-y: auto;
  z-index: 10;
  scrollbar-width: thin;
  scrollbar-color: #30363d #161b22;
}
#rr-sidebar::-webkit-scrollbar { width: 5px; }
#rr-sidebar::-webkit-scrollbar-track { background: #161b22; }
#rr-sidebar::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
#rr-main { flex: 1; position: relative; }
#mynetwork { width: 100%; height: 100vh; }
.sb-header {
  padding: 16px 16px 12px;
  border-bottom: 1px solid #21262d;
  background: #0d1117;
  position: sticky; top: 0; z-index: 2;
}
.sb-header h1 { font-size: 15px; color: #58a6ff; font-weight: 700; margin-bottom: 2px; }
.sb-header p  { font-size: 10px; color: #8b949e; letter-spacing: 0.3px; }
.sb-section { padding: 12px 14px; border-bottom: 1px solid #21262d; }
.sb-section h3 {
  font-size: 9.5px; color: #8b949e; text-transform: uppercase;
  letter-spacing: 1.2px; margin-bottom: 8px; font-weight: 600;
}
.stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.stat-card {
  background: #0d1117; border: 1px solid #21262d; border-radius: 6px;
  padding: 7px 10px; text-align: center;
}
.stat-card .val { font-size: 18px; font-weight: 700; color: #58a6ff; line-height: 1.1; }
.stat-card .lbl { font-size: 9px; color: #8b949e; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.cluster-item {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 5px 7px; margin-bottom: 2px; border-radius: 5px;
  cursor: pointer; transition: background 0.12s; border: 1px solid transparent;
}
.cluster-item:hover { background: #21262d; }
.cluster-item.active { background: #21262d33; border-color: #30363d; }
.cluster-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; margin-top: 2px; }
.cluster-label { flex: 1; font-size: 11px; color: #e6edf3; line-height: 1.35; }
.cluster-count { font-size: 9.5px; color: #8b949e; margin-top: 1px; }
.btn {
  width: 100%; padding: 7px 10px; margin-bottom: 5px;
  background: #0d1117; border: 1px solid #30363d;
  color: #e6edf3; border-radius: 6px; cursor: pointer;
  font-size: 11px; text-align: left; font-family: inherit;
  transition: background 0.12s, border-color 0.12s;
}
.btn:hover { background: #21262d; border-color: #58a6ff55; }
.btn.active { background: #1f6feb22; border-color: #58a6ff; color: #58a6ff; }
.top-paper {
  padding: 5px 7px; margin-bottom: 4px; border-radius: 4px;
  font-size: 10px; background: #0d1117; border-left: 3px solid;
  cursor: pointer; transition: background 0.1s;
}
.top-paper:hover { background: #21262d; }
.top-paper .tp-title { color: #e6edf3; line-height: 1.4; }
.top-paper .tp-meta  { color: #8b949e; margin-top: 2px; }
.sb-footer {
  padding: 10px 14px;
  font-size: 9px; color: #484f58; text-align: center;
  margin-top: auto; border-top: 1px solid #21262d;
}
</style>
"""


def _build_sidebar_html(
    G: "nx.DiGraph",
    topic_results: dict,
    stats: dict,
) -> str:
    """Return the full sidebar <div> HTML string."""
    human_names = topic_results.get("human_readable_names", {})
    clusters    = topic_results.get("clusters", {})

    # Topic legend items
    topic_ids_sorted = sorted(
        (k for k in clusters if str(k) != "-1"),
        key=lambda k: int(k),
    )
    cluster_items = ""
    for t_str in topic_ids_sorted:
        t_int    = int(t_str)
        color    = DISTINCT_COLORS[t_int % len(DISTINCT_COLORS)]
        name     = human_names.get(str(t_str), f"Topic {t_str}")
        count    = len(clusters.get(t_str, clusters.get(t_int, [])))
        # Truncate long names to keep sidebar tidy
        disp     = name[:48] + "…" if len(name) > 48 else name
        cluster_items += (
            f'<div class="cluster-item" id="cluster-{t_str}" '
            f'onclick="filterByTopic({t_str})">'
            f'<div class="cluster-dot" style="background:{color};"></div>'
            f'<div>'
            f'<div class="cluster-label">{disp}</div>'
            f'<div class="cluster-count">{count} paper{"s" if count!=1 else ""}</div>'
            f'</div></div>'
        )
    # Noise/outlier row if present
    noise_count = len(clusters.get("-1", clusters.get(-1, [])))
    if noise_count:
        cluster_items += (
            f'<div class="cluster-item" id="cluster--1" onclick="filterByTopic(-1)">'
            f'<div class="cluster-dot" style="background:{NOISE_COLOR};"></div>'
            f'<div>'
            f'<div class="cluster-label">Outlier / Unclustered</div>'
            f'<div class="cluster-count">{noise_count} papers</div>'
            f'</div></div>'
        )

    # Top influential papers
    influential_html = ""
    for i, p in enumerate(stats.get("most_influential_papers", [])[:6]):
        color = DISTINCT_COLORS[0]  # default
        # Try to match to topic color
        for t_str in topic_ids_sorted:
            if human_names.get(str(t_str), "") == p.get("topic_name", ""):
                color = DISTINCT_COLORS[int(t_str) % len(DISTINCT_COLORS)]
                break
        t_name = (p.get("topic_name") or "")[:30]
        title  = (p.get("title") or p.get("id", ""))[:55]
        if len(p.get("title","")) > 55:
            title += "…"
        influential_html += (
            f'<div class="top-paper" style="border-left-color:{color};" '
            f'onclick="focusNode(\'{p["id"]}\')">'
            f'<div class="tp-title">{title}</div>'
            f'<div class="tp-meta">📥 {p.get("in_citations",0)} citations · {p.get("year","")}'
            f' · {t_name}</div>'
            f'</div>'
        )
    if not influential_html:
        influential_html = '<div style="color:#8b949e;font-size:11px;">No citations found yet.<br>Run enrich_citations.py first.</div>'

    n_nodes = stats.get("total_nodes", 0)
    n_edges = stats.get("total_edges", 0)
    n_inter = stats.get("inter_cluster_edge_count", 0)
    n_iso   = stats.get("isolated_papers_count", 0)

    return f"""
<div id="rr-sidebar">
  <div class="sb-header">
    <h1>🔬 ResearchRadar</h1>
    <p>Citation Network · Stage 5</p>
  </div>

  <div class="sb-section">
    <h3>Graph Overview</h3>
    <div class="stat-grid">
      <div class="stat-card"><div class="val">{n_nodes}</div><div class="lbl">Papers</div></div>
      <div class="stat-card"><div class="val">{n_edges}</div><div class="lbl">Citations</div></div>
      <div class="stat-card"><div class="val">{n_inter}</div><div class="lbl">Cross-Topic</div></div>
      <div class="stat-card"><div class="val">{n_iso}</div><div class="lbl">Isolated</div></div>
    </div>
  </div>

  <div class="sb-section">
    <h3>Controls</h3>
    <button class="btn" id="physics-btn" onclick="togglePhysics()">⚡ Enable Physics</button>
    <button class="btn" onclick="resetView()">🔍 Fit to View</button>
    <button class="btn" id="influential-btn" onclick="highlightInfluential()">🌟 Top Influential</button>
    <button class="btn" id="bridges-btn" onclick="highlightBridges()">🌉 Bridge Papers</button>
    <button class="btn" onclick="clearHighlight()">✖ Clear Highlight</button>
  </div>

  <div class="sb-section">
    <h3>Topic Clusters <span style="color:#484f58;font-weight:400;">(click to filter)</span></h3>
    {cluster_items}
  </div>

  <div class="sb-section">
    <h3>Most Influential Papers</h3>
    {influential_html}
  </div>

  <div class="sb-footer">
    ResearchRadar Stage 5 · Pyvis + vis.js<br>
    Node size ∝ in-degree · Positions from Stage 4 PaCMAP
  </div>
</div>
"""


def _build_sidebar_js(
    G: "nx.DiGraph",
    topic_results: dict,
    stats: dict,
    scaled_coords: dict[str, tuple[float, float]],
) -> str:
    """
    Return the JS <script> block for sidebar interactivity.
    Embeds node→topic and bridge paper data as inline JSON constants
    so the JS functions work without any extra HTTP requests.
    """
    # Inline data for fast JS lookups
    node_topics: dict[str, int] = {
        n: int(data.get("topic", -1))
        for n, data in G.nodes(data=True)
    }
    topic_colors: dict[str, str] = {
        str(t): DISTINCT_COLORS[t % len(DISTINCT_COLORS)]
        for t in set(node_topics.values()) if t >= 0
    }
    topic_colors["-1"] = NOISE_COLOR

    # Default colors per node for restore
    node_default_colors: dict[str, str] = {
        n: data.get("color", NOISE_COLOR)
        for n, data in G.nodes(data=True)
    }

    # Bridge paper IDs
    bridge_ids: list[str] = [p["id"] for p in stats.get("bridge_papers", [])]

    # Influential paper IDs
    influential_ids: list[str] = [p["id"] for p in stats.get("most_influential_papers", [])]

    # Fixed positions for reset
    fixed_positions: dict[str, list[float]] = {
        pid: [round(xy[0], 2), round(xy[1], 2)]
        for pid, xy in scaled_coords.items()
    }

    return f"""
<script id="rr-sidebar-js">
// ---- Inline data (generated by Stage 5) ----
const NODE_TOPICS   = {json.dumps(node_topics)};
const TOPIC_COLORS  = {json.dumps(topic_colors)};
const NODE_COLORS   = {json.dumps(node_default_colors)};
const BRIDGE_IDS    = new Set({json.dumps(bridge_ids)});
const INFLUENTIAL   = {json.dumps(influential_ids)};
const FIXED_POS     = {json.dumps(fixed_positions)};

let physicsOn      = false;
let activeFilter   = null;   // currently selected topic id (int) or null
let activeHighlight = null;  // 'influential' | 'bridges' | null

// ---- Helpers ----
function _net() {{ return window.network; }}

function _dim(nodeId) {{
  return {{id: nodeId, color: {{background:'#1e2430', border:'#2d3748'}}, font:{{color:'#444'}} }};
}}
function _restore(nodeId) {{
  const c = NODE_COLORS[nodeId] || '#888888';
  return {{id: nodeId, color: {{background:c, border:c}}, font:{{color:'#e6edf3'}} }};
}}
function _highlight(nodeId, borderColor) {{
  const c = NODE_COLORS[nodeId] || '#888888';
  return {{id: nodeId, color: {{background:c, border: borderColor}}, font:{{color:'#ffffff'}},
           borderWidth:3 }};
}}

function _applyUpdates(updates) {{
  try {{ _net().body.data.nodes.update(updates); }} catch(e) {{}}
}}

function _clearBtnActive() {{
  document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
}}

// ---- Filter by topic cluster ----
function filterByTopic(topicId) {{
  const ti = parseInt(topicId);
  document.querySelectorAll('.cluster-item').forEach(el => el.classList.remove('active'));
  clearHighlight(false);

  if (activeFilter === ti) {{
    activeFilter = null;  // toggle off
    _applyUpdates(Object.keys(NODE_TOPICS).map(id => _restore(id)));
  }} else {{
    activeFilter = ti;
    document.getElementById('cluster-' + topicId)?.classList.add('active');
    const updates = Object.keys(NODE_TOPICS).map(id =>
      NODE_TOPICS[id] === ti ? _restore(id) : _dim(id)
    );
    _applyUpdates(updates);
  }}
}}

// ---- Focus (zoom to) a single node ----
function focusNode(nodeId) {{
  try {{
    _net().focus(nodeId, {{scale:1.8, animation:{{duration:600,easingFunction:'easeInOutQuad'}}}});
    _net().selectNodes([nodeId]);
  }} catch(e) {{}}
}}

// ---- Highlight influential papers ----
function highlightInfluential() {{
  clearHighlight(false);
  if (activeHighlight === 'influential') {{ activeHighlight = null; return; }}
  activeHighlight = 'influential';
  document.getElementById('influential-btn')?.classList.add('active');

  const infSet = new Set(INFLUENTIAL);
  const updates = Object.keys(NODE_TOPICS).map(id =>
    infSet.has(id) ? _highlight(id, '#FFD700') : _dim(id)
  );
  _applyUpdates(updates);
}}

// ---- Highlight bridge papers ----
function highlightBridges() {{
  clearHighlight(false);
  if (activeHighlight === 'bridges') {{ activeHighlight = null; return; }}
  activeHighlight = 'bridges';
  document.getElementById('bridges-btn')?.classList.add('active');

  const updates = Object.keys(NODE_TOPICS).map(id =>
    BRIDGE_IDS.has(id) ? _highlight(id, '#00FF88') : _dim(id)
  );
  _applyUpdates(updates);
}}

// ---- Restore all nodes to default colours ----
function clearHighlight(resetFilter=true) {{
  activeHighlight = null;
  _clearBtnActive();
  if (resetFilter) {{
    activeFilter = null;
    document.querySelectorAll('.cluster-item').forEach(el => el.classList.remove('active'));
  }}
  _applyUpdates(Object.keys(NODE_TOPICS).map(id => _restore(id)));
}}

// ---- Toggle Barnes-Hut physics ----
function togglePhysics() {{
  physicsOn = !physicsOn;
  _net().setOptions({{physics: {{enabled: physicsOn}}}});
  const btn = document.getElementById('physics-btn');
  if (btn) {{
    btn.textContent = physicsOn ? '⏸ Pause Physics' : '⚡ Enable Physics';
    btn.classList.toggle('active', physicsOn);
  }}
}}

// ---- Fit all nodes in view ----
function resetView() {{
  _net().fit({{animation: {{duration:700, easingFunction:'easeInOutQuad'}}}});
}}
</script>
"""


# ---------------------------------------------------------------------------
# Pyvis rendering + sidebar injection
# ---------------------------------------------------------------------------

def render_citation_graph(
    G: "nx.DiGraph",
    topic_results: dict,
    out_path: Path,
    stats: dict,
) -> None:
    """
    Build the Pyvis network, inject the dark sidebar, and write the final HTML.
    Node positions are taken from Stage 4 PaCMAP coords (physics disabled at start).
    """
    try:
        from pyvis.network import Network
    except ImportError:
        raise ImportError(
            "pyvis is required for Stage 5.  Install with: pip install pyvis"
        )

    coords_2d     = topic_results.get("coords_2d", {})
    scaled_coords = _scale_coords(coords_2d)

    # ---- Build Pyvis network -------------------------------------------
    net = Network(
        height="100vh",
        width="100%",
        directed=True,
        bgcolor=DARK_BG,
        font_color="#e6edf3",
        notebook=False,
        select_menu=False,
        filter_menu=False,
    )

    # Add nodes
    for node_id, data in G.nodes(data=True):
        xy      = scaled_coords.get(node_id, (0.0, 0.0))
        tooltip = _make_tooltip(node_id, data)
        label   = (data.get("title") or node_id)
        if len(label) > 28:
            label = label[:25] + "…"

        net.add_node(
            node_id,
            label   = label,
            title   = tooltip,
            color   = {
                "background": data.get("color", NOISE_COLOR),
                "border":     data.get("color", NOISE_COLOR),
                "highlight":  {"background": "#ffffff", "border": "#ffffff"},
                "hover":      {"background": data.get("color", NOISE_COLOR), "border": "#ffffff"},
            },
            size    = data.get("size", 15),
            x       = xy[0],
            y       = xy[1],
            physics = False,   # Start frozen at Stage 4 positions
            font    = {"color": "#e6edf3", "size": 10, "face": "Segoe UI"},
            borderWidth         = 1.5,
            borderWidthSelected = 3,
        )

    # Add edges
    for src, tgt in G.edges():
        src_color = G.nodes[src].get("color", NOISE_COLOR)
        net.add_edge(
            src, tgt,
            color  = {"color": src_color + "88", "highlight": src_color, "hover": "#ffffff"},
            width  = 1.2,
            arrows = "to",
            smooth = {"type": "dynamic"},
        )

    # Set global vis.js options
    net.set_options(json.dumps({
        "physics":     {"enabled": False},
        "interaction": {
            "hover":             True,
            "tooltipDelay":      80,
            "navigationButtons": True,
            "keyboard":          {"enabled": True},
            "zoomView":          True,
            "dragView":          True,
        },
        "edges": {
            "smooth": {"type": "dynamic"},
            "arrows": {"to": {"enabled": True, "scaleFactor": 0.45}},
        },
        "nodes": {
            "font": {"color": "#e6edf3", "size": 10, "face": "Segoe UI"},
        },
    }))

    # ---- Generate raw HTML from Pyvis ----------------------------------
    try:
        raw_html = net.generate_html(name=out_path.name)
    except TypeError:
        raw_html = net.generate_html()

    # ---- Build sidebar components --------------------------------------
    sidebar_html = _build_sidebar_html(G, topic_results, stats)
    sidebar_js   = _build_sidebar_js(G, topic_results, stats, scaled_coords)

    # ---- Inject into Pyvis HTML ----------------------------------------
    raw_html = _inject_sidebar(raw_html, sidebar_html, sidebar_js)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(raw_html, encoding="utf-8")


def _inject_sidebar(raw_html: str, sidebar_html: str, sidebar_js: str) -> str:
    """
    Surgically modify the Pyvis-generated HTML to:
      1. Add sidebar CSS to <head>
      2. Wrap the body in a flex layout: [sidebar | network]
      3. Make `network` a global var so sidebar JS can call it
      4. Append sidebar JS before </body>
    """
    # 1. Inject CSS in <head>
    html = raw_html.replace("</head>", f"{_SIDEBAR_CSS}\n</head>", 1)

    # 2. Wrap body with flex layout + inject sidebar
    #    Pyvis writes:  <body>\n<div id = "mynetwork">
    body_open = "<body>"
    if body_open in html:
        html = html.replace(
            body_open,
            f'{body_open}\n<div id="rr-layout">\n{sidebar_html}\n<div id="rr-main">',
            1,
        )

    # Close the rr-main and rr-layout wrappers before </body>
    html = html.replace("</body>", '</div>\n</div>\n' + sidebar_js + "\n</body>", 1)

    # 3. Expose `network` as window-global so sidebar JS can reach it
    #    Pyvis generates:  var network = new vis.Network(...)
    html = html.replace("var network = new vis.Network", "window.network = new vis.Network", 1)

    return html


# ---------------------------------------------------------------------------
# Full stage runner
# ---------------------------------------------------------------------------

def run_stage5(
    papers_path: Path,
    topics_path: Path,
    out_dir: Path,
) -> None:
    """Load inputs, build citation graph, compute stats, render HTML."""
    print(f"\n{'=' * 70}")
    print(f"  STAGE 5: CITATION GRAPH  (NetworkX · Pyvis · vis.js)")
    print(f"{'=' * 70}")

    # ---- Load papers -------------------------------------------------------
    if not papers_path.exists():
        raise FileNotFoundError(
            f"Papers file not found: {papers_path}\n"
            "Run Stage 1 (and optionally enrich_citations.py) first."
        )
    papers = json.loads(papers_path.read_text(encoding="utf-8"))
    enriched = sum(1 for p in papers if p.get("references"))
    print(f"  Loaded {len(papers)} papers from {papers_path}")
    print(f"  Papers with citation data : {enriched} / {len(papers)}")
    if enriched == 0:
        print(
            "\n  [WARNING] No papers have references yet.\n"
            "  Run  python research_radar/scripts/enrich_citations.py  first.\n"
            "  The graph will still render but will have no edges.\n"
        )

    # ---- Load topic results ------------------------------------------------
    if not topics_path.exists():
        raise FileNotFoundError(
            f"Topic results not found: {topics_path}\n"
            "Run Stage 4 first."
        )
    topic_results = json.loads(topics_path.read_text(encoding="utf-8"))
    print(f"  Loaded topic results from {topics_path}")
    print(f"  Topics : {topic_results.get('n_topics', '?')}  |  "
          f"Noise : {topic_results.get('n_noise', '?')}")

    # ---- Build graph -------------------------------------------------------
    print(f"\n  Building citation graph …")
    t0 = time.time()
    G  = build_citation_graph(papers, topic_results)
    elapsed = time.time() - t0

    n_nodes = G.number_of_nodes()
    n_edges = G.number_of_edges()
    print(f"  Nodes : {n_nodes}  |  Edges : {n_edges}  ({elapsed:.2f}s)")

    # ---- Compute analytics -------------------------------------------------
    papers_by_id = {p["id"]: p for p in papers if p.get("id")}
    stats = compute_graph_stats(G, papers_by_id, topic_results)

    print(f"  Inter-cluster edges : {stats['inter_cluster_edge_count']}")
    print(f"  Intra-cluster edges : {stats['intra_cluster_edge_count']}")
    print(f"  Isolated papers     : {stats['isolated_papers_count']}")

    # ---- Save analytics JSON -----------------------------------------------
    out_dir.mkdir(parents=True, exist_ok=True)
    stats_path = out_dir / "citation_stats.json"
    stats_path.write_text(json.dumps(stats, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n  Saved analytics → {stats_path}")

    # ---- Render HTML -------------------------------------------------------
    html_path = out_dir / "citation_graph.html"
    print(f"  Rendering Pyvis network → {html_path} …")
    t1 = time.time()
    render_citation_graph(G, topic_results, html_path, stats)
    print(f"  Done  ({time.time() - t1:.2f}s)  |  File size: "
          f"{html_path.stat().st_size / 1024:.0f} KB")

    # ---- Print summary banner ----------------------------------------------
    print(f"\n  {'=' * 66}")
    print(f"  STAGE 5 COMPLETE — CITATION GRAPH SUMMARY")
    print(f"  {'=' * 66}")
    print(f"  Nodes (papers)      : {n_nodes}")
    print(f"  Edges (citations)   : {n_edges}")
    print(f"  Cross-topic edges   : {stats['inter_cluster_edge_count']}")
    print(f"  Isolated papers     : {stats['isolated_papers_count']}")
    top = stats.get("most_influential_papers", [])
    if top:
        print(f"\n  Top Influential Papers (by in-corpus citations):")
        for i, p in enumerate(top[:5], 1):
            t = p.get("title", p.get("id",""))[:65]
            print(f"    {i}. [{p.get('in_citations',0):>2}×] {t}")
    hubs = stats.get("hub_papers", [])
    if hubs:
        print(f"\n  Top Hub Papers (cite the most within corpus):")
        for i, p in enumerate(hubs[:3], 1):
            t = p.get("title", p.get("id",""))[:65]
            print(f"    {i}. [{p.get('out_citations',0):>2}→] {t}")
    print(f"\n  Open in browser:  {html_path}")
    print(f"  Analytics saved:  {stats_path}")
    print(f"  {'=' * 66}\n")


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def _build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="python -m research_radar.stage5_citation_graph",
        description="Stage 5: build an interactive citation graph from Stage 4 outputs.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    p.add_argument(
        "--papers",
        type=Path,
        default=Path("research_radar/data/output/papers.json"),
        help="Enriched papers JSON (must have references[] populated).",
    )
    p.add_argument(
        "--topics",
        type=Path,
        default=Path("research_radar/data/output/topic_results.json"),
        help="Stage 4 topic_results.json (provides 2D coords + cluster labels).",
    )
    p.add_argument(
        "--out",
        type=Path,
        default=Path("research_radar/data/output"),
        help="Output directory for citation_graph.html and citation_stats.json.",
    )
    return p


def main(argv: list[str] | None = None) -> None:
    import sys as _sys
    if hasattr(_sys.stdout, "reconfigure"):
        _sys.stdout.reconfigure(encoding="utf-8")

    args = _build_parser().parse_args(argv)
    run_stage5(
        papers_path = args.papers,
        topics_path = args.topics,
        out_dir     = args.out,
    )


if __name__ == "__main__":
    main()
