# Portfolio iteration and feedback log

**Scope:** July 26–August 3, 2026  
**Evidence reviewed:** 38 Git commits, the current portfolio source, `PORTFOLIO_STYLE_GUIDE.md`, `PORTFOLIO_WRITING_GUIDE.md`, `glass-lab-brief.md`, and `PORTFOLIO_PROJECTS_VISUAL_BRIEF.md`.

## How to read this

- **Documented feedback** is written explicitly in a brief, guide, or direct copy edit.
- **Inferred goal** is a reasonable interpretation of a code change, not a quote from a reviewer.
- Git records what changed, but not who gave verbal or message-based feedback. Add the reviewer and original wording where known.

## Feedback and direction captured in the workspace

### 1. The projects page felt too much like a resume table

**Documented diagnosis:** Every project used the same text-only row and hid its visual evidence behind a click. The first scroll needed to show that the work shipped for real people, was visually and technically unusual, had clear ownership and results, and contained optional technical depth.

**Requested direction:**

- Make media part of the browsing state instead of withholding all proof until expansion.
- Give featured, standard, and compact projects different levels of visual hierarchy.
- Use more desktop width and create an editorial, image-led index rather than a uniform list of SaaS-like cards.
- Keep role, result, and the path to deeper technical detail immediately legible.

**Source:** `PORTFOLIO_PROJECTS_VISUAL_BRIEF.md`

### 2. The interface should reveal why the work is good

**Documented feedback:** Texture and polish should expose the quality of the content rather than cover for it. Show live behavior, material variables, constraints, before/after states, failure modes, and implementation decisions.

**Requested direction:** Pair claims with visual or manipulable proof, make case studies skimmable, and connect technical mechanisms to perceptual impact.

**Sources:** `glass-lab-brief.md`, `PORTFOLIO_STYLE_GUIDE.md`

### 3. Keep the material language contemporary and coherent

**Documented feedback:** Avoid a scrapbook or handmade-nostalgia treatment. Each object should have one physical story: glass behaves like glass, paper like paper, and controls like mounted controls. Effects should not contradict the implied material.

**Sources:** `glass-lab-brief.md`, `PORTFOLIO_STYLE_GUIDE.md`

### 4. Restrain decorative effects

**Documented feedback:** If a visitor would name the effect before the work, it is too loud. Before finishing, halve the intensity of tilt, particles, or texture and remove one decoration. Motion should explain state, material, or cause.

**Sources:** `glass-lab-brief.md`, `PORTFOLIO_STYLE_GUIDE.md`

### 5. Make interaction state visible and accessible

**Documented feedback:** Show real state such as playback time, slide position, or a live label. Treat hover, focus, and touch as equivalent feedback loops. Pause or remove autoplay for reduced-motion and data-saving users.

**Sources:** `glass-lab-brief.md`, `PORTFOLIO_STYLE_GUIDE.md`, `PORTFOLIO_PROJECTS_VISUAL_BRIEF.md`

### 6. Make the writing sound less professionally explained

**Documented through Estelle's direct edits:** The best voice is dry, specific, compressed, and slightly strange. Name the object and the interesting mechanism, then stop. Compact surfaces can use fragments and operators such as `+`, `/`, `=`, and `→`.

Specific corrections included:

- Use a recognized role label: `Frontend SWE intern @ PayPal` instead of a longer internal-scope description.
- Describe what to notice in a demo rather than narrating the full implementation.
- Put the key mechanism first when it is the hook.
- Remove repeated opening articles from project captions.
- Allow one restrained aside when it adds voice, as in `and somehow crypto wallets`.
- Prefer the broader `products` over the narrower and repetitive `product interactions` in the homepage introduction.

**Sources:** commits `5777dc8`, `396068b`, and `0ffdc11`; synthesized in `PORTFOLIO_WRITING_GUIDE.md`

## Iteration log

### Iteration 1 — Editorial reset and clearer project stories

