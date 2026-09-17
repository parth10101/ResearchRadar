# ANTIGRAVITY — RESEARCHRADAR VISUAL DNA, INTERACTION & MOTION SYSTEM

## READ THIS BEFORE IMPLEMENTING ANY UI

This document defines the desired **conceptual design language** for ResearchRadar.

It is NOT a request to copy a particular website, screenshot, template, or existing product.

The objective is to make ResearchRadar feel like a **premium research-intelligence observatory**: a living visual environment in which papers, citations, relationships, trends, and scientific knowledge are explored.

The interface should feel like a combination of:

- scientific instrument
- research observatory
- intelligence dashboard
- information map
- deep-space / data environment
- editorial research publication
- sophisticated technical software

It should feel **purpose-built for research**, not like a generic SaaS dashboard.

---

# 1. FIRST PRINCIPLE: UNDERSTAND THE CONCEPT BEFORE CODING

Before changing any code:

1. Audit the entire existing project.
2. Understand the product's purpose and user journeys.
3. Understand what each page is trying to help the user accomplish.
4. Inspect the current design system, components, assets, typography, colors, routing, and animation architecture.
5. Inspect ALL relevant preinstalled/local Antigravity skills before implementation.
6. Use the relevant skills for UI/UX, visual design, frontend architecture, motion, accessibility, responsive design, and performance.
7. Do not blindly apply every skill; choose what improves this specific product.
8. Identify where the current interface feels generic, flat, overly boxed, or disconnected from the visual environment.
9. Create a visual/motion plan BEFORE implementing.

### Important

Do not immediately start generating components because a screenshot exists.

First ask:

> "What is ResearchRadar conceptually?"

The answer should influence the visual language.

ResearchRadar is not merely a collection of paper cards.

It is a system for **navigating a body of knowledge**.

Therefore the interface should communicate:
- discovery
- relationships
- scale
- depth
- scientific structure
- evidence
- connections
- exploration
- orientation
- movement through information

---

# 2. THE CORE VISUAL IDEA

The website should feel like a **living research environment**.

The background is not wallpaper.

The foreground cards are not independent objects placed over a background.

The entire interface should feel like these things belong to the same visual world.

Think:

```text
                    RESEARCH UNIVERSE

       background data / particles / scientific field
                         ↓
              large visual system
                         ↓
          ┌─────────────────────────┐
          │      RESEARCH UI        │
          │                         │
          │ papers / citations /    │
          │ relationships / data    │
          └─────────────────────────┘
                         ↓
                 information field
```

The UI should appear to be **embedded in the environment**.

This is the major change needed when the current boxes feel disconnected from a strong background.

---

# 3. CURRENT PROBLEM TO AVOID

A visually rich background with ordinary opaque cards on top creates this problem:

```text
BEAUTIFUL BACKGROUND
        +
┌─────────────────────┐
│ generic white/dark   │
│ rectangular card     │
└─────────────────────┘
```

The result looks like two unrelated designs.

Do NOT solve this by simply making the cards transparent.

Instead redesign the relationship between:

- background
- panels
- typography
- borders
- data
- motion
- depth
- cursor
- scrolling

The foreground should feel like an **instrument layer inside the environment**.

---

# 4. OVERALL VIBE

Target adjectives:

- scientific
- cinematic
- intelligent
- precise
- mysterious
- premium
- technical
- editorial
- immersive
- calm
- exploratory
- high-information but not cluttered
- futuristic without looking like generic "AI"

Avoid:

- generic SaaS
- startup-template aesthetics
- excessive rounded rectangles
- cartoonish futuristic effects
- neon cyberpunk overload
- random gradients
- excessive glassmorphism
- excessive glowing borders
- "AI-generated dashboard" appearance

The design should communicate **scientific credibility first, visual sophistication second**.

---

# 5. COLOR LANGUAGE

The current direction works well with a dark environment.

