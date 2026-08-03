# Estelle Kim Portfolio Writing Guide

**Voice:** dry, specific, compressed, slightly strange

**Job:** make the object and its key mechanism obvious without turning every label into a pitch

**Current source of truth:** Estelle's direct copy edits, especially commits `5777dc8` and `396068b` from August 3, 2026

---

## 1. The voice in one sentence

> Name the thing, name the mechanism that makes it interesting, and stop before it starts sounding professionally explained.

The portfolio should sound like Estelle pointing at working software and telling someone what is actually unusual about it. It is closer to an annotated demo or engineering notebook than an award submission.

The writing is:

- technically literate without translating every term;
- concise enough to use fragments when the surface is already doing explanatory work;
- dry rather than performatively clever;
- specific about mechanisms, inputs, and visible behavior;
- comfortable with `+`, `/`, `=`, and `→` when they communicate structure faster than prose;
- occasionally a little odd in a way that sounds observed, not branded.

The desired impression is:

> Estelle knows what she made, knows which part matters, and does not need to inflate it.

Not:

> Estelle has converted every experiment into a polished product-design thesis.

---

## 2. Latest edits override older theory

When this guide conflicts with Estelle's recent direct edits, the edits win.

The two most useful recent commits are:

- `5777dc8` — rewrote status copy and every interaction-snippet description;
- `396068b` — rewrote project-card descriptions and removed repeated opening articles.

Together they establish several rules that the old guide missed.

### 2.1 A compact surface does not need a full sentence

Old:

> A shared 30 fps ticker drives the companion pixels' orbit, chase, and burst states.

Estelle:

> orbit, chase, and burst behavior that follows user attention

The revision is not trying to summarize the implementation. It labels what to notice in the demo.

### 2.2 The key mechanism can come first

Old:

> Canvas input feeds alternating WebGL textures that advect, diffuse, and dry persistent pigment.

Estelle:

> bottom pixel row of a CPU canvas feeds top row of a GPU diffusion shader

The second version is denser, more technical, and more memorable because it names the exact handoff.

### 2.3 Operators are part of the voice

Estelle's revisions use compact structural notation:

- `WebGL / SVG overlay`
- `noise field + cursor becomes dancing spark`
- `packing algorithms + POS tagging + d3-force = organic but ordered text layouts`

Do not expand these into connective prose unless the relationship becomes unclear.

### 2.4 A dry aside can do real voice work

Estelle:

> Social habit app built around contracts, proof, partners, transaction incentives, and somehow crypto wallets.

`somehow` acknowledges the project's odd scope without adding a paragraph of commentary. This kind of aside is useful because it is specific and restrained.

### 2.5 Repeated articles make cards sound templated

Estelle removed `A` from several project descriptions:

- `Mobile museum scavenger hunt...`
- `3D map of browsing paths...`
- `Material editor that turns...`

Project cards are captions. They do not need to pretend to be prose paragraphs.

### 2.6 Headline status copy should use recognized labels

Old:

> SWE intern @ PayPal · checkout-friction tooling + frontend

Estelle:

> Frontend SWE intern @ PayPal

Use the role someone will recognize immediately. Put internal scope elsewhere if it matters.

---

## 3. The four registers

The portfolio does not need one grammatical register everywhere. Match the amount of prose to the job of the surface.

### Register A: status and metadata

Use for role, timeline, availability, stack, recognition, and small interface labels.

Style:

- direct;
- recognizable;
- usually one line;
- no explanatory clause unless necessary;
- sentence case or lowercase according to the component;
- no period.

Good:

- `Frontend SWE intern @ PayPal`
- `CS + Computer Graphics @ UPenn`
- `solo design + engineering`
- `SF Make-a-thon · Best Design + Use of CopilotKit`

Avoid:

- `SWE intern focused on checkout-friction tooling and frontend systems at PayPal`
- `Awarded Best Design and Best Use of CopilotKit at the SF Make-a-thon`

The small surface already supplies context. Do not restate it.

### Register B: project-card caption

Use for the one-line description beneath or beside a project cover.

Style:

- concrete object first;
- omit a leading `A` or `An` by default;
- one human action, transformation, or unusual constraint;
- one sentence or fragment;
- dry aside allowed once;
- no role, stack, and outcome crammed into the same line.

Good:

> Mobile museum scavenger hunt where visitors photograph artifacts and collect them as stickers.

