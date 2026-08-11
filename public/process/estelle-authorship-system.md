<!-- Generated from Estelle_Kim_Authorship_System.docx. -->
<!-- Edit the source document or this Markdown intentionally; do not silently normalize the language. -->

# how I build 0 → 1

*How I turn an idea into working software, from the first question to the final checks.*

> **In one line:** start with a real need, choose one clear interaction, make its behavior easy to follow, and prove it works outside the demo.

_Based on my project history, repositories, and the feedback I have given while building. This is a living document that I update as I learn, build, and refine how I work._

<details class="process-section" open>
<summary>How to use this document</summary>

<p class="process-kicker">HOW TO USE THIS</p>

This is a practical record of how I make product and engineering decisions. It covers how I develop an idea, work with other people, respond to feedback, build the software, and decide when it is ready.


| Element | Definition |
| --- | --- |
| Observed | Something I said, changed, built, or documented. |
| Inferred | A pattern that appears across several projects or corrections. |
| Rule | A practical instruction drawn from those patterns. |
| Limit | Something the available work cannot prove. |

### What it is for

- Keep the original reason for a project visible as the work becomes more detailed.

- Show collaborators and AI how to contribute without making decisions on my behalf.

- Catch work that looks finished but does not solve the right problem or hold up in use.

> A process cannot prove that only one person could have made the result. It can show which decisions are mine, which came from collaborators, and why the final product took this form.


</details>

<details class="process-section">
<summary>1. What stays consistent across my work</summary>

<p class="process-kicker">PART I / WHAT STAYS CONSISTENT</p>

My projects look different, but I usually make the same move: take a familiar object or task, find the part the software hides, and make that part visible and usable.

### The pattern


| Element | Definition |
| --- | --- |
| Need | A person needs to understand, decide, learn, collect, play, or recover—not just admire an effect. |
| Object | The interface centers on something concrete: a map, word, artifact, stroke, data cell, or material sample. |
| Rule | One clear rule controls the important behavior. Its input, limits, and result can be explained. |
| Material | Paper, pigment, cloth, glass, metal, or light follows one believable physical model. |
| Cause and effect | A person can tell what they did, what changed, and when the system is finished responding. |
| Reliability | State, performance, recovery, accessibility, responsive behavior, and deployment work under real conditions. |
| Language | Describe the object and the key mechanism. Stop when the reader understands them. |

### The combination matters

None of these parts is unique by itself. The work becomes specific through the order of the decisions: the need defines the model; the model defines the unit; one rule controls the unit; the visual treatment explains the rule; and the code preserves it in real use.

> **Check:** if I can remove the user’s need, the main rule, or the visible cause and the project still looks the same, I have designed a style rather than a product.


</details>

<details class="process-section">
<summary>2. Tradeoffs I keep in balance</summary>

The work often requires two things that pull in opposite directions. I do not choose one and ignore the other; I decide where each belongs.


| Demand A | Demand B | Resolution |
| --- | --- | --- |
| Move quickly | Do not simplify the idea too early | Prototype early. Write the general rule only after it works in several cases. |
| Build systems | Do not build an engine before a working example | Generalize only when the same problem appears more than once. |
| Leave room for interpretation | Keep system behavior clear | Meaning can stay open. State changes and consequences cannot be arbitrary. |
| Use rich materials | Keep the default view quiet | Put texture, light, and motion where contact or change occurs. |
| Make personal work | Build with other people | Own the judgment and synthesis; credit the people who changed the result. |
| Try unfamiliar interactions | Ship reliable software | New behavior still needs stable state, recovery, cleanup, and responsive handling. |
| Use AI for range | Keep decisions and rendering controlled | AI can propose and critique. People approve decisions; deterministic code produces the result. |
| Write briefly | Keep the reason and the credit | Cut repetition, not motive, mechanism, or attribution. |


</details>

<details class="process-section">
<summary>3. How I develop an idea</summary>

