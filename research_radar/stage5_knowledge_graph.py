"""
Stage 5B: Academic Knowledge Graph & Research Gap Engine
=========================================================
Builds a heterogeneous multi-entity academic knowledge graph connecting:
  - 📄 Paper Nodes
  - 🏷 Topic / Concept Nodes
  - ⚙️ Method / Algorithm Nodes
  - 💾 Dataset / Benchmark Nodes
  - 👤 Key Author Nodes

Analytics & Gap Discovery:
  - Discovers unexplored (Method × Dataset) combinations (Research Gaps / White Space)
  - Identifies cross-domain method transfer opportunities
  - Interactive multi-entity filtering and gap explorer

Outputs:
  - data/output/knowledge_graph.html  — Interactive Pyvis knowledge graph
  - data/output/knowledge_graph_stats.json — Structured gap analytics & entity registry
"""

from __future__ import annotations

import argparse
import json
import re
import time
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Visual styling & Colors
# ---------------------------------------------------------------------------

DARK_BG = "#0d1117"

ENTITY_COLORS = {
    "paper":   "#388bfd",   # Blue
    "topic":   "#a371f7",   # Purple
    "method":  "#3fb950",   # Emerald Green
    "dataset": "#f0883e",   # Warm Amber / Orange
    "author":  "#db6d28",   # Burnt Coral
}

ENTITY_SHAPES = {
    "paper":   "dot",
    "topic":   "diamond",
    "method":  "triangle",
    "dataset": "box",
    "author":  "ellipse",
}


# ---------------------------------------------------------------------------
# Known Methods & Datasets Dictionary for Academic AI / Healthcare / CS
# ---------------------------------------------------------------------------

COMMON_METHOD_PATTERNS = [
    r"\bfederated learning\b",
    r"\btransfer learning\b",
    r"\bdifferential privacy\b",
    r"\bsplit learning\b",
    r"\bcontrastive learning\b",
    r"\bmeta-learning\b",
    r"\bself-supervised learning\b",
    r"\breinforcement learning\b",
    r"\btransformer\b",
    r"\bvision transformer\b",
    r"\bgraph neural network\b",
    r"\bgnn\b",
    r"\bknowledge distillation\b",
    r"\blora\b",
    r"\bparameter-efficient\b",
    r"\bactive learning\b",
    r"\bdomain adaptation\b",
    r"\bmulti-task learning\b",
    r"\bsecure aggregation\b",
    r"\bhomomorphic encryption\b",
    r"\bgenerative adversarial network\b",
    r"\bgan\b",
    r"\bdiffusion model\b",
    r"\battention mechanism\b",
    r"\bzero-shot\b",
    r"\bfew-shot learning\b",
    r"\bclustering\b",
    r"\bensemble learning\b",
    r"\bblockchain\b",
    r"\blarge language model\b",
    r"\bllm\b",
    r"\bretrieval-augmented generation\b",
    r"\brag\b",
    r"\bmultimodal learning\b",
    r"\bprompt tuning\b",
    r"\bcausal inference\b",
]

COMMON_DATASET_PATTERNS = [
    r"\bmimic[- ]?iii\b",
    r"\bmimic[- ]?iv\b",
    r"\bchexpert\b",
    r"\bcovid[- ]?19\b",
    r"\bimagenet\b",
    r"\bcifar[- ]?10\b",
    r"\bcifar[- ]?100\b",
    r"\bmnist\b",
    r"\bfashion[- ]?mnist\b",
    r"\bmedmnist\b",
    r"\bglue\b",
    r"\bsquad\b",
    r"\btraining set\b",
    r"\behr\b",
    r"\belectronic health records?\b",
    r"\bct scan\b",
    r"\bx[- ]?ray\b",
    r"\bmri\b",
    r"\bphysionet\b",
    r"\bhistopathology\b",
    r"\bbaseline dataset\b",
    r"\buk biobank\b",
    r"\bclinical trials?\b",
    r"\bpubmed\b",
    r"\btcga\b",
    r"\bgenomics\b",
]


# ---------------------------------------------------------------------------
# Entity Extraction Helpers
# ---------------------------------------------------------------------------

