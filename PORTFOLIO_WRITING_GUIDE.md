# Estelle Kim Portfolio Writing Guide

**Voice:** candid, exact, lightly conversational  
**Job:** make the work easy to understand without sanding off how Estelle actually thinks  
**Prepared from:** portfolio history from 2024–2026, with the strongest weight given to Estelle's long-form writing and her own copy revisions

---

## 1. The voice in one sentence

> Say what happened, what did not sit right, and what you changed—in the words you would use while showing the work to someone smart beside you.

The voice is not “casual.” It is **plainspoken and observant**. It can explain a shader, a product flow, or a team decision without changing personalities. Technical depth comes from naming the mechanism. Nuance comes from naming the tension. Neither needs to be announced.

The desired impression is:

> Estelle sees the real shape of a problem, builds carefully, and is honest about what changed along the way.

Not:

> Estelle has a polished theory for everything she has ever made.

---

## 2. What in the history is actually the source of truth

Not all old copy is equally “Estelle.” The history contains three distinct modes.

### Primary voice references

Use these to judge cadence, candor, and point of view:

- `on compressing thought` (June 2025)
- `another portfolio update` (June 2025)
- `magnet poetry board` (July 2025)
- the July 27, 2026 commit `38764b5` — **make about copy more personal**
- the current Tally retrospective, especially “I like the contract model more than I like every screen.”

These pieces sound like one person because they begin with a real observation, allow uncertainty, and use ordinary verbs.

### Secondary references

Use these for factual precision and scannability, not voice:

- the January–June 2026 project data
- technical bullets and stack descriptions
- deployment numbers, team sizes, and implementation details

This copy is useful but often reads like a résumé. Preserve its facts; rewrite its posture.

### Anti-reference

Later copy sometimes becomes smoother while becoming less specific. The clearest example appears in the parent of `38764b5`:

> “I build software where design, engineering, and interaction feel like one decision.”

Estelle changed it to:

> “I get excited by ideas and like figuring out how to make them real.”

The first sentence sounds finished. The second sounds true.

Another revision replaced:

> “Engineering gave those instincts a different medium. I now build interactive software because it sits where technical systems and human experience meet.”

with:

> “Learning to code gave me another way to do something I already loved: take a messy idea, give it structure, and bring it to life. I ended up in interactive software because I like caring about both the system and the person using it.”

This is the recurring edit to make: **move from category language to lived language.**

---

## 3. The four qualities

### 3.1 Candid, not diaristic

Candor means admitting the useful thing:

- “I kept adding sliders because I thought more control would make the fabric more expressive.”
- “It didn't feel like a big deal. But by the sixth week, I noticed how quickly I'd adapted.”
- “The burgundy looks nice, but primary actions and contract status still disappear inside some dense screens.”

The admission must help someone understand the work. Do not include private feeling merely to sound vulnerable.

Good candor answers one of these:

- What did I assume at first?
- What stayed confusing longer than expected?
- What did the first version get wrong?
- What tradeoff did I knowingly accept?
- What would I keep, even if I changed the rest?

### 3.2 Concise, not compressed

Estelle's old writing is concise because it gives each paragraph one job. It is not compressed into dense noun phrases.

Good:

> “The app kept asking one more question: what counts, who checks, what happens to the money, and what if someone disagrees?”

Compressed:

> “The contract lifecycle introduced compounding trust, verification, incentive, and exception-handling complexity.”

The second is shorter in characters and slower to understand.

### 3.3 Technical, after the object is clear

Name the thing before the machinery.

Good order:

1. What the person sees or does.
2. What made that difficult.
3. The mechanism that solved it.
4. The visible consequence.

Example:

> A visitor cuts an artifact out through the camera and keeps it as a sticker. Because museum Wi-Fi was unreliable, the PNG, metadata, and progress state were written to IndexedDB immediately. The interaction still worked after a restart.

Do not open with IndexedDB unless the reader already knows why it matters.

### 3.4 Nuanced through tension, not qualification

Nuance is not a pile of caveats. Show the two true things that pulled against each other.

- The interface needed structure, but too much setup felt like paperwork.
- The live ML pipeline was interesting, but the static version kept the interaction that mattered.
- More controls looked expressive, but made the renderer and solver disagree.
- Rebuilding would have been cleaner for one engineer, but worse for a rotating team.

State both sides plainly. Then say what you chose.