Good:

> Material editor that turns one fabric photo into PBR textures, simulated cloth, and an exportable 3D asset.

Good:

> Social habit app built around contracts, proof, partners, transaction incentives, and somehow crypto wallets.

Avoid:

> A thoughtfully designed mobile experience that empowers museum visitors to engage more deeply with artifacts.

Avoid:

> An innovative material platform at the intersection of GenAI and traditional rendering.

### Register C: interaction-snippet label

Use for `explores` copy beside a working video.

This is not a miniature case study. Its job is to tell someone what to watch for.

Style:

- lowercase fragment;
- no period;
- mechanism-first is encouraged;
- exact libraries, algorithms, media, and data paths are allowed;
- `+`, `/`, and `=` are allowed;
- 6–14 words is a useful target, not a hard limit;
- one key mechanism, or one mechanism plus its visible behavior.

Good:

- `orbit, chase, and burst behavior that follows user attention`
- `non-intrusive WebGL / SVG overlay to enhance everyday DOM objects`
- `minimal feedback loop for collaborative editing with WebSockets`
- `using Depth Anything v2 to create hi-fi, low-load 2.5D parallax scenes`
- `bottom pixel row of a CPU canvas feeds top row of a GPU diffusion shader`
- `packing algorithms + POS tagging + d3-force = organic but ordered text layouts`

Avoid:

> This interaction explores how a shared animation system can create responsive companion behavior.

Avoid:

> A custom WebGL solution that delivers a seamless and immersive visual experience.

The adjacent technical field can explain the implementation in full sentences. Do not force both fields to do the same job.

### Register D: case-study prose

Use full sentences when the reader needs causality, ownership, or a decision.

Style:

- straightforward headings;
- short paragraphs;
- ordinary verbs;
- exact scope;
- mechanism after the object is clear, unless the mechanism is the point of the section;
- no requirement to turn every decision into a story arc.

Good headings:

- `contract setup`
- `design system`
- `proof and contract states`
- `implementation review`
- `genAI as material input`
- `shared material model`
- `exports`

Avoid witty or thesis-like headings when a literal label is clearer:

- `the contract was the product`
- `where proof becomes trust`
- `giving fabric a memory`
- `the moment everything clicked`

The heading should help a design lead find the relevant work quickly.

---

## 4. Default construction rules

### 4.1 Put the concrete noun early

Start with something that can be pointed to:

- app;
- map;
- overlay;
- canvas;
- shader;
- pixel row;
- wallet;
- contract;
- fabric photo;
- 2D mesh.

Avoid making the reader cross an abstract introduction to reach the object.

Weak:

> Exploring new forms of collaborative expression through spatial interaction.

Stronger:

> Shared writing surface built around arranging rather than typing.

### 4.2 Prefer the distinguishing mechanism over a feature list

Ask:

> What makes this implementation different from the obvious version?

Then name that.

Examples:

- not `watercolor text effect`; use the CPU-canvas-to-GPU-shader handoff;
- not `interactive controls`; use the overlay that leaves DOM behavior intact;
- not `3D text`; use POS tagging plus collision-constrained force packing;
- not `fabric generator`; use GenAI maps feeding a deterministic renderer and cloth solver.

### 4.3 Omit scaffolding phrases

Cut these when the sentence works without them:

- `This project explores...`
- `I wanted to create...`
- `The goal was to...`
- `The result is...`
- `A system that...`
- `An experience designed to...`
- `This allowed me to...`
- `In order to...`

The object or mechanism can usually be the subject.

### 4.4 Do not make every line persuasive

Some copy is labeling. Some copy is explaining. Only a small amount needs to persuade.

If the video clearly demonstrates the behavior, the caption can simply name it. If a table already lists role and timeline, the paragraph should not repeat them.

### 4.5 Preserve exact technical nouns

Use the actual term when it is the shortest accurate phrase:

- `CPU canvas`
- `GPU diffusion shader`
- `WebGL / SVG overlay`
- `Depth Anything v2`
- `d3-force`
- `WebSockets`
- `PBR textures`
- `2.5D parallax`

Do not replace these with `custom technology`, `advanced rendering`, or `technical system`.

### 4.6 Use adjectives only when they encode a constraint

Useful:

