import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import {
  FieldNoteDetail,
  FieldNoteFigure,
  FieldNoteHeader,
  FieldNoteReader,
  FieldNoteSection,
  FieldNoteSequence,
} from '../components/FieldNotePrimitives';
import styles from './material-studies.module.css';

export const metadata: Metadata = {
  title: 'Graphics + interaction experiments · Estelle Kim',
  description:
    'Six small studies about why each experiment uses the representation, browser API, and rendering technique it does.',
  robots: {
    index: false,
    follow: false,
  },
};

const mapEntries = [
  ['loom', 'digital loom / generative maps, graphics behavior'],
  ['watercolor', 'watercolor / open input, persistent pigment'],
  ['burning', 'burning paper / shared UVs keep layers aligned'],
  ['jelly', 'softbody jelly / 2D motion, 3D light'],
  ['textellation', 'textellation / global hierarchy, local force'],
  ['characters', 'pip foundry / generated bodies, shared motion'],
  ['range', 'other experiments / ongoing small builds'],
] as const;

const smallExperiments = [
  {
    name: 'more bubbles!',
    medium: 'shader + interaction',
    note: 'soft collisions, screen-space refraction, and pop behavior inside one canvas.',
  },
  {
    name: 'thumb*ball',
    medium: 'touch + haptics',
    note: 'a one-screen fidget that uses browser haptics on Android.',
  },
  {
    name: 'drawscillate',
    medium: 'web audio',
    note: 'a collaborative instrument where drawing the waveform shapes the sound.',
  },
  {
    name: 'microtone graph',
    medium: 'notation + interface',
    note: 'scoring pitches between traditional notes through angle and magnitude.',
  },
  {
    name: 'sdf rigged guy',
    medium: 'small character system',
    note: 'a TypeScript rig with mouse tracking, idle behavior, and an SDF shader.',
  },
  {
    name: 'sound-to-form',
    medium: 'graphic study',
    note: 'mapping qualities of sound into a reusable shape language.',
  },
] as const;

function StudyTurn({
  problem,
  choice,
  reason,
  boundary,
}: {
  problem: string;
  choice: string;
  reason: string;
  boundary: string;
}) {
  return (
    <dl className={styles.studyFacts}>
      <div>
        <dt>visible problem</dt>
        <dd>{problem}</dd>
      </div>
      <div>
        <dt>what I chose</dt>
        <dd>{choice}</dd>
      </div>
      <div>
        <dt>why it fit</dt>
        <dd>{reason}</dd>
      </div>
      <div>
        <dt>boundary</dt>
        <dd>{boundary}</dd>
      </div>
    </dl>
  );
}

function StudyLinks({
  live,
  source,
  sourceLabel = 'source ↗',
}: {
  live?: string;
  source: string;
  sourceLabel?: string;
}) {
  return (
    <div className={styles.studyLinks}>
      {live ? (
        <a href={live} target="_blank" rel="noreferrer">
          try it ↗
        </a>
      ) : null}
      <a href={source} target="_blank" rel="noreferrer">
        {sourceLabel}
      </a>
    </div>
  );
}

