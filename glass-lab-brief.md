# glass-lab — implementation brief

Rebuild the `/playground` experiments view as **glass-lab**: floating anisotropic
glass blobs on a white field that melt into rounded screens showing each
experiment. A working standalone prototype exists and was approved by Estelle;
this brief contains everything needed to reproduce it as a proper component in
this repo. All shader code and physics constants below are final — port them
verbatim unless a section says "tune".

---

## 1. Concept & design guardrails

Each lab item is a **glass blob** built the `2d-softbody-lathe` way: a 2D
half-profile revolved into a ring mesh, spring physics on every vertex, normals
re-derived from the deformed mesh every frame. Hovering squiggles the blob
(same interaction as that repo's press). Clicking swaps the mesh's rest pose to
a rounded slab and the springs carry it there — **the melt is the physics, not
a tween**. When it settles, a DOM glass panel fades in over the slab and plays
the experiment (slideshow / video / live iframe).

Guardrails (from Estelle's design feedback — violating these fails review):

- **Transparency into content quality.** Texture, micro-interactions, cohesive
  physical detail. Not whitespace-minimalism, not decoration.
- **No nostalgia props.** No tape, polaroids, film sprockets, vintage set
  dressing. Texture lives in substrate and behavior; the surface stays
  contemporary.
- **One physical story per object.** The blob is glass with weight: it floats,
  squiggles, melts, settles. Nothing may contradict that (e.g. no bounce-in
  entrance animations).
- **Material effects concentrate at edges, barely noticeable.** Glass panel
  refraction/anisotropy only at the rim; centers optically quiet. If a viewer
  would name the effect, it's too loud.
- **Restraint pass before finishing:** halve any tilt/particle/texture
  intensity once and remove one decoration; if it still reads, it was too much.
- **Wear marks stay visible:** running timecode on video, `1 / 4` slide index,
  `live` tag on iframes. Mono font.
- Light mode only.

## 2. References already in this repo

| What | Where |
|---|---|
| Content data | `src/app/playground/components/labData.ts` (`LAB_BY_TECH`) — use as-is, do not edit |
| Mood palette | `src/app/design-deets/shader/MoodRingShader.tsx` → `moodPalette()`: galaxy `vec3(0.48,0.34,0.60)`, ember `vec3(0.94,0.52,0.28)`, sea `vec3(0.36,0.70,0.64)` |
| Texture overlay | `public/textures/sandpaper.png` |
| Display font | `public/fonts/star-glyphs.woff2` (already `@font-face`'d in `globals.css` as `'Star Glyphs'`) |
| Fonts | EB Garamond (serif), Ysabeau Office / existing sans stack, `"Courier New"` mono per `globals.css` |
| Softbody reference | external repo `2d-softbody-lathe` (`Blob2D.ts`) — its construction is restated fully in §4, no need to consult it |

## 3. Deliverables

Create:
- `src/app/playground/components/GlassLab.tsx` — main client component
  (`'use client'`), owns DOM + one shared WebGL canvas.
- `src/app/playground/components/SoftBlob.ts` — physics/mesh class (no React).
- `src/app/playground/components/glassShaders.ts` — vertex/fragment sources.

Modify:
- `src/app/playground/page.tsx` — mount `<GlassLab />` (replace `<Lab />`;
  keep the `Lab` files in place, unused, for now).

Do NOT touch: `labData.ts`, `MoodRingShader.tsx`, `globals.css` font faces,
anything outside `src/app/playground/` except the page file.

## 4. SoftBlob (port exactly)

Cell space: every blob lives in a logical **232 × 200 px** cell, sphere center
`(116, 100)`, radius `R = 66`.

Mesh: `ROWS = 44` profile rows, `SEGS = 34` revolve segments,
`RING = SEGS + 1`, `NVERT = (ROWS+1) * RING` (= 1575). Lathe construction:

```ts
for (let i = 0; i <= ROWS; i++) {
  const v = i / ROWS;
  const y = cy - R * Math.cos(v * Math.PI);   // profile height
  const r = R * Math.sin(v * Math.PI);        // half-profile radius
  for (let j = 0; j <= SEGS; j++) {
    const th = (j / SEGS) * Math.PI * 2;
    const x = cx + r * Math.cos(th);
    const z = r * Math.sin(th);
    // restA[k] = pos[k] = (x, y, z); uv = (j/SEGS, v)
  }
}
// indices: for each (i < ROWS, j < SEGS):
//   p0=i*RING+j, p1=(i+1)*RING+j, p2=i*RING+j+1, p3=(i+1)*RING+j+1
//   push(p0,p1,p2, p1,p3,p2)   — Uint16Array, one shared index buffer
```

Physics constants (glass, not jelly — do not soften):

```ts
const PHYS = { springK: 0.085, damping: 0.88, hoverForce: 2.4, hoverRadius: 78 };
```

Step (runs every frame per blob, including offscreen so springs settle):

```ts
step(hovering, px, py, bobY) {           // px,py = pointer in cell px
  for each vertex n:
    if (hovering) {                       // 2D repulsion, xy only
      d = hypot(p.x - px, p.y - py);
      if (d < hoverRadius) v.xy += normalize(p.xy - pointer) * (1 - d/hoverRadius) * hoverForce;
    }
    v += (rest - p) * springK;            // 3D spring (rest.y offset by bobY)
    v *= damping;
    p += v;
  // track mean |v|; expose `active` = false after 8 consecutive frames < 0.02
}
```

No gravity. No wall collisions. Idle bob: `bobY = sin(time*0.7 + phase) * 3.5 *
(1 - morph)` — freezes as the melt begins.

Screen rest pose (`restB`), computed once in the constructor: push each sphere
vertex **outward along its own radial direction from center** until it lands on
a rounded-slab SDF surface, via 24-step bisection (`sd(0) < 0`, `sd(300) > 0`).
Slab half-extents `bx=100, by=62, bz=4`, corner radius `rr=12` → footprint
224 × 148 × 32 px, matching the DOM panel. (Nearest-point projection does NOT
work — the sphere is inside the slab and collapses to the z-faces. Radial
ray-mapping spreads the shell over the whole screen.)

`setPose(1)` just sets `rest = restB` (and `0` → `restA`). That is the entire
melt implementation.

Normals: accumulate face cross-products per vertex, normalize — recompute every
frame the mesh is `active`, skip when settled (keep last buffer).

## 5. Rendering

**One** WebGL1 canvas, `position: fixed; inset: 0; pointer-events: none;`,
`z` above the page gradient, below overlays. Per frame, for each visible cell:
`getBoundingClientRect()` → `gl.viewport` + `gl.scissor` to that rect
(y flipped: `(innerHeight - rect.bottom) * dpr`), upload `pos` (+ normals if
active) via `bufferSubData`, draw. This avoids per-blob context limits.

Context: `{ alpha: true, antialias: true, premultipliedAlpha: false }`,
`BLEND` with `SRC_ALPHA, ONE_MINUS_SRC_ALPHA`, **DEPTH_TEST disabled**
(layered translucency, as Blob2D draws). DPR capped at 1.5. rAF capped ~60fps.
If `getContext('webgl')` fails: fall back to static circular thumbnails,
`console.error`, no crash.

Vertex shader:

```glsl
attribute vec3 a_pos;      /* cell px, z in px */
attribute vec3 a_nor;
attribute vec2 a_uv;
uniform vec2 u_cell;       /* (232, 200) */
varying vec3 v_nor; varying vec3 v_pos; varying vec2 v_uv;
void main() {
  vec2 norXY = (a_pos.xy / u_cell) * 2.0 - 1.0;
  v_pos = vec3(norXY, a_pos.z / u_cell.y);
  v_nor = a_nor; v_uv = a_uv;
  gl_Position = vec4(norXY * vec2(1.0, -1.0), 0.0, 1.0);
}
```

Fragment shader (the glass — Blob2D's alpha is inverted: jelly is opaque facing
the camera, glass carries its light on the rim):

```glsl
precision mediump float;
varying vec3 v_nor; varying vec3 v_pos; varying vec2 v_uv;
uniform float u_reveal;
uniform vec2 u_light;
uniform vec3 u_tint;
uniform sampler2D u_thumb;
void main() {
  vec3 N = normalize(v_nor);
  vec3 V = vec3(0.0, 0.0, 1.0);
  float ndv = abs(dot(N, V));                 /* abs: back faces shade too */
  float fres = pow(1.0 - ndv, 3.0);
  /* refract the view into the thumbnail; distortion rides the rim */
  vec3 rr = refract(-V, N, 0.72);
  vec2 tuv = clamp(vec2(0.5) + v_pos.xy * vec2(0.42, -0.42)
                   + rr.xy * 0.30 + N.xy * fres * 0.28, 0.0, 1.0);
  vec3 tex = texture2D(u_thumb, tuv).rgb;
  vec3 body = mix(vec3(1.0), tex, u_reveal);
  /* anisotropic streak: tangent wrapped around y — brushed, not sparkly */
  vec3 L = normalize(vec3(u_light, 0.8));
  vec3 T = normalize(vec3(-N.z, 0.0, N.x));
  vec3 H = normalize(L + V);
  float ta = dot(T, H);
  float aniso = pow(sqrt(max(0.0, 1.0 - ta * ta)), 90.0);
  float spec = aniso * (0.25 + 0.75 * fres) * 0.85;
  vec3 col = body + vec3(spec) + u_tint * fres * 0.16;
  float alpha = clamp(0.16 + 0.62 * fres + u_reveal * 0.5 + spec, 0.0, 0.92);
  gl_FragColor = vec4(col, alpha);
}
```

Per-blob uniforms: `u_reveal = (0.34 + 0.28 * hover) * (1 - max(0,(morph-0.7)/0.3))`
(hover eased at 0.12/frame; morph eased at 0.075/frame toward its target —
morph is only a timer for reveal/DOM handoff; geometry is pure springs).
`u_tint` cycles through the three moodPalette colors. `u_light` follows the
pointer, damped 0.06/frame: `((x/innerWidth)-0.5)*1.6, (0.5-(y/innerHeight))*1.6+0.5`
— pointer-as-light is earned here because the blobs are genuinely 3D.

Thumbnails (`u_thumb`): for image/video items, load a small (~256px) version of
the first preview image via `new Image()` → `texImage2D` (public-folder assets,
same origin, no taint). Placeholder until load, and permanently for iframe
items: a canvas-drawn monogram — first letter of the name, italic EB Garamond
130px, cobalt at 0.75, over a soft radial wash of the item's tint on white.
For `roboracer-logo.mp4`, grab a poster frame by seeking a muted offscreen
`<video>` to ~1.5s and drawing to canvas (its opening frames are white).

## 6. Page & DOM

Layout (all type/colors per `globals.css` conventions; cobalt
`hsl(226,100%,12%)` as ink):

- Page background (this route only): white with **slight** moodPalette radials —
  `radial-gradient(circle 900px at 32% 24%, rgba(122,87,153,0.16), rgba(122,87,153,0.07) 42%, transparent 68%)`,
  ember `rgba(240,133,71,0.14/0.06)` at `70% 44%` (760px),
  sea `rgba(92,179,163,0.13/0.06)` at `44% 78%` (680px). `background-attachment: fixed`.
- Softcopy processing: fixed overlay `sandpaper.png` at `60px 60px` repeat,
  `mix-blend-mode: screen`, above everything, `pointer-events: none`; plus a
  fixed cobalt hairline frame (`inset: 14px`, 0.5px border, opacity 0.28,
  `filter: blur(1px)`).
- Header: `h1` "lab ✦" in Star Glyphs (~4.2rem), serif italic subline
  "short-form snippets of side projects & experiments — touch a blob".
- Groups from `LAB_BY_TECH`: serif italic lowercase group label with hairline
  underline, then a flex-wrap cluster of cells. Hand-placed feel via nth-child
  micro-transforms: `2n → rotate(0.5deg) translateY(7px)`,
  `3n → rotate(-0.6deg) translateY(-4px)`, `5n → rotate(0.3deg) translateY(12px)`.
- Cell (232px wide): blob hit-area `<button>` 232×200 (transparent — the shared
  canvas draws through it), soft elliptical contact shadow at its base
  (`radial-gradient(ellipse, rgba(10,16,61,0.13), transparent 70%)`, widens on
  open), caption (serif name + mono meta line: `video` / `live` / `4 stills`,
  `· gh` when a github url exists), and a blurb paragraph that fades in only
  while open.
- Screen panel (`224 × 148`, radius 14, absolutely centered on the blob,
  sibling of the button — **never nest it inside the button**): glass per spec —
  `rgba(255,255,255,0.55)` + `backdrop-filter: blur(9px)`, cobalt hairline
  border, edge-only anisotropy as inset shadows tinted galaxy/sea/ember at
  0.4–0.5 alpha bleeding ≤9px inward, soft drop shadow. Opens
  (`opacity` + `scale(0.94→1)`, `cubic-bezier(0.25,0.9,0.25,1.2)`) when
  `morph > 0.86`; content mounts lazily on first open (build the DOM then,
  not upfront).
- Media inside the panel: `preview[0].type` drives it — `image` → slideshow
  (object-fit cover, mono `1 / n` mark, ←/→ buttons bottom-right + arrow keys),
  `video` → muted looping autoplay with running mono timecode `MM:SS.cc`
  updated per frame, `iframe` → lazy `src`, `live` mark. Close: ✕ top-left,
  Esc anywhere. Pause video / keep iframe on close.
- Footer: mono, ~0.62rem, opacity 0.45 — one line of usage cues (click/esc/
  arrows) and one line stating the construction honestly ("a 2d profile lathed
  into a ring mesh, spring physics on every vertex, normals re-derived each
  frame — the melt is just a new rest pose").

## 7. Interaction summary

| Gesture | Response |
|---|---|
| pointer near blob (hover) | vertices repelled within 78px → glass squiggle; caption name underlines; thumbnail reveal +0.28 |
| pointer moves anywhere | light direction follows, damped |
| click blob | `setPose(1)` — springs melt it into the slab; panel fades in at morph>0.86; media starts |
| click ✕ / Esc | `setPose(0)` — springs reform the sphere; panel fades out; video pauses |
| ←/→ (open, multi-image) | slideshow prev/next, mark updates |
| Tab / focus | button focus ring (1px cobalt, offset 6px); Enter opens |

`prefers-reduced-motion`: no idle bob, morph timer jumps (mSpeed 1), no CSS
transitions; springs still position geometry (single step to rest is fine).

## 8. Integration notes

- React 18 / Next 15 App Router. `GlassLab` is a client component; all GL and
  physics live in `useEffect` with full cleanup (cancel rAF, remove listeners,
  `gl.deleteProgram/Buffer/Texture` on unmount). Refs for everything imperative;
  no state in the render loop.
- TS strict; type the cell record and SoftBlob fields explicitly. Uniform names
  keep the `u_` prefix, attributes `a_`, varyings `v_`.
- Comment style: box-drawing section headers (`/* ─── … ─── */`) and
  domain-why comments (explain the physics choice, not the syntax).
- Mobile (`< md`): hover squiggle off (no pointer); tap = open. Cells center.
- Do not add dependencies. Raw WebGL only — no three.js for this.

## 9. Acceptance criteria

1. `npm run lint` and `npm run build` pass; no new deps.
2. 13 blobs render grouped by tech on white + slight purple/orange/green field;
   sandpaper + hairline overlays present.
3. Hover: visible but small squiggle (max ~14px displacement), settles < 1.5s,
   no residual drift. Blob never reads as jelly (no droop, short wobble tail).
4. Click: melt reaches the slab in ~1.5–2s with a soft overshoot; panel fades
   in seamlessly over it; media plays; wear marks tick.
5. Esc/✕ reforms the sphere; reopening works repeatedly without leaks (heap
   stable over 20 open/close cycles).
6. 60fps on a laptop with all blobs visible; offscreen blobs skip draw+normals.
7. Keyboard-only pass: Tab to any blob, Enter opens, arrows navigate, Esc closes.
8. `prefers-reduced-motion` honored.
9. No console noise.

## 10. Tuning knobs (only with visual review)

| Knob | Value | Direction |
|---|---|---|
| `PHYS.damping` | 0.88 | ↑ 0.90 = shorter wobble tail (more glass) |
| `PHYS.hoverForce` | 2.4 | ↓ = subtler squiggle |
| `PHYS.springK` | 0.085 | ↑ = stiffer, faster melt |
| fresnel power | 3.0 | ↑ = thinner rim |
| aniso exponent | 90.0 | ↑ = tighter streak |
| reveal base | 0.34 | thumbnail visibility at rest |