---

## 4. Sentence-level fingerprint

### Use ordinary subjects and active verbs

Preferred subjects:

- I
- we
- the visitor
- the app
- the camera
- the graph
- the shader
- the first version
- one shared canvas

Preferred verbs:

- built
- made
- kept
- split
- moved
- drew
- lined up
- stored
- changed
- broke
- noticed
- tried
- asked
- chose
- stayed

The portfolio should contain more verbs than professional nouns.

### Let short sentences carry judgment

Estelle often explains, then lands on a short sentence:

> “So I compressed to move on.”

> “And now, this.”

> “The first sentence sounds finished. The second sounds true.”

Use this sparingly. One short sentence can give a paragraph shape; five in a row becomes affected.

### Contractions are normal

Use `I'm`, `didn't`, `couldn't`, `what I'd change`, and `it's`. Uncontracted prose sounds like an application essay unless formality is required.

### Starting with And, But, or So is allowed

These words often reveal the actual relationship between thoughts more clearly than “However,” “Therefore,” or “Additionally.”

### Concrete lists are part of the voice

Estelle naturally lists things she can see or handle:

- “paper, fabric, light”
- “a purpose, a structure, and a set of needs”
- “the PNG, metadata, and progress state”

Keep lists concrete. Avoid polished abstract triads such as “design, innovation, and impact” unless they name literal team functions.

### One metaphor at a time

The writing can use an image—compression, a thread, a contract moving through an app—but should not keep decorating it. Introduce the metaphor, use it to clarify structure, then return to the work.

---

## 5. What to prefer and what to distrust

### Prefer

- first person when it reveals a decision, limit, or change—not as the default way to introduce intent
- “At first…” when the project changed your mind
- “The first version…” when showing an iteration
- “The hard part was…” followed by a concrete conflict
- “I kept…” when a deliberate constraint matters
- “I split…” when explaining architecture
- “This meant…” when translating technical cause into product consequence
- “I would…” for an honest retrospective
- numbers attached to nouns: `300 sites`, `one worker`, `nine months`

### Distrust on sight

These words are not forbidden, but each needs evidence immediately after it:

- thoughtful
- intentional
- expressive
- ambitious
- coherent
- seamless
- robust
- innovative
- novel
- intuitive
- scalable
- meaningful
- human-centered
- technically ambitious
- end-to-end
- product surface
- intersection of
- leverage
- empower

“I design and build technically ambitious product interactions” can remain as a positioning line. It should not become the grammar of the site.

### Phrases that usually sound generated

- “sits at the intersection of…”
- “bridges the gap between…”
- “not just X, but Y” repeated across sections
- “This project explores…”
- “The result is a seamless…”
- “A system designed to empower…”
- “where X, Y, and Z come together”
- “one claim, one mechanism”
- “causally coherent physical behavior” in marketing copy
- “from idea to polished implementation” without the actual middle

When one appears, ask: **what literally happened?** Write that instead.

---

## 6. The recurring structure of Estelle's best writing

The natural shape is not `problem → process → solution → impact`. It is:

1. **Observation** — something felt off, interesting, or unexpectedly hard.
2. **Tension** — two reasonable needs did not fit together.
3. **Move** — a concrete decision, prototype, or split.
4. **Consequence** — what became possible or clearer.
5. **Revision** — what Estelle would keep or change now.

Example:

> The input needed to stay loose, but persistent watercolor needed GPU state. Rebuilding every falling glyph inside a fluid solver would have made the whole piece harder to change. I kept the interaction in Canvas2D and sent only its bottom row into a ping-pong WebGL surface. The marks could stay loose while the pigment accumulated underneath.

This structure works because it preserves causality without pretending the solution was obvious from the beginning.

---

## 7. Rules by portfolio surface

### Homepage

The homepage is routing copy, not a manifesto.

- One recognized role or capability line.
- One sentence a founder can turn into an assignment.
- No more than one abstract phrase in the first viewport.
- Let the projects supply the nuance.

Current positioning is acceptable:

> I design and build technically ambitious product interactions.

Do not repeat “technically ambitious,” “product interactions,” or the graphics/design/engineering triad elsewhere just to reinforce the brand.

### Project row

Answer: **What did you make, and why would someone care?**

Use one concrete object and one human action.

Good:

> A habit app where proof, partners, and small bets have to make sense.

