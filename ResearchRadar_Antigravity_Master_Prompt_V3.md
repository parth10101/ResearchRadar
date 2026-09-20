# ResearchRadar — V3 Definitive Antigravity Master Prompt

## Purpose

This is a **presentation/UX/motion rebuild**, not a content rewrite or a redesign of the approved home experience.

The existing ResearchRadar project already contains the intended research content, data, pages, and home-page particle experience.

**Change the HOW, not the WHAT.**

---

# 0. NON-NEGOTIABLE PRESERVATION CONTRACT

There are **two absolute locks**.

## LOCK 1 — HOME PARTICLES + HOME → EPISTEMIC TRANSITION

### DO NOT TOUCH THESE.

The existing home-page particle visualization is approved.

The existing transition from:

`HOME → EPISTEMIC PAGE`

is also approved.

Treat both as **immutable/read-only for this task**.

Do NOT:

- redesign them
- regenerate them
- retime them
- shorten or lengthen them
- change easing
- change particle behavior
- change particle count
- change particle density
- change positions
- change colors
- change brightness
- change choreography
- replace their implementation
- merge them with a new animation
- “improve” them
- optimize their appearance

If the new implementation seems to require modifying either system:

**STOP and find another architectural solution.**

The redesign begins **after the existing home → epistemic transition has completed**.

### BEFORE MODIFYING CODE

Identify the exact files/components responsible for:

- home particles
- home → epistemic transition

Do not modify those files/components unless absolutely required for a non-visual compatibility fix. Preserve their behavior exactly.

### REGRESSION TEST

Before implementation, capture/record the current:

- home page
- home → epistemic transition

After implementation, compare them.

If they changed unintentionally:

**REVERT THE CHANGE.**

---

# LOCK 2 — ALL EXISTING CONTENT / DATA

Everything ResearchRadar already says, displays, calculates, or contains is locked.

This includes:

- headings
- titles
- descriptions
- paragraphs
- labels
- research information
- research findings
- paper titles
- authors
- paper metadata
- cluster information
- research gaps
- evidence
- statistics
- numerical values
- chart values
- datasets
- API responses
- existing terminology
- factual information
- existing page information
- existing navigation meaning

Do NOT:

- rewrite
- paraphrase
- summarize
- simplify
- rename
- invent
- fabricate
- remove
- reinterpret
- replace
- alter

existing information.

## Examples

### NOT ALLOWED

Existing:

> Research Gap: Object Detection + Landsat + Cloud Cover

Changing it to:

> Potential Opportunity in Satellite Vision

This changes the WHAT.

### ALLOWED

Keep the exact existing text and change:

- layout
- typography
- animation
- hierarchy
- interaction
- visualization

That changes only the HOW.

---

# 1. WHAT YOU ARE ACTUALLY CHANGING

Only change:

- visual presentation
- layout
- visual hierarchy
- typography styling
- spacing
- animation
- transitions **after the locked home transition**
- camera movement
- scrolling
- hover
- selection
- zoom
- pan
- progressive disclosure
- panel presentation
- glass treatment
- composition
- responsive behavior
- visualization rendering
- interaction design
- information reveal
- UX
- spatial storytelling

Conceptually:

```text
WHAT = LOCKED

HOW = MODIFIABLE
```

---

# 2. PRESERVE WHAT ALREADY WORKS

Do NOT assume the whole website needs replacement.

First classify existing elements into:

1. **Already strong — preserve**
2. **Functionally correct but visually weak — redesign presentation**
3. **Technically/visually problematic — fix**
4. **Locked — never modify**

The goal is not “make everything different.”

The goal is:

> **Keep what is already strong. Rebuild what is actually weak.**

---

# 3. PRIMARY DESIGN GOAL

Transform the experience from:

> dashboard + animated background

into:

> **immersive scientific visualization + research exploration environment**

The user should feel like they are exploring:

> **A living map of research.**

It should NOT feel like:

- a generic SaaS dashboard
- a hackathon demo
- a gaming interface
- a generic Three.js particle demo
- an AI-generated card layout

---

# 4. REFERENCE VIDEO — DESIGN LANGUAGE

Use the supplied reference video as inspiration for:

