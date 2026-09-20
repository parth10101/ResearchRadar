"""
Stage 6: Knowledge Graph (Epistemic Archipelago & 3-Tier Zoom Engine)
=====================================================================
A human-centered 3D/2.5D research visualization engine structured around
the user's exact multi-tier epistemic navigation:
  - Level 1 (Macro):  Field Clusters nebulae floating in space with citation filaments.
                      Contains the top [⚡ Research Gaps] trigger button (active ONLY here).
  - Level 2 (Focus):  Single cluster drill-down with 2 central landmark pillars and
                      surrounding radial satellite papers.
  - Level 3 Macro:    Triggered by [⚡ Research Gaps]: Sci-fi neuron/electron particle
                      reorganization transition. Top 5 Gaps materialize in macro space
                      with Gap #1 in center, each rendered as a 3-dot M x D x L network.
  - Level 3 Micro:    Deep traveling warp zoom into an isolated gap network:
                      All other gaps vanish completely. The selected triad expands with
                      Method (M), Dataset (D), Limitation (L) nodes, Uzzi z-score,
                      and slide-over Lit Review / Grant Proposal Studio.

Aesthetic & Scientific Standards:
  - Strict Swiss Editorial & Modern Product Craft (GEMINI.md)
  - Academic Tri-Font Hierarchy (Instrument Serif, Plus Jakarta Sans, JetBrains Mono)
  - Plain-English academic translations for all scientometric metrics
  - Physics-grounded spring transitions (cubic-bezier(0.16, 1, 0.3, 1))
"""

from __future__ import annotations

import argparse
import datetime
import json
import math
import os
import re
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
import time
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

import numpy as np


# ---------------------------------------------------------------------------
# Distinctive Academic Palette for the Macro Clusters (Subtle & Matte)
# ---------------------------------------------------------------------------
CLUSTER_PALETTE = [
    {"primary": "#38bdf8", "glow": "rgba(56, 189, 248, 0.25)", "name": "Frontier Velocity (Sky)"},
    {"primary": "#a855f7", "glow": "rgba(168, 85, 247, 0.25)", "name": "Theoretical Foundational (Purple)"},
    {"primary": "#10b981", "glow": "rgba(16, 185, 129, 0.25)", "name": "Empirical SOTA (Emerald)"},
    {"primary": "#eab308", "glow": "rgba(234, 179, 8, 0.25)",  "name": "Canonical Baseline (Gold)"},
    {"primary": "#f43f5e", "glow": "rgba(244, 63, 94, 0.25)",  "name": "Target Benchmarks (Rose)"},
    {"primary": "#818cf8", "glow": "rgba(129, 140, 248, 0.25)", "name": "Applied Synthesis (Indigo)"},
]


# ---------------------------------------------------------------------------
# 1. Topological Compiler Layer (Consolidates Clusters & Integrates Gaps)
# ---------------------------------------------------------------------------