<p class="process-kicker">PART II / DEVELOPING THE IDEA</p>

I do not start with a product category or visual style. I start with something that feels wrong: the interface hides important evidence, a material looks right but moves incorrectly, or a system has many rules without a reason to exist.

#### 01 / State what feels wrong

Write the problem before proposing a solution. Keep more than one explanation open until the source of the problem is clear.

#### 02 / Name the person and the task

Write who is doing what, what they might misunderstand, and what happens if they are wrong. In high-stakes work, show the evidence and make permission explicit.

#### 03 / Gather useful sources

Look at code, physical materials, older projects, policy, games, graphics research, collaborators, and direct observation. Use references to study how something works, not just how it looks.

#### 04 / Find the smallest unit that matters

Choose the smallest thing whose state matters: a stroke, data cell, word, artifact, card, pixel, node, material sample, control, or claim. Define its data and behavior before drawing the full interface.

#### 05 / Choose one main rule

Pick one rule that can carry the idea. Define its input, range, state change, timing, limits, and stopping point.

#### 06 / Build the smallest working example

Build enough to prove the rule wrong or useful. Do not start with a general engine, full design system, or polished product shell.

#### 07 / Test the rule under pressure

Change the content, density, screen size, latency, and input method. Fix repeated problems. Do not create a new abstraction for one awkward case.

#### 08 / Test it at other scales

Once the unit works, see whether the same rule can organize a component, layout, animation, or product flow without becoming vague.

#### 09 / Choose the material behavior

Choose one material or lighting model that makes the behavior easier to understand. Texture and effects cannot rescue a weak idea.

#### 10 / Put it in a real workflow

Decide where the idea fits into an existing design or product process. If another tool already solves the same problem, narrow or change the idea.

#### 11 / Make it production-ready

Separate state from rendering. Preserve history and sources. Handle recovery, export, performance, touch, keyboard input, and reduced motion.

#### 12 / State what is still unresolved

Do not hide uncertainty behind polished copy. Record it and decide whether it blocks launch.

### Questions I ask

- What is the actual object or task?

- Who is acting, and what are they trying to know or change?

- Which parts of the familiar interaction are necessary, and which are just convention?

- What is the smallest stateful unit?

- What changes it: human input, a neighbor, time, data, or substrate?

- What must stay true as the design changes?

- What would make the result feel random or unjustified?

- What existing project already contains a useful piece of this logic?

- Where does this belong in real work?

- What result would justify building a reusable system?


</details>

<details class="process-section">
<summary>4. What my corrections reveal</summary>

<p class="process-kicker">PART III / WHAT FEEDBACK CHANGED</p>

My corrections show my standards more clearly than an initial brief. Most of them make the same point: do not replace the specific problem with generic copy, a general framework, or a visual effect.