- spatial continuity
- cinematic movement
- depth
- camera choreography
- visual hierarchy
- restrained UI
- physicality
- continuous transitions
- progressive information reveal

Do NOT copy its exact objects, branding, content, or geometry.

Extract the underlying principles.

The equivalent of the reference video's hero object is:

> **ResearchRadar's research/data visualization.**

---

# 5. ONE CONTINUOUS EXPERIENCE

After the locked home transition, the epistemic experience should feel like one continuous environment.

Desired mental model:

```text
research world
    ↓
camera / visualization evolves
    ↓
structure becomes visible
    ↓
user explores
    ↓
existing information is revealed
```

Avoid:

```text
screen
→ fade
→ unrelated screen
→ card
→ modal
→ another dashboard
```

Do not build a slideshow.

---

# 6. THE VISUALIZATION IS THE ENVIRONMENT

Do not treat the embedding visualization as a decorative background.

It is the primary visual environment.

UI should feel layered into that environment rather than sitting on top of it like a conventional dashboard.

Priority:

```text
1. DATA VISUALIZATION
2. IMPORTANT EXISTING CONTENT
3. TYPOGRAPHY
4. SUPPORTING UI
5. DECORATION
```

---

# 7. EMBEDDING / "WORM" PROBLEM

The current final embedding visualization appears elongated / filamentary / worm-like.

Do NOT assume this is wrong.

First determine whether the structure comes from:

```text
raw embeddings
    ↓
normalization
    ↓
tanh
    ↓
projection / dimensional reduction
    ↓
Coulomb repulsion
    ↓
final coordinates
    ↓
rendering
```

The goal is:

> **Separate genuine data geometry from visualization artifacts.**

If elongated structure is genuinely present in the data:

**KEEP IT.**

If it is artificially introduced by the pipeline:

**FIX THE RESPONSIBLE STAGE.**

Do not simply make everything round.

---

# 8. TANH — DIAGNOSE BEFORE CHANGING

Locate every use of `tanh`.

Determine:

- why it exists
- whether it is analytically required
- whether it is normalization
- whether it is range compression
- whether saturation is occurring
- whether it is display-only

If analytically required:

**KEEP IT.**

If it is only display compression:

investigate whether a more mathematically transparent normalization would preserve the intended geometry better.

Do not blindly remove or replace it.

---

# 9. COULOMB REPULSION — DIAGNOSE BEFORE CHANGING

Determine whether Coulomb repulsion is:

### Analytical

If it is part of the actual methodology:

**preserve it.**

### Display-only

If it exists only to reduce visual overlap:

do not let it dominate the embedding geometry.

Test:

```text
0
low
medium
current
```

Use the minimum intervention necessary for readability.

Do not maximize point separation.

---

# 10. DATA SPACE VS DISPLAY SPACE

Maintain a strict conceptual distinction:

```text
SEMANTIC SPACE
raw embeddings

        ↓

ANALYTICAL SPACE
PCA / UMAP / existing legitimate projection

        ↓

DISPLAY SPACE
viewport fitting / translation / uniform scaling

        ↓

RENDERING
point size / opacity / color / lighting
```

A cosmetic layout operation must not silently redefine analytical geometry.

---

# 11. SEPARATE ANALYTICAL AND DISPLAY COORDINATES

Where appropriate, explicitly maintain:

```ts
analyticalPosition
displayPosition
```

The underlying analytical coordinate must remain recoverable.

Display transformations must be explicit and mathematically defensible.

Legitimate examples:

- translation
- uniform scaling
- viewport fitting

Do not arbitrarily deform individual clusters.

---

# 12. REQUIRED DIAGNOSTIC VIEWS

During development inspect:

```text
A — normalized embedding
B — after tanh
C — after projection
D — after Coulomb
E — final render
```

Determine exactly where the worm-like morphology appears.

Do not randomly tweak parameters without identifying the source.

---

# 13. MATHEMATICAL FIDELITY

At the final state:

```text
renderedPoint[i]
≈
expectedAnalyticalPosition[i]
```

after legitimate display transformations.

Do NOT:

- manually move clusters
- circularize clusters
- stretch individual groups
- compress individual groups
- move outliers
- artistically separate clusters
- invent positions

---

# 14. BEAUTIFY THE VISUALIZATION, NOT THE DATA