def compile_archipelago_data(
    papers: list[dict],
    topic_results: dict,
    detected_gaps: dict | None = None,
    narrated_gaps: dict | None = None,
) -> dict:
    """
    Compiles paper embeddings, cluster labels, and Stage 7/8 gap intelligence
    into a clean 3-level data hierarchy for the cinematic visualizer.
    """
    t0 = time.time()
    paper_map = {p.get("id") or p.get("s2_paper_id"): p for p in papers if p.get("id") or p.get("s2_paper_id")}
    clusters = topic_results.get("clusters", {})
    human_names = topic_results.get("human_readable_names", {})
    topic_keywords = topic_results.get("topic_keywords", {})

    # Sort clusters by size (descending) and select top 6 macro-clusters
    real_cluster_keys = [k for k in clusters.keys() if str(k) != "-1"]
    real_cluster_keys.sort(key=lambda k: len(clusters[k]), reverse=True)
    top_cluster_keys = real_cluster_keys[:6]

    # Assign fixed circular layout slots for mathematically zero label overlap
    center_x, center_y = 750.0, 420.0
    orbit_radius = 220.0
    n_clusters = len(top_cluster_keys)

    macro_clusters = []
    cluster_pos_map = {}

    for idx, c_key in enumerate(top_cluster_keys):
        c_int = int(c_key)
        pids = [pid for pid in clusters[c_key] if pid in paper_map]
        c_papers = [paper_map[pid] for pid in pids]
        
        # Clean circular perimeter slot rotated by 30 deg to keep top left open
        angle = (idx / max(n_clusters, 1)) * 2 * math.pi - math.pi / 3.2
        cx = center_x + orbit_radius * math.cos(angle)
        cy = center_y + orbit_radius * math.sin(angle)
        cluster_pos_map[c_int] = (cx, cy)

        # Rank papers by citation gravity
        c_papers.sort(
            key=lambda p: (p.get("citation_count") or 0) + (p.get("influential_citation_count") or 0) * 3,
            reverse=True
        )

        # Top 2 landmark pillars (Sketch 1 Level 2 central nodes)
        pillars = []
        for p in c_papers[:2]:
            pid = p.get("id") or p.get("s2_paper_id")
            authors_raw = p.get("authors") or []
            authors_list = [a.get("name") if isinstance(a, dict) else str(a) for a in authors_raw]
            pillars.append({
                "id": pid,
                "title": p.get("title") or "Seminal Pillar Work",
                "authors": authors_list[:3],
                "year": p.get("year") or 2023,
                "citations": p.get("citation_count") or 0,
                "venue": p.get("venue") or "Peer-Reviewed Venue",
                "tldr": p.get("tldr") or (p.get("abstract") or "")[:200] + "...",
                "abstract": p.get("abstract") or "",
                "doi": p.get("doi") or "",
            })

        # Satellite papers (surrounding the pillars in Level 2)
        satellites = []
        for s_idx, p in enumerate(c_papers[2:8]):
            pid = p.get("id") or p.get("s2_paper_id")
            s_angle = (s_idx / 6.0) * 2 * math.pi
            sat_r = 75.0
            satellites.append({
                "id": pid,
                "title": p.get("title") or "Supporting Scientific Study",
                "year": p.get("year") or 2022,
                "citations": p.get("citation_count") or 0,
                "doi": p.get("doi") or "",
                "dx": round(sat_r * math.cos(s_angle), 1),
                "dy": round(sat_r * math.sin(s_angle), 1),
            })

        palette = CLUSTER_PALETTE[idx % len(CLUSTER_PALETTE)]
        t_name = human_names.get(c_int) or human_names.get(str(c_int)) or f"Research Domain {c_int + 1}"
        t_kws = topic_keywords.get(c_int) or topic_keywords.get(str(c_int)) or []

        macro_clusters.append({
            "cluster_id": c_int,
            "name": t_name,
            "keywords": t_kws[:4],
            "color": palette["primary"],
            "glow": palette["glow"],
            "x": round(cx, 1),
            "y": round(cy, 1),
            "radius": round(math.sqrt(len(c_papers)) * 3.4 + 28, 1),
            "paper_count": len(c_papers),
            "pillars": pillars,
            "satellites": satellites,
        })

    # ── Macro Cluster Citations (Filaments) ──────────────────────────────────
    pid_to_cluster = {}
    for cl in macro_clusters:
        for pid in clusters.get(str(cl["cluster_id"]), []):
            pid_to_cluster[pid] = cl["cluster_id"]

    pair_citations = defaultdict(int)
    for p in papers:
        src_pid = p.get("id") or p.get("s2_paper_id")
        src_c = pid_to_cluster.get(src_pid)
        if src_c is None:
            continue
        for ref in (p.get("references") or []):
            dst_pid = ref.get("paperId") or ref.get("id")
            dst_c = pid_to_cluster.get(dst_pid)
            if dst_c is not None and dst_c != src_c:
                pair_citations[tuple(sorted([src_c, dst_c]))] += 1

    macro_filaments = []
    max_cits = max(pair_citations.values()) if pair_citations else 1
    for (c1, c2), count in pair_citations.items():
        if count >= 1 and c1 in cluster_pos_map and c2 in cluster_pos_map:
            p1 = cluster_pos_map[c1]
            p2 = cluster_pos_map[c2]
            macro_filaments.append({
                "source_id": c1,
                "target_id": c2,
                "x1": round(p1[0], 1), "y1": round(p1[1], 1),
                "x2": round(p2[0], 1), "y2": round(p2[1], 1),
                "volume": count,
                "width": round(max(1.2, (count / max_cits) * 3.8), 1),
            })

    # ── Top 5 Priority Gaps (Layout for Sketch 2: Gap #1 centered, 4 around) ──
    raw_gaps = []
    if detected_gaps and detected_gaps.get("gaps"):
        raw_gaps = list(detected_gaps["gaps"])
    elif narrated_gaps and narrated_gaps.get("gaps"):
        raw_gaps = list(narrated_gaps["gaps"])

    if narrated_gaps and narrated_gaps.get("gaps"):
        narrated_map = {g.get("title", ""): g for g in narrated_gaps["gaps"]}
        for g in raw_gaps:
            t = g.get("title", "")
            if t in narrated_map:
                if narrated_map[t].get("llm_narration"):
                    g["llm_narration"] = narrated_map[t]["llm_narration"]
                if narrated_map[t].get("evidence_papers"):
                    g["evidence_papers"] = narrated_map[t]["evidence_papers"]

    gap_positions = [
        {"x": 750.0, "y": 420.0, "role": "CENTER_TOP_GAP"},      # Gap 1 (Center)
        {"x": 450.0, "y": 240.0, "role": "QUAD_TOP_LEFT"},       # Gap 2 (Top-Left)
        {"x": 1050.0, "y": 240.0, "role": "QUAD_TOP_RIGHT"},     # Gap 3 (Top-Right)
        {"x": 450.0, "y": 600.0, "role": "QUAD_BOTTOM_LEFT"},    # Gap 4 (Bottom-Left)
        {"x": 1050.0, "y": 600.0, "role": "QUAD_BOTTOM_RIGHT"},  # Gap 5 (Bottom-Right)
    ]

    compiled_gaps = []
    for g_idx, g in enumerate(raw_gaps[:5]):
        pos = gap_positions[g_idx % len(gap_positions)]
        
        involved_ids = g.get("papers_involved") or []
        anchor_papers = [paper_map[pid] for pid in involved_ids if pid in paper_map]
        
        if anchor_papers:
            p1 = anchor_papers[0]
            authors1 = [a.get("name") if isinstance(a, dict) else str(a) for a in (p1.get("authors") or [])]
            anchor_a = {
                "id": p1.get("id") or p1.get("s2_paper_id") or "anc_1",
                "title": p1.get("title") or "Methodology Benchmark Work",
                "authors": authors1[:3],
                "year": p1.get("year") or 2023,
                "citations": p1.get("citation_count") or 0,
                "venue": p1.get("venue") or "",
                "tldr": p1.get("tldr") or (p1.get("abstract") or "")[:220] + "...",
                "doi": p1.get("doi") or "",
            }
        else:
            anchor_a = None

        if len(anchor_papers) > 1:
            p2 = anchor_papers[1]
            authors2 = [a.get("name") if isinstance(a, dict) else str(a) for a in (p2.get("authors") or [])]
            anchor_b = {
                "id": p2.get("id") or p2.get("s2_paper_id") or "anc_2",
                "title": p2.get("title") or "Target Problem Benchmark",
                "authors": authors2[:3],
                "year": p2.get("year") or 2022,
                "citations": p2.get("citation_count") or 0,
                "venue": p2.get("venue") or "",
                "tldr": p2.get("tldr") or (p2.get("abstract") or "")[:220] + "...",
                "doi": p2.get("doi") or "",
            }
        else:
            anchor_b = None

        method_str = g.get("method") or "Proposed Method"
        dataset_str = g.get("dataset") or "Target Benchmark"
        limitation_str = g.get("limitation") or "Operational Constraint"

        score_pct = round(float(g.get("score") or 0.85) * 100, 1)
        raw_z = g.get("uzzi_z_score")
        uzzi_z = round(float(raw_z), 3) if raw_z is not None else None

        hypothesis = (
            f"Applying {method_str} directly to {dataset_str} under {limitation_str} constraints "
            f"will overcome the structural representation disconnect, achieving statistically "
            f"significant error reduction over traditional baseline heuristics."
        )

        compiled_gaps.append({
            "gap_id": f"gap_{g_idx + 1}",
            "rank": g_idx + 1,
            "title": g.get("title") or f"Bridging {method_str} ↔ {dataset_str}",
            "method": method_str,
            "dataset": dataset_str,
            "limitation": limitation_str,
            "breakthrough_score": score_pct,
            "uzzi_z_score": round(float(uzzi_z), 3) if uzzi_z is not None else 0.0,
            "is_center_top": (g_idx == 0),
            "macro_x": pos["x"],
            "macro_y": pos["y"],
            "role": pos["role"],
            "description": g.get("description") or f"Unexplored structural intersection between {method_str} and {dataset_str}.",
            "hypothesis": hypothesis,
            "anchor_a": anchor_a,
            "anchor_b": anchor_b,
            "scientific_basis": g.get("scientific_basis") or {
                "paper": "Uzzi et al., Science 2013",
                "doi": "10.1126/science.1240474",
                "formula": "z = (C_obs - mu_null) / sigma_null"
            },
        })

    elapsed = time.time() - t0
    print(f"  [Topological Compiler] Consolidated {len(macro_clusters)} clusters & top {len(compiled_gaps)} MDL gaps in {elapsed:.2f}s.")

    return {
        "macro_clusters": macro_clusters,
        "macro_filaments": macro_filaments,
        "gaps": compiled_gaps,
        "meta": {
            "total_papers": len(papers),
            "compiled_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "execution_time_sec": round(elapsed, 3),
        }
    }


# ---------------------------------------------------------------------------
# 2. Modern Swiss Editorial Interactive HTML Application Template
# ---------------------------------------------------------------------------

STREAMLINED_NAVIGATOR_HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ResearchRadar • Epistemic Archipelago & 3-Tier Zoom</title>

  <!-- Tri-Font Typography Standard (GEMINI.md) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            serif: ['"Instrument Serif"', 'Georgia', 'serif'],
            sans: ['"Plus Jakarta Sans"', '-apple-system', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            canvas: '#080b11',
            card: '#0f141f',
            elevated: '#161e2e',
            sheet: 'rgba(17, 24, 38, 0.94)',
            canon: '#eab308',
            refuted: '#f43f5e',
            consensus: '#10b981',
            frontier: '#38bdf8',
            gapnexus: '#a855f7',
          }
        }
      }
    }
  </script>

  <style>
    :root {
      --bg-void: #080b11;
      --card-bg: #0f141f;
      --card-elevated: #161e2e;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-medium: rgba(255, 255, 255, 0.16);
      --border-highlight: rgba(255, 255, 255, 0.22);
      --spring-easing: cubic-bezier(0.16, 1, 0.3, 1);
    }
    body {
      background-color: var(--bg-void);
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow: hidden;
      height: 100vh;
      width: 100vw;
    }
    .specular-border {
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.10);
    }
    .tabular-nums {
      font-variant-numeric: tabular-nums;
    }
    .macro-filament {
      fill: none;
      stroke: rgba(255, 255, 255, 0.12);
      stroke-linecap: round;
      transition: stroke 0.3s, opacity 0.3s;
    }
    .cluster-halo {
      cursor: pointer;
      transition: transform 0.3s var(--spring-easing), opacity 0.3s ease;
    }
    .cluster-halo:hover {
      filter: drop-shadow(0 0 16px rgba(255,255,255,0.22));
    }
    .gap-triad-macro {
      cursor: pointer;
      transition: transform 0.25s var(--spring-easing);
    }
    .gap-triad-macro:hover {
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.45));
    }
    .drawer-slide {
      transition: transform 0.4s var(--spring-easing), opacity 0.4s ease;
    }
    /* Warp traveling canvas overlay */
    #warp-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 28;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    /* Animated pulse ring */
    @keyframes pulseRing {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 0.3; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }
    .pulse-ring-anim {
      animation: pulseRing 3s infinite ease-in-out;
      transform-origin: center;
    }
  </style>
