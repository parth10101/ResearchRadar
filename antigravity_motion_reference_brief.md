# ANTIGRAVITY — CINEMATIC UI / SCROLL / MOTION REFERENCE BRIEF

## 0. PURPOSE

Use the supplied **DNA-helix reference video and its single contact sheet** as a detailed reference for the project's webpage **motion language, scrolling behavior, visual depth, transitions, composition, and interaction design**.

### CRITICAL — DO NOT COPY THE DNA HELIX WEBSITE

The DNA-helix video is a **reference for design principles**, not a template.

Do NOT:
- copy the DNA helix itself
- copy its exact imagery
- copy its text
- copy its logo/branding
- copy its exact layout
- copy its exact cards
- copy its exact colors
- recreate its page as a clone

Instead, extract the **underlying interaction and visual concepts** and translate them into visual effects and metaphors that are genuinely relevant to OUR project.

If our project has a different subject, its hero visual should represent OUR subject. The DNA reference should influence **how that visual behaves**, not what the visual literally is.

The target is:

> **same level of cinematic motion sophistication, but a distinctly original website built around our project's identity and content.**

---

# 1. FIRST: AUDIT THE EXISTING PROJECT AND AVAILABLE SKILLS

Before writing or changing code:

### Inspect the project
Understand:
- framework
- routing
- existing pages
- component structure
- design tokens
- CSS architecture
- typography
- colors
- assets
- current animation libraries
- responsive behavior
- accessibility
- performance constraints
- existing reusable components

Do not replace a good existing system just to introduce a new style.

### Inspect the locally available / preinstalled Antigravity skills

Read and use the relevant available skills for:
- frontend development
- UI/UX design
- interaction design
- animation / motion
- visual design quality
- accessibility
- responsive design
- performance
- component architecture

Use the skills to **raise implementation quality and avoid AI-generated design slop**.

Do not blindly apply every skill. Select the ones relevant to this project.

Before implementation, form a short internal plan:

1. What is already good?
2. What should remain?
3. Which sections benefit from cinematic scrolling?
4. What is the project's own visual metaphor?
5. Which reference techniques should be translated?
6. Which reference techniques should NOT be used because they do not fit the project?

---

# 2. THE MOST IMPORTANT OBSERVATION: THIS FEELS LIKE ONE CONTINUOUS SCENE

The DNA reference does NOT primarily feel like a normal webpage made of independent sections.

Although the user is technically scrolling down a page, the visual experience feels more like:

> **one continuous camera journey through a single environment.**

This is the central concept to reproduce.

The user should NOT mentally experience:

`Hero → Section 2 → Section 3 → Section 4 → Footer`

Instead they should experience something closer to:

`ONE SCENE → CAMERA MOVES → CONTENT TRANSFORMS → CAMERA MOVES → NEW CONTENT EMERGES → CAMERA MOVES → SCENE RESOLVES`

The webpage can still contain normal semantic sections underneath. The **presentation layer**, however, should make those sections feel visually connected.

---

# 3. WHY IT DOES NOT FEEL LIKE "SCROLLING DOWN"

This is especially important.

The reference avoids making the user feel that the entire page is physically moving upward past them.

A conventional website behaves like:

```text
[Hero]
   ↓
[Section]
   ↓
[Cards]
   ↓
[Footer]
```

As the user scrolls, the previous section moves out of the viewport and another section replaces it.

The reference instead behaves more like a **camera moving through a scene**.

Conceptually:

```text
                 CAMERA
                   ↓
        ┌─────────────────────┐
        │     SAME WORLD       │
        │                     │
        │   LARGE VISUAL      │
        │       ↕             │
        │   TEXT / CONTENT    │
        │       ↕             │
        │   BACKGROUND        │
        └─────────────────────┘
                   ↓
              CAMERA MOVES
                   ↓
        SAME WORLD, NEW VIEW
```

The environment persists.

The background does not simply disappear and get replaced.

The primary visual changes **position, scale, crop, depth and perspective**.

Content layers enter and leave the scene.

This is what creates the illusion of a continuous experience.

---

# 4. THE DNA REFERENCE — CONTACT SHEET EXPLAINED

The contact sheet contains representative states from the approximately 13.8-second reference:

1. **0.0s**
2. **1.8s**
3. **2.7s**
4. **3.7s**
5. **4.6s**
6. **5.5s**
7. **6.4s**
8. **7.3s**
9. **8.2s**
10. **9.1s**
11. **10.0s**
12. **11.0s**
13. **11.9s**
14. **12.8s**
15. **13.7s**