| Correction signal | What failed | Permanent rule |
| --- | --- | --- |
| “Too wishy washy.” | Abstract positioning could apply to many people. | Replace identity claims with a concrete object, decision, or mechanism. |
| “It doesn’t sound like me.” | Tone matching without evidence or syntax. | Read direct writing and edits; preserve compression, technical nouns, and dry judgment. |
| “Now that’s too juvenile.” | Casual voice became simplified thinking. | Keep language ordinary while preserving the full adult motive and consequence. |
| “You’re oversimplifying my intent.” | The shorter version removed the reason for the work. | Cut repetition, not meaning, cause and effect, or credit. |
| “This is not practical to the actual design process.” | A compelling concept floated outside real work. | Name the workflow stage, input, decision, output, and handoff. |
| “Isn’t that just Rivet?” | The proposed product already existed. | Compare it with similar tools and state the exact difference. If there is none, stop. |
| “One elegant pattern / mechanism.” | Too many rules made the identity feel generated. | Select one primary rule; secondary effects must be consequences or separate layers. |
| “Let’s not build an engine until we have working models.” | The reusable system came before proof that the idea worked. | Build working examples first. Generalize only what repeats. |
| “Keep this current interface somewhere.” | Iteration threatened useful prior work. | Preserve a recoverable baseline before a broad redesign. |
| “Don’t touch anything in the actual canvas rendering.” | A narrow visual request was about to change the core system. | List what must stay untouched and edit the smallest possible layer. |
| “Not the type, controls, etc.—just the visual canvas rendering details.” | “Bring over the style” was interpreted too broadly. | Translate the exact visual property, not the whole component vocabulary. |
| “Everything should use the same engine.” | Illustrative previews duplicated live rendering logic. | Use one source of truth and controlled snapshots; eliminate look-alike implementations. |
| “The light should lag…because it’s a separate medium.” | The light followed the cursor directly instead of moving like a separate material. | Define what moves, when it starts, how fast it follows, and how it stops. |
| “The grid logic is incomprehensible and useless to the viewer.” | The interface showed internal complexity that did not help the viewer. | Show structure only when it helps someone understand or predict behavior. |
| “The paper looks plastic-y.” | Texture and gloss contradicted the named substrate. | Use credible scale, edge response, light behavior, and one physical story. |
| “Make sure we’re not making up rules for the sake of it.” | The system had rules with no practical purpose. | A rule must solve a repeated problem or preserve an important relationship. |
| “Sometimes rules are meant to be broken.” | Numeric consistency overrode optical judgment. | Allow named human exceptions; make the reason inspectable. |
| “The point around natural language was super ambiguous.” | Natural-language input had no defined job. | Show the interpreted request, ask for clarification, return an answer, and show the evidence. |
| “It’s not Tug’s flow; it’s the PayPal LLM interface.” | A good idea was attributed to the wrong project. | Do not borrow evidence across projects. Preserve source, collaborator, and ownership. |
| “I like my language better—think about the essence and metaphor.” | Polishing the sentence removed its central image. | Keep the original image and edit around it. Do not turn it into brand copy. |
| “The worst thing for a canvas to be is glitchy.” | Visual novelty was treated separately from reliability. | Interaction fidelity includes stable state, input sequencing, and rendering under stress. |
| “Everything has a purpose that isn’t blocked.” | A disclaimer ended the thought without giving the reader a useful next step. | Every sentence should help someone understand, decide, or act. Turn limits into a clear response or update path. |

### How to handle a correction

- Patch the immediate problem.

- State what was assumed and what was actually required.

- Check whether the same mismatch appears in another project or earlier correction.

- If the issue repeats, update the relevant rule or source document. If it does not, keep it as a local exception.

- Retest the broader system so the correction does not create a new contradiction elsewhere.


</details>

<details class="process-section">
<summary>5. How I work with other people</summary>

<p class="process-kicker">PART IV / WORKING WITH OTHERS</p>

I make unclear input concrete enough for a team to review and act on. I also keep track of who supplied the facts, constraints, and ideas that changed the work.

### Before dividing the work

- Ask what each person wants to learn, not only what role they already occupy. Internet Atlas expanded because task ownership followed learning goals across language, clustering, embeddings, data, backend, and 3D work.

- Identify who has authority over each decision. Museum staff owned cultural context and artifact constraints. Product managers and data engineers owned checkout questions and data meaning. Engineers owned production integration and code review.

- Define the handoffs. Early technical review should focus on the point where one person’s output becomes another person’s input.

- Separate facts, preferences, and open questions. A polished presentation does not make a claim authoritative.

### During iteration

- Share rough structure early. Put open questions in the working file before visual polish makes them expensive to change.

- Use one shared coordinate system, protocol, state model, or renderer when different disciplines need to touch the same object.

- Treat feedback as a possible change to the product model, not a list of cosmetic edits. A gallery walk removed a prescribed route. A request for natural-language input became a clarification and evidence flow. Code review changed the implementation.

- Record important decisions as “started with → changed to.” This preserves the reason without turning every revision into a case study.

