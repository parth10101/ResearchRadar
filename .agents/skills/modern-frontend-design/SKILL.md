---
name: modern-frontend-design
description: >-
  Use this skill whenever designing, building, or refining web interfaces, interactive dashboards,
  visualizations, HTML/CSS templates, and user experiences to ensure world-class Swiss editorial and modern SaaS quality.
---

# Modern Frontend Design & Visual Engineering Skill

This skill operationalizes the standards defined in `GEMINI.md` to produce world-class, professional, non-cluttered, and scannable web interfaces for ResearchRadar.

---

## 1. Non-Negotiable Visual Standards

### The Anti-Neon Aesthetic Creed
- ❌ **NEVER USE:** Neon green (`#00ff00`), electric cyan laser edges, cyber-glow shadows, high-saturation arcade purples, or matrix particle streams.
- ✅ **ALWAYS USE:** Matte charcoal/slate surfaces (`#080b11`, `#0f141f`, `#161e2e`), surgical 1px borders (`rgba(255,255,255,0.08)`), and restrained, meaningful academic functional accents (Emerald for validated SOTA, Terracotta/Rust for refutations, Matte Ochre Gold for canonical baselines, Steel Blue for frontier momentum).

### The 2-Second Scannability Rule
An academic or reviewer must grasp the primary takeaway in **under 2 seconds**:
1. **Never dump raw paragraphs** where a visual encoding can convey the metric.
2. **Empirical Refutations:** Always render the Dual-Bar Tug-of-War chart (Baseline vs Stress Test Collapse).
3. **Citation Momentum:** Render 12-month inline SVG sparklines with subtle gradient fills.
4. **Literature Recency:** Render circular Price Index radial progress meters ($P_{3yr}$).

### The Zero-Collision Layout Contract
1. **No Tilted 3D Planes:** Avoid isometric angles that compress or overlap text labels.
2. **Dedicated Slot Architecture:** Place milestones and cards inside structured horizontal or vertical transit bands with explicit CSS grid or flexbox padding (minimum $48\text{px}$ node spacing).

---

## 2. Universal Design Token Reference

Ensure every generated template or component integrates these foundational CSS variables:

```css
:root {
  --bg-canvas: #080b11;
  --bg-card: #0f141f;
  --bg-card-elevated: #161e2e;
  --bg-drawer: rgba(17, 24, 38, 0.92);
  
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-card: rgba(255, 255, 255, 0.09);
  --border-focus: rgba(255, 255, 255, 0.22);
  
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  
  --accent-canon: #eab308;
  --accent-refuted: #f43f5e;
  --accent-consensus: #10b981;
  --accent-frontier: #38bdf8;
  
  --font-serif: 'Instrument Serif', Georgia, serif;
  --font-sans: 'Plus Jakarta Sans', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## 3. Production Component Blueprints

### Blueprint A: The Empirical Refutation Dual-Bar

```html
<div class="p-3.5 rounded-lg bg-[#0a0e17] border border-white/10 space-y-2 font-mono text-xs">
  <div class="flex items-center justify-between text-slate-400">
    <span class="tracking-wide">ORIGINAL BENCHMARK CLAIM</span>
    <span class="text-slate-200 font-bold">84.2%</span>
  </div>
  <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
    <div class="h-full bg-amber-400 rounded-full" style="width: 84.2%;"></div>
  </div>

  <div class="flex items-center justify-between text-slate-400 pt-1">
    <span class="tracking-wide text-rose-400">REAL-WORLD STRESS TEST</span>
    <div class="flex items-center gap-2">
      <span class="text-rose-400 font-bold">38.1%</span>
      <span class="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-[10px] text-rose-400">
        -46.1% COLLAPSE ⚡
      </span>
    </div>
  </div>
  <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
    <div class="h-full bg-rose-500 rounded-full" style="width: 38.1%;"></div>
  </div>