def _extract_entities_from_paper(paper: dict, topic_keywords: list[str]) -> tuple[list[str], list[str]]:
    """
    Extract method entities and dataset entities from paper title, abstract, TLDR, keywords,
    and Semantic Scholar reference methodology intents.
    """
    text = " ".join([
        paper.get("title") or "",
        paper.get("abstract") or "",
        paper.get("tldr") or "",
        " ".join(topic_keywords or []),
    ]).lower()

    methods_found = set()
    for pat in COMMON_METHOD_PATTERNS:
        match = re.search(pat, text)
        if match:
            clean_m = match.group(0).title()
            methods_found.add(clean_m)

    # Check S2 reference intents for methodology influences
    for ref in (paper.get("references") or []):
        intents = ref.get("intents") or []
        if "methodology" in intents:
            ref_title = ref.get("title") or ""
            for pat in COMMON_METHOD_PATTERNS:
                if re.search(pat, ref_title.lower()):
                    clean_m = re.search(pat, ref_title.lower()).group(0).title()
                    methods_found.add(clean_m)

    # Fallback to key phrases in TLDR
    if not methods_found and paper.get("tldr"):
        tldr_words = paper["tldr"].split()
        if len(tldr_words) > 4:
            methods_found.add(" ".join(tldr_words[:3]).title())

    datasets_found = set()
    for pat in COMMON_DATASET_PATTERNS:
        match = re.search(pat, text)
        if match:
            clean_d = match.group(0).upper() if len(match.group(0)) <= 6 else match.group(0).title()
            datasets_found.add(clean_d)

    return list(methods_found), list(datasets_found)


# ---------------------------------------------------------------------------
# Knowledge Graph Construction
# ---------------------------------------------------------------------------