Build around a deep near-black / midnight base.

Suggested conceptual hierarchy:

### Base
Very dark:
- near-black
- midnight blue
- extremely deep violet-blue

### Environmental colors
Use restrained atmospheric variation:
- deep indigo
- muted blue
- dark violet
- subtle cosmic reds/browns where scientifically/visually appropriate

### Accent
Use a controlled warm accent for interaction and emphasis.

The existing orange accent can remain a signature color.

Use it for:
- active navigation
- selected states
- important labels
- key CTA
- small highlights
- cursor interaction
- important data points

Do NOT make the entire interface orange.

### Secondary scientific/data accent
A cool cyan/blue/teal can represent:
- links
- related research
- secondary information
- network relationships

The accent system should communicate hierarchy rather than decoration.

---

# 6. BACKGROUND SYSTEM

The background should be treated as an active visual system.

Potential layers:

### Layer 1 — Base atmosphere
Very subtle gradient / tonal field.

### Layer 2 — Nebula / atmospheric texture
Low-contrast, slow-moving shapes.

### Layer 3 — Scientific particle field
Small points representing:
- data
- observations
- knowledge nodes
- stars
- research entities

These should NOT look like random decorative confetti.

### Layer 4 — Main scientific visual
A large meaningful object/system:
- research network
- knowledge graph
- scientific visualization
- orbital system
- data structure
- domain-specific visualization

This should be the main environmental anchor.

### Layer 5 — UI
Research content sits within this environment.

---

# 7. THE BACKGROUND MUST MOVE

Do not create a static background behind animated cards.

The environment should respond to:
- scroll
- pointer movement
- page state
- selected paper/topic
- section transitions

Movement should be subtle and continuous.

For example:

Background:
very slow parallax

Particles:
tiny differential movement

Main visual:
larger scroll-driven transformation

UI:
smaller movement

Navigation:
almost anchored

This creates depth.

---

# 8. THE WEBSITE SHOULD FEEL LIKE ONE CONTINUOUS SCENE

The most important scrolling concept:

The user should feel like they are **moving through a research environment**, not scrolling past unrelated HTML sections.

Do not think:

```text
Hero
↓
Feature section
↓
Card grid
↓
Statistics
↓
Footer
```

Think:

```text
ONE RESEARCH ENVIRONMENT

camera/view changes
↓
knowledge visual evolves
↓
research content emerges
↓
relationships become visible
↓
information transforms
↓
camera continues
↓
next concept is revealed
```

The page may contain normal semantic sections, but visually they should share a continuous environment.

---

# 9. HOW TO CREATE THE "NOT REALLY SCROLLING" FEEL

A conventional page makes the user feel:

> "I am moving down."

The desired experience should feel closer to:

> "I am moving through the interface."

This can be achieved with:

- sticky/pinned visual scenes
- scroll-progress-driven transforms
- persistent environmental layers
- camera-like movement
- changing scale
- changing crop
- parallax
- crossfading content
- objects entering/exiting from spatial positions
- persistent visual anchors

A cinematic section can have a tall scroll range while its visual viewport remains pinned.

The scroll position becomes a **timeline controlling the scene**.

---

# 10. SCROLL CHOREOGRAPHY

For major cinematic sections, use this conceptual sequence:

### 0–15% — ESTABLISH

The scene is stable.

User understands:
- where they are
- what the section means
- what the main visual represents

Do not animate immediately just because the user arrived.

---

### 15–35% — APPROACH

The main visual begins changing.

Possible effects:
- scale
- translation
- subtle rotation
- perspective
- crop
- parallax

Supporting content begins responding.

---

### 35–55% — TRANSFORM

The current concept starts transitioning into the next.

Old content:
- moves
- fades
- changes scale

New content:
- begins entering

Background:
- continues moving

There should be no blank transition.

---

### 55–75% — REVEAL

The new concept becomes dominant.

