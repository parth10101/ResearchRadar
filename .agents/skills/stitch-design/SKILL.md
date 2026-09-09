---
name: stitch-design
description: >-
  Google Stitch DESIGN.md Generator & Specification Engine. Creates formal design tokens,
  component stylings, and anti-pattern guardrails for Google Stitch UI generation.
---

# Google Stitch DESIGN.md Specification Engine

Generates and enforces formal `DESIGN.md` specifications formatted specifically for Google Stitch (`https://stitch.withgoogle.com/`).

## DESIGN.md Specification Structure

Every Stitch-compatible design document must follow this 9-section architecture:

1. **Visual Theme & Atmosphere**: Evocative description of mood, density, variance, and motion intensity.
2. **Color Palette & Semantic Roles**: Canvas, card surfaces, text hierarchy, and functional accents (saturation < 80%, no neon).
3. **Typography Rules**: Display, Body, and Monospace font pairings with size scales and weight hierarchy.
4. **Component Stylings**: Tactile buttons, elevated cards, inputs, skeletal loaders, and empty states.
5. **Layout Principles**: Grid-first responsive architecture, asymmetric hero splits, max-width containment, no calc() percentage hacks.
6. **Depth & Elevation**: Hairline border tokens and subtle tinted specular highlights.
7. **Do's and Don'ts**: Explicit anti-pattern bans (no emojis in buttons, no Inter in premium UI, no pure black, no neon halos).
8. **Responsive Behavior**: Breakpoints, touch target rules, and mobile collapse strategy.
9. **Agent Prompt Guide**: Compact color and token reference for downstream AI generators.