def build_knowledge_graph(papers: list[dict], topic_results: dict) -> tuple["nx.Graph", dict]:
    """
    Build a multi-entity heterogeneous NetworkX graph and compute research gap analytics.
    """
    import networkx as nx

    paper_to_topic  = topic_results.get("paper_to_topic", {})
    human_names     = topic_results.get("human_readable_names", {})
    clusters        = topic_results.get("clusters", {})
    topic_kws_map   = topic_results.get("topic_keywords", {})

    G = nx.Graph()

    # Track entity connections for gap analysis
    method_to_papers   = defaultdict(set)
    dataset_to_papers  = defaultdict(set)
    method_to_datasets = defaultdict(set)
    author_counts      = Counter()

    # 1. Add Topic Nodes
    for t_str, pids in clusters.items():
        t_int = int(t_str)
        t_name = human_names.get(str(t_str), f"Topic {t_str}")
        t_node_id = f"TOPIC_{t_str}"
        G.add_node(
            t_node_id,
            entity_type="topic",
            label=t_name[:28] + ("…" if len(t_name) > 28 else ""),
            full_name=t_name,
            size=28,
            color={"background": ENTITY_COLORS["topic"], "border": "#ffffff"},
            shape=ENTITY_SHAPES["topic"],
            paper_count=len(pids),
            topic_id=t_int,
        )

    # 2. Add Paper Nodes & Extract Methods/Datasets
    for paper in papers:
        pid = paper.get("id", "")
        if not pid:
            continue

        t_id = paper_to_topic.get(pid, -1)
        t_kws = topic_kws_map.get(str(t_id), topic_kws_map.get(t_id, []))
        methods, datasets = _extract_entities_from_paper(paper, t_kws)

        title = paper.get("title") or pid
        short_title = title[:30] + ("…" if len(title) > 30 else "")

        G.add_node(
            pid,
            entity_type="paper",
            label=short_title,
            full_title=title,
            year=paper.get("year", "N/A"),
            authors=paper.get("authors", []),
            venue=paper.get("venue"),
            tldr=paper.get("tldr"),
            citation_count=paper.get("citation_count"),
            size=14,
            color={"background": ENTITY_COLORS["paper"], "border": "#58a6ff"},
            shape=ENTITY_SHAPES["paper"],
            topic_id=t_id,
        )

        # Link Paper -> Topic
        if t_id is not None:
            t_node_id = f"TOPIC_{t_id}"
            if t_node_id in G:
                G.add_edge(pid, t_node_id, relation="BELONGS_TO", color="#a371f766", width=1.5)

        # Link Paper -> Methods
        for m in methods:
            m_id = f"METHOD_{m.lower().replace(' ', '_')}"
            if m_id not in G:
                G.add_node(
                    m_id,
                    entity_type="method",
                    label=f"⚙️ {m}",
                    full_name=m,
                    size=20,
                    color={"background": ENTITY_COLORS["method"], "border": "#ffffff"},
                    shape=ENTITY_SHAPES["method"],
                )
            G.add_edge(pid, m_id, relation="PROPOSES_METHOD", color="#3fb95088", width=1.8)
            method_to_papers[m].add(pid)

        # Link Paper -> Datasets
        for d in datasets:
            d_id = f"DATASET_{d.lower().replace(' ', '_')}"
            if d_id not in G:
                G.add_node(
                    d_id,
                    entity_type="dataset",
                    label=f"💾 {d}",
                    full_name=d,
                    size=20,
                    color={"background": ENTITY_COLORS["dataset"], "border": "#ffffff"},
                    shape=ENTITY_SHAPES["dataset"],
                )
            G.add_edge(pid, d_id, relation="EVALUATED_ON", color="#f0883e88", width=1.8)
            dataset_to_papers[d].add(pid)

        # Connect Method <-> Dataset co-occurrences within this paper
        for m in methods:
            for d in datasets:
                method_to_datasets[m].add(d)

        # Author counting
        for a in (paper.get("authors") or [])[:2]:
            author_counts[a] += 1

    # 3. Add Prominent Author Nodes (authors with >= 2 papers)
    for auth, count in author_counts.most_common(12):
        if count < 2:
            continue
        a_id = f"AUTH_{auth.lower().replace(' ', '_')}"
        G.add_node(
            a_id,
            entity_type="author",
            label=f"👤 {auth}",
            full_name=auth,
            size=18,
            color={"background": ENTITY_COLORS["author"], "border": "#ffffff"},
            shape=ENTITY_SHAPES["author"],
            paper_count=count,
        )
        for paper in papers:
            if auth in (paper.get("authors") or []):
                pid = paper.get("id")
                if pid and pid in G:
                    G.add_edge(pid, a_id, relation="AUTHORED_BY", color="#db6d2866", width=1.2)

    # 4. Research Gap Analysis (White Space Discovery)
    all_methods  = list(method_to_papers.keys())
    all_datasets = list(dataset_to_papers.keys())
    research_gaps = []

    for m in all_methods:
        tested_datasets = method_to_datasets.get(m, set())
        for d in all_datasets:
            if d not in tested_datasets:
                m_count = len(method_to_papers[m])
                d_count = len(dataset_to_papers[d])
                # Gap score: product of popularity (high method activity + high dataset benchmark activity with 0 intersection)
                gap_score = m_count * d_count
                if gap_score >= 2:
                    research_gaps.append({
                        "method": m,
                        "dataset": d,
                        "gap_score": gap_score,
                        "method_papers_count": m_count,
                        "dataset_papers_count": d_count,
                        "opportunity": f"Apply {m} to {d} benchmark",
                    })

    research_gaps.sort(key=lambda g: g["gap_score"], reverse=True)

    stats = {
        "total_nodes": G.number_of_nodes(),
        "total_edges": G.number_of_edges(),
        "counts_by_type": {
            "papers":   sum(1 for _, d in G.nodes(data=True) if d.get("entity_type") == "paper"),
            "topics":   sum(1 for _, d in G.nodes(data=True) if d.get("entity_type") == "topic"),
            "methods":  sum(1 for _, d in G.nodes(data=True) if d.get("entity_type") == "method"),
            "datasets": sum(1 for _, d in G.nodes(data=True) if d.get("entity_type") == "dataset"),
            "authors":  sum(1 for _, d in G.nodes(data=True) if d.get("entity_type") == "author"),
        },
        "top_methods":  sorted([{"name": m, "count": len(p)} for m, p in method_to_papers.items()], key=lambda x: x["count"], reverse=True)[:8],
        "top_datasets": sorted([{"name": d, "count": len(p)} for d, p in dataset_to_papers.items()], key=lambda x: x["count"], reverse=True)[:8],
        "research_gaps": research_gaps[:15],
    }

    return G, stats


# ---------------------------------------------------------------------------
# HTML / CSS / JS Rendering for Knowledge Graph
# ---------------------------------------------------------------------------