These frames should be treated as **visual states along one continuous motion sequence**, not 15 separate screens.

## STATE 01 — 0.0s — INITIAL HERO

The DNA structure is visible as a large environmental object extending diagonally through the scene.

Important characteristics:

- dark blue/black atmospheric background
- large visual object
- object is not centered like a conventional hero illustration
- composition uses significant negative space
- navigation stays near the top and visually quiet
- headline sits over the environment
- CTA is small and restrained
- visual extends beyond the viewport
- object feels physically large

### Important lesson

Do not put the hero artwork inside a normal rectangular "image box".

The visual should feel like it **occupies the world behind the interface**.

---

# STATE 02 — 1.8s — HERO VISUAL ADVANCES

The main DNA object has moved substantially.

The visual occupies a different part of the viewport.

It becomes larger/more prominent relative to the initial state.

The camera/viewpoint appears to have advanced along the object.

The text remains part of the scene rather than the whole page moving as one rigid block.

### Key principle

The **visual moves more than the UI chrome**.

Navigation remains comparatively stable.

This difference in movement is what establishes depth.

---

# STATE 03 — 2.7s — TRANSITION INTO THE NEXT MESSAGE

The DNA structure is now much closer to the viewer.

A different part of the structure dominates the frame.

The previous hero message is leaving while the next message begins to appear.

There is no obvious hard cut.

The background remains part of the same environment.

### Important transition pattern

```text
OLD TEXT
   ↓ opacity / position
   leaving

        +

NEW TEXT
   ↓ opacity / position
   entering

        +

SAME VISUAL WORLD
   ↓
changes crop / scale / position
```

This overlap is crucial.

---

# STATE 04 — 3.7s — SECOND MESSAGE BECOMES DOMINANT

The large visual is now a close-up.

The typography has moved to a new position and a new message is dominant.

Notice that the page does not need to completely change its background.

Instead, the **camera framing changes**.

The visual can therefore communicate:

> "We are still in the same place, but we are looking at it differently."

For OUR project, identify an equivalent visual "world" and allow the camera to move through it.

---

# STATE 05 — 4.6s — EXTREME CLOSE-UP / VISUAL TRANSITION

The primary visual becomes extremely large.

Individual components/details of the object dominate the viewport.

This is not merely a zoom animation.

It creates a feeling of moving **through** the visual.

Use:
- scale
- translation
- crop
- object-position
- depth/parallax
- subtle rotation where useful

The user should feel proximity increasing.

### Do not interpret this as:

`image scale: 1 → 1.5`

Interpret it as:

`camera position changes relative to a large visual environment`.

---

# STATE 06 — 5.5s — INFORMATION SURFACES EMERGE

Floating information/statistic cards become visible over the moving environment.

Important:

The background visual does NOT stop being important.

The cards are layered into the scene.

They appear like information floating **inside the environment**, rather than ordinary dashboard cards sitting on a blank page.

Characteristics:
- translucent/dark surfaces
- subtle borders
- restrained glow/reflection
- strong text hierarchy
- background remains visible
- cards occupy a relatively compact area
- visual remains active behind them

### For OUR project

If our content contains statistics, features, metrics or concise facts, use this concept.

Do not automatically create cards if the content does not justify them.

---

# STATE 07 — 6.4s — INFORMATION / MESSAGE SECTION

The experience transitions toward a central message and input/CTA area.

The environment continues behind it.

The footer/navigation information begins to become visible around the lower area.

This is a major lesson:

### The page content is being layered INTO the environment.

The environment is not being removed to display the content.

---

# STATE 08 — 7.3s — SAME SCENE, DIFFERENT COMPOSITION

The background visual has continued moving.

The central content remains readable.

The footer/information architecture is becoming clearer.

The page feels like one composition even though the content has changed significantly.

This is achieved through:
- persistent background atmosphere
- continued movement
- consistent typography
- consistent spatial relationships
- overlapping transitions
- stable navigation

---

# STATE 09 — 8.2s — BACKGROUND CONTINUES TO EVOLVE

The user is still looking at essentially the same visual environment.

The DNA object has shifted.

Its position/crop has changed.

The foreground/background relationship has changed.

The content stays visually anchored enough that the user does not feel lost.

### Key lesson

The background should have its own motion timeline.

Do NOT animate only the text.

If text animates while the background is frozen, the experience immediately becomes a generic website with scroll reveals.

---

# STATE 10 — 9.1s — CONTINUATION / HOLD

The composition settles temporarily.

This is important.

Cinematic interfaces need **breathing room**.