**Date:** July 26  
**Commits:** `256d7c1`, `2884013`, `4c5e9a1`, `dc24290`

Changes:

- Replaced the animated, typed constellation hero with a quieter editorial introduction containing a clear role statement, short positioning copy, availability, and direct contact links.
- Created a structured source of truth for project copy: purpose, role, result, goal, challenge, decision, ownership, outcome, and reflection.
- Added project media and richer story sections, then simplified the interaction model after trying a cursor-following hover preview and inline expansion.
- Moved the project index toward a list-to-detail flow with a dedicated back action and preserved navigation state.
- Simplified the About page, global surfaces, footer, navigation, and responsive media treatment.
- Made the ambient shader opt-in by default so the work, not the background effect, led the first impression.

**Inferred goal:** Make the portfolio faster to understand and reduce decorative or technically impressive elements that competed with the work.

### Iteration 2 — More personal identity and a simpler cover

**Date:** July 27  
**Commits:** `e921728`, `38764b5`, `67bb45b`, `7368616`, `92ab717`, `0c3bd28`

Changes:

- Updated the resume and its public filename.
- Rewrote About copy around Estelle's actual path from organizing and education policy into engineering.
- Iterated repeatedly on hero balance, spacing, positioning, and contact hierarchy.
- Replaced icon-only resume and email actions with legible text links while keeping quieter social icons.
- Added a compact status margin note for current role, education, and availability.
- Continued simplifying the project index and its transition into project details.

**Inferred goal:** Make the identity feel more human and immediately useful to a recruiter without turning the cover into a dense biography.

### Iteration 3 — Field notes as evidence of process

**Date:** July 28–29  
**Commits:** `302e227` through `e304386`

Changes:

- Added a complete Field Notes area with long-form pages for Internet Atlas, Into the Blue, and material studies.
- Added research artifacts, diagrams, screenshots, PBR maps, iteration images, and a source paper/PDF.
- Added external-link previews, disclosure components, reusable field-note primitives, and source disclosure.
- Expanded material studies with Digital Loom, Pip Foundry, watercolor, mood-ring, and interactive-forest evidence.
- Added a reader-controlled text-size knob and a scroll affordance, then refined both for responsive layouts.
- Made a series of small copy, spacing, and typography corrections after the initial build.

**Feedback addressed:** Show proof and process, not only claims. Give technical readers optional depth without forcing every visitor through it.

### Iteration 4 — Ambient-effect and copy calibration

**Date:** July 29–August 1  
**Commits:** `ff47e36` through `1c91672`

Changes:

- Tested the shader on by default, then reversed that decision and turned it off again.
- Iterated several times on the status margin copy.
- Removed a redundant Field Notes label.
- Tightened cover and project copy and removed lines that did not earn their space.

**Inferred goal:** Calibrate how much personality and ambient motion the first viewport could carry without distracting from the portfolio's purpose.

### Iteration 5 — Deeper flagship case studies

**Date:** August 2  
**Commit:** `8ff8bd3`

Changes:

- Added a dedicated Digital Loom case study with custom layout and a hover preview.
- Expanded project-detail rendering and the projects page to support richer flagship stories.
- Improved Field Notes structure, metadata, and layout for Internet Atlas and Into the Blue.
- Refined video loading behavior and project copy.

**Feedback addressed:** Let a reader see both the finished artifact and the reasoning or technical system behind it.

### Iteration 6 — Major content and design-system expansion

**Date:** August 3, early  
**Commits:** `ff3218d`, `68682a6`

Changes:

- Created formal visual and writing guides so future edits could follow a consistent standard.
- Added a complete Tally case study with flows, state diagrams, setup iterations, verification states, design-system evidence, and demo videos.
- Reworked Digital Loom and the flagship Field Notes pages around stronger hierarchy and visual evidence.
- Added an Interaction Studies grid with ten videos or posters and project metadata.
- Added a new blog story and revised About, homepage, footer, and project copy.
- Added custom Tally cover art, a design-system image, smoother list/detail transitions, and stronger integration with the playground.
- Refined inline featured case-study navigation and preserved list scroll position on return.