- `lightweight` when bundle or runtime weight matters;
- `low-load` when rendering cost matters;
- `non-intrusive` when the overlay preserves DOM behavior;
- `shared` when one ticker, canvas, or state source replaces many;
- `persistent` when pigment or state survives frames or sessions.

Weak without evidence:

- thoughtful;
- intentional;
- expressive;
- seamless;
- innovative;
- robust;
- intuitive;
- ambitious;
- meaningful;
- human-centered.

---

## 5. Operators and shorthand

Operators are editorial tools, not decoration.

### `/` means parallel media, alternatives, or a hybrid

Use:

- `WebGL / SVG overlay`
- `design engineering / creative tech`

Do not use `/` when `and` would communicate a causal sequence.

### `+` means components combined in one mechanism or scope

Use:

- `POS tagging + d3-force`
- `design + engineering`
- `Best Design + Use of CopilotKit`

Avoid stacking more than three items unless the list is intentionally equation-like.

### `=` means a visible or conceptual result

Use:

> packing algorithms + POS tagging + d3-force = organic but ordered text layouts

Do not use `=` for a vague brand conclusion.

### `→` means transformation or pipeline

Use:

- `GenAI input → editable renderer → portable export`
- `photo → PBR maps → cloth asset`

Do not mix `→`, `+`, `/`, and `=` in one line unless the notation stays immediately readable.

### Typography

- Put spaces around `+`, `/`, `=`, and `→` in prose labels.
- Keep library and protocol names correctly cased.
- Use numerals when the number is part of the mechanism: `2.5D`, `30 fps`, `300+ websites`.
- Use `hi-fi` only for perceptual fidelity, not as generic praise.

---

## 6. Dryness, humor, and personality

The voice is dry, not sterile.

Useful personality usually comes from one of three places:

1. an unexpectedly honest scope detail;
2. a restrained aside;
3. a concrete preference.

Good:

> and somehow crypto wallets

Good:

> The burgundy looks nice, but primary actions still disappear inside some dense screens.

Good:

> I like the contract model more than I like every screen.

Rules:

- one aside is enough;
- do not add a wink to every project;
- do not use cute language to soften technical uncertainty;
- do not write jokes around collaborators, users, accessibility, privacy, or risk;
- keep `idk`, `j`, and chat shorthand out of published copy unless the surface is intentionally conversational;
- smileys are acceptable in personal copy, not as a substitute for a point of view.

Dry does not mean aloof. It means the sentence does not oversell itself.

---

## 7. Rules by portfolio surface

### Homepage identity

Use recognizable information before internal detail.

Good:

- `Frontend SWE intern @ PayPal`
- `CS + Computer Graphics @ UPenn`
- `available mid-august 2026 · full-time design engineering / creative tech`

Do not make the margin note carry a résumé bullet. The project pages can explain the work.

### Project cards

Use:

> `[Concrete product] + [main action or transformation]`

This is a check, not a fixed template.

Keep:

- one object;
- one action;
- one weird or consequential constraint if it earns the space.

Cut:

- leading articles;
- role and stack repetition;
- generic value claims;
- a second sentence that merely interprets the first.

### Interaction snippets

The video is primary. The copy is an annotation.

The first line should answer one of:

- what behavior should I watch?
- what is the unusual handoff?
- what systems are combined?
- what familiar object is being changed?

The technical line underneath can answer:

- how does it work?
- what remains local?
- what is shared?
- what is recomputed?

Do not duplicate the same mechanism in both lines using different words.

### Case-study opening

The first screen should answer:

- what is it?
- what was Estelle's role?
- when was it made?
- who else was involved?
- what parts of the product are actually covered?

Use a factual deck and a compact summary table. Do not warm up with a philosophy.

### Case-study sections

Use literal headings and one clear job per section.

Within a section:

1. state the problem or decision plainly;
2. show the relevant screen, diagram, or demo;
3. explain the mechanism or revision;
4. stop when the evidence is clear.

Not every section needs a dramatic tension, a lesson, and a concluding thesis.

### Technical explanation

Choose the order that matches the point.

If the reader first needs context:

> visible behavior → constraint → mechanism → consequence

If the mechanism is the hook:

> mechanism → visible behavior → why it matters

Both are valid. Do not bury an unusual mechanism behind product-language setup.

### Retrospective

Be direct about what works and what does not.

Good forms:

- `I would keep ___.`
- `I would change ___.`
- `The ___ works better than the ___.`
- `I would not call it finished until ___.`
- `I like ___ more than ___.`

