---
name: estelle-style
description: Estelle Kim's personal coding and graphics style, distilled from her creative-coding portfolio (cloth-sim, paper-between-us, known-forms, watercolor-diffuser, shader work, and more). Use this skill whenever writing code, building UI, choosing colors/fonts/motion, writing shaders, or making any design decision on Estelle's behalf — new projects, prototypes, portfolio pieces, demos, or edits to her existing work. Trigger even if she doesn't mention "style"; the point is that output should feel like hers by default.
---

# Estelle's Style

Estelle builds interactive pieces where digital things behave like physical materials — cloth that creases, paper that burns, pigment that diffuses, glass that refracts. The craft is in making the simulation *be* the material, not a lookup table that fakes it. Every choice below serves that: quiet UI so the material is the star, physics instead of tweens, comments that teach the domain.

When working on her behalf, be grounded and true to the work. Focus on the why and the impact. Don't invent capabilities or embellish; her aesthetic is restraint.

## Philosophy (read this first, it explains everything else)

- **Transparency into the quality of the content — the first principle.** The interface's job is to let the viewer *feel* how good the work is. Estelle conveys this through texture, micro-interactions, and cohesive detail — never through whitespace or polish. Beware the failure mode: "clean" is not the goal, and a page that reads as a tasteful minimal template has missed entirely. A merely-clean surface hides the content's quality; a surface with grain, weight, and touch-response reveals it. Restraint lives in the palette; it never applies to the density of considered detail.
- **Material authenticity.** Interactions are physical phenomena. If something moves, ask what material it is and how light passes through it. The cloth sim encodes real Korean textiles (silk, ramie, hemp, cotton) as distinct stiffness/crease/translucency profiles — the physics IS the cultural content.
- **Digital artifacts are objects.** They get handled, not clicked: dragged, peeled, pressed, tilted, torn, stacked. Every interactive element has a felt, physical response. An inert hover state is a missed opportunity.
- **Derive, don't store.** Her signature move. Recompute state from source rather than caching: DOM text rasterized into a height map every frame, undo via stroke replay, coastlines recomputed in both water and sand shaders. Prefer this even when caching would be "cleaner."
- **Quiet chrome, loud material — quiet ≠ sterile.** Neutral palette, one accent, gesture over buttons, but every surface carries texture (paper grain, substrate noise, ink bleed) and detail is dense and cohesive throughout. The interface should feel like paper, a terminal, or a filing cabinet — whatever the concept demands. Form expresses concept (drawing app feels like paper; token feed feels like a trading terminal).
- **Elegant reformulation over brute force.** 2D cloth sim swept into 3D by revolution; free-text adjectives as embedding axes; intentional SDF "lies" for artistic effect. It's fine to cheat if the cheat is beautiful and honest about being a cheat.
- **Performance is respect.** Hand-written GLSL/WGSL, raw WebGL when Three.js is too much abstraction, Rust+wgpu when it matters. No abstraction layers that don't pay rent.

## Stack defaults

- Next.js (App Router) + React 19 + TypeScript strict. Path alias `@/*`.
- Tailwind v4 for layout/utility; vanilla CSS with custom properties (`--ink`, `--paper`, `--accent`) for the design-driven parts. `color-mix(in srgb, ...)` for semantic opacity. No CSS-in-JS, no styled-components.
- 3D: Three.js / React Three Fiber + drei + postprocessing for scenes; raw WebGL for custom shader pieces; Rust + wgpu/WGSL for simulation-heavy work.
- Animation: CSS easings and physics loops first; Framer Motion / Motion only for orchestrated sequences. No spring-physics libraries — the sim IS the spring.
- State: `useState` + `useRef` (refs for anything imperative: GL contexts, solvers, rAF ids); `useReducer` with action creators for complex boards. Never Redux/Zustand.
- Client-only 3D via `dynamic(() => import("./Scene"), { ssr: false })`.

## Code conventions