Good:

> A museum scavenger hunt that turns found artifacts into a personal sticker collection.

Avoid beginning every row with `Turning…`. Repeated participles make different projects sound generated from one template.

### Project opening

The first paragraph should contain:

1. the real context;
2. what the product lets someone do;
3. Estelle's role, including collaborators.

Keep the stack out until the reader understands the product.

### Case-study sections

Use declarative, lowercase headings that name the decision or problem:

- `the contract was the product`
- `one reference box for every crop`
- `the model leaves after authoring`
- `why i kept the interaction local`

Avoid headings that merely name the design-process stage:

- Research
- Ideation
- Solution
- Final Design
- Reflection

### Technical explanation

Use this order:

> visible behavior → constraint → mechanism → payoff

The mechanism should name real parts. “A custom system” says nothing. “A worker runs depth inference once, then the image and depth map are baked into a small WebGL renderer” does.

### Outcome

State what shipped or what can be done now. Use numbers when they change the reader's understanding.

Avoid pretending every exploration created business impact. For experiments, the outcome can be a working behavior, a learned constraint, or a reusable primitive.

### Retrospective

This is where the voice should be most recognizable.

Strong forms:

- `I thought ___. Once ___, I realized ___.`
- `I would keep ___. I would change ___.`
- `The ___ works better than the ___.`
- `I would not call it finished until ___.`

Never end with “This project taught me the importance of…” Name the changed decision instead.

### About page

Personal details should explain how Estelle works, not prove that she has a personality.

Good:

> I came to engineering a little sideways.

Good:

> I like caring about both the system and the person using it.

Keep the smiley, contractions, and small odd details. They are doing more voice work than another paragraph about multidisciplinary collaboration.

### Interaction studies

These currently drift furthest toward either exhibition-label language or the repeated cadence `I wanted → I built`. Each should read like a compact build note whose opening reveals the project's model.

Prefer:

> A material layer that sits on top of existing controls instead of replacing them. Buttons, inputs, and sliders keep their original behavior.

over:

> Adding material response to existing UI elements without replacing or intercepting them.

This keeps the fuller idea—the relationship between material and interface—rather than reducing the project to a visual effect. Then give the mechanism in one direct sentence:

> One pointer-transparent WebGL layer mirrors each element's bounds and corner radius, so the original DOM keeps handling focus, clicks, and form state.

Use `explores` as an interface label if useful, but do not force the sentence underneath to sound like curatorial copy.

---

## 8. Collaboration and ownership

The old résumé mode either hid the team or compressed everyone into a team count. The right voice names both without ceremony.

Use:

- `I` for what Estelle personally decided or built.
- `we` for a shared product decision.
- a person's name or role when their contribution changes the story.

Good:

> Ruth and I shaped the product. I led the visualization and handled the integration, API, and deployment work.

Good:

> I built Drift with a friend.

Avoid:

> Led a cross-functional team to deliver an end-to-end spatial navigation experience.

Do not inflate solo work with `0→1 ownership`. Say what was built. Do not hide collaboration to sound more impressive; clear boundaries make ownership more credible.

---

## 9. Templates to use as checks, not fill-in-the-blank prose

### Compact project description

> A [concrete object] that lets [person] [action], even when [real constraint].

### Interaction study

> [Object or interface] sits between [two competing models]. [Mechanism] handles [one job], while [existing system] keeps [important behavior].

This is a diagnostic shape, not a sentence pattern. If adjacent projects all use “sits between,” change the syntax while preserving the tension.

### Technical decision

> At first I [first approach]. It [specific failure]. I [change], so [visible consequence].

### Team role

> [Collaborator] handled [scope]. I handled [scope], and we decided [shared decision] together.

### Retrospective

> I would keep [core decision]. I would change [weak part]. I would not call it finished until [real test].

If the final copy still sounds like the template, rewrite it once more.

---

## 10. The AI smell test

Before shipping a sentence, ask:

1. Could this sentence appear unchanged on another design engineer's portfolio?
2. Are there three abstract nouns before the first thing I can picture?
3. Did an adjective replace evidence?
4. Did I summarize the meaning before saying what happened?
5. Is the sentence perfectly balanced in a way I would never say aloud?
6. Did I use an em dash to make an ordinary claim sound profound?
7. Did I turn one honest limitation into a triumphant lesson?
8. Does every project now have the same `I wanted → challenge → solution` cadence?
9. Did I erase the collaborator, false start, or constraint that makes the decision believable?
10. Does the paragraph end with a thesis when it should end with a result?