The environment may reveal:
- related papers
- network relationships
- metrics
- topic information
- visual data

---

### 75–90% — SETTLE

Let the user actually read.

Do not continuously animate.

The scene should have a readability window.

---

### 90–100% — HANDOFF

Begin transitioning toward the next scene.

Use visual continuity.

---

# 11. SCROLLING SHOULD BE REVERSIBLE

Scrolling upward should naturally reverse the visual journey.

If the user scrolls back:

- objects return
- text returns
- background reverses
- cards retreat
- camera pulls back

Avoid one-way entrance animations that look broken when reversed.

Scroll-linked animation should be deterministic where possible.

---

# 12. TRANSITIONS

Use **overlapping transitions**, not sequential replacement.

Bad:

```text
old section
↓
fade out
↓
blank
↓
new section
↓
fade in
```

Good:

```text
old scene leaves
        +
new scene enters
        +
background continues
        +
camera continues
```

This produces continuity.

---

# 13. UI PANELS SHOULD FEEL LIKE INSTRUMENTS

The left-side research panel shown in the reference screenshot demonstrates the key issue: the content is useful, but the heavy rectangular box can overpower the environment.

Do not simply reproduce that panel more beautifully.

Reconsider the **entire panel language**.

A research paper should feel like an **information instrument**, not a generic card.

Possible treatment:

- translucent dark surface
- very subtle border
- environmental background subtly visible
- selective separators
- typography doing most of the structure
- small metadata labels
- accent markers
- edge lighting only where useful
- carefully controlled shadows

Use panels only where a surface is genuinely needed.

---

# 14. REDUCE THE "BOX WITHIN BOX" PROBLEM

Avoid:

```text
CARD
 ├── badge
 ├── title
 ├── metadata
 ├── CARD
 │    └── summary
 ├── buttons
 └── another card
```

This creates visual heaviness.

Instead use **typographic hierarchy and spatial grouping**.

For example:

```text
FRONTIER                     1 CITATION · 10 REFERENCES

Large paper title

Author · Year
Journal

────────────────────────────

EXECUTIVE SUMMARY

Summary text...

OPEN DOI     COPY
```

The hierarchy can be created with:
- spacing
- type scale
- subtle rules
- alignment
- accent markers

rather than nested containers.

---

# 15. PAPER / RESEARCH CARD DESIGN

A research item should have:

### Primary
- title
- relevance/status

### Secondary
- authors
- year
- journal/source

### Tertiary
- citation count
- references
- tags

### Optional
- executive summary
- relationship information
- DOI
- actions

The title should be visually dominant.

Metadata should feel technical and compact.

Use monospace or tabular-feeling typography selectively for:
- numbers
- IDs
- counts
- technical metadata

Do not make the whole interface monospace.

---

# 16. TYPOGRAPHY SYSTEM

Typography should combine:

### Primary UI / editorial font
Use a modern neutral sans with excellent screen readability.

Good conceptual direction:
- Inter
- Geist
- similar contemporary grotesk

First inspect the project's existing font setup and use it if appropriate.

Do not randomly introduce multiple fonts.

### Technical font
A monospace font can be used selectively for:
- citations
- numeric counters
- paper IDs
- metadata
- technical labels
- navigation indices

This creates a scientific/instrument feeling.

### Headings
Large, confident, compact.

Avoid excessive giant text.

### Body
Readable and calm.

### Labels
Small, uppercase or compact where appropriate.

Do not turn every piece of text into uppercase.

---

# 17. TYPOGRAPHIC MOTION

Typography should not simply fade in.

Possible behavior:

- title subtly moves with the camera
- metadata appears slightly after title
- summary enters after the title has settled
- old title shifts out as new title enters
- selected words can transition color
- numeric values can count/change when the scene changes

The motion should reinforce hierarchy.

---

# 18. NAVIGATION

Navigation should feel like the control panel of an observatory.