- Props type at top of file: `type LiquidGlassBlobProps = { size?: number; color?: string }`. Interfaces or type aliases, self-documenting — no JSDoc.
- Shaders co-located with components as template literals (`const frag = /* glsl */ \`...\``), or in a `shaders/` folder for bigger projects. Uniforms `u_`, varyings `v_`, attributes `a_` (e.g. `u_time`, `u_burnProgress`, `v_ripple`).
- Section headers with box-drawing dividers:
  ```ts
  // ─── clothShaders.ts ─────────────────────────────────────────────
  // Cloth material shader — backlit translucent fabric.
  // Lighting model assumes key light BEHIND the fabric.
  ```
- Comments explain domain/physics *why*, never syntax: `// Ramie is THE creasing fabric`, `// Dark = thin/open, light = dense/thick`. Dense shader math otherwise uncommented — variable names carry the meaning.
- Hand-roll small utilities (`hexToRgb01`, noise hashes, `lobe()`) rather than importing math libs.
- Constants as camelCase config objects near the top (`const ITEM_H = 80` style for layout constants is the exception).
- Graceful degradation at setup (`if (!gl) { console.error(...); return; }`); throw with real messages on shader compile failure; no try/catch inside render loops.
- No console noise, no dead code left behind, no lint suppressions.

## Visual language

**Color — restraint, one accent.** Base palettes are warm off-whites or near-blacks:
- Paper/cream: `#fbfaf7`, `#f7f2e7`, `#efe8dc`, `#fafafa`
- Ink/charcoal: `#0a0a0a`, `#111111`, `#171717`, `#2A2A2A`
- Grays: stone/zinc scales, hairlines like `#e2e2e2`
- One accent per piece, from a pigment-like register: vermilion `#C84B31`, indigo `#3D5A80`, moss `#6A7F5A`, ochre `#C99846`, plum `#7C4B66`, purple `rgb(84,38,112)`
- Dark-mode pieces go terminal: bg `#0b0e11`, panel `#12161c`, text `#e6edf3`
- No gradients unless the gradient is the concept (e.g. a 24-hour sky: `#0C1020` → `#E7E6DF` → `#4C2E3C`)

**Typography as design tool, not afterthought.** Pair a serif with a grotesque: EB Garamond or Calluna for body/cultural content, Hanken Grotesk / Ysabeau Office (light weights, 100–300) for UI, Geist as the Next.js default, monospace (SF Mono stack or VT323) for technical/archival readouts. Serif for artifacts, mono for instruments. Weights: 100–400 body, 600–700 headings only.

**Motion.** Eased, never bouncy-for-its-own-sake:
- Default transitions: `cubic-bezier(0.4, 0, 0.2, 1)` at 180–240ms
- Entrances: `cubic-bezier(0.22, 1, 0.36, 1)` or `(0.2, 0.8, 0.3, 1)`, 380–600ms
- Tactile press: `cubic-bezier(0.34, 1.7, 0.5, 1)` with tiny transform (`translateY(-2px) rotate(-1.2deg)`)
- Animate CSS custom properties via `@property` for smooth color/angle interpolation
- Always include `@media (prefers-reduced-motion: reduce)`
- When a physics sim exists, it replaces tweening entirely — damping and stiffness are the easing

**Texture — surfaces are never flat, but texture is substrate, not memorabilia.** This is where "transparency into quality" lives, and where it most often goes wrong. Texture means the surface itself has material presence: paper grain and noise overlays (subtle canvas-generated or SVG turbulence), ink bleed at edges, slight per-item rotation or misregistration so things feel placed by hand rather than laid out by a grid engine. Texture does NOT mean nostalgic props: no tape scraps, polaroid frames, film sprocket holes, torn-scrapbook ephemera, or vintage-studio set dressing. Her work is contemporary — the material realism is in how things *behave* (weight, light, response), never in dressing the page up as an old object. If a decorative element can't answer "why is this here," cut it. Flat solid-color panels are a tell that something went wrong; so is a page that looks like a mood board of analog artifacts.

**Depth.** Soft and papery, never neon: `backdrop-filter: blur()`, shadows like `0 10px 28px rgba(40,38,32,0.07)`, hairline borders via `color-mix`. Glass cards at `rgba(255,255,255,0.55)`.

## Interaction patterns

Micro-interactions are not garnish — they're the evidence of quality. Every touchable element should respond physically; budget detail here before anywhere else.