**Feedback addressed:** Show visual and technical range immediately, support skimming, and make flagship work feel like authored case studies rather than generic detail pages.

### Iteration 7 — Mobile and interaction reliability

**Date:** August 3  
**Commit:** `4fb6e25`

Changes:

- Fixed mobile interaction-study playback so the active preview follows viewport visibility.
- Prevented desktop hover behavior from fighting the mobile playback model.
- Corrected interaction-grid and Field Notes alignment at small widths.

**Feedback addressed:** Touch should receive an intentional interaction model instead of inheriting hover behavior.

### Iteration 8 — Voice pass driven by direct edits

**Date:** August 3  
**Commits:** `5777dc8`, `396068b`, `063fc61`

Changes:

- Rewrote all interaction-study labels as shorter annotations focused on the visible behavior or the exact technical handoff.
- Simplified the status note to recognizable role and search language.
- Rewrote project-card captions to remove templated openings and add more specific voice.
- Revised project data, Tally, Digital Loom, Internet Atlas, Into the Blue, and the supporting style/writing guides.
- Added or corrected posters so every interaction study had a useful still state before playback.

**Feedback addressed:** Reduce pitch language, let the media carry explanation, and preserve Estelle's actual syntax and humor.

### Iteration 9 — Preview expansion, sharing, and final wording

**Date:** August 3, late morning  
**Commits:** `7505aa8`, `0ffdc11`

Changes:

- Made interaction-study media expandable in an accessible modal with Escape/backdrop close, focus restoration, scroll lock, and reduced-motion handling.
- Added opening and closing motion that keeps the preview visually continuous.
- Added Open Graph and Twitter metadata plus a 1600×1144 social-sharing cover.
- Updated the availability target from `creative tech` to `frontend SWE`.
- Changed the homepage line from `performant, expressive product interactions` to `performant, expressive products`.

**Feedback addressed:** Make demonstrations easier to inspect and the portfolio more intentional when shared outside the site.

## Feedback-to-change map

| Feedback or direction | Changes made | Current read |
| --- | --- | --- |
| Projects read like a resume table | Added thumbnails, media previews, flagship case studies, interaction-study grid, roles/results, and list-to-detail transitions | **Partially addressed.** The current index still uses one compact row pattern; the documented featured/standard/compact editorial layout is not fully represented. |
| Show why the work is technically and aesthetically good | Added Field Notes, artifacts, diagrams, implementation evidence, demo media, Tally and Digital Loom case studies, and expandable interaction previews | **Strongly addressed.** |
| Reduce decorative competition | Removed the constellation hero, simplified surfaces, turned the shader off by default, and adopted stricter motion rules | **Mostly addressed.** Decorative stars remain in project section headings even though the visual brief recommends removing that repetition. |
| Make the voice sound like Estelle | Applied direct copy edits, created a writing guide from them, used fragments/operators, and removed templated openings | **Strongly addressed.** |
| Make hover, focus, touch, and reduced motion intentional | Added mobile viewport-based playback, focus-visible states, dialog focus restoration, reduced-motion branches, and data-saving checks | **Strongly addressed in the reviewed components.** |
| Make work easy to inspect and share | Added query-addressable project detail states, back/scroll restoration, preview modals, social metadata, and a share image | **Addressed.** |
| Keep one coherent physical story per object | Added the rule to the style system and used paper/glass/media-specific treatments | **Needs a visual QA pass.** The principle is documented, but consistency across every page cannot be established from history alone. |

## Feedback still missing from the record

Git and the local briefs do not identify the people, meetings, messages, or exact quotes behind most revisions. To make this a complete feedback history, add entries in this format:

| Date | Reviewer / context | Original feedback | What changed | Commit or link | Status |
| --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | Name, portfolio review / interview / friend critique | Exact quote or faithful paraphrase | Concrete response | Commit, screenshot, or page | acted on / testing / declined |