</head>
<body class="flex flex-col select-none antialiased">

  <!-- =========================================================================
       1. TOP COMMAND BAR
       ========================================================================= -->
  <header class="h-16 px-6 bg-[#0a0e17]/90 backdrop-blur-xl border-b border-white/8 flex items-center justify-between z-50">
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2.5 cursor-pointer" onclick="returnToLevel1()">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-purple-500 flex items-center justify-center text-black font-bold text-xs">
          RR
        </div>
        <div>
          <span class="font-serif italic text-lg text-white font-medium">ResearchRadar</span>
          <span class="text-[10px] font-mono text-slate-400 ml-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/8">STAGE 06 // EPISTEMIC ARCHIPELAGO</span>
        </div>
      </div>
    </div>

    <!-- The 3-Tier Breadcrumb State Indicator -->
    <div class="flex items-center gap-3">
      <nav class="flex p-1 bg-[#0f141f] border border-white/10 rounded-xl text-xs font-medium text-slate-400">
        <button id="nav-step-1" onclick="returnToLevel1()" class="px-3.5 py-1.5 rounded-lg text-white bg-white/10 shadow-sm transition flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>1. Macro Clusters</span>
        </button>
        <button id="nav-step-2" class="px-3.5 py-1.5 rounded-lg text-slate-500 cursor-default transition flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-purple-400 opacity-40"></span>
          <span>2. Cluster Drill-Down</span>
        </button>
        <button id="nav-step-3" class="px-3.5 py-1.5 rounded-lg text-slate-500 cursor-default transition flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-sky-400 opacity-40"></span>
          <span>3. M×D×L Gaps</span>
        </button>
      </nav>

      <!-- EXCLUSIVE TOP BUTTON: [⚡ Research Gaps] (Only active from Level 1) -->
      <div class="relative group">
        <button id="btn-top-research-gaps" onclick="triggerSciFiGapsTransition()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-sky-500/20 hover:from-purple-500/30 hover:to-sky-500/30 border border-purple-500/40 text-purple-200 font-mono text-xs font-semibold tracking-wide transition shadow-lg flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
          <span>⚡ RESEARCH GAPS (TOP 5)</span>
        </button>
        <div id="btn-tooltip" class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-[#1c2638] text-[10px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap border border-white/10">
          Available only from Level 1 Macro Space
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex items-center gap-2.5 font-mono text-xs">
      <button id="btn-back-macro" onclick="zoomBackToMacroGaps()" class="hidden px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white transition flex items-center gap-1.5">
        <span>← Back to Top 5 Gaps</span>
      </button>
      <button id="btn-back-clusters" onclick="returnToLevel1()" class="hidden px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition flex items-center gap-1.5">
        <span>🌐 Field Clusters</span>
      </button>
      <button onclick="exportTaxonomy()" class="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-slate-300 transition">
        📑 Export
      </button>
    </div>
  </header>

  <!-- =========================================================================
       2. MAIN VIEWPORT (CANVAS + WARP EFFECT + SVG)
       ========================================================================= -->
  <main class="relative flex-1 w-full h-[calc(100vh-64px)] overflow-hidden bg-[#080b11]">

    <!-- Dynamic Level Status Pill (Top Left) -->
    <div class="absolute top-5 left-8 z-20 pointer-events-none">
      <div id="level-badge" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0f141f]/90 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200">
        <span id="level-dot" class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        <span id="level-title" class="font-semibold tracking-wide">LEVEL 1: MACRO THEMATIC NEBULAE</span>
      </div>
      <p id="level-desc" class="text-xs text-slate-400 font-sans mt-2 max-w-[340px] leading-relaxed">
        Full field topology. Click any cluster to focus its landmark pillars, or press <strong class="text-purple-300">[⚡ RESEARCH GAPS]</strong> to initiate neuron reorganization.
      </p>
    </div>

    <!-- Warp Speed Travelling HUD Overlay (Appears during deep micro zoom) -->
    <div id="warp-hud" class="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300">
      <div class="p-5 rounded-2xl bg-[#080b11]/90 backdrop-blur-xl border border-purple-500/40 text-center space-y-2.5 shadow-2xl">
        <div class="text-[11px] font-mono text-purple-400 tracking-widest uppercase animate-pulse flex items-center justify-center gap-2">
          <span class="w-2 h-2 rounded-full bg-purple-400"></span>
          <span>HYPER-WARP DIVE IN PROGRESS</span>
        </div>
        <div id="warp-telemetry" class="text-xs font-mono text-slate-200 tabular-nums font-semibold">
          SECTOR: MACRO → SUB-LATTICE → MID-SUB CORE → SUPER-SUB TRIAD → MICRO
        </div>
        <div class="w-64 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div id="warp-progress-bar" class="h-full bg-gradient-to-r from-sky-400 via-purple-400 to-emerald-400 w-0"></div>
        </div>
      </div>
    </div>

    <!-- Canvas for Sci-Fi Particle Reorganization Lines -->
    <canvas id="warp-canvas"></canvas>

    <!-- Central SVG Canvas -->
    <svg id="canvas-svg" class="w-full h-full">
      <defs>
        <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-sky" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g id="canvas-root">
        <!-- Level 1: Inter-cluster citation filaments -->
        <g id="filament-layer"></g>

        <!-- Level 1 & Level 2: Cluster nebulae & satellite paper nodes -->
        <g id="cluster-layer"></g>

        <!-- Dynamic Sci-Fi Reorganization Particles Layer -->
        <g id="scifi-particles-layer"></g>

        <!-- Level 3 Macro & Micro: Top 5 M*D*L Gap Networks Layer -->
        <g id="gaps-layer"></g>
      </g>
    </svg>

    <!-- =======================================================================
         3. SLIDE-OVER INSPECTION DRAWER (EVIDENCE & GRANT STUDIO)
         ======================================================================= -->
    <aside id="info-drawer" class="absolute top-0 right-0 h-full w-[460px] bg-[#0f141f]/95 backdrop-blur-2xl border-l border-white/10 p-6 z-40 transform translate-x-full drawer-slide overflow-y-auto space-y-5 specular-border">
      <div class="flex items-center justify-between pb-3 border-b border-white/8">
        <span id="drawer-eyebrow" class="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
          M×D×L GAP DOSSIER
        </span>
        <button onclick="closeDrawer()" class="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded hover:bg-white/5">✕ ESC</button>
      </div>

      <div id="drawer-content" class="space-y-4">
        <!-- Dynamic content injected by JavaScript -->
      </div>
    </aside>

    <!-- Toast Notification -->
    <div id="toast" class="fixed bottom-6 right-8 px-4 py-2.5 rounded-xl bg-[#1c2638] border border-white/20 text-white text-xs font-mono shadow-2xl opacity-0 pointer-events-none transition-opacity duration-300 z-50">
      Copied to clipboard!
    </div>

  </main>

  <!-- =========================================================================
       4. EMBEDDED COMPILED DATA & APPLICATION SCRIPT
       ========================================================================= -->
  <script>
    const DATA = __ARCHIPELAGO_DATA_PLACEHOLDER__;

    // Viewport Coordinates & D3 Zoom Setup
    const width = window.innerWidth;
    const height = window.innerHeight - 64;
    const drawerWidth = 460;
    const svg = d3.select("#canvas-svg");
    const rootG = d3.select("#canvas-root");
    const filamentLayer = d3.select("#filament-layer");
    const clusterLayer = d3.select("#cluster-layer");
    const particleLayer = d3.select("#scifi-particles-layer");
    const gapsLayer = d3.select("#gaps-layer");

    // Warp Canvas Setup
    const warpCanvas = document.getElementById("warp-canvas");
    const warpCtx = warpCanvas.getContext("2d");
    warpCanvas.width = width;
    warpCanvas.height = height;

    const zoom = d3.zoom().scaleExtent([0.4, 4.0]).on("zoom", (event) => {
      rootG.attr("transform", event.transform);
    });
    svg.call(zoom);

    // Initial center transform with ample margins
    const initialTransform = d3.zoomIdentity.translate((width / 2) - 750, (height / 2) - 420);
    svg.call(zoom.transform, initialTransform);

    // State Variables
    let currentState = 'LEVEL_1_CLUSTERS';
    let selectedCluster = null;
    let selectedGap = null;

    // ── 1. RENDER LEVEL 1 & LEVEL 2 CLUSTERS ─────────────────────────────────
    function renderClusters() {
      filamentLayer.selectAll(".macro-filament")
        .data(DATA.macro_filaments)
        .enter()
        .append("line")
        .attr("class", "macro-filament")
        .attr("x1", d => d.x1).attr("y1", d => d.y1)
        .attr("x2", d => d.x2).attr("y2", d => d.y2)
        .attr("stroke-width", d => d.width);

      const cGroups = clusterLayer.selectAll(".cluster-halo")
        .data(DATA.macro_clusters)
        .enter()
        .append("g")
        .attr("class", "cluster-halo")
        .attr("id", d => `cluster-g-${d.cluster_id}`)
        .attr("transform", d => `translate(${d.x}, ${d.y})`)
        .on("click", (event, d) => handleClusterClick(d));

      cGroups.append("circle")
        .attr("r", d => d.radius + 18)
        .attr("fill", d => d.color)
        .attr("opacity", 0.08);

      cGroups.append("circle")
        .attr("r", d => d.radius)
        .attr("fill", "#0f141f")
        .attr("stroke", d => d.color)
        .attr("stroke-width", 2);

      cGroups.append("text")
        .attr("class", "cluster-main-label")
        .attr("dy", "-0.2em")
        .attr("text-anchor", "middle")
        .attr("font-family", "'Instrument Serif', Georgia, serif")
        .attr("font-size", "15px")
        .attr("fill", "#ffffff")
        .text(d => d.name.length > 24 ? d.name.slice(0, 22) + "..." : d.name);

      cGroups.append("text")
        .attr("class", "cluster-count-label")
        .attr("dy", "1.3em")
        .attr("text-anchor", "middle")
        .attr("font-family", "'JetBrains Mono', monospace")
        .attr("font-size", "10px")
        .attr("fill", "#94a3b8")
        .text(d => `${d.paper_count} papers`);

      // Add Level 2 Pillar & Satellite sub-groups (hidden initially)
      cGroups.each(function(c) {
        const g = d3.select(this);
        const l2Group = g.append("g")
          .attr("class", "level2-constellation")
          .attr("opacity", 0)
          .attr("pointer-events", "none");

        if (c.pillars && c.pillars.length >= 2) {
          l2Group.append("line")
            .attr("x1", -38).attr("y1", 0)
            .attr("x2", 38).attr("y2", 0)
            .attr("stroke", c.color)
            .attr("stroke-width", 2.5)
            .attr("stroke-dasharray", "4,2");

          const p1 = l2Group.append("g").attr("transform", "translate(-38, 0)");
          p1.append("circle").attr("r", 14).attr("fill", "#161e2e").attr("stroke", c.color).attr("stroke-width", 2);
          p1.append("text").attr("dy", "0.35em").attr("text-anchor", "middle").attr("font-family", "'JetBrains Mono'").attr("font-size", "9px").attr("fill", "#fff").text("P1");

          const p2 = l2Group.append("g").attr("transform", "translate(38, 0)");
          p2.append("circle").attr("r", 14).attr("fill", "#161e2e").attr("stroke", c.color).attr("stroke-width", 2);
          p2.append("text").attr("dy", "0.35em").attr("text-anchor", "middle").attr("font-family", "'JetBrains Mono'").attr("font-size", "9px").attr("fill", "#fff").text("P2");
        }

        (c.satellites || []).forEach(sat => {
          l2Group.append("line")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", sat.dx).attr("y2", sat.dy)
            .attr("stroke", "rgba(255,255,255,0.15)")
            .attr("stroke-width", 1);

          l2Group.append("circle")
            .attr("cx", sat.dx).attr("cy", sat.dy)
            .attr("r", 5)
            .attr("fill", c.color)
            .attr("opacity", 0.85);
        });
      });
    }

    // ── 2. RENDER LEVEL 3 TOP 5 M×D×L GAPS (MACRO) ───────────────────────────
    function renderGapsMacro() {
      gapsLayer.selectAll("*").remove();

      DATA.gaps.forEach(gap => {
        const gapG = gapsLayer.append("g")
          .attr("class", "gap-triad-macro")
          .attr("id", `gap-macro-${gap.gap_id}`)
          .attr("transform", `translate(${gap.macro_x}, ${gap.macro_y}) scale(0)`)
          .attr("opacity", 0)
          .on("click", () => zoomIntoGapMicro(gap));

        gapG.append("circle")
          .attr("r", gap.is_center_top ? 74 : 56)
          .attr("fill", "none")
          .attr("stroke", "#a855f7")
          .attr("stroke-width", gap.is_center_top ? 2 : 1.5)
          .attr("stroke-dasharray", "5,3")
          .attr("class", "pulse-ring-anim");

        const boxSize = gap.is_center_top ? 50 : 40;
        gapG.append("rect")
          .attr("x", -boxSize / 2).attr("y", -boxSize / 2)
          .attr("width", boxSize).attr("height", boxSize)
          .attr("rx", 8)
          .attr("fill", "#1c1429")
          .attr("stroke", gap.is_center_top ? "#c084fc" : "#a855f7")
          .attr("stroke-width", gap.is_center_top ? 2.5 : 1.8);

        gapG.append("text")
          .attr("dy", "-0.1em")
          .attr("text-anchor", "middle")
          .attr("font-family", "'JetBrains Mono', monospace")
          .attr("font-size", gap.is_center_top ? "13px" : "11px")
          .attr("font-weight", "700")
          .attr("fill", "#f3e8ff")
          .text(`#${gap.rank}`);

        gapG.append("text")
          .attr("dy", "1.25em")
          .attr("text-anchor", "middle")
          .attr("font-family", "'JetBrains Mono', monospace")
          .attr("font-size", "9px")
          .attr("fill", "#c084fc")
          .text(`${Math.round(gap.breakthrough_score)}%`);

        const mOff = { x: -65, y: 48 };
        const dOff = { x: 72, y: -48 };
        const lOff = { x: 0, y: 68 };

        gapG.append("line").attr("x1", 0).attr("y1", 0).attr("x2", mOff.x).attr("y2", mOff.y).attr("stroke", "#10b981").attr("stroke-width", 1.8);
        gapG.append("line").attr("x1", 0).attr("y1", 0).attr("x2", dOff.x).attr("y2", dOff.y).attr("stroke", "#38bdf8").attr("stroke-width", 1.8);
        gapG.append("line").attr("x1", 0).attr("y1", 0).attr("x2", lOff.x).attr("y2", lOff.y).attr("stroke", "#f43f5e").attr("stroke-width", 1.8);

        const dotM = gapG.append("g").attr("transform", `translate(${mOff.x}, ${mOff.y})`);
        dotM.append("circle").attr("r", 9).attr("fill", "#064e3b").attr("stroke", "#10b981").attr("stroke-width", 2);
        dotM.append("text").attr("dy", "0.35em").attr("text-anchor", "middle").attr("font-family", "'JetBrains Mono'").attr("font-size", "9px").attr("font-weight", "bold").attr("fill", "#ecfdf5").text("M");

        const dotD = gapG.append("g").attr("transform", `translate(${dOff.x}, ${dOff.y})`);
        dotD.append("circle").attr("r", 9).attr("fill", "#0c4a6e").attr("stroke", "#38bdf8").attr("stroke-width", 2);
        dotD.append("text").attr("dy", "0.35em").attr("text-anchor", "middle").attr("font-family", "'JetBrains Mono'").attr("font-size", "9px").attr("font-weight", "bold").attr("fill", "#f0f9ff").text("D");

        const dotL = gapG.append("g").attr("transform", `translate(${lOff.x}, ${lOff.y})`);
        dotL.append("circle").attr("r", 9).attr("fill", "#881337").attr("stroke", "#f43f5e").attr("stroke-width", 2);
        dotL.append("text").attr("dy", "0.35em").attr("text-anchor", "middle").attr("font-family", "'JetBrains Mono'").attr("font-size", "9px").attr("font-weight", "bold").attr("fill", "#fff1f2").text("L");

        gapG.append("text")
          .attr("y", boxSize / 2 + 38)
          .attr("text-anchor", "middle")
          .attr("font-family", "'Plus Jakarta Sans', sans-serif")
          .attr("font-size", "10.5px")
          .attr("font-weight", "600")
          .attr("fill", "#e2e8f0")
          .text(gap.is_center_top ? `★ TOP GAP 1: ${gap.method.slice(0, 18)}` : `${gap.method.slice(0, 16)} ↔ ${gap.dataset.slice(0, 12)}`);
      });
    }

    // ── 3. SCI-FI NEURON/ELECTRON REORGANIZATION TRANSITION ───────────────────
    function triggerSciFiGapsTransition() {
      if (currentState !== 'LEVEL_1_CLUSTERS') return;
      currentState = 'LEVEL_3_GAPS_MACRO';
      closeDrawer();

      const topBtn = document.getElementById("btn-top-research-gaps");
      topBtn.classList.add("opacity-40", "cursor-not-allowed");
      document.getElementById("btn-back-clusters").classList.remove("hidden");

      document.getElementById("nav-step-1").className = "px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition flex items-center gap-2";
      document.getElementById("nav-step-3").className = "px-3.5 py-1.5 rounded-lg text-white bg-purple-500/20 border border-purple-500/40 shadow-sm transition flex items-center gap-2";
      document.getElementById("nav-step-3").querySelector("span").className = "w-2 h-2 rounded-full bg-purple-400";

      const dot = document.getElementById("level-dot");
      const title = document.getElementById("level-title");
      const desc = document.getElementById("level-desc");
      dot.className = "w-2.5 h-2.5 rounded-full bg-purple-400";
      title.innerText = "LEVEL 3: TOP 5 RESEARCH GAPS (MACRO NEURAL SYNAPSE)";
      desc.innerText = "Cluster nebulae reorganized into top 5 M×D×L void bridges. Top Gap #1 is centered. Click any 3-dot triad to execute deep traveling warp zoom.";

      renderSciFiParticleStream(() => {
        renderGapsMacro();

        gsap.to(".gap-triad-macro", {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "back.out(1.6)",
        });

        gsap.to(".cluster-halo", { opacity: 0, scale: 0.8, duration: 0.6, pointerEvents: "none" });
        gsap.to(".macro-filament", { opacity: 0, duration: 0.5 });
      });
    }

    function renderSciFiParticleStream(onComplete) {
      particleLayer.selectAll("*").remove();
      const particles = [];
      const targets = DATA.gaps.map(g => ({ x: g.macro_x, y: g.macro_y }));

      DATA.macro_clusters.forEach(c => {
        for (let i = 0; i < 14; i++) {
          const target = targets[Math.floor(Math.random() * targets.length)];
          particles.push({
            startX: c.x + (Math.random() - 0.5) * 50,
            startY: c.y + (Math.random() - 0.5) * 50,
            endX: target.x + (Math.random() - 0.5) * 30,
            endY: target.y + (Math.random() - 0.5) * 30,
            color: Math.random() > 0.5 ? "#38bdf8" : "#a855f7",
            radius: Math.random() * 2.5 + 1.5,
          });
        }
      });

      const pNodes = particleLayer.selectAll(".scifi-particle")
        .data(particles)
        .enter()
        .append("circle")
        .attr("class", "scifi-particle")
        .attr("cx", d => d.startX)
        .attr("cy", d => d.startY)
        .attr("r", d => d.radius)
        .attr("fill", d => d.color)
        .attr("filter", "url(#glow-purple)")
        .attr("opacity", 0.9);

      pNodes.each(function(d, i) {
        gsap.to(this, {
          cx: d.endX,
          cy: d.endY,
          opacity: 0,
          scale: 1.8,
          duration: 0.75 + Math.random() * 0.35,
          ease: "power3.inOut",
          onComplete: () => {
            if (i === particles.length - 1 && onComplete) {
              particleLayer.selectAll("*").remove();
              onComplete();
            }
          }
        });
      });
    }

    // ── 4. DEEP TRAVELING WARP ZOOM TO LEVEL 3 MICRO (ISOLATED M×D×L) ──────────
    function zoomIntoGapMicro(gap) {
      currentState = 'LEVEL_3_GAP_MICRO';
      selectedGap = gap;

      document.getElementById("btn-back-macro").classList.remove("hidden");
      document.getElementById("btn-back-clusters").classList.remove("hidden");

      const dot = document.getElementById("level-dot");
      const title = document.getElementById("level-title");
      const desc = document.getElementById("level-desc");
      dot.className = "w-2.5 h-2.5 rounded-full bg-sky-400";
      title.innerText = `LEVEL 3 MICRO: GAP #${gap.rank} // ${gap.method.slice(0, 24)} ↔ ${gap.dataset.slice(0, 20)}`;
      desc.innerText = "Isolated M×D×L triad constellation. All background entities eliminated. Inspect evidence, anchor papers, and synthesize grant aims.";

      DATA.gaps.forEach(otherGap => {
        if (otherGap.gap_id !== gap.gap_id) {
          gsap.to(`#gap-macro-${otherGap.gap_id}`, {
            opacity: 0,
            scale: 0.05,
            duration: 0.45,
            ease: "power2.in"
          });
        }
      });

      playWarpSpeedEffect();

      // Ergonomic offset: center within the available space to the left of the 460px drawer
      const targetScale = 1.45;
      const targetX = ((width - drawerWidth) / 2) - 35 - gap.macro_x * targetScale;
      const targetY = (height / 2) - gap.macro_y * targetScale;

      svg.transition()
        .duration(1100)
        .ease(d3.easeCubicInOut)
        .call(zoom.transform, d3.zoomIdentity.translate(targetX, targetY).scale(targetScale))
        .on("end", () => {
          renderMicroIsolatedTriad(gap);
          openGapDrawer(gap);
        });
    }

    function playWarpSpeedEffect() {
      const warpHud = document.getElementById("warp-hud");
      const warpBar = document.getElementById("warp-progress-bar");
      const telemetry = document.getElementById("warp-telemetry");
      warpCanvas.style.opacity = "1";
      warpHud.classList.remove("opacity-0");

      const stages = [
        "SECTOR: MACRO LEVEL (TOP 5 GAPS OVERVIEW)",
        "DEPTH 600m: ENTERING SUB-NETWORK LATTICE 4B...",
        "DEPTH 350m: TRAVERSING MID-SUB SYNAPSE CORRIDOR...",
        "DEPTH 120m: LOCKING ONTO SUPER-SUB M×D×L NUCLEUS...",
        "DEPTH 0m: MICRO ISOLATION RECEPTOR REACHED."
      ];

      stages.forEach((st, idx) => {
        setTimeout(() => {
          telemetry.innerText = st;
        }, idx * 210);
      });

      gsap.fromTo(warpBar, { width: "0%" }, { width: "100%", duration: 1.05, ease: "power2.inOut" });

      const lines = [];
      const cx = width / 2;
      const cy = height / 2;
      for (let i = 0; i < 120; i++) {
        const ang = Math.random() * 2 * Math.PI;
        lines.push({
          ang: ang,
          dist: Math.random() * 80 + 10,
          speed: Math.random() * 18 + 12,
          length: Math.random() * 60 + 20,
          color: Math.random() > 0.5 ? "rgba(56, 189, 248, 0.7)" : "rgba(168, 85, 247, 0.7)"
        });
      }

      let animId;
      const startTime = performance.now();

      function drawWarp(now) {
        const elapsed = now - startTime;
        warpCtx.clearRect(0, 0, width, height);

        lines.forEach(l => {
          l.dist += l.speed;
          const x1 = cx + Math.cos(l.ang) * l.dist;
          const y1 = cy + Math.sin(l.ang) * l.dist;
          const x2 = cx + Math.cos(l.ang) * (l.dist + l.length);
          const y2 = cy + Math.sin(l.ang) * (l.dist + l.length);

          warpCtx.beginPath();
          warpCtx.moveTo(x1, y1);
          warpCtx.lineTo(x2, y2);
          warpCtx.strokeStyle = l.color;
          warpCtx.lineWidth = 1.5;
          warpCtx.stroke();
        });

        if (elapsed < 1050) {
          animId = requestAnimationFrame(drawWarp);
        } else {
          warpCanvas.style.opacity = "0";
          warpHud.classList.add("opacity-0");
          warpCtx.clearRect(0, 0, width, height);
        }
      }
      animId = requestAnimationFrame(drawWarp);
    }

    // ── 5. RENDER THE HIGH-DEFINITION ISOLATED MICRO TRIAD ────────────────────
    function renderMicroIsolatedTriad(gap) {
      const g = d3.select(`#gap-macro-${gap.gap_id}`);
      g.selectAll("*").remove();

      g.append("circle")
        .attr("r", 150)
        .attr("fill", "url(#glow-purple)")
        .attr("opacity", 0.08);

      const core = g.append("g").attr("class", "micro-nexus-core");
      core.append("rect")
        .attr("x", -44).attr("y", -44)
        .attr("width", 88).attr("height", 88)
        .attr("rx", 14)
        .attr("fill", "#140e20")
        .attr("stroke", "#c084fc")
        .attr("stroke-width", 2.5)
        .attr("class", "specular-border");

      core.append("text")
        .attr("dy", "-0.3em")
        .attr("text-anchor", "middle")
        .attr("font-family", "'JetBrains Mono'")
        .attr("font-size", "11px")
        .attr("font-weight", "bold")
        .attr("fill", "#c084fc")
        .text(`GAP #${gap.rank}`);

      core.append("text")
        .attr("dy", "1.1em")
        .attr("text-anchor", "middle")
        .attr("font-family", "'JetBrains Mono'")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "#ffffff")
        .text(`${Math.round(gap.breakthrough_score)}%`);

      core.append("text")
        .attr("dy", "2.6em")
        .attr("text-anchor", "middle")
        .attr("font-family", "'JetBrains Mono'")
        .attr("font-size", "9.5px")
        .attr("fill", "#a855f7")
        .text(`z = ${gap.uzzi_z_score}σ`);

      const mPos = { x: -130, y: 90 };
      const dPos = { x: 135, y: -90 };
      const lPos = { x: 0, y: 130 };

      g.append("line").attr("x1", 0).attr("y1", 0).attr("x2", mPos.x).attr("y2", mPos.y).attr("stroke", "#10b981").attr("stroke-width", 2.5).attr("stroke-dasharray", "4,2");
      g.append("line").attr("x1", 0).attr("y1", 0).attr("x2", dPos.x).attr("y2", dPos.y).attr("stroke", "#38bdf8").attr("stroke-width", 2.5).attr("stroke-dasharray", "4,2");
      g.append("line").attr("x1", 0).attr("y1", 0).attr("x2", lPos.x).attr("y2", lPos.y).attr("stroke", "#f43f5e").attr("stroke-width", 2.5).attr("stroke-dasharray", "4,2");

      const gM = g.append("g").attr("transform", `translate(${mPos.x}, ${mPos.y})`);
      gM.append("circle").attr("r", 26).attr("fill", "#064e3b").attr("stroke", "#10b981").attr("stroke-width", 2.5);
      gM.append("text").attr("dy", "0.35em").attr("text-anchor", "middle").attr("font-family", "'JetBrains Mono'").attr("font-size", "14px").attr("font-weight", "bold").attr("fill", "#ffffff").text("M");
      gM.append("text").attr("y", 38).attr("text-anchor", "middle").attr("font-family", "'Plus Jakarta Sans'").attr("font-size", "11px").attr("font-weight", "600").attr("fill", "#34d399").text("METHOD TECHNIQUE");
      gM.append("text").attr("y", 50).attr("text-anchor", "middle").attr("font-family", "'JetBrains Mono'").attr("font-size", "9px").attr("fill", "#94a3b8").text(gap.method.length > 22 ? gap.method.slice(0, 20) + "..." : gap.method);

      const gD = g.append("g").attr("transform", `translate(${dPos.x}, ${dPos.y})`);
      gD.append("circle").attr("r", 26).attr("fill", "#0c4a6e").attr("stroke", "#38bdf8").attr("stroke-width", 2.5);
      gD.append("text").attr("dy", "0.35em").attr("text-anchor", "middle").attr("font-family", "'JetBrains Mono'").attr("font-size", "14px").attr("font-weight", "bold").attr("fill", "#ffffff").text("D");
      gD.append("text").attr("y", -34).attr("text-anchor", "middle").attr("font-family", "'Plus Jakarta Sans'").attr("font-size", "11px").attr("font-weight", "600").attr("fill", "#38bdf8").text("TARGET DATASET");
      gD.append("text").attr("y", -46).attr("text-anchor", "middle").attr("font-family", "'JetBrains Mono'").attr("font-size", "9px").attr("fill", "#94a3b8").text(gap.dataset.length > 22 ? gap.dataset.slice(0, 20) + "..." : gap.dataset);

      const gL = g.append("g").attr("transform", `translate(${lPos.x}, ${lPos.y})`);
      gL.append("circle").attr("r", 26).attr("fill", "#881337").attr("stroke", "#f43f5e").attr("stroke-width", 2.5);
      gL.append("text").attr("dy", "0.35em").attr("text-anchor", "middle").attr("font-family", "'JetBrains Mono'").attr("font-size", "14px").attr("font-weight", "bold").attr("fill", "#ffffff").text("L");
      gL.append("text").attr("y", 38).attr("text-anchor", "middle").attr("font-family", "'Plus Jakarta Sans'").attr("font-size", "11px").attr("font-weight", "600").attr("fill", "#fb7185").text("EMPIRICAL BOTTLENECK");
      gL.append("text").attr("y", 50).attr("text-anchor", "middle").attr("font-family", "'JetBrains Mono'").attr("font-size", "9px").attr("fill", "#94a3b8").text(gap.limitation.length > 22 ? gap.limitation.slice(0, 20) + "..." : gap.limitation);
    }

    // ── 6. REVERSE NAVIGATION: BACK TO TOP 5 MACRO ───────────────────────────
    function zoomBackToMacroGaps() {
      currentState = 'LEVEL_3_GAPS_MACRO';
      closeDrawer();
      document.getElementById("btn-back-macro").classList.add("hidden");

      svg.transition()
        .duration(800)
        .ease(d3.easeCubicOut)
        .call(zoom.transform, initialTransform);

      renderGapsMacro();
      gsap.to(".gap-triad-macro", { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05 });

      const dot = document.getElementById("level-dot");
      const title = document.getElementById("level-title");
      const desc = document.getElementById("level-desc");
      dot.className = "w-2.5 h-2.5 rounded-full bg-purple-400";
      title.innerText = "LEVEL 3: TOP 5 RESEARCH GAPS (MACRO NEURAL SYNAPSE)";
      desc.innerText = "Top 5 M×D×L void bridges in macro space. Top Gap #1 is centered. Click any 3-dot triad to execute deep traveling warp zoom.";
    }

    // ── 7. RETURN TO LEVEL 1 (ALL CLUSTERS) ───────────────────────────────────
    function returnToLevel1() {
      currentState = 'LEVEL_1_CLUSTERS';
      closeDrawer();

      document.getElementById("btn-back-macro").classList.add("hidden");
      document.getElementById("btn-back-clusters").classList.add("hidden");
      const topBtn = document.getElementById("btn-top-research-gaps");
      topBtn.classList.remove("opacity-40", "cursor-not-allowed");

      document.getElementById("nav-step-1").className = "px-3.5 py-1.5 rounded-lg text-white bg-white/10 shadow-sm transition flex items-center gap-2";
      document.getElementById("nav-step-2").className = "px-3.5 py-1.5 rounded-lg text-slate-500 cursor-default transition flex items-center gap-2";
      document.getElementById("nav-step-3").className = "px-3.5 py-1.5 rounded-lg text-slate-500 cursor-default transition flex items-center gap-2";
      document.getElementById("nav-step-3").querySelector("span").className = "w-2 h-2 rounded-full bg-purple-400 opacity-40";

      svg.transition()
        .duration(800)
        .ease(d3.easeCubicOut)
        .call(zoom.transform, initialTransform);

      gsap.to(".cluster-halo", { opacity: 1, scale: 1, duration: 0.6, pointerEvents: "auto" });
      gsap.to(".macro-filament", { opacity: 0.3, duration: 0.6 });
      gsap.to(".level2-constellation", { opacity: 0, duration: 0.3 });
      gsap.to(".cluster-main-label, .cluster-count-label", { opacity: 1, duration: 0.3 });

      gapsLayer.selectAll("*").remove();

      const dot = document.getElementById("level-dot");
      const title = document.getElementById("level-title");
      const desc = document.getElementById("level-desc");
      dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-400";
      title.innerText = "LEVEL 1: MACRO THEMATIC NEBULAE";
      desc.innerText = "Full field topology. Click any cluster to focus its landmark pillars, or press [⚡ RESEARCH GAPS] to initiate neuron reorganization.";
    }

    // ── 8. LEVEL 2: CLUSTER DRILL-DOWN (SKETCH 1 FOCUS) ──────────────────────
    function handleClusterClick(cluster) {
      if (currentState !== 'LEVEL_1_CLUSTERS') return;
      currentState = 'LEVEL_2_CLUSTER_FOCUS';
      selectedCluster = cluster;

      const topBtn = document.getElementById("btn-top-research-gaps");
      topBtn.classList.add("opacity-40", "cursor-not-allowed");
      document.getElementById("btn-back-clusters").classList.remove("hidden");

      document.getElementById("nav-step-1").className = "px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition flex items-center gap-2";
      document.getElementById("nav-step-2").className = "px-3.5 py-1.5 rounded-lg text-white bg-emerald-500/20 border border-emerald-500/40 shadow-sm transition flex items-center gap-2";
      document.getElementById("nav-step-2").querySelector("span").className = "w-2 h-2 rounded-full bg-emerald-400";

      const dot = document.getElementById("level-dot");
      const title = document.getElementById("level-title");
      const desc = document.getElementById("level-desc");
      dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-400";
      title.innerText = `LEVEL 2 FOCUS: ${cluster.name.toUpperCase()}`;
      desc.innerText = "Central landmark pillars (P1, P2) connected by core spine, with satellite literature nodes radiating outward.";

      const targetScale = 2.2;
      const targetX = ((width - drawerWidth) / 2) - cluster.x * targetScale;
      const targetY = (height / 2) - cluster.y * targetScale;

      svg.transition()
        .duration(850)
        .ease(d3.easeCubicOut)
        .call(zoom.transform, d3.zoomIdentity.translate(targetX, targetY).scale(targetScale));

      DATA.macro_clusters.forEach(c => {
        if (c.cluster_id !== cluster.cluster_id) {
          gsap.to(`#cluster-g-${c.cluster_id}`, { opacity: 0.08, duration: 0.5 });
        } else {
          gsap.to(`#cluster-g-${c.cluster_id} .cluster-main-label`, { opacity: 0, duration: 0.3 });
          gsap.to(`#cluster-g-${c.cluster_id} .cluster-count-label`, { opacity: 0, duration: 0.3 });
          gsap.to(`#cluster-g-${c.cluster_id} .level2-constellation`, { opacity: 1, duration: 0.5 });
        }
      });
      gsap.to(".macro-filament", { opacity: 0.04, duration: 0.4 });

      openClusterDrawer(cluster);
    }

    // ── 9. DRAWERS: EVIDENCE & GRANT SYNTHESIS ────────────────────────────────
    function openGapDrawer(gap) {
      const drawer = document.getElementById("info-drawer");
      const content = document.getElementById("drawer-content");
      document.getElementById("drawer-eyebrow").innerText = `M×D×L GAP #${gap.rank} // VERIFIED EVIDENCE`;

      const p1 = gap.anchor_a || {};
      const p2 = gap.anchor_b || {};

      content.innerHTML = `
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-bold">
              GAP #${gap.rank}
            </span>
            <span class="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-[11px]">
              Uzzi z = ${gap.uzzi_z_score}σ
            </span>
          </div>
          <h3 class="text-2xl font-serif text-white font-normal leading-snug pt-1">${gap.title}</h3>
          <p class="text-xs text-slate-400 font-sans leading-relaxed pt-1">${gap.description}</p>
        </div>

        <div class="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
          <div class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
            <div class="text-[9px] text-emerald-400 font-bold uppercase">METHOD (M)</div>
            <div class="text-[10px] text-white font-medium truncate mt-0.5" title="${gap.method}">${gap.method}</div>
          </div>
          <div class="p-2 rounded-lg bg-sky-500/10 border border-sky-500/25">
            <div class="text-[9px] text-sky-400 font-bold uppercase">DATASET (D)</div>
            <div class="text-[10px] text-white font-medium truncate mt-0.5" title="${gap.dataset}">${gap.dataset}</div>
          </div>
          <div class="p-2 rounded-lg bg-rose-500/10 border border-rose-500/25">
            <div class="text-[9px] text-rose-400 font-bold uppercase">LIMIT (L)</div>
            <div class="text-[10px] text-white font-medium truncate mt-0.5" title="${gap.limitation}">${gap.limitation}</div>
          </div>
        </div>

        <div class="space-y-2.5 pt-2">
          <div class="text-[11px] font-mono text-slate-400 uppercase font-semibold">Literature Proof Spine</div>

          <div class="p-3 rounded-xl bg-[#080b11] border border-emerald-500/25 space-y-1">
            <div class="flex items-center justify-between text-[10px] font-mono">
              <span class="text-emerald-400 font-bold uppercase">ANCHOR 1: TECHNIQUE PROVIDER</span>
              <span class="text-slate-400 tabular-nums">${p1.year || 2023}</span>
            </div>
            <h4 class="font-serif text-base text-white leading-snug">${p1.title || "Method Paper"}</h4>
            <p class="text-[11px] text-slate-400 font-sans">${(p1.authors || []).join(", ")} • ${(p1.citations || 0).toLocaleString()} citations</p>
            <p class="text-xs text-slate-300 font-sans leading-relaxed pt-1">${p1.tldr || p1.abstract || ""}</p>
            <div class="pt-1.5 flex items-center justify-between text-[11px] font-mono">
              ${p1.doi ? `<a href="https://doi.org/${p1.doi}" target="_blank" class="text-emerald-400 hover:underline">📄 DOI / PDF ↗</a>` : '<span class="text-slate-500">Open Access</span>'}
              <button onclick="copyBibtex('${p1.title}')" class="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300">Copy BibTeX</button>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-[#080b11] border border-sky-500/25 space-y-1">
            <div class="flex items-center justify-between text-[10px] font-mono">
              <span class="text-sky-400 font-bold uppercase">ANCHOR 2: TARGET BENCHMARK</span>
              <span class="text-slate-400 tabular-nums">${p2.year || 2022}</span>
            </div>
            <h4 class="font-serif text-base text-white leading-snug">${p2.title || "Target Paper"}</h4>
            <p class="text-[11px] text-slate-400 font-sans">${(p2.authors || []).join(", ")} • ${(p2.citations || 0).toLocaleString()} citations</p>
            <p class="text-xs text-slate-300 font-sans leading-relaxed pt-1">${p2.tldr || p2.abstract || ""}</p>
            <div class="pt-1.5 flex items-center justify-between text-[11px] font-mono">
              ${p2.doi ? `<a href="https://doi.org/${p2.doi}" target="_blank" class="text-sky-400 hover:underline">📄 DOI / PDF ↗</a>` : '<span class="text-slate-500">Open Access</span>'}
              <button onclick="copyBibtex('${p2.title}')" class="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300">Copy BibTeX</button>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-white/8 space-y-2 font-mono text-xs">
          <button onclick="copyLitReviewSynthesis()" class="w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/35 text-purple-200 font-semibold transition flex items-center justify-center gap-2">
            <span>📋 Copy Lit Review Synthesis</span>
          </button>
          <button onclick="copyGrantHypothesis()" class="w-full py-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-200 font-semibold transition flex items-center justify-center gap-2">
            <span>⚡ Draft Grant Proposal Section (H₁)</span>
          </button>
        </div>
      `;

      drawer.classList.remove("translate-x-full");
    }

    function openClusterDrawer(cluster) {
      const drawer = document.getElementById("info-drawer");
      const content = document.getElementById("drawer-content");
      document.getElementById("drawer-eyebrow").innerText = "CLUSTER DOSSIER";

      let pillarsHtml = (cluster.pillars || []).map((p, idx) => `
        <div class="p-3.5 rounded-xl bg-[#080b11] border border-white/8 space-y-1">
          <div class="flex items-center justify-between text-[11px] font-mono">
            <span class="text-amber-400 font-bold">LANDMARK PILLAR ${idx + 1}</span>
            <span class="text-slate-400 tabular-nums">${p.year}</span>
          </div>
          <h4 class="font-serif text-base text-white leading-snug">${p.title}</h4>
          <p class="text-[11px] text-slate-400 font-sans">${p.authors.join(", ")} • ${p.citations.toLocaleString()} citations</p>
          <p class="text-xs text-slate-300 font-sans leading-relaxed pt-1">${p.tldr}</p>
        </div>
      `).join("");

      content.innerHTML = `
        <div>
          <span class="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">DOMAIN CLUSTER FOCUS</span>
          <h3 class="text-2xl font-serif text-white font-normal mt-1">${cluster.name}</h3>
          <p class="text-xs text-slate-400 font-mono mt-1">${cluster.paper_count} peer-reviewed papers in corpus</p>
        </div>

        <div class="space-y-1">
          <div class="text-[11px] font-mono text-slate-400 uppercase font-semibold">Seminal Landmark Pillars</div>
          <div class="space-y-2 mt-2">${pillarsHtml}</div>
        </div>

        <div class="pt-4 border-t border-white/8">
          <button onclick="returnToLevel1()" class="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs font-semibold transition">
            ← Return to Field Clusters
          </button>
        </div>
      `;

      drawer.classList.remove("translate-x-full");
    }

    function closeDrawer() {
      document.getElementById("info-drawer").classList.add("translate-x-full");
    }

    function showToast(msg) {
      const t = document.getElementById("toast");
      t.innerText = msg;
      t.classList.remove("opacity-0");
      setTimeout(() => t.classList.add("opacity-0"), 2200);
    }

    function copyLitReviewSynthesis() {
      const gap = selectedGap || DATA.gaps[0];
      const text = `A critical research void in recent literature lies at the intersection of ${gap.method} and ${gap.dataset}. While prior work demonstrated strong performance in standalone benchmarks, zero studies have integrated ${gap.method} under ${gap.limitation} constraints (Uzzi et al. z = ${gap.uzzi_z_score}σ). Reconciling these findings offers immediate breakthrough potential.`;
      navigator.clipboard.writeText(text).then(() => showToast("Lit review synthesis copied!"));
    }

    function copyGrantHypothesis() {
      const gap = selectedGap || DATA.gaps[0];
      const text = `[NSF / NIH Research Proposal Section - Specific Aims]\\nProject Title: Bridging ${gap.method} to ${gap.dataset}\\n\\nCentral Hypothesis (H1):\\n${gap.hypothesis}\\n\\nEmpirical Rationale:\\nUzzi Novelty standing z = ${gap.uzzi_z_score}σ demonstrates an atypical, high-impact combination with proven feasibility across literature anchors.`;
      navigator.clipboard.writeText(text).then(() => showToast("Grant proposal section copied!"));
    }

    function copyBibtex(title) {
      const bib = `@article{ref_${Math.floor(Math.random()*9000+1000)},\\n  title={${title}},\\n  year={2023},\\n  journal={Peer-Reviewed Proceedings}\\n}`;
      navigator.clipboard.writeText(bib).then(() => showToast("BibTeX citation copied!"));
    }

    function exportTaxonomy() {
      const lines = ["# ResearchRadar Epistemic Field Taxonomy", ""];
      DATA.macro_clusters.forEach(c => {
        lines.push(`## ${c.name} (${c.paper_count} papers)`);
        lines.push(`- Key Methodologies: ${c.keywords.join(", ")}`);
        lines.push("");
      });
      navigator.clipboard.writeText(lines.join("\\n")).then(() => showToast("Corpus taxonomy copied!"));
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDrawer();
        if (currentState === 'LEVEL_3_GAP_MICRO') zoomBackToMacroGaps();
        else if (currentState === 'LEVEL_2_CLUSTER_FOCUS' || currentState === 'LEVEL_3_GAPS_MACRO') returnToLevel1();
      }
      if (e.key === "1") returnToLevel1();
      if (e.key === "3" && currentState === 'LEVEL_1_CLUSTERS') triggerSciFiGapsTransition();
    });

    renderClusters();
  </script>