Make the result beautiful through:

- precise point rendering
- point size
- opacity
- color
- density representation
- depth
- camera framing
- antialiasing
- restrained luminosity
- composition
- typography
- interaction
- legitimate normalization/projection

NOT by falsifying the data.

---

# 15. REAL EMBEDDINGS DO NOT NEED TO BE ROUND

Real embeddings can contain:

- elongated clusters
- curved manifolds
- sparse tails
- branching structures
- overlapping groups
- irregular densities

If this is genuinely present:

**preserve it.**

The objective is not:

> make every cluster pretty

The objective is:

> **remove artificial visualization artifacts while preserving genuine structure.**

---

# 16. DENSITY IS INFORMATION

Do not force every point apart.

If real points overlap, that overlap can communicate density.

Prefer:

```text
small precise points
+
alpha
+
natural density
```

over:

```text
heavy repulsion
+
artificial separation
```

---

# 17. FINAL POINT RENDERING

Final data points should look like research data, not stars.

Prefer:

- small points
- crisp rendering
- controlled opacity
- subtle luminosity
- subtle depth
- meaningful color

Avoid:

- giant glowing spheres
- excessive bloom
- rainbow particles
- giant halos
- cyberpunk neon

---

# 18. COLOR

If actual cluster/category labels exist:

use them meaningfully.

If not:

use a restrained scientific palette.

Do not randomly color points.

Color should communicate information.

---

# 19. GLOW

Glow is an accent.

It is NOT the visual system.

If everything glows:

**nothing has hierarchy.**

---

# 20. PARTICLE / DATA IDENTITY

Where feasible:

```text
1 data point = 1 persistent particle
```

Maintain stable identity:

```ts
{
    id,
    dataId,
    initialPosition,
    analyticalPosition,
    displayPosition,
    targetPosition,
    clusterId
}
```

However:

**do not modify the locked home particle system or locked home transition to force this architecture.**

The new epistemic visualization begins after that locked experience.

---

# 21. NEW TRANSITIONS — 2.5 SECONDS

For transitions being newly redesigned AFTER the locked home → epistemic transition:

## TARGET ≈ 2.5 SECONDS

Practical range:

```text
2.3–2.7 seconds
```

Do NOT use 4.5–5 seconds for these new transitions.

Do NOT change the timing of the locked home transition.

---

# 22. 2.5-SECOND MOTION DESIGN

Conceptually:

```text
0.0–0.4s
initial state / subtle initiation

0.4–1.0s
coherent movement begins

1.0–1.7s
structure develops

1.7–2.2s
target structure becomes dominant

2.2–2.5s
precise settling

2.5s
final state
```

This is one continuous animation, not five separate screen states.

---

# 23. DO NOT JUST SPEED UP A BAD ANIMATION

If an existing new transition is visually weak:

**rebuild the motion logic.**

Do not simply multiply its speed.

Motion should feel:

- coherent
- smooth
- physical
- intentional
- controlled

---

# 24. FIELD-BASED MOTION

Avoid making every particle look like an independent projectile.

Prefer a combination of:

```text
global/coherent flow
+
target attraction
+
damping
+
inertia
+
smooth easing
+
small deterministic variation
```

The viewer should primarily perceive:

> **the field reorganizing.**

Not:

> thousands of unrelated particles flying around.

---

# 25. NO MOTION TRAILS

Particles remain points.

Do NOT use:

- ribbons
- streaks
- elongated particle geometry
- visible trails
- spaghetti trails

Motion should be understood from the changing spatial configuration.

---

# 26. FINAL POSITION IS NON-NEGOTIABLE

Animation controls:

> HOW the particle gets there.

It does NOT control:

> WHERE it ends.

At:

```text
progress = 1
```

the final position must be correct.

---

# 27. CAMERA AS STORYTELLING

Use camera movement intentionally.

Possible progression:

```text
wide research environment
    ↓
subtle push toward structure
    ↓
embedding becomes readable
    ↓
gentle reframing
    ↓
user explores details
```

Use:

- subtle push-ins
- subtle pull-backs
- restrained parallax
- gentle reframing

Avoid:

- random spinning
- constant orbiting
- camera shake
- gaming-style camera movement