Avoid:

> This project taught me the importance of balancing user needs with technical constraints.

Name the part you would actually change.

### Links and proof

Only show a source, live demo, or deep dive when it helps the reader inspect something real.

It is fine to omit a link when:

- the build is not ready;
- the repository is noisy or misleading;
- the live version no longer represents the work;
- the snippet already shows the relevant behavior.

More links do not automatically make the work more credible.

---

## 8. Sentence-level fingerprint

### Fragments are allowed on compact surfaces

Good:

> lathing, baking, and deforming a lightweight 2D mesh with 3D features

Do not add `This experiment explores` just to make it grammatical.

### Full prose should still sound spoken

Use contractions:

- `I'm`
- `didn't`
- `couldn't`
- `it's`
- `I'd`

Uncontracted prose often sounds like an application essay.

### Ordinary verbs beat professional nouns

Prefer:

- built;
- made;
- kept;
- split;
- moved;
- stored;
- changed;
- broke;
- tried;
- chose;
- drew;
- packed;
- fed;
- baked;
- lathed;
- deformed.

Distrust:

- leveraged;
- facilitated;
- enabled;
- empowered;
- operationalized;
- ideated;
- delivered, when `built` is more accurate.

### Lists should be concrete

Good:

> contracts, proof, partners, transaction incentives, and somehow crypto wallets

Weak:

> trust, accountability, motivation, and community

### Short sentences can carry judgment

Use them in case studies, not every card.

Good:

> The state model works. Some screens still do not.

Do not manufacture a dramatic landing sentence for every paragraph.

---

## 9. What to distrust on sight

These are not banned, but they require immediate evidence:

- thoughtful;
- intentional;
- expressive;
- ambitious;
- coherent;
- seamless;
- robust;
- innovative;
- novel;
- intuitive;
- scalable;
- meaningful;
- human-centered;
- end-to-end;
- product surface;
- intersection of;
- leverage;
- empower.

Usually generated-sounding:

- `sits at the intersection of...`
- `bridges the gap between...`
- `not just X, but Y`
- `This project explores...`
- `The result is a seamless...`
- `A system designed to empower...`
- `where X, Y, and Z come together`
- `from idea to polished implementation`
- `one claim, one mechanism`
- `technically ambitious` repeated outside the main positioning line
- headings that announce a revelation rather than naming the section

When one appears, ask:

> What is the noun, mechanism, or visible behavior hiding underneath this phrase?

Write that.

---

## 10. Calibration from the August 3 edits

| Before | After | Rule |
| --- | --- | --- |
| `SWE intern @ PayPal · checkout-friction tooling + frontend` | `Frontend SWE intern @ PayPal` | Use the recognized role in status copy. |
| `full-time design engineering / product frontend` | `full-time design engineering / creative tech` | Name the field you actually want, not the narrowest adjacent job title. |
| `A shared 30 fps ticker drives...` | `orbit, chase, and burst behavior that follows user attention` | Label the behavior in the preview; keep implementation in technical copy. |
| `One non-interactive WebGL overlay tracks...` | `non-intrusive WebGL / SVG overlay to enhance everyday DOM objects` | Name the media and the familiar objects being changed. |
| `A Hume voice agent delivers route cues...` | `voice agent and interactive artifact-driven take on maps for detours` | Describe the actual product model without making it a polished thesis. |
| `Drag state stays local...` | `minimal feedback loop for collaborative editing with WebSockets` | Summarize the interaction model, not every state update. |
| `Depth Anything runs in a worker...` | `using Depth Anything v2 to create hi-fi, low-load 2.5D parallax scenes` | Name the model and the performance/fidelity target. |
| `Radial distance and layered noise drive...` | `one noise field for multiple visual effects + cursor becomes dancing spark` | Let one line contain mechanism plus the fun visible behavior. |
| `Canvas input feeds alternating WebGL textures...` | `bottom pixel row of a CPU canvas feeds top row of a GPU diffusion shader` | Prefer the exact handoff over a generalized pipeline summary. |
| `D3 forces pack grammar-tagged words...` | `packing algorithms + POS tagging + d3-force = organic but ordered text layouts` | Equation-like shorthand is allowed when the combination is the point. |
| `A material editor that turns...` | `Material editor that turns...` | Treat project descriptions as captions; omit repeated articles. |
| `A habit app built around...` | `Social habit app built around... and somehow crypto wallets.` | A restrained aside can make an odd scope feel honest. |

