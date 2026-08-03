import Image from 'next/image';
import {
  FieldNoteDetail,
  FieldNoteFigure,
  FieldNoteHeader,
  FieldNoteProjectSummary,
  FieldNoteReader,
  FieldNoteSection,
} from '../../field-notes/components/FieldNotePrimitives';
import FieldNoteScrollLink from '../../field-notes/components/FieldNoteScrollLink';
import styles from './digital-loom-case-study.module.css';

const mapEntries = [
  ['evidence', 'genAI as material input'],
  ['source', 'shared material model'],
  ['scale', 'cloth simulation and surface shading'],
  ['controls', 'material controls'],
  ['export', 'exports'],
  ['boundary', 'inference limits', 'retrospective'],
] as const;

const materialFacts = [
  ['areal density', 'apparent weight + solver mass'],
  ['cover factor', 'porosity + transmission'],
  ['thickness', 'relief + bending response'],
  ['fiber modulus', 'warp and weft stiffness'],
  ['fiber type', 'sheen + translucency family'],
  ['weave', 'directional structure'],
  ['twist', 'fiber-scale highlight breakup'],
] as const;

const exports = [
  ['PBR maps', 'named albedo, normal, roughness, height + ORM'],
  ['GLB', 'a self-contained, relightable material asset'],
  ['physics', 'cloth parameters derived from the same source'],
  ['provenance', 'machine-readable inputs and material metadata'],
] as const;

function FlowArrow() {
  return (
    <span className={styles.flowArrow} aria-hidden="true">
      →
    </span>
  );
}