_KG_SIDEBAR_CSS = """
<style id="kg-styles">
* { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  background: #0d1117;
  color: #e6edf3;
  font-family: 'Segoe UI', system-ui, sans-serif;
  height: 100%;
  overflow: hidden;
}
#rr-layout { display: flex; height: 100vh; width: 100%; }
#rr-sidebar {
  width: 290px; min-width: 290px;
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
.sb-header p  { font-size: 10px; color: #8b949e; }
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
.stat-card .val { font-size: 16px; font-weight: 700; color: #58a6ff; }
.stat-card .lbl { font-size: 8.5px; color: #8b949e; margin-top: 2px; text-transform: uppercase; }
.btn {
  width: 100%; padding: 7px 10px; margin-bottom: 5px;
  background: #0d1117; border: 1px solid #30363d;
  color: #e6edf3; border-radius: 6px; cursor: pointer;
  font-size: 11px; text-align: left; font-family: inherit;
  transition: background 0.12s, border-color 0.12s;
}
.btn:hover { background: #21262d; border-color: #58a6ff55; }
.btn.active { background: #1f6feb22; border-color: #58a6ff; color: #58a6ff; }
.gap-item {
  padding: 8px 10px; margin-bottom: 6px; border-radius: 6px;
  font-size: 10.5px; background: #0d1117; border-left: 3px solid #f0883e;
  cursor: pointer; transition: background 0.12s;
}
.gap-item:hover { background: #21262d; }
.gap-title { color: #f0883e; font-weight: 600; line-height: 1.35; margin-bottom: 2px; }
.gap-meta { color: #8b949e; font-size: 9.5px; }
.sb-footer {
  padding: 10px 14px; font-size: 9px; color: #484f58; text-align: center;
  margin-top: auto; border-top: 1px solid #21262d;
}
</style>
"""


def _make_kg_tooltip(node_id: str, data: dict) -> str:
    etype = data.get("entity_type", "entity")
    color = ENTITY_COLORS.get(etype, "#888888")

    if etype == "paper":
        title_esc = (data.get("full_title") or node_id).replace("<", "&lt;").replace(">", "&gt;")
        authors_str = ", ".join((data.get("authors") or [])[:3])
        tldr_html = f'<div style="margin:5px 0;color:#c9d1d9;font-size:10px;">💡 {data.get("tldr")}</div>' if data.get("tldr") else ""
        return (
            f'<div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:10px 12px;max-width:300px;font-family:sans-serif;font-size:11px;">'
            f'<div style="color:#58a6ff;font-weight:600;margin-bottom:4px;">📄 {title_esc}</div>'
            f'<div style="color:#8b949e;">📅 {data.get("year","N/A")} · 👥 {authors_str}</div>'
            f'{tldr_html}'
            f'</div>'
        )
    elif etype == "method":
        return (
            f'<div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:10px 12px;font-family:sans-serif;font-size:11px;">'
            f'<div style="color:#3fb950;font-weight:600;">⚙️ Method / Algorithm</div>'
            f'<div style="color:#e6edf3;font-size:13px;margin-top:2px;">{data.get("full_name", node_id)}</div>'
            f'</div>'
        )
    elif etype == "dataset":
        return (
            f'<div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:10px 12px;font-family:sans-serif;font-size:11px;">'
            f'<div style="color:#f0883e;font-weight:600;">💾 Dataset / Benchmark</div>'
            f'<div style="color:#e6edf3;font-size:13px;margin-top:2px;">{data.get("full_name", node_id)}</div>'
            f'</div>'
        )
    elif etype == "topic":
        return (
            f'<div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:10px 12px;font-family:sans-serif;font-size:11px;">'
            f'<div style="color:#a371f7;font-weight:600;">🏷 Topic Cluster</div>'
            f'<div style="color:#e6edf3;font-size:12px;margin-top:2px;">{data.get("full_name", node_id)}</div>'
            f'<div style="color:#8b949e;margin-top:3px;">{data.get("paper_count", 0)} papers</div>'
            f'</div>'
        )
    else:
        return f'<div style="background:#161b22;padding:8px;color:#e6edf3;">{data.get("label", node_id)}</div>'