Tactility strategies are conditional, not ambient. Pointer-as-light, tilt-toward-cursor, parallax, and relief belong to a suite of strategies for showing that something is 3D or tactile *without screaming it* — deploy one only when the content actually has depth or surface worth revealing. A flat screenshot with raking light is visual noise. Default state: flat, still, quiet; the strategy activates where it has something true to show.

Hierarchy through surface treatment: group content and give each functional layer its own surface. Dense where content is dense, open where it needs air — e.g. parameters floating in open air while a workbench sits on a glass panel. The surface tells you what layer you're in. Default to light mode; dark mode almost never (only when the content demands it, e.g. a terminal-natured piece).

Material effects concentrate at edges and stay barely noticeable. Her glass spec: subtle refraction and anisotropy *only at the edges* — the pane's center is optically quiet; the material declares itself where it terminates. This generalizes: put the craft where surfaces meet or end (edge refraction, contact shadows, hairline transitions), keep interiors calm, and tune intensity to just-perceptible. If a viewer would name the effect, it's too loud.

Wear and direction marks stay visible: timestamps, running timecodes, progress signals. They honestly register where a piece is in its life — unfinished work reads as unfinished by its marks, not by apology.

- Cursor as physical disturbance: pointer position feeds the sim (impulse radius + strength), not just hover states.
- Drag with full feedback: `cursor: grab` → `grabbing`, lift on hover (`translateY(-0.15em)`), tiny rotation on press, `aria-pressed` state changes.
- Artifacts handled like objects: peel a corner, tilt toward the cursor, settle with damped weight when released, stack with real occlusion and shadow.
- Reveal mechanics: click to burn away, drag to uncover, scroll to move through time. Interaction rewards attention.
- Parallax follows the pointer proportionally to inferred/actual depth.
- Discrete controls are quiet but tactile: toggles, a single slider, no control panels unless the piece is an instrument — and even a toggle should feel like it has a detent.
- Cohesion check: micro-interactions across the piece should share one physical logic (same easing family, same weight, same material), not be a grab-bag of effects.
- Physical coherence check: each object gets ONE physical story and every behavior obeys it. If something is pinned down, it doesn't float on hover; if it lifts, nothing should look like it's fastened. Contradictions between what an element looks like and how it moves read instantly as fake — worse than no metaphor at all.
- Micro-interactions that consistently land (keep reaching for these): slight random per-item rotation, hover-to-play with a live running timecode, a subtle play affordance, visible mouse + keyboard cues, quiet filter chips. They earn their place because each one reveals something true about the content.

## Graphics techniques to reach for

- Backlit translucency for thin materials: transmitted light dominates, soft fill (`0.18 + 0.32 * abs(dot(N, L))`), sheen at grazing angles (`pow(graze, 3.0) * u_sheen`), subtle depth-fade.
- XPBD/Verlet constraint solvers for cloth/soft bodies; per-material parameter profiles; velocity-zeroing to kill phantom energy.
- Noise + SDF raymarching with hot-swappable field/metric/traversal hooks.
- Substrate textures (paper grain) as an explicit layer under pigment/ink.
- Monocular depth → parallax via inverse-depth UV displacement.
- Text as geometry: rasterize DOM text to height/mask maps for lighting or destruction.
- Postprocessing (bloom, DOF) sparingly, for atmosphere — cinematic, not flashy.

## What to avoid

Anything that would read as template-derived or corporate: default Tailwind blue, heavy borders, gradient-splash hero sections, emoji in UI, spring-physics wobble everywhere, Redux for a toy, JSDoc ceremony, stock shadows. Equally: sterile cleanliness — flat untextured surfaces, whitespace-as-personality, perfectly aligned grids with inert cards, minimalism that mistakes emptiness for taste. And the third failure mode: skeuomorphic nostalgia — tape, polaroids, sprocket holes, "old studio" set dressing that makes the page feel dated and extra. All three hide the content; the work should be visible *through* the surface, which should feel contemporary and behave physically. If a choice doesn't serve the material metaphor or the concept, drop it. And per her standing instruction: don't edit her existing project code unless explicitly asked.