export default function MaterialStudiesFieldNotes() {
  return (
    <main
      className={`responsive-padding ${styles.page}`}
      style={{ '--field-accent': 'rgb(142, 86, 98)' } as CSSProperties}
    >
      <article className="page-frame-wide">
        <FieldNoteHeader
          eyebrow="six graphics + interaction experiments"
          title="material studies"
          deck="why I used one representation instead of a larger simulation."
          meta={[
            'solo design + engineering',
            'sep 2025–jul 2026',
            'graphics + interaction experiments',
          ]}
          links={[
            {
              href: 'https://digital-loom-nine.vercel.app/',
              label: 'open digital loom ↗',
            },
          ]}
          motif={
            <div className={styles.heroMaps} aria-hidden="true">
              <Image
                src="/project-images/material-studies/loom/albedo.webp"
                alt=""
                width={720}
                height={720}
                priority
              />
              <Image
                src="/project-images/material-studies/loom/normal.webp"
                alt=""
                width={720}
                height={720}
                priority
              />
              <Image
                src="/project-images/material-studies/loom/roughness.webp"
                alt=""
                width={720}
                height={720}
                priority
              />
            </div>
          }
        />

        <FieldNoteReader
          mapLabel="technique choices"
          entries={mapEntries}
        >
            <FieldNoteSection
              number="00"
              id="loom"
              title="digital loom"
              className={styles.studySection}
            >

              <div
                className={`${styles.studyHeader} ${styles.studyHeaderStacked}`}
              >
                <div>
                  <p className={styles.studyDate}>jul 09–26, 2026</p>
                  <h3>
                    the model generated maps; graphics engineering turned them
                    into a material
                  </h3>
                </div>
                <StudyLinks
                  live="https://digital-loom-nine.vercel.app/"
                  source="https://github.com/kimestelle/digital-loom"
                />
              </div>

              <div className={styles.studyStack}>
                <FieldNoteFigure
                  src="/project-images/covers/loom-cover.webp"
                  alt="Digital Loom interface showing fabric samples, cloth simulation, and material controls"
                  width={1920}
                  height={1231}
                  caption="Patina’s extracted maps, explicit fabric controls, and the live cloth preview."
                  className={styles.studyFigure}
                  sizes="(max-width: 767px) 100vw, 70rem"
                />

                <div className={styles.studyCopy}>
                  <StudyTurn
                    problem="fal’s Patina model could factor one flat fabric photo into albedo, normal, roughness, height, and metalness maps. Those maps were useful, but they only described cues visible from one view. They could not tell me how the fabric should bend, stretch, transmit light, or react to wind."
                    choice="I treated Patina’s output as an intermediate representation, not the finished result. I analyzed the maps for conservative starting values, combined them with seven explicit fabric fields, and derived both WebGPU shader behavior and XPBD solver values from that material core."
                    reason="Generative AI handles the tedious part of separating visible surface cues into reusable maps. The graphics system adds controllable relighting, thread-scale relief, deformation, and motion. Each side supplies information the other does not have."
                    boundary="The model cannot recover physical truth from a flat image. Weight, fiber stiffness, weave, and twist remain editable inputs; every map-derived suggestion stays conservative and overridable."
                  />
                  <p>
                    This is the generative-media and graphics intersection
                    I&apos;m currently interested in. The generated image does
                    not have to remain a fixed 2D result, and the model does not
                    have to invent physics it cannot infer. Patina supplies
                    editable surface evidence;{' '}
                    <strong>
                      the rendering and simulation system makes it relightable,
                      deformable, tunable, and exportable
                    </strong>
                    .
                  </p>
                  <p>
                    Underneath, a 48 × 48 XPBD mesh carries the drape. The
                    extracted normal and height maps drive normal mapping and
                    parallax occlusion mapping for thread-scale relief that
                    would be wasteful to model as geometry.
                  </p>
                </div>
              </div>

              <div className={styles.mapContactSheet} aria-label="Digital Loom material maps">
                {[
                  ['albedo', 'color'],
                  ['height', 'micro-relief'],
                  ['normal', 'fiber direction'],
                  ['roughness', 'light spread'],
                ].map(([file, label]) => (
                  <figure key={file}>
                    <div className="media-clip-surface">
                      <Image
                        src={`/project-images/material-studies/loom/${file}.webp`}
                        alt={`${label} map extracted for the red silk sample`}
                        width={720}
                        height={720}
                        sizes="(max-width: 520px) 44vw, 9rem"
                      />
                    </div>
                    <figcaption>{label}</figcaption>
                  </figure>
                ))}
              </div>

              <FieldNoteDetail label="the solver">
                <p>
                  The live demo uses Verlet integration with XPBD warp, weft,
                  shear, and bend constraints. Later dihedral-hinge experiments
                  are separate cloth R&amp;D, not a feature represented here.
                </p>
              </FieldNoteDetail>
            </FieldNoteSection>

            <FieldNoteSection
              number="01"
              id="watercolor"
              title="watercolor"
              className={styles.studySection}
            >

              <div className={styles.studyHeader}>
                <div>
                  <p className={styles.studyDate}>oct 2025 / may + jul 2026</p>
                  <h3>one pixel row kept the input open</h3>
                </div>
                <StudyLinks
                  live="https://watercolor-drip-shader.vercel.app/"
                  source="https://github.com/kimestelle/watercolor-drip-shader"
                  sourceLabel="2025 source ↗"
                />
              </div>

              <div className={`${styles.studyGrid} ${styles.studyGridReverse}`}>
                <div className={styles.studyCopy}>
                  <StudyTurn
                    problem="I wanted the input to stay loose. The user could play with glyphs falling under simple 2D rules, or toggle a rainbow brush and paint directly with the pointer. I still needed those marks to become persistent pigment without rebuilding every interaction inside a shader."
                    choice="The 2025 sketch is two separate systems. Canvas2D handles the cloud, falling glyphs, pointer forces, and rainbow brush. Each frame, its bottom pixel row becomes the top row of a WebGL canvas, where two alternating textures store, diffuse, and dry the pigment."
                    reason="Canvas2D let me keep inventing input mechanisms without changing the pigment simulation. The one-row handoff gave the GPU a very small contract: it did not need to know whether a color came from a glyph or the mouse, only what pixels had entered the drip surface."
                    boundary="The newer prototype has velocity but no pressure projection. It studies pigment, water, paper, and subtractive color without claiming to be a full Navier–Stokes watercolor model."
                  />
                  <p>
                    The handoff was an interaction decision. I did not want
                    WebGL to decide what counted as valid input. Anything the
                    CPU canvas could draw could reach the same lower edge;{' '}
                    <strong>
                      the GPU took over only once those pixels entered the drip
                    </strong>
                    . The later substrate R&amp;D moves the paper itself into
                    full-surface compute passes so it can affect diffusion,
                    wetness, deposition, and edge darkening.
                  </p>
                </div>

                <FieldNoteFigure
                  src="/project-images/covers/watercolor-cover.webp"
                  alt="Watercolor Drip playground with pigment running through a paper texture"
                  width={1541}
                  height={1343}
                  caption="the free-form Canvas2D input surface feeding persistent GPU pigment."
                  className={styles.studyFigure}
                  sizes="(max-width: 767px) 100vw, 25rem"
                />
              </div>

              <div className={styles.substrateNote}>
                <div className={`${styles.paperSwatch} media-clip-surface`}>
                  <Image
                    src="/project-images/material-studies/watercolor/paper-field.png"
                    alt="The grayscale paper field used to modulate watercolor diffusion"
                    width={500}
                    height={500}
                    sizes="7rem"
                  />
                </div>
                <p>
                  <span>2026 substrate R&amp;D</span>
                  paper luminance becomes a simulation field that changes local
                  diffusion and pigment deposit instead of only tinting the
                  final frame.
                </p>
              </div>
            </FieldNoteSection>

            <FieldNoteSection
              number="02"
              id="burning"
              title="burning paper"
              className={styles.studySection}
            >

              <div className={styles.studyHeader}>
                <div>
                  <p className={styles.studyDate}>may 03–05, 2026</p>
                  <h3>one UV-space field controls the hole, char, ember, and text</h3>
                </div>
                <StudyLinks
                  live="https://burning-paper.vercel.app/"
                  source="https://github.com/kimestelle/burning-paper"
                />
              </div>

              <div className={styles.studyGrid}>
                <FieldNoteFigure
                  src="/project-images/covers/burning-cover.webp"
                  alt="A procedural letter burning outward from the point of contact"
                  width={1015}
                  height={709}
                  caption="a letter deforming as its shared burn field expands."
                  className={styles.studyFigure}
                  sizes="(max-width: 767px) 100vw, 25rem"
                />

                <div className={styles.studyCopy}>
                  <StudyTurn
                    problem="Editable text, the missing paper, the char band, and the ember edge all had to stay registered while the sheet moved."
                    choice="I rasterized the multiline letter into a Canvas2D texture, gave the deforming mesh static UVs, and used one raw WebGL fragment shader with an aspect-corrected noisy radial field."
                    reason="DOM text cannot be sampled inside the burn shader. Shared UVs let different thresholds of the same field discard the hole, mix the char, light the ember, and mask the text, so the layers cannot drift apart."
                    boundary="The particle grid only supplies pointer response and flutter. The effect does not model heat, oxygen, ash, or physical combustion."
                  />
                  <p>
                    The pointer position becomes the burn origin in UV space.
                    Aspect correction keeps the radius circular on a rectangular
                    letter, while two noise scales keep the edge from reading
                    like a clean reveal mask. Raw WebGL was enough for one mesh,
                    one texture, and one shader; a scene graph would not change
                    the interaction.
                  </p>
                </div>
              </div>

            </FieldNoteSection>

            <FieldNoteSection
              number="03"
              id="jelly"
              title="softbody jelly"
              className={styles.studySection}
            >

              <div className={styles.studyHeader}>
                <div>
                  <p className={styles.studyDate}>sep 10–oct 06, 2025</p>
                  <h3>2D motion was enough; the light needed 3D</h3>
                </div>
                <StudyLinks
                  live="https://2d-softbody-lathe.vercel.app/"
                  source="https://github.com/kimestelle/2d-softbody-lathe"
                />
              </div>

              <div className={`${styles.studyGrid} ${styles.studyGridReverse}`}>
                <div className={styles.studyCopy}>
                  <StudyTurn
                    problem="The jelly needed an editable silhouette, a convincing poke and rebound, and highlights that followed the deformation."
                    choice="I sampled a symmetrical SVG Bézier half-profile with the browser&apos;s path-length APIs, rotated those samples around a center axis, moved them with X/Y spring-to-rest motion, and rebuilt the mesh normals every frame."
                    reason="A few Bézier handles keep every edited silhouette recognizable. The visible motion is mostly frontal, so 2D springs handle the poke; the lathed surface and dynamic normals provide the part that actually needs 3D: rim and specular light."
                    boundary="There is no neighbor spring network or volume constraint. Facial features follow fixed particle indices, which is fast but brittle if the mesh topology changes."
                  />
                  <p>
                    The profile is the source of truth for geometry and motion.
                    <strong>
                      The surface adds depth without introducing a second shape
                      model
                    </strong>
                    , and the symmetry constraint prevents the editor from
                    generating forms that stop reading as the same character.
                  </p>
                </div>

                <FieldNoteFigure
                  src="/project-images/covers/blob-cover.webp"
                  alt="A customizable softbody jelly rendered with dimensional light"
                  width={1012}
                  height={1024}
                  caption="the editable profile and the dimensional surface generated from it."
                  className={styles.studyFigure}
                  sizes="(max-width: 767px) 100vw, 25rem"
                />
              </div>

              <FieldNoteDetail label="where this started">
                <p>
                  <a
                    href="https://artsandculture.google.com/experiment/blob-opera/AAHWrq360NcGbw"
                    target="_blank"
                    rel="noreferrer"
                    data-preview-title="Blob Opera"
                  >
                  David Li&apos;s Blob Opera
                </a>{' '}
                  made me curious about materials in the first place. I was
                  learning computer graphics through large, general-purpose
                  renderers that tried to support everything, and honestly
                  could not find much joy in building another one. Blob Opera
                  showed me a different scale: a small, purpose-built renderer
                  could make one character feel soft, glossy, and physically
                  responsive while leaving most of the experiment to the ML
                  music system.
                </p>
                <p>
                  I first guessed the blobs were 2D because their silhouettes do
                  so much of the work. I checked the renderer, and they are
                  actually deforming 3D meshes. The part I borrowed was the
                  division of work: my jelly keeps its editable silhouette and
                  motion in a 2D profile, then adds a lathed 3D surface only for
                  the lighting.
                </p>
              </FieldNoteDetail>
            </FieldNoteSection>

            <FieldNoteSection
              number="04"
              id="textellation"
              title="textellation"
              className={styles.studySection}
            >

              <div className={styles.studyHeader}>
                <div>
                  <p className={styles.studyDate}>nov 08–dec 30, 2025</p>
                  <h3>the layout needed structure without becoming a word cloud</h3>
                </div>
                <StudyLinks
                  live="https://www.textellation.com/"
                  source="https://github.com/kimestelle/textellation"
                />
              </div>

              <div className={styles.studyGrid}>
                <FieldNoteFigure
                  src="/project-images/covers/textellation-cover.webp"
                  alt="A Textellation poster arranging a passage into nested typographic constellations"
                  width={400}
                  height={400}
                  caption="an exported poster with paragraph and sentence territories still visible."
                  className={styles.studyFigure}
                  sizes="(max-width: 767px) 100vw, 25rem"
                />

                <div className={styles.studyCopy}>
                  <StudyTurn
                    problem="Strict reading order still looked like typesetting; one global force layout erased the paragraphs and sentences that made the passage legible."
                    choice="I render a fixed-resolution Canvas2D composition, pack paragraph territories first, seed sentence centers with a sunflower pattern, and run D3 forces only on words inside those local neighborhoods. A local wink POS tagger supplies grammatical cues."
                    reason="Canvas text measurement gives the widths used for collision radii and preserves the exact exported pixels. D3 resolves local collisions without replacing the document hierarchy. POS tagging runs in the browser without a server or language model."
                    boundary="Textellation measures text width and estimates vertical bounds rather than measuring every glyph outline. Each output format enforces a readable floor and may cap or trim input that cannot fit."
                  />
                  <p>
                    Punctuation becomes a small set of star-shaped cues rather
                    than disappearing. Poster, card, square, strip, and
                    wallpaper outputs keep fixed dimensions, so the saved
                    composition does not reflow later.
                  </p>
                </div>
              </div>

              <FieldNoteDetail label="the nested rules that keep it legible">
                <ol className={styles.ruleList}>
                  <li>
                    <span>01 / paragraphs</span>
                    <p>
                      Each paragraph gets a 3:2 territory sized from its word
                      count. Packing favors a loose top-to-bottom, left-to-right
                      path without forcing every cluster into a grid.
                    </p>
                  </li>
                  <li>
                    <span>02 / sentences</span>
                    <p>
                      Sentence centers begin in a sunflower pattern, separate
                      from one another, and stay clamped inside their paragraph.
                    </p>
                  </li>
                  <li>
                    <span>03 / words</span>
                    <p>
                      Canvas-measured text widths set the collision radii. Local
                      gravity, faint order links, and part-of-speech styling
                      help a reader recover the sentence structure.
                    </p>
                  </li>
                  <li>
                    <span>04 / the page</span>
                    <p>
                      The poster, card, square, strip, or wallpaper stays fixed
                      while the browser scales it uniformly. If a passage cannot
                      clear the readability floor, the input is capped or
                      trimmed for that format instead of shrinking into noise.
                    </p>
                  </li>
                </ol>
              </FieldNoteDetail>

              <FieldNoteDetail label="earlier record">
                <p>
                  My 2025 portfolio slides, pages 6–7, record the original UX
                  constraints behind these rules.
                </p>
              </FieldNoteDetail>
            </FieldNoteSection>

            <FieldNoteSection
              number="05"
              id="characters"
              title="pip foundry"
              className={styles.studySection}
            >

              <div className={styles.studyHeader}>
                <div>
                  <p className={styles.studyDate}>
                    jul 18–19, 2026 · hackathon R&amp;D
                  </p>
                  <h3>
                    separate generative variation from what the character has
                    to keep
                  </h3>
                </div>
              </div>

              <div className={`${styles.studyGrid} ${styles.studyGridReverse}`}>
                <div className={styles.studyCopy}>
                  <p>
                    Pip started after I generated a Codex pet. That workflow
                    let the image model redraw every pose, then used an LLM and
                    written rules to check the frames one by one. It took about
                    eight hours, and I still could not directly tune the body,
                    rig, expressions, or material. For the hackathon, I treated
                    that as a pipeline problem:{' '}
                    <strong>
                      use generation to propose the character, then move
                      repeatable structure into code
                    </strong>
                    .
                  </p>
                  <StudyTurn
                    problem="A generated image can vary freely. A reusable character cannot. Its front, side, and back need to agree; eyes and mouths need stable anchors; seams need to survive the jump to 3D; and the final mesh needs a usable rig. Single-view 3D generation kept inventing the hidden sides and returned inconsistent topology or unreliable rigs."
                    choice="The brief split the system into four bounded stages: generate a parameter-controlled sketch, restyle it to the target material, create front, side, and back views with marked facial features and seam lines, then reconstruct and rig the 3D mesh. During the hackathon, I tested Taubin and conformalized mean-curvature smoothing on generated GLBs, then wrote a rig-preserving plushify pass that welds UV splits, smooths and inflates the surface, and writes the result back in the original accessor order."
                    reason="Multi-view references reduce what the 3D model has to invent. Marked features give rigging and seam projection explicit anchors. The deterministic plushify pass can give different generated bodies one material language without changing vertex IDs, joints, skin weights, textures, or animations."
                    boundary="The end-to-end pipeline below is the system I designed, not a claim that every stage shipped in two days. The hackathon implementation covered mesh-treatment tests, rig-preserving plushify, panel flattening, sewing-pattern output, and offline texture baking. Automatic turnaround-to-rig transfer, live expression controls, PATINA material reuse, and the Gemma layer remained follow-up work."
                  />
                </div>

                <div
                  className={styles.processGallery}
                  aria-label="Pip Foundry pipeline experiments"
                >
                  <FieldNoteFigure
                    src="/project-images/material-studies/pip-foundry/multiview-and-component-maps.png"
                    alt="Pip character moving from a sketch to material render, front side and back views, and fixed-color component maps"
                    width={2142}
                    height={1956}
                    caption="sketch → material pass → front, side, and back views → fixed-color component maps."
                    className={styles.studyFigure}
                    sizes="(max-width: 767px) 100vw, 23rem"
                  />
                  <FieldNoteFigure
                    src="/project-images/material-studies/pip-foundry/turnaround-and-rig-marks.png"
                    alt="Three-view Pip turnaround with component colors used as rigging and projection cues"
                    width={2060}
                    height={1956}
                    caption="the component map made each limb identifiable before projecting the marks onto the 3D mesh."
                    className={styles.studyFigure}
                    sizes="(max-width: 767px) 100vw, 23rem"
                  />
                  <FieldNoteFigure
                    src="/project-images/material-studies/pip-foundry/seam-marked-turnaround.png"
                    alt="Pip turnaround with colored component regions and a plush render with marked seams"
                    width={2060}
                    height={1956}
                    caption="a separate seam-marked turnaround tested how fabrication cues could survive the same transfer."
                    className={styles.studyFigure}
                    sizes="(max-width: 767px) 100vw, 23rem"
                  />
                  <FieldNoteFigure
                    src="/project-images/material-studies/pip-foundry/rig-lab.png"
                    alt="Pip Rig Lab showing a generated character with selectable bodies, moods, and plushification"
                    width={2782}
                    height={1956}
                    caption="the rig lab reused one state machine across generated bodies and exposed plushification as a tunable pass."
                    className={styles.studyFigure}
                    sizes="(max-width: 767px) 100vw, 23rem"
                  />
                </div>

                <FieldNoteFigure
                  src="/project-images/material-studies/pip-foundry/mesh-treatment-study.png"
                  alt="Generated piprite mesh compared across mean-curvature, Taubin, pressure, and smoothing treatments"
                  width={930}
                  height={740}
                  caption="the same generated body under the mesh treatments I tested."
                  className={styles.studyFigure}
                  sizes="(max-width: 767px) 100vw, 25rem"
                />
              </div>

              <FieldNoteDetail label="what I implemented from the papers">
                <p>
                  Taubin&apos;s 1995 smoothing method and Kazhdan, Solomon, and
                  Ben-Chen&apos;s 2012 conformalized mean-curvature flow gave me
                  two baselines: one reduced shrinkage; the other rounded by
                  shrinking. The plushify pass added outward pressure so I
                  could soften and inflate the body while keeping the original
                  rigged file structure.
                </p>
                <p>
                  Separately, I rebuilt the core geometry path from Mori and
                  Igarashi&apos;s <i>Plushie</i>: split the mesh into
                  near-developable panels, flatten each panel with LSCM, smooth
                  the outlines, and lay them out as a sewing pattern. The same
                  pattern coordinates became the UV atlas for tiled fabric,
                  seam darkening, stitch dashes, quilt-puff normals, and edge
                  bleed.
                </p>
              </FieldNoteDetail>
            </FieldNoteSection>

            <aside
              className={`${styles.deletedLayer} ${styles.deletedLayerFinal}`}
              aria-labelledby="mood-ring-evolution"
            >
              <div>
                <span
                  className={`star-glyph-detail ${styles.deletedGlyph}`}
                  aria-hidden="true"
                >
                  {'\uE000'}
                </span>
                <p>mood ring shader</p>
              </div>
              <div>
                <h3 id="mood-ring-evolution">why I made it opt-in</h3>
                <ol className={styles.evolutionList}>
                  <li>
                    <span>01 · pointer heat</span>
                    <p>
                      The first version stored each pointer or touch contact as
                      a timestamped heat spot. A fragment shader expanded and
                      decayed up to 50 spots, mixing purple, orange, and teal
                      while the page showed through the cooler center. I wanted
                      cursor movement to leave evidence of contact instead of
                      reading like a detached pointer.
                    </p>
                  </li>
                  <li>
                    <span>02 · more system, more cost</span>
                    <p>
                      I added a second canvas of star glyphs driven by
                      Conway-style cellular automata and hollow rings around new
                      heat spots. I also added a WebGPU path, kept a WebGL
                      fallback, rendered the low-frequency field at half
                      resolution, added dithering, and stopped the frame loop
                      after the spots expired. The background still asked
                      people to parse two systems before reading the portfolio.
                    </p>
                  </li>
                  <li>
                    <span>03 · opt-in</span>
                    <p>
                      Optimization did not solve the main problem. The default
                      still put motion behind text, changed local contrast, and
                      competed with project imagery. I kept the renderer,
                      fallback, saved preference, and reduced-motion behavior,
                      but <strong>changed the default to off.</strong> The toggle
                      now treats it as an optional interaction study.
                    </p>
                  </li>
                </ol>
                <div
                  className={styles.evolutionMedia}
                  aria-label="Mood ring shader evolution"
                >
                  <FieldNoteFigure
                    src="/project-images/material-studies/mood-ring/first-heat-spots.png"
                    alt="October 2025 portfolio with soft pink heat spots following the pointer"
                    width={2225}
                    height={1481}
                    caption="oct 2025 · the first soft heat spots."
                    className={styles.studyFigure}
                    sizes="(max-width: 767px) 100vw, 15rem"
                  />
                  <FieldNoteFigure
                    src="/project-images/material-studies/mood-ring/stars-and-heat.png"
                    alt="January 2026 portfolio with large heat fields and a star layer"
                    width={2940}
                    height={1912}
                    caption="jan 2026 · the cellular-automata stars became a second canvas."
                    className={styles.studyFigure}
                    sizes="(max-width: 767px) 100vw, 15rem"
                  />
                  <FieldNoteFigure
                    src="/project-images/material-studies/mood-ring/portal-rings.png"
                    alt="January 2026 portfolio with hollow portal-like rings and star glyphs"
                    width={2940}
                    height={1912}
                    caption="jan 2026 · rings exposed the field beneath each contact."
                    className={styles.studyFigure}
                    sizes="(max-width: 767px) 100vw, 15rem"
                  />
                </div>
              </div>
            </aside>

            <FieldNoteSection
              number="06"
              id="range"
              title="other experiments"
              className={`${styles.studySection} ${styles.rangeSection}`}
            >
              <p className={styles.rangeIntroduction}>
                I keep making small builds between larger projects. Each one
                isolates an interaction, input, or representation.
              </p>

              <ul className={styles.rangeGrid}>
                {smallExperiments.map((experiment) => (
                  <li key={experiment.name}>
                    <span>{experiment.medium}</span>
                    <h3>{experiment.name}</h3>
                    <p>{experiment.note}</p>
                  </li>
                ))}
              </ul>
            </FieldNoteSection>
        </FieldNoteReader>

        <FieldNoteSequence
          current={3}
          total={3}
          previous={{
            href: '/field-notes/into-the-blue',
            title: 'into the blue',
          }}
        />
      </article>
    </main>
  );
}