def _build_kg_sidebar_html(stats: dict) -> str:
    counts = stats.get("counts_by_type", {})
    gaps = stats.get("research_gaps", [])

    gaps_html = ""
    for g in gaps[:6]:
        gaps_html += (
            f'<div class="gap-item">'
            f'<div class="gap-title">⚡ {g["opportunity"]}</div>'
            f'<div class="gap-meta">Method: {g["method_papers_count"]} papers · Dataset: {g["dataset_papers_count"]} papers</div>'
            f'</div>'
        )
    if not gaps_html:
        gaps_html = '<div style="color:#8b949e;font-size:10.5px;">No prominent gaps identified.</div>'

    return f"""
<div id="rr-sidebar">
  <div class="sb-header">
    <h1>🧠 Academic Knowledge Graph</h1>
    <p>Semantic Entities & Research Gaps · Stage 5B</p>
  </div>

  <div class="sb-section">
    <h3>Entity Overview</h3>
    <div class="stat-grid">
      <div class="stat-card"><div class="val" style="color:#388bfd;">{counts.get('papers',0)}</div><div class="lbl">Papers</div></div>
      <div class="stat-card"><div class="val" style="color:#a371f7;">{counts.get('topics',0)}</div><div class="lbl">Topics</div></div>
      <div class="stat-card"><div class="val" style="color:#3fb950;">{counts.get('methods',0)}</div><div class="lbl">Methods</div></div>
      <div class="stat-card"><div class="val" style="color:#f0883e;">{counts.get('datasets',0)}</div><div class="lbl">Datasets</div></div>
    </div>
  </div>

  <div class="sb-section">
    <h3>Entity Filters</h3>
    <button class="btn active" id="filter-all" onclick="filterEntityType('all')">🌐 Show All Entities</button>
    <button class="btn" id="filter-methods" onclick="filterEntityType('method')">⚙️ Methods & Datasets Only</button>
    <button class="btn" id="filter-papers" onclick="filterEntityType('paper')">📄 Papers Only</button>
    <button class="btn" id="filter-topics" onclick="filterEntityType('topic')">🏷 Topics Only</button>
  </div>

  <div class="sb-section">
    <h3>⚡ Research Gaps (White Spaces)</h3>
    <p style="font-size:9.5px;color:#8b949e;margin-bottom:8px;">Unexplored Method × Benchmark combinations with high opportunity scores:</p>
    {gaps_html}
  </div>

  <div class="sb-footer">
    ResearchRadar Knowledge Graph · Stage 5B<br>
    Multi-Entity Heterogeneous Semantic Graph
  </div>
</div>
"""


def _build_kg_sidebar_js(G: "nx.Graph") -> str:
    node_types = {n: d.get("entity_type", "paper") for n, d in G.nodes(data=True)}
    node_default_colors = {
        n: ENTITY_COLORS.get(d.get("entity_type", "paper"), "#888888")
        for n, d in G.nodes(data=True)
    }

    return f"""
<script id="kg-sidebar-js">
const NODE_TYPES   = {json.dumps(node_types)};
const DEFAULT_COLS = {json.dumps(node_default_colors)};

function _net() {{ return window.network; }}

function filterEntityType(targetType) {{
  document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
  
  if (targetType === 'all') {{
    document.getElementById('filter-all')?.classList.add('active');
    const updates = Object.keys(NODE_TYPES).map(id => ({{
      id: id,
      color: {{ background: DEFAULT_COLS[id], border: '#ffffff' }},
      hidden: false
    }}));
    _net().body.data.nodes.update(updates);
  }} else if (targetType === 'method') {{
    document.getElementById('filter-methods')?.classList.add('active');
    const updates = Object.keys(NODE_TYPES).map(id => {{
      const isMD = NODE_TYPES[id] === 'method' || NODE_TYPES[id] === 'dataset';
      return {{
        id: id,
        color: {{ background: DEFAULT_COLS[id], border: '#ffffff' }},
        hidden: !isMD
      }};
    }});
    _net().body.data.nodes.update(updates);
  }} else {{
    document.getElementById('filter-' + targetType + 's')?.classList.add('active');
    const updates = Object.keys(NODE_TYPES).map(id => ({{
      id: id,
      color: {{ background: DEFAULT_COLS[id], border: '#ffffff' }},
      hidden: NODE_TYPES[id] !== targetType
    }}));
    _net().body.data.nodes.update(updates);
  }}
  _net().fit({{animation: {{duration:600}}}});
}}
</script>
"""