- When the schedule gets tighter, say what is being cut or deferred.

### When people disagree

- Return to the person affected and the consequence of being wrong.

- Return to source material or observed behavior instead of arguing through taste words.

- Build the smallest comparison that isolates the disagreement.

- Change one declared variable at a time.

- If both versions work, keep the difference as a clear choice or exception. Do not invent a universal rule.

### Credit and ownership

Be exact about what I started, built, inherited, adapted, and co-built. Name the museum staff, designers, teammates, reviewers, friends, and managers whose input changed the product. A personal point of view does not require pretending I worked alone.

> Good collaboration keeps another person’s constraint visible. It does not absorb every contribution into my style.


</details>

<details class="process-section">
<summary>6. How I use AI</summary>

I use AI to inspect, compare, critique, draft, and implement. It causes problems when it makes an unresolved decision for me, rebuilds something that already exists, or smooths specific language into generic copy.


| Element | Definition |
| --- | --- |
| Human | Sets the goal, sources, consequences, taste, exceptions, and final choice. |
| AI | Inspects, summarizes, proposes, compares, critiques, drafts, and helps implement. |
| Domain model / compiler | Enforces rules, validates input, preserves history and sources, and produces repeatable results. |
| Renderer | Draws the result, handles visual transitions, and captures direct input. |

### Required AI behavior

- Inspect repositories, current artifacts, and direct edits before proposing a new system.

- State the real problem in plain language and show the evidence behind that reading.

- Offer no more than three directions. They should change the structure, not just the styling.

- State what will remain untouched before making a scoped change.

- Reuse existing logic, renderers, and assets when they already encode the right relationship.

- Treat a correction as a sign that the working assumption was wrong. Update it before continuing.

- Challenge unsupported claims such as “scalable,” “physical,” “offline-first,” or “production-ready.”

- Prefer exact nouns and mechanisms over professional language.

- Keep generated suggestions out of the final render path until a person accepts them.


</details>

<details class="process-section">
<summary>7. How I choose between two good options</summary>

<p class="process-kicker">PART V / MAKING DECISIONS</p>

When two options both work, I compare them in this order. Novelty and polish come last.

1. Truth

Does the interface preserve the source, actual capability, attribution, and consequence?

2. Human use

Can the intended person understand the state, act, recover, and predict the outcome?

3. Main rule

Is there one explainable rule with clear limits, stable state, and visible cause?

4. Product fit

Does the idea occupy a real workflow and improve a real decision without duplicating an existing tool?

5. Composition

Is the hierarchy clear before the visual effects appear? Is one thing doing the main work?

6. Material behavior

Do texture, light, depth, and motion agree with the named substrate?

7. Reliability

Can state replay, scale, recover, clean up, export, and survive input/device variation?

8. Specificity

Would a generic visual treatment leave the result unchanged?

9. Novelty

Is the unfamiliar part still useful after every earlier layer passes?

### When a rule deserves to exist

- A rule earns permanence only after it solves a repeated collision.

- A metric is useful only if changing it changes a real design decision.

- A constraint should come from physics, meaning, product risk, performance, accessibility, collaboration, or a deliberate design choice.

- Optical corrections are valid. Record them as exceptions instead of pretending they are universal.

- When a rule makes every output look equally distributed or equally “designed,” it is probably erasing composition.


</details>

<details class="process-section">
<summary>8. Visual and interaction choices</summary>

The visual style comes from how the interface behaves, not from a mood board. The default view stays calm. Detail appears through contact and change.