Keep it:
- compact
- technically precise
- visually restrained

Useful concepts:
- numbered sections
- active topic
- current research domain
- subtle progress indicator
- compact search/filter controls

Avoid turning the navbar into a giant collection of pills.

Active states can use the warm accent.

---

# 19. CURSOR DESIGN

The cursor should contribute to the experience.

Do not use a giant trendy circle cursor simply because it looks futuristic.

A better direction:

### Default cursor
Small, precise pointer/crosshair-like indicator.

### Over interactive elements
It can:
- expand slightly
- change accent
- show a subtle ring
- reveal a tiny interaction cue

### Over research nodes / visualizations
The cursor could become:
- a crosshair
- focus reticle
- small data probe

### Over draggable/interactive visualizations
Indicate the interaction subtly.

Potentially use a very subtle trailing effect, but only if performance and usability remain excellent.

The cursor should feel like a **research instrument**, not a decorative animation.

Always preserve usability and native cursor behavior where appropriate.

On touch devices, remove cursor-specific effects.

---

# 20. HOVER INTERACTIONS

Hover should reveal information, not just make things glow.

For a research item:
- subtle elevation
- accent line
- title color shift
- related nodes highlight
- connected papers may subtly illuminate

For a visualization node:
- node enlarges slightly
- nearby connections become more visible
- metadata appears

For a button:
- tiny lift
- subtle brightness
- restrained border/accent response

Avoid:
- giant scale
- bouncing
- excessive glow
- random gradients

---

# 21. RESEARCH GRAPH / VISUALIZATION INTERACTION

If the project uses a knowledge graph or related-paper visualization, this should become a major opportunity for meaningful interaction.

When hovering a paper/node:

1. Highlight the selected node.
2. Slightly increase its visual weight.
3. Highlight directly related nodes.
4. Reduce unrelated nodes slightly.
5. Emphasize connecting edges.
6. Reveal concise metadata.
7. Keep the rest of the environment visible.

This communicates:

> "This paper exists within a network of knowledge."

rather than:

> "This is another isolated card."

---

# 22. ELEMENT TRANSITIONS

When changing between papers/topics:

Avoid replacing the entire card.

Instead use **shared visual continuity**.

For example:

Current title
→ transforms/repositions
→ next title

Current paper metadata
→ updates in place

Current graph node
→ remains anchored
→ connected network changes around it

Current background
→ continues moving

Current accent indicator
→ slides to the new location

This creates a sophisticated interface because the user sees the **state changing**, rather than seeing one DOM tree disappear and another appear.

---

# 23. SHARED-ELEMENT TRANSITIONS

Where possible, visually connect the same concept across states.

Examples:

- paper title stays spatially anchored while content changes
- selected node remains in the same location
- a citation count changes rather than being replaced
- an accent marker travels between categories
- an image/visual expands into the next state
- a relationship line continues into the next section

This is much better than independent entrance animations.

---

# 24. BACKGROUND ↔ FOREGROUND RELATIONSHIP

The background should occasionally interact visually with the UI.

Examples:

- particles subtly pass behind a translucent panel
- a network line appears to continue behind content
- the main visualization extends beyond panel boundaries
- visual objects are clipped by the viewport rather than contained in cards
- background lighting subtly reacts to selected content

Do this carefully.

The content must remain readable.

---

# 25. DEPTH

Create at least three perceived depth planes:

### FAR
Atmosphere / particles

### MID
Main scientific visualization

### NEAR
Research UI / selected information

The layers should move at different rates.

This creates a camera illusion.

---

# 26. SPATIAL COMPOSITION

Do not center every element.

Use:
- asymmetry
- large negative space
- edge-to-edge visuals
- off-center objects
- intentional overlap

A large scientific visualization may occupy 60–70% of the viewport while the research interface occupies the remaining visual space.

But do not hard-code this percentage everywhere.

Composition should respond to content.