# ---------------------------------------------------------------------------
# Pyvis HTML Rendering
# ---------------------------------------------------------------------------

def render_knowledge_graph(G: "nx.Graph", out_path: Path, stats: dict) -> None:
    try:
        from pyvis.network import Network
    except ImportError:
        raise ImportError("pip install pyvis")

    net = Network(
        height="100vh",
        width="100%",
        directed=False,
        bgcolor=DARK_BG,
        font_color="#e6edf3",
        notebook=False,
        select_menu=False,
        filter_menu=False,
    )

    # Add nodes
    for node_id, data in G.nodes(data=True):
        tooltip = _make_kg_tooltip(node_id, data)
        net.add_node(
            node_id,
            label=data.get("label", node_id),
            title=tooltip,
            color=data.get("color", {"background": "#888888", "border": "#ffffff"}),
            size=data.get("size", 16),
            shape=data.get("shape", "dot"),
            font={"color": "#e6edf3", "size": 10, "face": "Segoe UI"},
            borderWidth=1.5,
        )

    # Add edges
    for src, tgt, edge_data in G.edges(data=True):
        color = edge_data.get("color", "#88888844")
        width = edge_data.get("width", 1.2)
        net.add_edge(src, tgt, color=color, width=width)

    # Physics configuration (Barnes-Hut for organic clustering)
    net.set_options(json.dumps({
        "physics": {
            "enabled": True,
            "barnesHut": {
                "gravitationalConstant": -3000,
                "centralGravity": 0.25,
                "springLength": 95,
                "springConstant": 0.04,
                "damping": 0.09,
                "avoidOverlap": 0.3
            },
            "stabilization": {"iterations": 150}
        },
        "interaction": {
            "hover": True,
            "tooltipDelay": 80,
            "navigationButtons": True,
            "zoomView": True,
            "dragView": True,
        }
    }))

    try:
        raw_html = net.generate_html(name=out_path.name)
    except TypeError:
        raw_html = net.generate_html()

    sidebar_html = _build_kg_sidebar_html(stats)
    sidebar_js   = _build_kg_sidebar_js(G)

    # Inject layout & styles
    final_html = raw_html.replace("</head>", f"{_KG_SIDEBAR_CSS}</head>")
    body_wrap = f'<div id="rr-layout">{sidebar_html}<div id="rr-main"><div id="mynetwork"></div></div></div>'
    final_html = re.sub(r'<div id="mynetwork"[^>]*></div>', "", final_html)
    final_html = final_html.replace("<body>", f"<body>{body_wrap}")
    final_html = final_html.replace("var network = new vis.Network", "window.network = new vis.Network")
    final_html = final_html.replace("</body>", f"{sidebar_js}</body>")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(final_html, encoding="utf-8")


# ---------------------------------------------------------------------------
# Runner Entry Point
# ---------------------------------------------------------------------------

def run_knowledge_graph(
    papers_path: Path | str,
    topics_path: Path | str,
    out_dir: Path | str,
) -> dict:
    papers_path = Path(papers_path)
    topics_path = Path(topics_path)
    out_dir     = Path(out_dir)

    papers = json.loads(papers_path.read_text(encoding="utf-8"))
    topic_results = json.loads(topics_path.read_text(encoding="utf-8"))

    t0 = time.time()
    G, stats = build_knowledge_graph(papers, topic_results)
    out_html = out_dir / "knowledge_graph.html"
    out_json = out_dir / "knowledge_graph_stats.json"

    render_knowledge_graph(G, out_html, stats)
    out_json.write_text(json.dumps(stats, indent=2, ensure_ascii=False), encoding="utf-8")
    elapsed = time.time() - t0

    print(f"  [Knowledge Graph] Built {stats['total_nodes']} entities, {stats['total_edges']} semantic relationships ({elapsed:.2f}s)")
    print(f"  [Knowledge Graph] Saved -> {out_html}")
    return stats


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Build Academic Knowledge Graph & Research Gap Engine.")
    parser.add_argument("--papers", type=Path, default=Path("data/output/papers.json"))
    parser.add_argument("--topics", type=Path, default=Path("data/output/topic_results.json"))
    parser.add_argument("--out", type=Path, default=Path("data/output"))
    args = parser.parse_args()

    run_knowledge_graph(args.papers, args.topics, args.out)


if __name__ == "__main__":
    main()