| Element | Definition |
| --- | --- |
| Default state | Still. Pointer movement may move light; state changes require explicit input; every response stops. |
| Composition | One focal object, asymmetry, cropping, empty territory, and unequal visual weight. Avoid equal cards and decorative background competition. |
| Material | Warm paper, glassine, pigment, cloth, metal, iridescence, emboss, or grain. Use one main material effect per view. |
| Edges | Refraction, pooling, relief, contact shadow, and contrast live where a surface ends, overlaps, folds, or receives input. |
| Color | Neutral field; deep cobalt for structure; electric ultramarine for active ink or light; faint atmospheric color. Add another hue only when it explains meaning or light. |
| Type | Editorial serif for identity and artifact language; clear sans for controls and explanation; mono for exact values; glyph font for marks only. |
| Motion | Interruptible and ordered. Input → transfer → imprint → rest is stronger than an ambient loop. |
| Density | The surface can be strange or complex, but the primary object and action remain obvious. |

### What I remove

- If the effect is more noticeable than the object, reduce it. If it still takes over, remove it.

- If a paper surface looks plastic, correct scale, roughness, light spread, and edge behavior before adding more layers.

- If accent colors only decorate different states, remove them or give each a clear meaning.

- If motion does not explain state, material, cause, or action, it is not worth its cost.

- If a grid is visible but does not help someone interpret or predict behavior, hide it or replace it with the actual path.

- If material effects make the information harder to read, remove the effects.


</details>

<details class="process-section">
<summary>9. How I structure the software</summary>

<p class="process-kicker">PART VI / BUILDING THE SOFTWARE</p>

Not every experiment is built for large-scale production. Across the repositories, I still use the same foundations: local state, explicit event order, repeatable output, shared rendering code, and a clear split between product meaning and visual presentation.


| Element | Definition |
| --- | --- |
| Localize state | Keep drag local and send only changed words; keep component state near the object; use typed protocols at boundaries. |
| Define the source of truth | Store strokes, accepted data cells, compiled material state, or graph edges—not rendered pixels or generated prose. |
| Replay instead of patching pixels | Use deterministic inputs for undo, resize, reconnect, export, late join, and verification. |
| One engine, many views | Render system and parts as controlled states of the live renderer; share a compositor, listener, or animation loop. |
| Separate layers | Framework-free engine / product state / compiler / renderer / adapter / interface. Each layer has one authority. |
| Preserve native behavior | Visual overlays ignore pointer input. The existing page keeps focus, form behavior, events, and accessibility. |
| Sequence expensive work | Move heavy processing to capture time, a worker, an offline bake, or explicit invalidation instead of every frame. |
| Limit expensive work | Bound rule range, render areas, target counts, travel, texture resolution, and effect intensity. |
| Version and export | Keep schemas, seeds, maps, sources, parameters, and recoverable snapshots so artifacts can move between systems and survive changes. |
| Test the weird path | Private browsing, reconnect, touch, viewport resize, reduced motion, keyboard, cleanup, unsupported capabilities, and stale responses. |

### Evidence from the repositories


| Element | Definition |
| --- | --- |
| paper-between-us | Strokes are the unit of truth; deterministic replay drives live rendering, sync, resize, reveal, reconnect healing, and poster export. |
| iridescence | One non-interactive WebGL layer leaves the page usable; renderers share coordinates, one listener, one animation loop, cleanup, stress tests, and limited render areas. |
| material-engine | A standalone compiler limits manufacturing choices, shares one compositor, creates fixed output files, keeps optical references separate, and defines release checks. |
| softcopy | People, the language model, compiler, and renderer have separate jobs; meaning is defined before generation; one rule controls behavior; results can be reproduced and traced to their inputs. |
| magnetic-poetry | Local dragging plus minimal WebSocket diffs; proportional positions; HiDPI export reconstructs the board instead of screenshotting it. |
| into-the-blue | One coordinate system for guide/crop/sticker geometry; capture-time processing; IndexedDB recovery; museum constraints changed route and content. |
| internet-atlas | Cross-layer data plumbing, cached semantic vectors, participant paths, explicit handoffs; also a reminder not to overclaim renderer scalability. |
| portfolio | Media, state, accessibility, reduced motion, mobile playback, evidence, and copy are revised as one product—not separate presentation work. |