---

# 28. DEPTH

Use depth carefully.

If the underlying visualization is genuinely 3D:

use it.

If the data is 2D:

do not fabricate an arbitrary third data dimension merely for aesthetics.

Depth cues may come from camera/rendering without changing the analytical data.

---

# 29. UI MUST FEEL INTEGRATED

Avoid the feeling:

> HTML cards placed over a canvas.

Instead:

> visualization + typography + minimal interface = one composition.

Use:

- subtle translucency
- restrained blur
- thin borders
- low visual noise
- careful positioning

---

# 30. NO LEFT-SIDE CARD WALL

Do not turn the left side into a dashboard.

Avoid:

- stacked feature cards
- metric cards
- floating rectangles
- dashboard grids
- multiple containers

Prefer:

```text
open space
+
typography
+
visualization
```

---

# 31. RIGHT-SIDE GLASS PANEL

A right-side glass panel is acceptable.

Keep it:

- compact
- elegant
- translucent
- restrained
- research-oriented

Avoid excessive nested cards.

The panel is secondary to the visualization.

---

# 32. TYPOGRAPHY

Use strong editorial hierarchy:

```text
small eyebrow
↓
large headline
↓
short supporting text
↓
single clear action
```

Do not overload the screen.

Do not rewrite existing copy.

Only change its presentation.

---

# 33. PROGRESSIVE DISCLOSURE

The user should not see every piece of information simultaneously.

Use the existing content progressively:

```text
RESEARCH LANDSCAPE
        ↓
CLUSTER
        ↓
TOPIC
        ↓
PAPERS
        ↓
RESEARCH GAP
        ↓
EVIDENCE
```

Only the presentation/reveal changes.

The underlying information remains identical.

---

# 34. EMBEDDING INTERACTION

Once the embedding is visible, allow where appropriate:

- hover
- selection
- zoom
- pan
- cluster focus
- metadata inspection

Interactions must not alter analytical coordinates.

---

# 35. HOVER

Use:

```text
point
↓
subtle enlargement
↓
subtle brightness increase
↓
small contextual information
```

Avoid giant tooltips.

---

# 36. CLUSTER SELECTION

Selecting a cluster may:

- highlight relevant points
- reduce emphasis of irrelevant points
- reveal existing cluster information

Do NOT physically move the embedding to make the selection prettier.

---

# 37. RESEARCH GAP EXPERIENCE

The existing research-gap content is locked.

Improve only the journey through it:

```text
cluster
↓
existing topic information
↓
existing papers
↓
existing research gap
↓
existing evidence
```

Make the user feel like they discovered the information.

Do not rewrite it.

---

# 38. DO NOT TURN EVERYTHING INTO MODALS

Avoid:

```text
click
→ giant modal
→ close
→ another modal
```

Prefer information appearing naturally within the spatial experience.

Use a modal only when it genuinely improves usability.

---

# 39. TIMELINE / TEMPORAL DATA

If existing content contains temporal information:

present it elegantly and minimally.

Do not create a giant dashboard timeline.

---

# 40. GRAPH RELATIONSHIPS

If actual graph relationships exist:

use them.

Do NOT fabricate edges.

Do not assume:

```text
close points = graph relationship
```

unless the actual data model says so.

---

# 41. GRAPH EDGES

Keep graph edges:

- subtle
- readable
- secondary

The point cloud remains primary.

---

# 42. TECHNICAL ARCHITECTURE FOR NEW VISUALIZATION

Preferred:

- React
- TypeScript
- Three.js
- WebGL2
- GLSL shaders

Use:

- `THREE.BufferGeometry`
- `THREE.Points`
- `THREE.ShaderMaterial`

Avoid:

- DOM particle rendering
- one Mesh per point
- unnecessary object creation
- React state updates every frame

---

# 43. ONE WEBGL WORLD FOR THE NEW EPISTEMIC VISUALIZATION

Use one primary WebGL canvas for the new visualization where appropriate.

Do NOT create unnecessary parallel particle systems.

Again:

**this does NOT authorize modifying the locked home particle system or locked home transition.**

---

# 44. PERFORMANCE

Target:

## 60 FPS on desktop.

Use:

- GPU buffers
- typed arrays
- shaders
- requestAnimationFrame
- efficient rendering