Not every millisecond should introduce a new effect.

Allow some states to hold long enough for the user to understand the content.

Motion should have:
- acceleration
- transformation
- settling
- readability window

---

# STATE 11 — 10.0s — INFORMATION LAYER RETURNS

The floating statistic/information treatment becomes prominent again.

This reinforces that the reference is not simply a linear list of sections.

Visual motifs can reappear as the camera moves through the environment.

For OUR project, a visual element can similarly be revisited or transformed rather than discarded after one section.

This can create a sense of narrative continuity.

---

# STATE 12 — 11.0s — CLOSE-UP AGAIN

The scene transitions back toward a close-up of the main visual.

Again, the environment changes framing rather than simply being replaced.

The user feels as though the camera has moved back toward another part of the same world.

---

# STATE 13 — 11.9s — CLOSE-UP MESSAGE

A previous visual/message relationship returns.

The scene has effectively come full circle.

The large visual remains continuous.

The typography reappears in a related spatial relationship.

This demonstrates a valuable principle:

### A scroll experience can be cyclical in visual motifs even when the page is linear in content.

---

# STATE 14 — 12.8s — RETURN TOWARD HERO

The camera/view pulls back.

The DNA structure becomes more recognizable as a whole.

The composition starts resembling the original hero state.

This creates a strong sense of resolution.

---

# STATE 15 — 13.7s — HERO / RESOLUTION

The scene reaches a composition close to the original.

The large visual again occupies the environment.

The initial headline is dominant.

The experience feels complete rather than like the user simply reached another rectangular section.

### Important lesson

The end state should feel like a **designed destination**, not an accidental stopping point.

---

# 5. THE BACKGROUND IS A CHARACTER, NOT WALLPAPER

One of the biggest mistakes to avoid is treating the background as static decoration.

In the reference, the large visual environment is effectively a second protagonist.

It changes:
- scale
- position
- crop
- perspective
- depth
- visible details
- lighting relationships
- foreground/background balance

while the UI content changes above it.

For OUR project, find an equivalent visual system.

Examples:

If the project is about:
- AI → abstract computational/network/agent visual environment
- cybersecurity → evolving network/security environment
- research → scientific/data visualization environment
- finance → dynamic data/market environment
- education → knowledge/diagram environment
- robotics → mechanical/robotic environment

These are examples only. Choose something actually relevant to the project.

---

# 6. THE "CAMERA JOURNEY" MODEL

Think about the entire experience as a camera timeline.

Instead of implementing:

```text
Section 1 animation
Section 2 animation
Section 3 animation
```

design:

```text
SCROLL PROGRESS

0%       15%       30%       45%       60%       75%       90%      100%
│---------│---------│---------│---------│---------│---------│---------│

CAMERA
wide ─────→ approach ─────→ close ─────→ pass through ─────→ pull back

VISUAL
hero ─────→ detail ─────→ extreme close-up ─────→ alternate view ───→ hero

TEXT
message A ─────→ exit
                    message B ─────→ exit
                                  message C ─────→ hold

INFO
                         cards enter ─────→ hold ─────→ leave

BACKGROUND
continuous movement throughout
```

The exact percentages should be tuned to the project.

The principle is what matters.

---

# 7. HOW TO IMPLEMENT "ONE PAGE" WITHOUT MAKING IT FEEL LIKE ONE LONG PAGE

A useful implementation strategy is:

### Semantic page structure

Keep normal sections for:
- accessibility
- SEO
- responsive layout
- navigation
- content structure

But for the cinematic portions, use a **pinned/sticky viewport scene**.

Conceptually:

```text
PAGE
│
├── Hero cinematic section
│      └── sticky viewport
│            ├── background
│            ├── primary visual
│            ├── text layer
│            └── UI layer
│
├── transition
│
├── next cinematic section
│      └── sticky viewport / continued scene
│
├── normal content where appropriate
│
└── footer
```

The sticky viewport can remain fixed while the user's scroll position advances through a longer scroll range.

The visible scene changes according to **scroll progress**.

This is how you create:

> scrolling as a timeline

rather than:

> scrolling as physical page movement.

---

# 8. DO NOT OVERUSE SCROLL-JACKING

The user should still feel in control.

Prefer:
- normal browser scrolling
- sticky/pinned cinematic regions
- scroll-linked transforms
- progressive transitions

Avoid:
- forcing the browser into aggressive custom scrolling
- fighting the user's wheel/touch input
- trapping the user unnecessarily
- snapping between states unless genuinely useful

If the user scrolls slowly, the animation should progress slowly.

