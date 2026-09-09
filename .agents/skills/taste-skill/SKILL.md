---
name: taste-skill
description: >-
  Curated skill framework to refine design aesthetics, eradicate generic AI tropes,
  and enforce high-end visual product craft.
---

# Taste Skill: Anti-Generic AI UI/UX Design System

Enforces uncompromising taste, visual depth, and spatial sophistication. Eradicates cookie-cutter AI aesthetic tells.

## Core Directives

### 1. Eradicate Generic "AI Tells"
- **BANNED Fonts**: `Inter` as a default, Times New Roman, generic Garamond. Use characterful typography: `Plus Jakarta Sans`, `Geist`, `Cabinet Grotesk`, `Instrument Serif`, `JetBrains Mono`.
- **BANNED Grids**: The boring "3 equal cards horizontally" row is BANNED. Use asymmetric grids, 2-column zig-zag, or horizontal scroll bands.
- **BANNED Copywriting**: "Elevate", "Seamless", "Unleash", "Next-Gen", "Supercharge". Write specific, grounded domain copy.
- **BANNED UI Clutter**: Floating label badges on every card, fake technical pill labels, nested cards-inside-cards-inside-cards, bouncing scroll arrows.
- **BANNED Colors**: Pure `#000000` pitch black, `#00ff00` matrix neon green, arcade black-light purple. Use nuanced dark surfaces (`#080b11`, `#0f141f`, `#161e2e`) with specular highlights.

### 2. Spatial Discipline & Breathable Layouts
- **Section Rhythm**: A great interface never repeats the same container rhythm. Alternate between dense tabular controls, high-impact typography, and calm negative space.
- **Elevation Hierarchy**: Use 1px hairline borders (`rgba(255, 255, 255, 0.08)`) with inset specular highlights (`inset 0 1px 0 rgba(255, 255, 255, 0.10)`) rather than blurry drop-shadows.
- **Hero Cleanliness**: The hero must breathe. Max 1 primary CTA. Never stack 3 buttons together.

### 3. Tactile Feedback & Motion Physics
- **Spring Physics**: Use cubic spring curves (`cubic-bezier(0.16, 1, 0.3, 1)`) or spring parameters (`stiffness: 100, damping: 20`).
- **Tactile Feedback**: Active buttons subtly press down (`transform: translateY(1px)` or `scale(0.98)`).
- **Perpetual Micro-Interactions**: Active status nodes carry subtle harmonic breathing pulses, not erratic flashing.