Avoid:

- React state every frame
- one Mesh per particle
- recreating geometry every frame
- expensive data processing every frame

---

# 45. DATA PROCESSING

Keep data processing separate from rendering:

```text
loadData()
    ↓
validateData()
    ↓
projectEmbedding()
    ↓
normalizeForDisplay()
    ↓
createParticleMapping()
    ↓
render()
```

Do not mix expensive analytical computation with the render loop.

---

# 46. EXPENSIVE COMPUTATION

Do NOT calculate embeddings, PCA, UMAP, or force layouts every frame.

Prepare the required coordinates before rendering.

---

# 47. DETERMINISTIC OUTPUT

Use deterministic seeds for procedural visual variation.

The same dataset should produce the same visualization.

Do not use uncontrolled randomness for data meaning.

---

# 48. RESPONSIVE DESIGN

Do not simply shrink the desktop design.

Adapt:

- camera framing
- composition
- typography
- panel placement
- interaction

while preserving the same conceptual experience.

---

# 49. REDUCED MOTION

Respect:

```text
prefers-reduced-motion
```

Reduce:

- camera movement
- decorative motion
- transition intensity

Keep the underlying data and content accessible.

---

# 50. IMPLEMENTATION PROCESS

## PHASE 1 — AUDIT

Inspect the entire existing project.

Do not immediately rewrite.

Identify:

- locked home particles
- locked home → epistemic transition
- locked content/data
- existing embedding pipeline
- current visualization
- tanh
- Coulomb
- projection
- current UX
- weak presentation areas

---

## PHASE 2 — FREEZE

Identify exact files/components that must not be modified:

```text
HOME PARTICLES
HOME → EPISTEMIC TRANSITION
DATA / CONTENT SOURCES
```

Treat them as immutable.

---

## PHASE 3 — DATA DIAGNOSIS

Inspect:

```text
raw embeddings
normalization
tanh
projection
Coulomb
rendering
```

Determine the source of the worm-like morphology.

---

## PHASE 4 — FIX VISUALIZATION

Improve the final visualization while preserving analytical meaning.

---

## PHASE 5 — REBUILD EPISTEMIC UX

Create a continuous research exploration environment.

---

## PHASE 6 — MOTION

Implement newly redesigned transitions at approximately 2.5 seconds.

---

## PHASE 7 — INTERACTION

Implement appropriate hover, selection, zoom, pan and exploration.

---

## PHASE 8 — POLISH

Only after structure and data are correct, polish:

- typography
- glass
- glow
- depth
- camera
- spacing
- micro-interactions

---

# 51. DO NOT POLISH THE WRONG ARCHITECTURE

If the current presentation fundamentally creates:

- disconnected screens
- dashboard overload
- bad hierarchy
- artificial visualization geometry

do not merely add:

- gradients
- glow
- blur
- shadows

Fix the underlying presentation architecture.

But preserve the two locked systems and all existing content/data.

---

# 52. MANDATORY ITERATION LOOP

Do not stop because the code compiles.

Use:

```text
IMPLEMENT
↓
BUILD
↓
RUN ACTUAL PAGE
↓
OBSERVE ACTUAL RESULT
↓
SCREENSHOT / RECORD
↓
COMPARE WITH REFERENCES
↓
IDENTIFY TOP 3 PROBLEMS
↓
FIX
↓
RENDER AGAIN
```

Repeat until the result is genuinely strong.

---

# 53. "IT WORKS" IS NOT ACCEPTANCE

Compilation is not success.

The result must pass:

### DATA TEST

Is the underlying data unchanged and correctly represented?

### VISUAL TEST

Does it look sophisticated?

### UX TEST

Does it feel intuitive?

### MOTION TEST

Does it feel continuous and intentional?

### PROFESSIONALISM TEST

Would this look credible in front of professors/researchers?

### REGRESSION TEST

Were the locked systems preserved?

---

# 54. HOME REGRESSION TEST

Before vs after:

```text
HOME PARTICLES
HOME → EPISTEMIC TRANSITION
```

Must remain unchanged.

If changed:

**REVERT.**

---

# 55. CONTENT REGRESSION TEST

Before vs after:

```text
headings
text
labels
numbers
research findings
paper data
metadata
gap information
```

Must remain unchanged.

If changed:

**RESTORE ORIGINAL.**

---

# 56. DATA REGRESSION TEST

Verify:

```text
data point count
particle/data mapping
IDs
cluster IDs
coordinates
graph relationships
```

remain correct.

---

# 57. MATHEMATICAL VALIDATION

At final state:

```text
renderedPosition[i]
≈
expectedAnalyticalPosition[i]
```

after legitimate display transformations.

No manual coordinate beautification.

---

# 58. WORM DIAGNOSTIC TEST

Temporarily expose development-only controls:

```text
TANH ON/OFF
COULOMB ON/OFF
NORMALIZATION A/B
PROJECTION A/B
```

Determine which stage creates the morphology.

Remove experimental controls from production.

---

# 59. COULOMB TEST

If Coulomb is display-only, test:

```text
0
low
medium
current
```

Choose the minimum intervention necessary for readability.

---

# 60. 2.5-SECOND MOTION TEST

For newly redesigned transitions:

```text
0%
25%
50%
75%
100%
```

At 100%:

the final state must be exact.

---

# 61. SLOW-MOTION QA

Temporarily run newly redesigned motion at:

```text
0.25×
```

Inspect for:

- snapping
- teleportation
- sudden acceleration
- unnatural easing
- particle replacement
- visual discontinuity
- excessive trajectory curvature

Fix problems before production.

---

# 62. REFERENCE VIDEO QA

Evaluate the result against the reference video's principles:

- continuity
- spatial storytelling
- depth
- camera choreography
- visual hierarchy
- restrained UI
- cinematic motion

Do not copy its literal content.

---

# 63. ANTI-AI-SLOP TEST

Reject designs dominated by generic AI-web aesthetics.

Avoid excessive:

- glassmorphism
- rounded cards
- neon gradients
- glowing borders
- dashboard grids
- floating rectangles
- decorative particles
- random network lines
- excessive blur
- giant UI
- generic SaaS layouts
- cyberpunk styling

Desired language:

# PREMIUM SCIENTIFIC + EDITORIAL + RESEARCH VISUALIZATION

It should feel calm, precise, intelligent and intentional.

---

# 64. PRESERVE STRONG ELEMENTS

If an existing component already looks good:

**KEEP IT.**

Do not redesign something merely for visual novelty.

---

# 65. USER EXPERIENCE TARGET

The user's mental journey should be:

```text
ARRIVE
↓
UNDERSTAND
↓
OBSERVE
↓
ENTER
↓
EXPLORE
↓
SELECT
↓
INVESTIGATE
↓
DISCOVER
↓
VERIFY
```

The user should naturally understand:

```text
What is this?
↓
What am I seeing?
↓
What do these clusters mean?
↓
Which papers are involved?
↓
What gap is being suggested?
↓
What evidence supports it?
```

The existing content answers these questions.

Your job is to make the path through that content dramatically better.

---

# 66. DESIGN PHILOSOPHY

ResearchRadar should feel like:

> **A window into the structure of scientific knowledge.**

The visualization is not decoration.

The UI is not the hero.

The data is not background information.

Everything should work together:

```text
DATA
↓
VISUALIZATION
↓
MOTION
↓
INTERACTION
↓
UNDERSTANDING
```

---

# 67. ABSOLUTE DO / DON'T LIST

## DO

- preserve home particles
- preserve home → epistemic transition
- preserve all existing content
- preserve all existing data
- preserve research findings
- preserve paper information
- preserve numbers
- preserve metadata
- improve presentation
- diagnose tanh
- diagnose Coulomb
- preserve genuine data geometry
- remove artificial visualization artifacts
- improve rendering
- improve density representation
- use cinematic spatial storytelling
- use subtle camera movement
- use progressive disclosure
- use restrained UI
- use approximately 2.5-second NEW transitions
- make the visualization interactive
- test actual rendering
- test mathematical correctness
- perform regression testing
- iterate repeatedly
- preserve anything already strong

## DON'T