If they scroll quickly, the scene should move naturally toward the corresponding state.

If they scroll backward, the animation should reverse naturally.

---

# 9. TEXT IS PART OF THE SCENE

Text should not behave like independent HTML blocks being revealed by IntersectionObserver.

Avoid the generic:

```text
opacity: 0
translateY(40px)

↓ scroll

opacity: 1
translateY(0)
```

on every section.

Instead, text should have a relationship with the camera.

Possible behavior:

- text enters as the camera approaches a visual
- text shifts slightly as the visual passes
- old text fades while moving away
- new text emerges from another spatial position
- text remains anchored while the environment moves around it

This makes the typography feel integrated with the environment.

---

# 10. BACKGROUND + FOREGROUND MOTION HIERARCHY

Use different movement amplitudes.

### Background atmosphere
Very slow:
- subtle scale
- subtle translation
- lighting variation
- low-frequency movement

### Main visual
Strongest:
- scale
- translation
- crop
- depth
- perspective

### Text
Moderate/subtle:
- position
- opacity
- perhaps slight scale

### Cards
Moderate:
- translate
- scale
- opacity

### Navigation
Minimal:
- nearly fixed

This produces a convincing depth hierarchy.

---

# 11. TRANSITION CHOREOGRAPHY

For each major transition, think in four phases:

### A. APPROACH
The camera begins moving toward the next visual state.

### B. OVERLAP
Old content begins leaving while new content begins entering.

### C. DOMINANCE
New content becomes the primary focus.

### D. SETTLE
The scene holds long enough to be understood.

Then repeat.

Avoid:
`exit → blank → enter`

Prefer:
`exit + enter + continuous background movement`

---

# 12. VISUAL CONTINUITY BETWEEN SECTIONS

A transition should preserve at least one visual continuity anchor.

Examples:
- same background world
- same large visual
- same lighting direction
- same color atmosphere
- same spatial axis
- an object moving from one section into another
- a line/path continuing across states
- a particle system continuing
- a shape morphing into another element

This is how separate content sections become one experience.

---

# 13. DEPTH THROUGH OCCLUSION AND SCALE

The reference often feels 3D because objects overlap and pass close to the camera.

For OUR implementation, consider:
- foreground elements crossing behind/around text
- large objects partially leaving the viewport
- objects entering from off-screen
- depth-based blur used sparingly
- different scale rates
- clipping/masking

A visual does not need to be fully visible to communicate its scale.

In fact, **cropping a large object can make it feel more immersive** than displaying the entire object.

---

# 14. DO NOT CENTER EVERYTHING

The reference uses spatial composition rather than placing every object in the middle.

For OUR project:
- allow large visuals to extend beyond viewport edges
- use negative space intentionally
- position text based on the visual composition
- vary alignment when content changes
- use asymmetry when it improves hierarchy

Do not turn every section into:

```text
headline
paragraph
button
3 cards
```

centered in the viewport.

That is a common AI-generated pattern.

---

# 15. GLASS / FLOATING INFORMATION

Use the floating-card idea only when appropriate.

Characteristics:
- translucent dark surface
- subtle border
- controlled blur
- soft shadow
- high readability
- compact information hierarchy

Avoid:
- excessive glassmorphism
- giant rounded cards
- glowing borders
- random blur
- cards floating for no reason

The card should appear because the **content needs a surface**, not because the design needs decoration.

---

# 16. MOTION SHOULD HAVE MEANING

Every significant animation should answer one of these:

- What is the user discovering?
- What is changing?
- What is becoming important?
- What is connected to what?
- Where is the user's attention being guided?
- Does this movement communicate depth?
- Does it establish continuity?

If the answer is "it just looks cool", reconsider it.

---

# 17. AVOID GENERIC AI-GENERATED UI / "AI SLOP"

The following patterns should be treated as warning signs:

- endless pill-shaped buttons
- excessive rounded cards
- random gradient blobs
- purple/blue AI gradients by default
- glowing outlines everywhere
- excessive glassmorphism
- floating badges with no purpose
- meaningless dots
- random decorative lines
- generic 3-column feature grids
- repeated fade-up animations
- every section looking structurally identical
- arbitrary huge headings
- excessive whitespace with no composition
- fake 3D elements that have no relationship to content
- unnecessary animation on every component
- stock-looking illustrations
- template-like SaaS layouts

The site should feel **designed**, not generated.

Prefer:
- deliberate composition
- project-specific visual metaphors
- varied but coherent layouts
- strong editorial hierarchy
- intentional asymmetry
- meaningful motion
- restrained decoration
- real content hierarchy
- custom visual systems