### Claims I can support

- Say production-minded when the code shows persistence, failure handling, deployment, lifecycle cleanup, versioning, testing, accessibility, or explicit performance work.

- Say scalable only when the relevant path has clear limits, measurements, or an architecture designed for the stated scale. Infrastructure alone is not proof.

- Say local-first when durable local state exists; do not say offline-first without a cold-launch path such as a service worker.

- Separate audience traffic, organization reach, and actual product usage.

- Do not transfer implementation details from an earlier version or adjacent repository without verifying the current source.


</details>

<details class="process-section">
<summary>10. My build process</summary>

<p class="process-kicker">PART VII / BUILD STEPS</p>

I use this sequence for a new product, tool, or interaction. It keeps the original problem visible while the implementation gets more complex.

#### 01 / Problem

In one or two plain sentences, write what feels wrong, hidden, or decided too early.

#### 02 / Person

Name the person, context, task, and consequence of misunderstanding. Add the relevant sources and collaborators.

#### 03 / Object

Choose the concrete object the interface manipulates. If it cannot be pointed to, the brief is not ready.

#### 04 / Source of truth

Define the authoritative data and its source. Decide what can be generated, what requires approval, and what must be reproducible.

#### 05 / Unit

Define the smallest meaningful stateful unit and its exact data shape.

#### 06 / Main rule

Define one main rule: input, range, state change, limit, timing, stopping point, and failure case.

#### 07 / Working example

Build one working model. No general engine. No full design system. No decorative product shell.

#### 08 / Review

Compare the model with the person’s task. Record what someone can and cannot understand from its behavior.

#### 09 / Product fit

Place the model in a real workflow. List nearby tools and state exactly what this does differently.

#### 10 / Composition

Establish hierarchy, focal object, spatial unit, and temporal cadence before material.

#### 11 / Material

Choose one physical model. Decide how state and input affect light, depth, texture, contact, and rest.

#### 12 / Architecture

Separate product state, domain model, deterministic core, renderer, adapters, and UI. Reuse proven logic.

#### 13 / Stress test

Test density, mobile, touch, keyboard, reduced motion, latency, stale data, reconnect, failure, cleanup, and export.

#### 14 / Language

Name the object and differentiating mechanism. Remove claims the artifact already proves.

#### 15 / Ship

Version inputs, seeds, exceptions, sources, and outputs. State known limitations plainly.


</details>

<details class="process-section">
<summary>11. Checks before I ship</summary>

A build is not ready just because it looks polished or works in a demo. I check each layer below.


| Gate | Pass condition | Status |
| --- | --- | --- |
| Person | The task, consequence, and domain authority are clear. | □ pass □ revise |
| Meaning | The hierarchy and generated content preserve meaning and sources. | □ pass □ revise |
| Main rule | One rule explains the important behavior. Its limits and stopping point are clear. | □ pass □ revise |
| Product | The artifact changes a real decision or action and does not duplicate a nearby tool. | □ pass □ revise |
| Composition | The first reading and primary action are clear before texture. | □ pass □ revise |
| Material | The substrate behaves credibly and makes the mechanism easier to perceive. | □ pass □ revise |
| Interaction | Input, feedback, transition, and rest happen in a clear order. | □ pass □ revise |
| Engineering | State truth, replay, failure, cleanup, accessibility, responsiveness, and performance are handled. | □ pass □ revise |
| Language | The object and mechanism are clear without generic persuasion. | □ pass □ revise |
| Specificity | Removing the person’s need or the main rule would change the product, not only its appearance. | □ pass □ revise |

### Reasons to stop or rethink the project

- The concept can be described without naming a person, object, or consequence.

- The proposed tool is an existing product with my visual style applied.

- The behavior needs several unrelated rules to look intentional.

- The only evidence that the work is mine is paper, glass, stars, blue, or WebGL.

- The engine exists mainly to generate variations instead of solving a repeated problem.