</div>
```

### Blueprint B: The 3-Lens Citation Switcher Header

```html
<div class="flex items-center justify-between px-6 py-3 bg-[#0f141f] border-b border-white/8">
  <div class="flex items-center gap-3">
    <span class="font-serif italic text-lg text-slate-200">Citation Geometry</span>
    <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
      3 LENSES
    </span>
  </div>
  
  <!-- Pill Segmented Switcher -->
  <div class="flex p-0.5 bg-[#080b11] border border-white/10 rounded-lg text-xs font-medium text-slate-400">
    <button class="px-3 py-1 rounded-md text-white bg-white/10 shadow-sm transition">
      Lineage Backbone (SPLC)
    </button>
    <button class="px-3 py-1 rounded-md hover:text-slate-200 transition">
      Foundation Canon
    </button>
    <button class="px-3 py-1 rounded-md hover:text-slate-200 transition flex items-center gap-1.5">
      The Frontier <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
    </button>
  </div>
</div>
```

### Blueprint C: Node Milestone Card with Acceleration Sparkline

```html
<div class="group relative p-4 rounded-xl bg-[#0f141f] hover:bg-[#141b2b] border border-white/8 hover:border-white/20 transition-all duration-300">
  <div class="flex items-start justify-between gap-4">
    <div>
      <div class="flex items-center gap-2 mb-1">
        <span class="font-mono text-[11px] text-amber-400/90 font-semibold uppercase tracking-wider">CANONICAL BASELINE</span>
        <span class="text-slate-500 text-[11px] font-mono">• 2017</span>
      </div>
      <h3 class="font-serif text-xl text-slate-100 font-normal leading-tight">Attention Is All You Need</h3>
      <p class="text-xs text-slate-400 mt-1 font-sans">Vaswani et al. • NeurIPS</p>
    </div>
    
    <!-- Sparkline -->
    <div class="flex flex-col items-end">
      <svg class="w-20 h-6" viewBox="0 0 80 24" fill="none">
        <path d="M0,22 L16,20 L32,17 L48,12 L64,6 L80,2" stroke="#38bdf8" stroke-width="1.75" stroke-linecap="round"/>
      </svg>
      <span class="text-[10px] font-mono text-sky-400 mt-1">+142% 12mo velocity</span>
    </div>
  </div>

  <p class="mt-3 text-xs text-slate-300/90 leading-relaxed">
    Eliminated recurrent recurrence; introduced multi-head scaled dot-product attention as the universal sequence transducer.
  </p>

  <div class="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
    <span>114,289 citations</span>
    <div class="flex gap-2">
      <button class="hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition">📋 Copy Context</button>
      <button class="hover:text-sky-400 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition">DOI ↗</button>
    </div>
  </div>
</div>
```

---

## 4. Visual Quality Assurance Protocol (The Puppeteer Loop)

When generating or editing an interface:
1. **Render**: Launch headless Chrome via Puppeteer MCP (`puppeteer_navigate`) pointing to `file://.../your_page.html`.
2. **Inspect Collision**: Use `puppeteer_evaluate` to verify that bounding boxes of cards, labels, and text nodes do not overlap:
   ```javascript
   () => {
     const nodes = Array.from(document.querySelectorAll('.card, .milestone, .badge, h1, h2, h3'));
     const rects = nodes.map(el => el.getBoundingClientRect());
     const collisions = [];
     for (let i = 0; i < rects.length; i++) {
       for (let j = i + 1; j < rects.length; j++) {
         const r1 = rects[i], r2 = rects[j];
         const overlap = !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
         if (overlap && !nodes[i].contains(nodes[j]) && !nodes[j].contains(nodes[i])) {
           collisions.push({ a: nodes[i].className, b: nodes[j].className });
         }
       }
     }
     return { collisionCount: collisions.length, collisions };
   }
   ```
3. **Capture Retina Screenshot**: Execute `puppeteer_screenshot` at `deviceScaleFactor: 2` to verify visual balance and contrast.
4. **Audit Against 2-Second Rule**: If text blocks require more than 2 seconds to scan, replace them with dual-bar gauges or sparklines.