export default function DigitalLoomCaseStudy({
  inline = false,
}: {
  inline?: boolean;
}) {
  const Root = inline ? 'div' : 'main';

  return (
    <Root
      className={`${inline ? 'project-case-study-inline-content' : 'responsive-padding'} case-study-reading-scope ${styles.page}`}
    >
      <article className={inline ? undefined : 'page-frame-wide'}>
        <div className={styles.heroIntro}>
          <FieldNoteHeader
            eyebrow="solo design + engineering"
            title="digital loom"
            deck="Material editor that turns one fabric photo into PBR maps, live cloth, and exportable assets. GenAI proposes the surface; an editable renderer and cloth solver make the material."
            meta={[]}
            links={[
              {
                href: 'https://digital-loom-nine.vercel.app/',
                label: 'open the studio ↗',
              },
            ]}
            breadcrumbRoot={{ href: '/projects', label: 'selected work' }}
            hideBreadcrumb={inline}
          />

          <figure className={styles.heroFigure}>
            <div className={`${styles.heroVideo} media-clip-surface`}>
              <video
                src="/project-images/digital-loom/demo/material-studio.m4v"
                poster="/project-images/covers/loom-cover.webp"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Digital Loom material studio switching fabric samples and inspecting live cloth up close"
              />
            </div>
            <figcaption>
              generated maps become a material that can be tuned, simulated,
              and exported.
            </figcaption>
          </figure>
        </div>

        <FieldNoteProjectSummary
          facts={[
            ['role', 'solo designer and engineer'],
            ['timeline', 'july–august 2026 · active development'],
            ['team', 'solo project'],
            ['outcome', 'photo → editable material → PBR + GLB export'],
          ]}
          keyDetails={[
            'GenAI turns a fabric photo into source maps instead of a finished render',
            'seven fabric properties supply shared renderer and solver defaults',
            'transmission, weight, stiffness, and surface controls remain editable',
            'exports include PBR maps, packed ORM, GLB, cloth settings, and provenance',
          ]}
        />

        <FieldNoteReader mapLabel="sections" entries={mapEntries}>
          <FieldNoteSection
            number="00"
            id="evidence"
            title="genAI as material input"
            className={styles.section}
          >
            <p className={styles.lead}>
              Patina generates albedo, normal, roughness, height, and metalness
              maps from a fabric photo. Digital Loom treats those maps as
              source material for a WebGL renderer and cloth solver.
            </p>

            <div className={styles.thesisFlow} aria-label="Digital Loom product approach">
              <div>
                <span>genAI input</span>
                <strong>photo → PBR maps</strong>
                <small>surface information, not a finished render</small>
              </div>
              <FlowArrow />
              <div>
                <span>opinionated framework</span>
                <strong>fabric core + derived defaults</strong>
                <small>renderer and solver start from the same fabric</small>
              </div>
              <FlowArrow />
              <div>
                <span>traditional rendering</span>
                <strong>XPBD cloth + WebGL surface</strong>
                <small>deterministic, interactive, and inspectable</small>
              </div>
              <FlowArrow />
              <div>
                <span>preserved freedom</span>
                <strong>manual controls + export</strong>
                <small>tune the result and take it elsewhere</small>
              </div>
            </div>

            <p>
              The maps describe color, relief, and light response. A photograph
              cannot determine mass, weave, bend, transmission, or crease
              behavior, so the editor supplies those values and keeps them
              editable.
            </p>

            <div className={styles.mapContactSheet} aria-label="Extracted material maps">
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
                      sizes="(max-width: 520px) 44vw, 10rem"
                    />
                  </div>
                  <figcaption>{label}</figcaption>
                </figure>
              ))}
            </div>

            <p>
              GenAI supplies the visible surface. The material model still
              decides how the fabric moves.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="01"
            id="source"
            title="shared material model"
            className={styles.section}
          >
            <p className={styles.lead}>
              Starting from unrelated optical and mechanical sliders made it
              easy to pair one fabric&apos;s surface with another fabric&apos;s
              motion. I added a shared starting model for both.
            </p>

            <div className={styles.sourceDiagram} aria-label="Material source of truth diagram">
              <div className={styles.factGrid}>
                {materialFacts.map(([name, effect]) => (
                  <div key={name}>
                    <strong>{name}</strong>
                    <span>{effect}</span>
                  </div>
                ))}
              </div>
              <FlowArrow />
              <div className={styles.compilerNode}>
                <span>shared derivation</span>
                <strong>material core</strong>
                <small>bounded, editable, serializable</small>
              </div>
              <FlowArrow />
              <div className={styles.outputPair}>
                <div>
                  <span>appearance</span>
                  <strong>sheen · relief · transmission · fray</strong>
                </div>
                <div>
                  <span>motion</span>
                  <strong>mass · warp · weft · shear · bend</strong>
                </div>
              </div>
            </div>

            <p>
              Each profile starts from seven fabric properties. One function
              derives renderer and solver defaults, then applies small preset
              overrides. Lower-level controls remain available; the shared
              model only supplies their starting point.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="02"
            id="scale"
            title="cloth simulation and surface shading"
            className={styles.section}
          >
            <p className={styles.lead}>
              A 48 × 48 XPBD mesh handles drape and creases. The shader handles
              thread-scale relief, transmission, and highlights.
            </p>

            <div className={styles.scaleDiagram}>
              <div className={styles.meshPanel} aria-hidden="true">
                <span>48 × 48</span>
                <div className={styles.meshGrid} />
                <strong>XPBD structure</strong>
                <small>drape · constraints · creases · wind</small>
              </div>
              <div className={styles.plus} aria-hidden="true">+</div>
              <div className={styles.surfacePanel}>
                <Image
                  src="/project-images/material-studies/loom/normal.webp"
                  alt="Normal map carrying the red silk sample's fiber-scale relief"
                  width={720}
                  height={720}
                />
                <strong>high-resolution surface</strong>
                <small>normal · parallax · weave · grazing light</small>
              </div>
            </div>

            <p>
              The mesh carries motion without trying to model every thread.
              Normal and height maps add the fiber detail that appears when
              light moves across the surface.
            </p>

            <FieldNoteDetail label="cloth solver">
              <p>
                The live studio uses Verlet integration with XPBD warp, weft,
                shear, and bend constraints. More detailed dihedral-hinge
                experiments remain separate cloth research rather than a
                capability represented by the current product.
              </p>
            </FieldNoteDetail>
          </FieldNoteSection>

          <FieldNoteSection
            number="03"
            id="controls"
            title="material controls"
            className={styles.section}
          >
            <p className={styles.lead}>
              Detailed controls remain. The change was giving them a material-
              specific starting point before someone tunes them.
            </p>

            <div className={styles.controlComparison}>
              <div>
                <span>derived starting point</span>
                <strong>density + cover + thickness</strong>
                <strong>fiber + weave + twist</strong>
                <small>one profile supplies renderer and solver defaults</small>
              </div>
              <div className={styles.controlPreferred}>
                <span>manual overrides</span>
                <strong>transmission + weight</strong>
                <strong>warp + weft + shear + bend</strong>
                <strong>sheen + openness + surface depth</strong>
                <small>
                  detailed controls remain available and save with the material
                </small>
              </div>
            </div>

            <p>
              The fabric core supplies the baseline. Independent overrides sit
              on top and save with the material. Coupling defines the starting
              point, not the allowed result.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="04"
            id="export"
            title="exports"
            className={styles.section}
          >
            <p className={styles.lead}>
              Export includes the maps, 3D asset, cloth settings, and source
              metadata needed to reuse the material elsewhere.
            </p>

            <div className={styles.exportFlow}>
              <div className={styles.exportSource}>
                <span>authored once</span>
                <strong>Digital Loom material</strong>
              </div>
              <FlowArrow />
              <div className={styles.exportGrid}>
                {exports.map(([name, description]) => (
                  <div key={name}>
                    <strong>{name}</strong>
                    <span>{description}</span>
                  </div>
                ))}
              </div>
            </div>

            <p>
              The studio writes named PBR maps, a packed ORM texture, a
              self-contained GLB, cloth values, and provenance metadata. The
              preview and export use the same resolved material.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="05"
            id="boundary"
            title="inference limits"
            className={styles.section}
          >
            <p className={styles.lead}>
              A flat photograph cannot measure a fabric&apos;s physical behavior.
              Digital Loom suggests a starting point and leaves the uncertain
              values editable.
            </p>

            <div className={styles.boundaryGrid}>
              <div>
                <span>the image can support</span>
                <strong>color, directional detail, visible relief, light spread</strong>
              </div>
              <div>
                <span>the author must still decide</span>
                <strong>weight, fiber stiffness, weave, twist, intended scale</strong>
              </div>
            </div>

            <p>
              The next step is calibration against fabrics with known
              measurements, followed by interaction tests across material
              families and clearer confidence labels in the editor.
            </p>
          </FieldNoteSection>

          <div className={styles.endMatter}>
            <FieldNoteScrollLink href="#evidence">
              back to top ↑
            </FieldNoteScrollLink>
          </div>
        </FieldNoteReader>
      </article>
    </Root>
  );
}