- The interface hides the source, evidence, or uncertainty required to trust its output.

- The render path contains unreviewed LLM judgment or non-replayable state.

- A visually impressive canvas is unreliable under touch, resize, reconnect, or sustained input.

- The project only sounds important when the copy overstates its reliability, physics, novelty, or scale.


</details>

<details class="process-section">
<summary>12. Brief template</summary>

<p class="process-kicker">PART VIII / TEMPLATES</p>

Fill this in before asking an AI, collaborator, or future version of me to build. A blank field means a decision is still open.


| Field | Prompt / response space |
| --- | --- |
| Problem | What feels wrong, hidden, simplified, or decided too early? |
| Person + context | Who is using this, where, and what are they trying to do? |
| Consequence | What happens if the interface is misunderstood or fails? |
| Sources | Which artifacts, data, people, and constraints are authoritative? |
| Concrete object | What can the person point to, collect, move, inspect, compare, or change? |
| Source of truth | What state must survive rendering, reconnect, resize, and export? |
| Smallest meaningful unit | What is the smallest item that carries state or meaning? |
| Main rule | Input → local rule → visible change → rest. |
| Bounds | Neighborhood, energy, latency, density, scale, risk, and exceptions. |
| Material model | Surface, light, depth, texture, contact, and what is not being simulated. |
| Spatial logic | Base unit, ratios, optical corrections, focal object, and target viewports. |
| Temporal logic | Time quantum, delay, interruption, settling, and reduced motion. |
| Product difference | Where this enters real work and why an existing tool does not already solve it. |
| Protected areas | What must not change during this iteration? |
| Architecture | Domain model, deterministic core, renderer, adapters, UI, storage, export. |
| Collaboration | Who owns facts, constraints, design judgment, implementation, and approval? |
| Evidence plan | What prototype, trace, test, or comparison will prove the decision? |
| Known limitations | What is not yet true? |
| Ship definition | What exact artifact leaves the workbench? |


</details>

<details class="process-section">
<summary>13. What I want back from a collaborator or AI</summary>

This format makes assumptions visible and keeps polished presentation from hiding a weak decision.


| Element | Definition |
| --- | --- |
| Real question | The unresolved problem, stated in plain language. |
| Evidence | Direct sources, repo behavior, user corrections, and what is inferred rather than observed. |
| Recommendation | One direction and why it is the best fit. |
| Alternatives | No more than two different options, each with a real tradeoff. |
| Protected scope | Files, systems, language, interactions, or visual elements that remain untouched. |
| Working example | The smallest implementation that can prove the recommendation wrong. |
| Next check | What must be visibly or technically true before expanding the work. |
| Contradiction check | Which earlier rule, project, or stated preference this could conflict with. |
| Limit | What the evidence does not support yet. |


</details>

<details class="process-section">
<summary>14. Check for generic work</summary>

<p class="process-kicker">PART IX / FINAL CHECKS</p>

Use this once the concept works but before polishing it. These questions catch work that looks good but could belong to anyone.

- □ Could another design engineer change the typography and colors without changing how the product works?

- □ Did the project begin with a category (“AI design tool,” “ambient interface,” “data canvas”) instead of a specific problem?

- □ Is the main rule a familiar demo that does not improve the person’s task?

- □ Are multiple effects compensating for weak composition or unclear state?

- □ Does the material explain behavior, or is it only a recognizable wrapper?

- □ Can the person inspect why the system made a consequential decision?

- □ Is AI working within stated limits, or silently deciding those limits?

- □ Does the architecture preserve one source of truth and replay?

- □ Does the language name the exact object and unusual handoff?

- □ Are collaborators and source constraints visible in the outcome?

- □ Would removing the weirdest visual detail leave the core idea intact?

- □ Would removing the person and their need leave the same demo?

> If the answer is “yes” to question 1, 2, 3, 4, or 12, the project is not specific enough. Return to the problem, person, object, or main rule before polishing it.


