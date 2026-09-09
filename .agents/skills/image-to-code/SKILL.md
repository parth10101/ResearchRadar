---
name: image-to-code
description: >-
  AI-powered workflow to deeply analyze visual designs, wireframes, and UI mockups,
  extracting typography, spacing, colors, and components into production code.
---

# Image-to-Code Skill

Transforms visual designs, Figma screenshots, and UI mockups into faithful, pixel-precise code.

## Workflow

### 1. Deep Visual Extraction Pass
Before writing code, extract and document:
1. **Layout & Grid Anatomy**: Measure column tracks, flex alignments, and container max-widths.
2. **Color Palette Mapping**: Extract exact hex codes for background canvas, structural cards, borders, text primary/secondary, and accent highlights.
3. **Typography Audit**: Map font families, font sizes (rem/px), weights (400/500/600/700), letter-spacing (tracking), and line-heights.
4. **Component Hierarchy**: Identify signature atoms (buttons, tags, sparklines, gauges, tooltips, slide-overs).
5. **Interactive States**: Determine default, hover, active, focus-visible, and loading states.

### 2. Fidelity Rules
- **No Freeform Reinterpretation**: Faithfully preserve the spacing proportions and alignment relationships of the visual reference.
- **Zero Placeholder Text**: Extract and render authentic copy. If text in the image is illegible, synthesize domain-realistic text instead of `Lorem Ipsum`.
- **Responsive Architecture**: Multi-column desktop layouts must collapse into an intentional mobile order (< 768px). Touch targets must be at least 44px.
- **Component Isolation**: Break complex views into reusable, modular component files.
