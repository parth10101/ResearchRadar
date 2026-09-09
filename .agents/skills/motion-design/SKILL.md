---
name: motion-design
description: >-
  Motion Sites AI design standards. Master physics-based spring animations, micro-interactions,
  staggered reveals, and performance-optimized UI transitions.
---

# Motion Design & Physics Standards (Motion Sites AI)

Rules for fluid, responsive, high-performance UI motion.

## Motion Principles

### 1. Physics Over Timing Curves
- Use **Spring Physics** over linear or ease-in-out curves.
- Recommended spring parameters: `stiffness: 100`, `damping: 20` (or `cubic-bezier(0.16, 1, 0.3, 1)`).
- Motion should feel weighty, settled, and organic.

### 2. Hardware-Accelerated Performance
- Animate **ONLY** `transform` and `opacity`.
- NEVER animate layout geometry: `top`, `left`, `width`, `height`, `margin`, `padding` trigger CPU reflows.
- Use `will-change: transform` sparingly on active animating surfaces.

### 3. Staggered Orchestration
- When mounting lists or grid cards, stagger the reveal with 40–60ms cascade delays.
- Avoid all elements popping onto the screen at once.

### 4. Interactive Tactility
- Hover: Elevate subtly (`transform: translateY(-2px)` with specular border brightening).
- Press/Active: Tactile depression (`transform: translateY(1px) scale(0.99)`).
- Interruptibility: Animations must respond instantly to user clicks mid-flight.