---

# 27. VISUAL HIERARCHY

At any moment, the user should know:

1. What am I looking at?
2. What is important?
3. What can I interact with?
4. Where am I in the research system?
5. What can I do next?

Do not allow cinematic effects to reduce clarity.

---

# 28. MOTION LANGUAGE

Establish one consistent motion language across the product.

### Small interaction
150–250ms

### Standard transition
250–450ms

### Large scene transformation
400–900ms or scroll-progress-controlled

Use smooth easing.

Avoid everything using the exact same duration.

Motion should have:
- acceleration
- movement
- settling

Not robotic linear interpolation.

---

# 29. DO NOT ANIMATE EVERYTHING

A premium interface has contrast between motion and stillness.

Some elements should remain stable.

Use motion primarily for:
- navigation feedback
- state changes
- scene transitions
- hierarchy
- spatial relationships
- discovery

Static elements provide visual anchors.

---

# 30. LOADING / DATA STATES

Because ResearchRadar is information-heavy, loading states should belong to the visual language.

Avoid generic skeleton rectangles everywhere.

Consider:
- subtle data scanning
- progressive node appearance
- small status indicators
- restrained shimmer only where appropriate
- incremental content revelation

The loading state should feel like the observatory is **acquiring research data**.

But never make users wait unnecessarily for decorative animation.

---

# 31. SEARCH / FILTER INTERACTION

Search and filtering should feel like manipulating a research instrument.

When a filter changes:

Do not simply refresh a grid.

Instead:
- relevant nodes/papers remain
- irrelevant items recede
- relationships update
- counts change
- selected filter state moves smoothly
- background/visualization responds subtly

The user should understand that the **research landscape has changed**.

---

# 32. PAGE-TO-PAGE TRANSITIONS

If the application has multiple routes/pages, transitions should preserve the visual world.

Avoid:

```text
Page A
↓
hard white/black flash
↓
Page B
```

Prefer:
- persistent environment
- crossfade
- spatial transition
- shared visual anchor
- directional movement related to navigation

However, do not add elaborate route transitions if they harm speed.

---

# 33. PERFORMANCE

This style can become expensive.

Prioritize:
- transform
- opacity
- efficient canvas/WebGL if genuinely needed
- optimized assets
- lazy loading
- limited particle counts
- controlled blur
- requestAnimationFrame where appropriate
- efficient event handling

Avoid animating:
- width
- height
- top
- left

continuously when transforms can achieve the same result.

Do not introduce WebGL merely because it sounds impressive.

Use it when the project's visual concept genuinely benefits from it.

---

# 34. ACCESSIBILITY

The cinematic layer must never compromise:

- keyboard navigation
- focus states
- readable text
- contrast
- screen-reader semantics
- touch accessibility

Respect:

`prefers-reduced-motion`

With reduced motion:
- minimize camera movement
- remove excessive parallax
- simplify transitions
- preserve the same information architecture

---

# 35. RESPONSIVE DESIGN

Do not simply stack desktop cards on mobile.

The visual system should adapt.

### Desktop
Richest cinematic composition.

### Tablet
Reduce simultaneous layers.

### Mobile
Prioritize:
- readable content
- clear hierarchy
- one main visual focal point
- simplified motion
- touch-friendly interactions

Cursor effects disappear on touch.

Avoid horizontal overflow.

---

# 36. DESIGN SYSTEM RULES

Create reusable tokens for:

- background
- surface
- elevated surface
- border
- primary text
- secondary text
- accent
- data accent
- spacing
- radius
- shadow
- blur
- motion duration
- easing

Do not introduce random values throughout the code.

The visual system should feel intentional.

---

# 37. WHAT NOT TO DO

Never respond to this brief by generating a generic:

```text
Hero
↓
3 feature cards
↓
3 statistics
↓
testimonials
↓
CTA
↓
footer
```

