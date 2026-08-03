# Estelle Kim Portfolio Style Guide

**Direction:** material editorial instrument  
**Reference base:** Interfaces, its three public magazine issues, the full public issue index, and Jakub Krehel's linked writing  
**Prepared:** August 2, 2026

This guide translates the rigor of [Interfaces](https://interfaces.dev/) into Estelle's existing visual language. It is not a recipe for cloning the reference site. Interfaces contributes editorial structure, typographic discipline, visible measurements, and unusually careful micro-interactions. Estelle contributes paper, glass, pigment, physical response, serif character, and work whose material behavior is the content.

The target feeling is:

> A precise design-engineering publication that can be handled like an object.

The portfolio should feel calm at first glance and densely considered on contact. The work stays visually dominant. Chrome clarifies the work, surfaces give it material presence, and motion reveals how it behaves.

---

## 1. Source synthesis

### What the Interfaces site contributes

The rendered landing page uses a near-white `#fcfcfc` ground, a 760px main column with 20px side padding, a 60/60 hero title, 24/32 section headings, 18/28 subheads, 16/24 body copy, medium weights, tight display tracking, 128px desktop section gaps, pill controls, and translucent shadow-based outlines. Its hero turns design measurements—x-height, pixel distances, color values, and bounding boxes—into part of the composition.

Adopt the discipline, not the costume:

| Interfaces pattern | Portfolio translation |
| --- | --- |
| Visible type and spacing measurements | Sparse annotations that expose a project's real variables: stiffness, diffusion, refraction, FPS, dimensions, or time |
| Neutral editorial column | Warm paper reading column nested inside the existing wider project grid |
| Blue call-to-action | Estelle purple used only for active state, selection, and the single primary action |
| Clean white demo cards | Paper or glass specimens with edge texture and contact shadow |
| Sans + italic serif hero | EB Garamond for artifact/identity, Ysabeau Office for explanation and interface |
| Interactive teaching demos | Small, manipulable proof of each project's core behavior |
| Uniform product polish | Material-specific behavior: cloth acts like cloth, glass like glass, paper like paper |

### What the public magazine issues contribute

Three issues are fully exposed and can be used as direct craft references:

1. [Details That Make Interfaces Feel Better](https://interfaces.dev/magazine/issues/details-that-make-interfaces-feel-better)
   - Balance titles and pretty-wrap body copy.
   - Keep nested radii concentric: `outer radius = inner radius + padding`.
   - Animate contextual icon swaps with opacity, scale, and a small blur.
   - Use antialiased font smoothing for lighter, crisper text.
   - Use tabular numerals for measurements, counters, and timecodes.
   - Prefer interruptible transitions for user-controlled interactions.
   - Split and stagger entrances; make exits quieter than entrances.
   - Align icons optically, not only geometrically.
   - Use layered shadows instead of hard borders where depth is useful.
   - Add a 1px, 10%-opacity inset outline to images.

2. [How I Use Shared Layout Animations](https://interfaces.dev/magazine/issues/how-i-use-shared-layout-animations)
   - Preserve the identity of an object as it moves between views.
   - Use one unique shared identity per live element.
   - Let position, size, and radius interpolate as part of the same state change.
   - Fade or blur transient connectors separately; do not make the persistent object disappear.

3. [Understanding Gradients](https://interfaces.dev/magazine/issues/understanding-gradients)
   - Choose linear, radial, or conic geometry deliberately.
   - Treat stops as structure, not decoration.
   - Use layered gradients to construct light and material effects.
   - Check the interpolation color space; OKLCH can introduce hues that were not explicit in the endpoints.
   - Use gradients only when they express light, depth, time, pigment, or a real field.

The public index exposes fifteen editions. The other issue titles are useful as a coverage map, but this guide does not claim access to their paid content:

| Issue | Topic | Relevance to the portfolio |
| ---: | --- | --- |
| 15 | Working with type | Make type specimens and role-based scales part of QA |
| 14 | Typography manual for the web | Treat wrapping, smoothing, numerals, rhythm, and optical alignment as one system |
| 13 | Less is more, more or less | Remove interactions that cannot explain their purpose |
| 12 | Building an animated sign-in dialog | Study complete component state choreography, not isolated hover effects |
| 11 | Reviewing your animations | Review motion for purpose, interruption, frequency, and reduced-motion behavior |
| 10 | Sharing your work online | Make every project understandable, linkable, and demonstrable |
| 9 | Details that make interfaces feel better | Apply the concrete polish checklist above |
| 8 | Using gestures in motion | Give touchable things physically coherent responses |
| 7 | Drag gestures on the web | Use drag only where handling is part of the artifact |
| 6 | Using AI as a design engineer | Use AI to accelerate trials; keep judgment and direction human |
| 5 | `will-change` in CSS | Promote only elements that truly animate; performance is part of feel |
| 4 | Shared layout animations | Maintain object continuity between states and routes |
| 3 | Understanding gradients | Build fields and lighting deliberately |
| 2 | What are OKLCH colors? | Define perceptually stable palettes and state ramps |
| 1 | Introduction | Establish the quality-and-craft thesis |

### What the linked writing contributes

- [Less is more, more or less](https://jakub.kr/writing/less-is-more) argues that quality is the accumulation of small decisions, while simplicity comes from understanding what to remove. For this portfolio, every effect needs an answer to “what does this reveal about the work?”
- [Using Gestures in Motion](https://jakub.kr/work/motion-gestures) treats hover, tap, drag, pan, focus, and in-view states as feedback loops. Keyboard focus deserves the same care as pointer feedback.
- [Drag Gestures on the Web](https://jakub.kr/work/drag-gesture) demonstrates constrained axes, low elasticity, disabled momentum where precision matters, snap points, and progressive reveal thresholds. These are appropriate for artifacts, not generic navigation.
- [Using AI as a Design Engineer](https://jakub.kr/work/using-ai-as-a-design-engineer) frames AI as a way to test and discard ideas faster, followed by human tweaking, polish, animation, and review.
- [What are OKLCH colors?](https://jakub.kr/components/oklch-colors) shows why OKLCH is useful for consistent perceived brightness and predictable shade ramps.

---

## 2. Design principles

### 2.1 Transparency into the quality of the work

The interface should reveal why the projects are technically and aesthetically good. A quiet surface alone does not do that. Show evidence: the live behavior, the material variable, the before/after, the constraint, the failure mode, or the tiny implementation decision that changed the feel.

### 2.2 Annotate what is real

Interfaces uses x-height, color, pixel, and box annotations as visual language. Estelle's version should annotate real project properties:

- `bend stiffness 0.72`
- `ramie · high crease memory`
- `diffusion 18.4 px/s`
- `edge refraction 0.08`
- `60 fps · 1.3 ms solver`
- `drag to disturb`

Use at most two annotation clusters in the first viewport. Labels are evidence, not decoration.

### 2.3 One physical story per object

If a project card is a glass specimen, its material declares itself at the edge and it may lift slightly. If a note is printed on paper, it can settle or shift but should not glow. If a control is mounted in an instrument panel, it presses inward and does not float.

### 2.4 Motion must explain state, material, or cause

Motion is warranted when it:

- preserves the identity of an object between views;
- shows cause and effect;
- makes a material property perceptible;
- progressively reveals an available action;
- confirms an input or change of state.

If motion only advertises that the page has animation, remove it.

### 2.5 Editorial clarity, material density

Use Interfaces-like structure: strong hierarchy, a narrow reading measure, predictable chapter rhythm, and concise labels. Add Estelle-like density at the surface and edge: texture, refraction, contact shadow, playback state, measurement, and tactile response.

---

## 3. Foundations

### 3.1 Color

Default to a warm, low-chroma light theme. Use one accent family at a time.

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#fbfaf7` / `oklch(98.50% 0.0041 91.4)` | Page ground |
| Paper deep | `#f7f2e7` / `oklch(96.20% 0.0155 86.4)` | Reading panels, nested paper |
| Surface | `#ffffff` | Controls and glass centers |
| Ink | `#161616` / `oklch(20.02% 0 0)` | Primary type |
| Ink secondary | `#4d4d4d` / `oklch(42.02% 0 0)` | Supporting copy |
| Ink meta | `#777777` / `oklch(56.93% 0 0)` | Labels and measurements |
| Hairline | `#e2e2e2` / `oklch(91.28% 0 0)` | Divisions and quiet edges |
| Estelle purple | `#542670` / `oklch(36.93% 0.1266 310.3)` | Active state and primary action |

Rules:

- Purple may occupy no more than about 8% of a typical viewport outside a project image.
- Do not use default product blue.
- Use color to encode state or material, never to fill empty space.
- Project-specific pigments—vermilion, indigo, moss, ochre, plum—belong inside the project specimen, not in global chrome.
- Use alpha or `color-mix()` for semantic variants rather than inventing unrelated grays.

### 3.2 Typography

Keep the existing font pair. It is the right translation of Interfaces' grotesque/editorial contrast.

- **EB Garamond:** identity, project titles, artifact language, cultural or reflective writing.
- **Ysabeau Office:** body copy, navigation, controls, captions, technical explanation.
- **System mono:** measurements, variable names, timecodes, FPS, dimensions, code.
- **Star Glyphs:** rare wayfinding and identity marks, never as a substitute for an icon.

Recommended roles:

| Role | Size / line-height | Weight | Notes |
| --- | --- | ---: | --- |
| Identity | `clamp(48px, 7vw, 64px) / 0.96` | 500 | Slight negative tracking; one to two lines maximum |
| Case-study title | `clamp(36px, 5vw, 48px) / 1.02` | 500 | `text-wrap: balance` |
| Page title | `32px / 1.08` | 500 | `text-wrap: balance` |
| Section | `20px / 1.20` | 400 | Serif, sentence case |
| Lead | `18px / 1.50` | 300 | Max 58ch |
| Body | `16px / 1.55` | 300 | `text-wrap: pretty`; max 66ch |
| Project title | `18px / 1.25` | 400 | Serif |
| Meta | `14px / 1.40` | 300–400 | UI and attribution |
| Measurement | `11px / 1.35` | 400 | Mono, tabular numerals, +0.02em tracking |

Global type rules:

```css
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, .type-balance { text-wrap: balance; }
p, li, .type-pretty { text-wrap: pretty; }
.numeric { font-variant-numeric: tabular-nums; }
```

Use optical corrections without apology. A triangular play icon often needs to move 1px to the right. A text-and-arrow control can use 2px less padding on the arrow side. Fix reusable SVG geometry at the source.

### 3.3 Layout and rhythm

Retain the existing two-measure system:

- **Wide frame:** 52rem / 832px for homepage grids and paired media.
- **Reading frame:** 42rem / 672px for case-study narrative.
- **Interface reference measure:** 760px including 20px gutters; useful as a ceiling for magazine-like pages, not a new mandatory token.

Spacing system:

| Token | Value | Use |
| --- | ---: | --- |
| `space-1` | 4px | Optical corrections |
| `space-2` | 8px | Tight nested padding |
| `space-3` | 12px | Card text rhythm |
| `space-4` | 16px | Control padding |
| `space-5` | 20px | Heading-to-copy |
| `space-6` | 24px | Grid gaps and small groups |
| `space-8` | 32px | Component groups |
| `space-12` | 48px | Chapter internals |
| `space-20` | 80px | Mobile section break |
| `space-28` | 112px | Desktop section break |

Interfaces uses roughly 128px between major landing-page sections. Use 112px here because texture, project imagery, and marginal notes already add density. Increase to 128px only around a true conceptual shift.

### 3.4 Radius and nesting

The current 4/8/16/pill system is strong and should remain:

- control: 4px;
- panel: 8px;
- surface: 16px;
- pill: 999px.

For nested surfaces, use the concentric rule from the public issue:

```text
outer radius = inner radius + padding
```

Example: an 8px inner control with 8px surrounding padding gets a 16px outer container. Do not independently choose radii for nested layers.

### 3.5 Texture and depth

Interfaces' shadow-border technique and Estelle's substrate textures fit together well.

Base outline shadow:

```css
--shadow-outline:
  0 0 0 1px rgb(22 22 22 / 6%),
  0 1px 2px -1px rgb(22 22 22 / 6%),
  0 2px 4px rgb(22 22 22 / 4%);

--shadow-outline-hover:
  0 0 0 1px rgb(22 22 22 / 8%),
  0 1px 2px -1px rgb(22 22 22 / 8%),
  0 2px 4px rgb(22 22 22 / 6%);
```

Rules:

- Use a border when it communicates an actual boundary or layer transition.
- Use shadow-as-outline when an element needs adaptive separation across mixed imagery or textured ground.
- Put a `1px` inset outline at 10% black over every project image; it normalizes bright and dark edges.
- Keep paper grain between 6% and 10% opacity on large surfaces.
- Concentrate glass/refraction at edges; the center stays optically quiet.
- Avoid nostalgic props such as tape, polaroid frames, or torn scrapbook edges.

---

## 4. Component language

### 4.1 Navigation: quiet instrument edge

- Keep the current floating pill, but let it behave like mounted glass.
- Default height: 40–44px; links at 14px.
- Use opacity or pigment shift on hover. Do not make mounted links float independently.
- The shader toggle may press inward by 1px and change refraction/pigment; it should not bounce.
- Focus rings must be visible and share the 4px control radius.

### 4.2 Homepage hero: annotated identity specimen

Structure:

1. `Estelle Kim` as the primary serif identity.
2. `graphics · interaction · engineering` as the positioning line.
3. One sentence on what she makes and why it matters.
4. Two direct actions: work and contact/resume.
5. One live status or measurement note.

Add only one reference-site-inspired annotation cluster. Good candidates:

- a baseline/x-height guide around the identity;
- `48 px · EB Garamond 500` in a mono label;
- a live shader reading attached to the background toggle;
- a small bounding box around one word during the entrance, removed after it settles.

Do not scatter blueprint labels across the whole page.

### 4.3 Project cards: specimens, not tiles

Each card needs:

- one dominant 16:10 image or video;
- a 1px inset image outline;
- title, role, and one-sentence purpose;
- a true hover/focus response;
- a visible cue when motion is available;
- no generic “view project” button.

Interaction:

- Still at rest.
- On hover/focus, begin the real preview and show a live timecode or material variable.
- Lift at most 2px only if the card reads as a loose surface.
- Scale imagery no more than 1.018.
- Make focus behavior equivalent to hover behavior.
- Pause previews when inactive, out of view, reduced-motion, or data-saving is enabled.

### 4.4 Case-study opening: one claim, one proof

The first viewport should answer:

- What is it?
- Why is it interesting?
- What did Estelle own?
- What can I manipulate or observe right now?

Use one live specimen or focused media proof. Do not begin with a wall of process copy.

Recommended header order:

```text
[project type · year · role]
Project title
One-sentence claim
[live specimen or hero media]
[one real measurement annotation]
```

### 4.5 Case-study chapters: editorial cadence

Use a repeatable sequence:

1. **Premise** — the problem or sensory goal.
2. **Material model** — what the thing is made of computationally.
3. **Interaction** — how the viewer causes change.
4. **System** — architecture, solver, shader, or state model.
5. **Craft decision** — one small detail shown before/after.
6. **Outcome** — what changed, shipped, performed, or was learned.

Every two to three text blocks, insert a proof: interactive demo, annotated still, short video, code fragment, diagram, or measured result.

### 4.6 Interactive demos: explain through manipulation

Follow the magazine's strongest editorial device: let the reader change one concept at a time.

- One primary input per demo.
- State the relationship being tested.
- Show values in tabular mono text.
- Provide reset.
- Keep the specimen visible while controls change.
- Controls live in a rail or dock, not over the specimen.
- If a demo is optional, show a static fallback.

For before/after craft comparisons, keep copy and structure fixed. Change only the tested detail.

### 4.7 Buttons and icon actions

- Primary action: Estelle purple, white label, pill or 8px panel radius depending on context.
- Secondary action: white/paper with layered outline shadow.
- Icon-only controls: minimum 32px visual container and 44px effective touch target.
- On state swap, animate old/new icons with `opacity`, `scale: 0.75 → 1`, and `blur: 4px → 0` over 140–180ms.
- Use tabular numbers for timers, progress, frame rate, issue numbers, dimensions, and percentages.
- Labels use verbs: `copy email`, `play specimen`, `reset cloth`, `show guides`.

### 4.8 Measurement labels

Reference appearance:

- 11px mono;
- ink-meta color;
- white or paper-deep at 88–94% opacity;
- 4px vertical / 8px horizontal padding;
- 6px radius;
- shadow-outline;
- optional 1px leader line in hairline gray;
- values use tabular numerals.

Only annotate values a designer or engineer would genuinely inspect.

---

## 5. Motion and gesture

### 5.1 Timing

| Tier | Duration | Use |
| --- | ---: | --- |
| Instant | 90–120ms | Press, toggle detent, icon acknowledgement |
| Fast | 140–180ms | Hover, focus, contextual icon swap |
| Standard | 200–260ms | Expand, select, small layout shift |
| Enter | 380–600ms | Page/chapter reveal |
| Mood | 600–800ms | Rare whole-view shader or atmosphere change |

Default easing: `cubic-bezier(0.4, 0, 0.2, 1)`.  
Entrance easing: `cubic-bezier(0.22, 1, 0.36, 1)`.  
Existing mood easing: `cubic-bezier(0.22, 0.7, 0.25, 1)`.

### 5.2 Interruptibility

- Use CSS transitions for hover, selection, disclosure, and any state the user may reverse mid-flight.
- Use keyframes for staged entrances that run once.
- Never lock input while decorative motion finishes.
- Rapidly reverse every toggle during QA. It should retarget cleanly from its current visual state.

### 5.3 Entrances and exits

- Split a hero into identity, positioning, description, actions, and annotation.
- Stagger sections by 80–100ms, not every character.
- Prefer 8px or less of travel with small blur and opacity.
- Exit with opacity and 2–4px blur where possible; do not replay the full entrance backward.
- Repeatedly used controls should often have no entrance animation.

### 5.4 Shared layout

Use shared-object motion for:

- project card → case-study hero;
- selected material chip → specimen legend;
- active navigation marker between routes;
- thumbnail → expanded media viewer.

The artifact persists. Temporary labels, arrows, and connectors may fade separately. Each live shared element must have one unique identity.

### 5.5 Gestures

Map gesture to meaning:

| Gesture | Appropriate portfolio use |
| --- | --- |
| Hover | Preview motion, raking light, reveal one measurement |
| Tap/press | Detent, copy confirmation, play/pause |
| Drag | Move cloth, peel/reveal paper, scrub time, reorder a real stack |
| Pan | Tune continuous material parameters or navigate a contained field |
| Focus | Equivalent preview and strong focus evidence |
| In view | Start lightweight proof or chapter entrance once |

For precise drag interactions:

- constrain to the meaningful axis;
- use very low elasticity around `0.05`;
- disable momentum when the release point matters;
- snap to named states;
- progressively reveal secondary actions after meaningful thresholds;
- provide non-drag controls and keyboard access.

### 5.6 Reduced motion

At `prefers-reduced-motion: reduce`:

- remove parallax, auto-playing previews, blur entrances, and shared-route travel;
- retain immediate opacity/state confirmation;
- never hide information that was revealed through motion;
- keep all controls fully usable.

---

## 6. Gradient and shader rules

The portfolio already has a mood-ring background. It remains an intentional exception because the field itself is part of Estelle's practice.

Use a gradient or shader only when it expresses:

- illumination across a surface;
- pigment diffusion or mixing;
- depth or refraction;
- time of day or progress;
- a measured scalar/vector field;
- a project-specific material phenomenon.

Construction rules:

- Choose geometry first: linear for directional light, radial for localized light/pressure, conic for angle/rotation, shader for spatially evolving fields.
- Use explicit stops and hints to control where transitions occur.
- Layer gradients for constructed light; do not use one giant multicolor wash.
- Prefer OKLCH for controlled shade ramps, but inspect intermediate hues.
- Provide an sRGB fallback for any critical color.
- Keep global chrome neutral while a project-specific field is active.

---

## 7. Content and voice

`PORTFOLIO_WRITING_GUIDE.md` is the source of truth. Its rules are derived from
Estelle's direct copy edits and override older formulas in this document.

### Voice

- Dry, specific, compressed, and slightly strange.
- Name the object and the mechanism that makes it interesting.
- Let compact surfaces use lowercase fragments rather than forcing full prose.
- Let exact technical terms appear without a long translation when they are the shortest accurate description.
- Use `+`, `/`, `=`, and `→` when they communicate a real structural relationship.
- Allow one restrained aside when the project's scope is genuinely odd.
- Avoid inflated claims, generic design language, and polished thesis statements.

### Surface-specific register

- **Status:** recognized role or fact, usually one line and no period.
- **Project card:** concrete product first; omit repeated leading articles.
- **Interaction snippet:** mechanism or behavior label; the video does most of the explaining.
- **Case study:** full sentences, literal headings, visible evidence, and exact ownership.
- **Retrospective:** direct judgment about what works and what should change.

Do not apply one formula everywhere. A fragment such as `bottom pixel row of a
CPU canvas feeds top row of a GPU diffusion shader` belongs beside a demo. A
case-study paragraph should restore the context and consequence.

### What to show

- failed or flat version beside the finished version;
- exact property changed;
- a short live interaction;
- the domain reason behind the implementation;
- one performance or accessibility constraint;
- the resulting perceptual difference.

---

## 8. Portfolio-specific do / do not

### Do

- Keep EB Garamond + Ysabeau Office.
- Keep the 52rem / 42rem layout measures.
- Keep the single purple global accent.
- Make project previews the visual center.
- Add sparse, real measurement annotations.
- Pair every major claim with manipulable or visual proof.
- Use layered shadows and image outlines for adaptive edge definition.
- Make hover, focus, and touch states equally intentional.
- Use material-specific interaction rather than one universal card effect.
- Review frequently used motion more strictly than one-time entrances.

### Do not

- Recolor the portfolio to Interfaces blue.
- Copy its exact hero composition or floating guides everywhere.
- Turn every section into a pristine white SaaS card.
- Use annotations as decorative pseudo-technical language.
- Animate every heading, icon, and card by default.
- Put generic gradients behind text for atmosphere.
- use spring wobble as a personality substitute.
- Add nostalgic analog props to signal “craft.”
- Hide the work behind process copy.
- let texture reduce readability or flatten project color.

---

## 9. Proposed token layer

This is a specification, not an automatic replacement for the current CSS. It is designed to map cleanly onto the existing custom properties.

```css
:root {
  --paper: #fbfaf7;
  --paper-deep: #f7f2e7;
  --surface: #ffffff;
  --ink: #161616;
  --ink-secondary: #4d4d4d;
  --ink-meta: #777777;
  --hairline: #e2e2e2;
  --accent: #542670;

  --font-display: var(--font-symbol), var(--font-eb-garamond), Georgia, serif;
  --font-body: var(--font-symbol), var(--font-ysabeau-office), system-ui, sans-serif;
  --font-mono: var(--font-symbol), ui-monospace, SFMono-Regular, Menlo, monospace;

  --type-identity: clamp(3rem, 7vw, 4rem);
  --type-case-title: clamp(2.25rem, 5vw, 3rem);
  --type-page-title: 2rem;
  --type-section: 1.25rem;
  --type-lead: 1.125rem;
  --type-body: 1rem;
  --type-meta: 0.875rem;
  --type-measurement: 0.6875rem;

  --radius-control: 4px;
  --radius-panel: 8px;
  --radius-surface: 16px;
  --radius-pill: 999px;

  --layout-wide: 52rem;
  --layout-reading: 42rem;
  --section-gap: clamp(5rem, 10vw, 7rem);

  --ease-ui: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-mood: cubic-bezier(0.22, 0.7, 0.25, 1);

  --shadow-outline:
    0 0 0 1px rgb(22 22 22 / 6%),
    0 1px 2px -1px rgb(22 22 22 / 6%),
    0 2px 4px rgb(22 22 22 / 4%);
  --shadow-outline-hover:
    0 0 0 1px rgb(22 22 22 / 8%),
    0 1px 2px -1px rgb(22 22 22 / 8%),
    0 2px 4px rgb(22 22 22 / 6%);
}
```

---

## 10. Review checklist

### Every page

- [ ] Primary purpose is clear in five seconds.
- [ ] The work is more visually prominent than the chrome.
- [ ] Title wraps are balanced and paragraphs avoid orphans where supported.
- [ ] Reading copy stays near 66 characters per line.
- [ ] Numerals that update or align use tabular figures.
- [ ] Nested radii are concentric.
- [ ] Project imagery has a subtle inset outline.
- [ ] Focus-visible state is designed, not browser-default-hidden.
- [ ] Motion can be interrupted without jumping or locking input.
- [ ] Exit motion is quieter than entrance motion.
- [ ] Reduced-motion mode preserves all content and controls.
- [ ] Texture remains subtle at 100% zoom and on a lower-contrast display.

### Every interaction

- [ ] It reveals state, material, cause, or action.
- [ ] Its physical behavior matches the object's visual construction.
- [ ] Hover, keyboard, touch, and reduced-motion paths are considered.
- [ ] It remains pleasant on the 200th use, not only the first.
- [ ] The duration and easing belong to the shared motion tiers.
- [ ] Icons are optically aligned.

### Every case study

- [ ] Opening viewport answers what, why, role, and proof.
- [ ] Each major claim has visual or interactive evidence.
- [ ] At least one craft decision is shown before/after.
- [ ] Technical detail is connected to perceptual impact.
- [ ] The narrative can be skimmed through headings, captions, and specimens.
- [ ] The final section states the outcome without inflating it.

---

## 11. Priority rollout

1. **Typography pass** — smoothing, balance/pretty wrapping, tabular measurements, and optical icon alignment.
2. **Edge pass** — normalize project media with inset outlines and consolidate outline shadows.
3. **Hero pass** — introduce one real annotation cluster and sharpen the one-sentence claim.
4. **Case-study pass** — standardize premise/material/interaction/system/craft/outcome chapters.
5. **Motion audit** — make interaction motion interruptible, soften exits, and remove effects that do not explain anything.
6. **Demo pass** — add one focused manipulation or before/after specimen to each flagship project.

The correct end state is not “the portfolio looks like Interfaces.” It is “the portfolio demonstrates the same level of editorial and interaction judgment while remaining unmistakably Estelle's.”