</details>

<details class="process-section">
<summary>15. How I edit the writing</summary>

The writing should preserve the important decisions after the work leaves my hands.

### Keep

- Concrete nouns early.

- Sentences that help the reader understand, decide, or act.

- Exact technical handoffs and ordinary verbs.

- Fragments on compact surfaces.

- Operators when they encode a real relationship: +, /, =, →.

- One restrained aside when the scope is honestly strange.

- Literal headings and candid retrospectives.

- Known limits stated without apology or inflation.

### Cut or question

- Thoughtful, intentional, expressive, seamless, innovative, intuitive, human-centered, scalable, robust.

- “This project explores…” and “I wanted to…” when the object can be the subject.

- A dramatic thesis when a literal heading would be clearer.

- Perfectly balanced prose that sounds more polished than I would say aloud.

- A short version that deletes why, who, or what changed.

- A claim that the screen, trace, test, or code should be proving instead.


</details>

<details class="process-section">
<summary>16. Sources for this document</summary>

<p class="process-kicker">PART X / SOURCES</p>

This document comes from available conversations, corrections, repository history, and project documentation. These are the main sources, not a complete list.


| Element | Definition |
| --- | --- |
| Conversation corrections | Explore generative interfaces / Softcopy; Software and Interaction Design; Continue startup project ideas; Aristotle vs Greptile; Frontend/Product Engineering Roles; Founding Engineer Interview Prep; Greptile branding; portfolio iteration discussions. |
| Writing source of truth | my-portfolio/PORTFOLIO_WRITING_GUIDE.md and commits 5777dc8, 396068b. |
| Visual source of truth | my-portfolio/PORTFOLIO_STYLE_GUIDE.md; softcopy/docs/SOFTCOPY_TASTE.md; softcopy/docs/SOFTCOPY_IDENTITY_GRAMMAR.md. |
| Product model | softcopy/docs/SOFTCOPY_PRODUCT_MODEL.md. |
| Self-described thinking | my-portfolio/src/app/blog/pages/compressed-thinking.tsx; new-portfolio.tsx; about/page.tsx; field-notes/page.tsx. |
| Feedback history | my-portfolio/PORTFOLIO_ITERATION_LOG.md and project case studies. |
| Deterministic collaboration | paper-between-us/README.md; magnetic-poetry/README.md. |
| Non-intrusive visual systems | iridescence/README.md and source architecture. |
| Bounded material compiler | material-engine/README.md and OBJECT_SPEC.md. |
| Domain-constrained product work | Into the Blue and Internet Atlas repositories plus portfolio field notes. |
| Repository history | Git logs across my-portfolio, Into the Blue, Internet Atlas, Textellation, Iridescence, Magnetic Poetry, and related projects. |

### How certain each part is


| Element | Definition |
| --- | --- |
| High | Writing voice, correction patterns, preference for one main rule, clear cause and effect, consistent material behavior, reliable architecture, and exact credit. |
| Medium-high | General ideation sequence, collaboration method, decision hierarchy, and AI role separation. These recur across projects but may change by context. |
| Provisional | Any single universal visual palette, fixed mathematical rule, or claim that every future project should use material simulation or generative behavior. |


</details>

<details class="process-section">
<summary>17. Short version</summary>

> Start with a real problem. Choose a concrete object and one clear rule. Build the smallest version that can prove the idea. Make cause and effect easy to follow. Put it in a real workflow. Keep one source of truth, recovery, and a record of where the inputs came from. Credit other people’s work. Describe the mechanism plainly. Only claim what the product can prove.

### When stuck

- Return to the person, task, and source—not the styling.

- Find the smallest meaningful unit.

- Remove one mechanism or effect.

- Build two versions instead of debating an adjective.

- Ask which part of the system should own the decision.

- Protect the part that already works.

- State what is not yet true.

- Spend more time defining the problem.

</details>