unless the product's information architecture genuinely requires those things.

Do not add sections just because "modern landing pages" have them.

Do not use:
- generic blob gradients
- generic 3D cubes
- random orbiting spheres
- meaningless particles
- arbitrary glass cards
- excessive neon
- random floating labels
- fake technical jargon
- decorative graphs with no informational purpose

Every visual should belong to the research concept.

---

# 38. THE MOST IMPORTANT ANTI-SLOP RULE

If an element could appear unchanged on:
- a crypto website
- an AI startup
- a SaaS landing page
- a developer tool
- a fintech dashboard

then question whether it belongs in ResearchRadar.

ResearchRadar should have its own visual vocabulary.

The strongest differentiator should be:

> **research knowledge behaving like a navigable visual environment.**

---

# 39. IMPLEMENTATION WORKFLOW

### PHASE 1 — UNDERSTAND
Read this entire document.

Inspect the project.

Inspect available skills.

Understand the product.

### PHASE 2 — AUDIT
Identify:
- strongest existing components
- weakest visual areas
- existing animation infrastructure
- assets that can become environmental visuals
- sections that can become cinematic
- sections that should remain calm

### PHASE 3 — CONCEPT
Define:
- visual world
- depth layers
- motion language
- typography
- panel language
- cursor behavior
- scroll choreography

### PHASE 4 — PROTOTYPE
Implement ONE representative cinematic section first.

Do not redesign the whole application immediately.

Evaluate:
- does the background feel alive?
- do panels belong to the environment?
- does scrolling feel like movement through a scene?
- does the content remain readable?
- does it feel like ResearchRadar?

### PHASE 5 — EXTEND
Once the visual language works, propagate the system through the appropriate pages.

Do not duplicate animations mechanically.

Adapt them to the content.

### PHASE 6 — POLISH
Use the relevant installed skills to inspect:
- visual hierarchy
- spacing
- motion
- accessibility
- performance
- responsive behavior
- code quality

Then refine.

---

# 40. FINAL MENTAL MODEL

Do not think:

> "I need to make the cards prettier."

Think:

> "I need to redesign the relationship between the research information and the visual world."

Do not think:

> "I need scroll animations."

Think:

> "Scrolling is the camera/navigation mechanism through the research environment."

Do not think:

> "I need a futuristic cursor."

Think:

> "The cursor is the user's research instrument."

Do not think:

> "I need a cool background."

Think:

> "The background represents the living research universe."

Do not think:

> "I need glassmorphism."

Think:

> "Information surfaces should feel embedded in the environment."

Do not think:

> "I need animations everywhere."

Think:

> "Motion should communicate state, hierarchy, relationships and discovery."

---

# 41. FINAL QUALITY TEST

After implementation, stop and view the page without looking at the code.

Ask:

### Visual
Does the interface feel like one coherent world?

### Content
Does the UI communicate research intelligence?

### Background
Does the environment feel alive rather than decorative?

### Panels
Do the panels belong to the environment rather than sitting on top of it?

### Scroll
Does scrolling feel like moving through a scene?

### Motion
Are transitions meaningful?

### Cursor
Does it feel like a research instrument rather than a trendy effect?

### Typography
Does it feel editorial + scientific?

### Interaction
Do hover and selection states reveal relationships?

### Originality
Could this design be mistaken for a generic AI/SaaS template?

If yes, keep refining.

---

# 42. NON-NEGOTIABLE PRINCIPLE

Build an **original ResearchRadar experience**.

Use this document as the project's visual and interaction DNA.

Use the project's actual content and subject matter to determine:
- imagery
- visual metaphors
- layouts
- interactions
- data visualization
- motion

Use the preinstalled Antigravity skills to improve implementation quality.

Do not copy a reference website.

Do not blindly reproduce patterns.

Do not chase effects.

Create a product where:

> **the interface feels like a living observatory for navigating knowledge.**

That is the design target.