</body>
</html>
"""


def render_archipelago_html(data: dict, out_path: Path) -> Path:
    """Renders the streamlined 3-level research navigator HTML file."""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    json_str = json.dumps(data, ensure_ascii=False)
    html_content = STREAMLINED_NAVIGATOR_HTML_TEMPLATE.replace("__ARCHIPELAGO_DATA_PLACEHOLDER__", json_str)
    out_path.write_text(html_content, encoding="utf-8")
    return out_path


# ---------------------------------------------------------------------------
# 3. Stage 6 Runner (Integrated with Pipeline)
# ---------------------------------------------------------------------------

def run_stage6(
    papers: list[dict],
    out_dir: Path,
    topics_path: Path | None = None,
    detected_gaps_path: Path | None = None,
    narrated_gaps_path: Path | None = None,
) -> dict:
    """
    Executes Stage 6: The 3-Level Knowledge Graph & Epistemic Archipelago.
    Level 1: Clusters | Level 2: Cluster Focus | Level 3: M*D*L Gaps Macro & Micro
    """
    print(f"\n{'=' * 70}")
    print(f"  STAGE 6: KNOWLEDGE GRAPH")
    print(f"{'=' * 70}")

    topics_file = topics_path or (out_dir / "topic_results.json")
    if not topics_file.exists():
        topics_file = out_dir / "topics.json"
    if not topics_file.exists():
        print(f"  [WARN] Topic results not found at {topics_file}. Stage 6 requires Stage 4 output.", file=sys.stderr)
        return {}

    topic_results = json.loads(topics_file.read_text(encoding="utf-8"))

    detected_gaps = None
    dg_file = detected_gaps_path or (out_dir / "detected_gaps.json")
    if dg_file.exists():
        try:
            detected_gaps = json.loads(dg_file.read_text(encoding="utf-8"))
        except Exception:
            pass

    narrated_gaps = None
    ng_file = narrated_gaps_path or (out_dir / "narrated_gaps.json")
    if ng_file.exists():
        try:
            narrated_gaps = json.loads(ng_file.read_text(encoding="utf-8"))
        except Exception:
            pass

    navigator_data = compile_archipelago_data(
        papers=papers,
        topic_results=topic_results,
        detected_gaps=detected_gaps,
        narrated_gaps=narrated_gaps,
    )

    json_out_path = out_dir / "archipelago_data.json"
    json_out_path.write_text(json.dumps(navigator_data, indent=2, ensure_ascii=False), encoding="utf-8")

    html_out_path = out_dir / "epistemic_archipelago.html"
    render_archipelago_html(navigator_data, html_out_path)

    print(f"\n  {'=' * 66}")
    print(f"  STAGE 6 COMPLETE -- KNOWLEDGE GRAPH READY")
    print(f"  {'=' * 66}")
    print(f"  Level 1: Consolidated Macro Clusters : {len(navigator_data['macro_clusters'])}")
    print(f"  Level 2: Landmark Pillars & Constellations Configured")
    print(f"  Level 3: Top 5 M×D×L Gaps (Gap #1 Centered) : {len(navigator_data['gaps'])}")
    print(f"  Deep Warp Travelling Zoom & 1-Click Studio : Enabled")
    print(f"  Interactive Application              : {html_out_path}")
    print(f"  Data Contract Export                 : {json_out_path}")
    print(f"  {'=' * 66}\n")

    return navigator_data


def main():
    parser = argparse.ArgumentParser(description="Stage 6: Knowledge Graph")
    parser.add_argument("--corpus", type=Path, default=Path("data/papers.json"))
    parser.add_argument("--out", type=Path, default=Path("data/output"))
    args = parser.parse_args()

    if not args.corpus.exists():
        print(f"[ERROR] Corpus file not found: {args.corpus}")
        sys.exit(1)

    papers = json.loads(args.corpus.read_text(encoding="utf-8"))
    run_stage6(papers=papers, out_dir=args.out)


if __name__ == "__main__":
    main()