---

# 18. USE THE REFERENCE'S PRINCIPLES, NOT ITS SURFACE

For every reference technique, ask:

### Reference technique
"Large DNA object moves toward camera."

### OUR translation
"What is the equivalent large visual object in our project?"

---

### Reference technique
"Statistics float over the environment."

### OUR translation
"What important project information could naturally inhabit the visual environment?"

---

### Reference technique
"Close-up reveals details."

### OUR translation
"What part of our product/system can become visually interesting when explored closely?"

---

### Reference technique
"Camera pulls back to reveal whole object."

### OUR translation
"What broader project concept can be revealed after the user explores its details?"

This translation step is essential.

---

# 19. PERFORMANCE

Keep the cinematic experience smooth.

Prefer GPU-friendly properties:
- transform
- opacity

Be cautious with:
- continuously animated filters
- expensive blur
- layout-triggering animations
- excessive DOM complexity
- giant unoptimized assets

Use:
- lazy loading
- optimized images/video
- sensible asset sizes
- reusable animation primitives

If WebGL / canvas / video is appropriate, use it only when it materially improves the experience.

Do not introduce heavy technology simply to imitate a visual effect.

Respect:

`prefers-reduced-motion`

When reduced motion is requested:
- remove large camera movements
- reduce parallax
- simplify transitions
- preserve content hierarchy

---

# 20. RESPONSIVE MOTION

Desktop can support the richest cinematic composition.

Mobile should be intentionally adapted.

Do NOT simply scale the desktop scene down.

On mobile:
- simplify the camera path
- reduce object scale where necessary
- preserve the focal visual
- reduce simultaneous layers
- maintain readable text
- ensure CTA accessibility
- prevent horizontal overflow

The core idea should survive:

**continuous visual journey + meaningful motion + depth**

even if the implementation becomes simpler.

---

# 21. NAVIGATION

Navigation should feel anchored to the interface while the world moves beneath it.

Keep it:
- compact
- readable
- quiet
- consistent

Do not let cinematic motion destroy navigation usability.

If needed:
- use a subtle translucent background
- use backdrop blur sparingly
- preserve contrast
- maintain keyboard focus states

---

# 22. IMPLEMENTATION ARCHITECTURE

Prefer a reusable motion system.

Potential primitives:

- `CinematicSection`
- `ScrollScene`
- `SceneLayer`
- `ParallaxLayer`
- `ScrollText`
- `SceneTransition`
- `FloatingInfo`
- `MotionButton`

Names are examples; follow the project's architecture.

The goal is to create a coherent motion system rather than hundreds of unrelated animation snippets.

Centralize:
- easing
- durations
- scroll progress mapping
- motion intensity
- responsive adjustments

This makes the experience tunable.

---

# 23. TESTING THE EXPERIENCE

Test all of these:

### Scroll
- very slow scrolling
- normal scrolling
- fast scrolling
- trackpad scrolling
- mouse wheel
- touch scrolling
- reverse scrolling

### Visual
- different desktop widths
- tablet
- mobile
- high-DPI screens

### Accessibility
- keyboard navigation
- focus visibility
- reduced motion
- readable contrast

### Technical
- page refresh
- direct URL navigation
- slow network
- asset loading
- animation performance

Most importantly:

**Watch the site as a user, not as a developer.**

Ask:

> Does this feel like one continuous visual journey?

If the answer is no, improve the transitions before adding more effects.

---

# 24. FINAL QUALITY BAR

The desired result is NOT:

> "A normal website with some fancy scroll animations."

The desired result is:

> **"A coherent visual world that responds to my scrolling."**

The user should feel that they are:
- moving through the product's story
- exploring a visual environment
- revealing information
- changing perspective
- discovering the next idea

rather than simply moving downward through HTML sections.

The best implementation will make the page feel almost like a **cinematic interactive sequence controlled by scroll**.

But it must remain:
- usable
- accessible
- performant
- responsive
- original
- project-specific

---

# 25. FINAL IMPLEMENTATION RULE

If there is ever a conflict between:

**A. Making the website resemble the DNA reference literally**

and

**B. Creating an original, project-specific experience using the DNA reference's underlying interaction principles**

ALWAYS choose **B**.

The DNA reference supplies the **motion language and design principles**.

OUR PROJECT supplies:
- the subject
- the visual metaphor
- the content
- the branding
- the information architecture
- the actual interface

The final product should feel like **our project evolved with the same level of cinematic design thinking**, not like the DNA website was copied and its text was replaced.