If two answers are yes, revise.

---

## 11. Revision method

### Pass 1: facts only

Write down:

- who it was for;
- what they could do;
- what Estelle built;
- who else built it;
- what went wrong;
- the decision that changed the work;
- what exists now.

No adjectives.

### Pass 2: say it aloud

Explain the project as if showing it to one engineering manager. Transcribe the sentence that feels most natural. This is often better than the prepared opening.

### Pass 3: restore the tension

Add the one conflict that made the decision non-obvious. Do not add every constraint.

### Pass 4: check nouns against the screen

Underline every noun. Could the reader point to it in the interface, architecture, or team? Replace floating nouns with visible ones.

### Pass 5: cut the interpretation

Remove sentences that tell the reader the work is thoughtful, polished, ambitious, coherent, or human-centered. Leave the evidence that creates that impression.

### Pass 6: vary the cadence

Look at adjacent projects. If all of them begin with `Turning`, `I wanted`, or `The challenge was`, change the opening—not the facts.

### Pass 7: read for embarrassment

The copy should feel a little exposed because it states what Estelle actually thought. It should not feel embarrassing because it overshares or overclaims.

---

## 12. Current portfolio: what already sounds right

Protect these lines and the moves behind them:

- “I came to engineering a little sideways.”
- “I like caring about both the system and the person using it.”
- “The app kept asking one more question…”
- “I like the contract model more than I like every screen.”
- “I would not call the rest finished until…”
- “I kept adding sliders because I thought more control would make the fabric more expressive.”
- “I came in thinking the dashboard was the product. Most of the real work was underneath it.”
- “There was the first one, which looked like the first.”

They are specific, a little dry, and confident without pretending certainty.

---

## 13. Current portfolio: first places to revise

When the guide is applied, begin here:

1. Interaction-study header, group descriptions, and footer. Phrases such as “Interaction ideas, proven through working mechanisms” and “One interaction claim, one implemented mechanism” are polished but impersonal.
2. The `explores` lines in the interaction data. Several read like museum labels rather than build notes.
3. Repeated `Turning…` openings across project rows.
4. Any project paragraph that could be reduced to a role label plus an abstract result.
5. Any new case-study conclusion that turns a concrete decision into a universal philosophy.

Do not rewrite the whole site into first person. The goal is not more `I`; it is more **cause, choice, and visible detail**.

---

## 14. Calibration examples from the current site

These are not mandatory final lines. They show how to apply the guide without making every project sound the same.

### Interactions page introduction

Current:

> Interaction ideas, proven through working mechanisms.

Closer to the voice:

> Small interfaces I built to see whether the interaction still worked outside the idea.

The revision gives the page a person, an action, and a standard of proof.

### Iridescence

Current:

> Adding material response to existing UI elements without replacing or intercepting them.

Closer to the voice:

> A material layer that sits on top of existing controls instead of replacing them. Buttons, inputs, and sliders keep their original behavior.

The second names visible objects, preserves the larger system idea, and states the constraint in the same sentence.

### Drift

Current:

> Navigation that rewards attention and memory instead of shortest-path arrival.

Closer to the voice:

> A friend and I built a walking app without a map. It traces where you've been and sometimes asks you to stop and notice something instead of getting there faster.

The idea is still unusual, but the prose no longer has to announce that it is.

### Paper Between Us

Current:

> Remote drawing through partial visibility: live blur or reveal only after both people finish.

Closer to the voice:

> Most shared canvases maximize visibility. This one keeps part of the other person's drawing uncertain: marks can arrive blurred, or both drawings can stay hidden until the reveal.

This keeps the nuance while using the actual interaction to explain it.

### Magnetic Poetry

The underlying intent is worth preserving without reusing the same first-person opening:

> A shared writing surface built around arranging rather than typing. Every word stays movable, so meaning stays provisional.

It contains a point of view, behavior, and consequence without reading like a feature list.

---

## 15. Final standard

The copy is ready when a recruiter can skim it and understand the assignment Estelle could own, while a design or engineering lead can keep reading and find a real mind at work.

It should be possible to remove every adjective of praise without weakening the impression.

The work supplies the ambition. The writing supplies the shape.