---

## 11. Revision workflow

### Pass 1: identify the surface

Is this:

- status metadata;
- a project-card caption;
- an interaction label;
- technical explanation;
- case-study prose;
- retrospective copy?

Do not apply long-form grammar to a label or fragment shorthand to a paragraph.

### Pass 2: find the key noun

Write the object first. If the sentence starts with `This project`, delete those words and try again.

### Pass 3: find the differentiating mechanism

Ask what the obvious implementation would have been and what this one does differently.

### Pass 4: choose behavior-first or mechanism-first

- Behavior-first when the mechanism needs context.
- Mechanism-first when the handoff, algorithm, or medium is the interesting part.

### Pass 5: compress with structure

Try one of these only if it clarifies:

- `X + Y`
- `X / Y`
- `X = Y`
- `X → Y`

Do not use operators merely to make ordinary copy look technical.

### Pass 6: remove the professional wrapper

Cut claims that the work is thoughtful, innovative, expressive, seamless, or human-centered. Keep the fact that creates that impression.

### Pass 7: add personality only if it is already there

If the project has an honestly weird constraint, one dry aside may belong. Do not invent one.

### Pass 8: compare adjacent cards

Check for repeated openings, sentence shapes, and operators. The portfolio should share a voice without looking generated from one syntax template.

### Pass 9: read it aloud once

If it sounds like a panel abstract, shorten it. If it sounds like raw notes no one else can parse, restore one noun or relationship.

---

## 12. Fast review checklist

### Every compact line

- [ ] Does it name a concrete object, mechanism, or behavior?
- [ ] Can the leading `A`, `An`, `This project`, or `I wanted` be removed?
- [ ] Is a fragment clearer than a full sentence here?
- [ ] Is the key mechanism specific enough to be memorable?
- [ ] Are operators communicating a real relationship?
- [ ] Is there only one main idea?
- [ ] Does the line stop before it explains itself twice?

### Every case-study section

- [ ] Is the heading literal enough to scan?
- [ ] Are role, timeline, and scope easy to find?
- [ ] Does the paragraph say what changed, not just what was considered?
- [ ] Is technical detail attached to a visible screen, behavior, or output?
- [ ] Did the copy avoid turning the section into a universal lesson?
- [ ] Is the strongest evidence visual rather than adjectival?

### AI smell test

- [ ] Could this appear unchanged on another design engineer's portfolio?
- [ ] Are there three abstract nouns before the first visible thing?
- [ ] Did an adjective replace a mechanism?
- [ ] Is the sentence more balanced or polished than Estelle would say aloud?
- [ ] Did an em dash make an ordinary claim sound profound?
- [ ] Did every project acquire the same narrative arc?
- [ ] Did the copy explain a video instead of annotating what to notice?
- [ ] Did a dry sentence get rewritten into an aloof one?

If two answers are yes, revise.

---

## 13. Protected moves

Protect these patterns in future edits:

- recognized role labels: `Frontend SWE intern @ PayPal`;
- project captions without opening articles;
- lowercase interaction fragments;
- exact mechanism handoffs;
- equation-like combinations when the combination is the point;
- one restrained aside when the scope is genuinely odd;
- straightforward case-study headings;
- candid retrospective judgments;
- technical terms that do not apologize for being technical;
- copy that leaves room for the demo to do the explaining.

Protect these existing lines or the move behind them:

- `I came to engineering a little sideways.`
- `I like caring about both the system and the person using it.`
- `The app kept asking one more question...`
- `I like the contract model more than I like every screen.`
- `I would not call the rest finished until...`
- `bottom pixel row of a CPU canvas feeds top row of a GPU diffusion shader`
- `packing algorithms + POS tagging + d3-force = organic but ordered text layouts`
- `and somehow crypto wallets`

---

## 14. Final standard

The copy is ready when:

- a recruiter can name the product and role quickly;
- a design lead can scan the case-study headings without decoding them;
- an engineer can identify the key mechanism without searching for it;
- the interaction labels tell someone what to watch rather than narrating the whole build;
- the copy sounds dry and alive, not polished and aloof;
- the screen, demo, or diagram still does most of the proving.

The target is not perfect prose.

The target is copy that knows exactly why it is there.