- change home particles
- change home → epistemic transition
- change existing text
- change existing data
- change research findings
- change paper titles
- change numbers
- fabricate content
- fabricate data
- fabricate graph relationships
- manually move clusters
- circularize clusters
- artificially separate points
- blindly remove tanh
- blindly modify Coulomb
- distort analytical coordinates
- use decorative particle systems
- use generic starfields
- overload with glass
- create card walls
- create dashboard grids
- use random camera movement
- make everything glow
- make every section a separate screen
- use unnecessary giant modals
- sacrifice data accuracy for aesthetics
- redesign something that is already working simply for novelty

---

# 68. FINAL DEFINITION OF DONE

Do NOT declare completion because:

- it compiles
- it runs
- the animation works
- the UI looks “modern”
- the page has been redesigned

Completion requires:

## LOCKED SYSTEMS

Home particles:

**UNCHANGED.**

Home → epistemic transition:

**UNCHANGED.**

Existing content:

**UNCHANGED.**

Existing data:

**UNCHANGED.**

---

## VISUALIZATION

Final embedding:

**MATHEMATICALLY DEFENSIBLE.**

Artificial worm/filament artifacts:

**REMOVED WHERE APPROPRIATE.**

Genuine data structures:

**PRESERVED.**

---

## UX

The experience feels:

**CONTINUOUS.**

**SPATIAL.**

**INTUITIVE.**

**RESEARCH-ORIENTED.**

---

## MOTION

New transitions:

**~2.5 SECONDS.**

Motion:

**SMOOTH.**

**COHERENT.**

**PHYSICAL.**

**NON-ROBOTIC.**

---

## DESIGN

The visual language feels:

**PREMIUM.**

**SCIENTIFIC.**

**EDITORIAL.**

**RESTRAINED.**

**CREDIBLE.**

Not:

**GENERIC AI UI.**

Not:

**HACKATHON UI.**

Not:

**CYBERPUNK DASHBOARD.**

---

# 69. FINAL ARCHITECTURAL MODEL

```text
                    RESEARCHRADAR
                         │
             ┌───────────┴───────────┐
             │                       │
          THE WHAT                 THE HOW
             │                       │
             🔒                      ✏️
             │                       │
      EXISTING CONTENT          VISUALIZATION
      EXISTING DATA             ANIMATION
      RESEARCH FINDINGS         TRANSITIONS
      PAPER INFORMATION         CAMERA
      HOME PARTICLES            INTERACTION
      HOME TRANSITION            UX
                                 LAYOUT
                                 RENDERING
```

## NEVER CROSS THE BOUNDARY.

---

# 70. FINAL MENTAL MODEL

> **DO NOT CHANGE WHAT RESEARCHRADAR KNOWS.**
>
> **DO NOT CHANGE WHAT RESEARCHRADAR SAYS.**
>
> **DO NOT CHANGE THE APPROVED HOME PARTICLE EXPERIENCE.**
>
> **DO NOT CHANGE THE EXISTING HOME → EPISTEMIC TRANSITION.**
>
> **CHANGE HOW BEAUTIFULLY, CLEARLY AND INTELLIGENTLY THE USER EXPERIENCES EVERYTHING AFTER THAT.**
>
> **DIAGNOSE THE WORM-LIKE EMBEDDING VISUALIZATION RATHER THAN HIDING IT.**
>
> **IF IT IS REAL DATA STRUCTURE, PRESERVE IT.**
>
> **IF IT IS A VISUALIZATION ARTIFACT, REMOVE THE ARTIFACT.**
>
> **BEAUTIFY THE RENDERING — NOT THE DATA.**
>
> **USE SPATIAL STORYTELLING INSTEAD OF DASHBOARD STORYTELLING.**
>
> **USE CAMERA, DEPTH, MOTION AND PROGRESSIVE DISCLOSURE TO GUIDE THE USER.**
>
> **KEEP NEW TRANSITIONS AROUND 2.5 SECONDS.**
>
> **PRESERVE WHAT IS ALREADY GOOD. REBUILD WHAT IS ACTUALLY WEAK.**
>
> **DO NOT STOP AT "IT WORKS."**
>
> **BUILD → RENDER → OBSERVE → DIAGNOSE → REBUILD → RETEST.**
>
> # THE WHAT IS LOCKED.
> # THE HOW IS YOUR JOB.
> # MAKE THE HOW EXCEPTIONAL.
