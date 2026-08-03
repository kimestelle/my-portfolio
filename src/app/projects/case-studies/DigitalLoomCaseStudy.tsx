import type { CSSProperties } from 'react';
import Image from 'next/image';
import {
  FieldNoteDetail,
  FieldNoteFigure,
  FieldNoteHeader,
  FieldNoteReader,
  FieldNoteSection,
} from '../../field-notes/components/FieldNotePrimitives';
import FieldNoteScrollLink from '../../field-notes/components/FieldNoteScrollLink';
import styles from './digital-loom-case-study.module.css';

const mapEntries = [
  ['evidence', 'generated maps are evidence, not a material'],
  ['source', 'one material core drives appearance and motion'],
  ['scale', 'simulate structure; shade surface detail'],
  ['controls', 'fewer controls create a wider believable range'],
  ['export', 'the material should survive outside the tool'],
  ['boundary', 'what the system cannot infer', 'retrospective'],
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
      className={`${inline ? 'project-case-study-inline-content' : 'responsive-padding'} ${styles.page}`}
      style={{ '--field-accent': 'rgb(142, 86, 98)' } as CSSProperties}
    >
      <article className={inline ? undefined : 'page-frame-wide'}>
        <FieldNoteHeader
          eyebrow="solo design + engineering"
          title="digital loom"
          deck="what does a generated fabric image need before it becomes a material you can trust, tune, simulate, and take elsewhere?"
          meta={[
            'built july 2026',
            'photo-to-PBR material pipeline',
            'custom rendering + XPBD cloth',
            'in active development',
          ]}
          links={[
            {
              href: 'https://digital-loom-nine.vercel.app/',
              label: 'open the studio ↗',
            },
          ]}
          breadcrumbRoot={{ href: '/projects', label: 'selected work' }}
          hideBreadcrumb={inline}
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

        <FieldNoteFigure
          src="/project-images/covers/loom-cover.webp"
          alt="Digital Loom interface showing fabric samples, cloth simulation, and material controls"
          width={1920}
          height={1231}
          caption="one fabric source moving through map extraction, material authoring, live cloth, and portable export."
          className={styles.heroFigure}
          sizes="(max-width: 767px) 100vw, 70rem"
          priority
        />

        <FieldNoteReader mapLabel="material argument" entries={mapEntries}>
          <FieldNoteSection
            number="00"
            id="evidence"
            title="generated maps are evidence, not a material"
            className={styles.section}
          >
            <p className={styles.lead}>
              Patina can factor one fabric photograph into albedo, normal,
              roughness, height, and metalness maps. Those maps describe
              visible surface cues. They do not explain how the cloth should
              bend, shear, transmit light, catch wind, or hold a crease.
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
              I treat the generated maps as an intermediate representation.
              They provide editable surface evidence; the graphics and
              simulation system adds the material behavior the image cannot
              contain.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="01"
            id="source"
            title="one material core drives appearance and motion"
            className={styles.section}
          >
            <p className={styles.lead}>
              My first versions exposed rendering and simulation as separate
              controls. That made it easy to create fabric that looked heavy
              and moved weightlessly, or looked porous while transmitting no
              light.
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
              I reduced the source of truth to seven physical facts. One
              function derives both shader and solver values from them, so the
              material remains coherent as someone tunes it.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="02"
            id="scale"
            title="simulate structure; shade surface detail"
            className={styles.section}
          >
            <p className={styles.lead}>
              Fidelity did not require modeling every thread. It required
              choosing the correct representation at each scale.
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
              A small XPBD mesh carries the causes of motion. Normal and height
              maps reconstruct thread-scale relief in the renderer. Geometry
              is spent where the cloth moves; shading is spent where the eye
              reads fiber structure.
            </p>

            <FieldNoteDetail label="the solver">
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
            title="fewer controls create a wider believable range"
            className={styles.section}
          >
            <p className={styles.lead}>
              More sliders initially felt like more expressive power. In
              practice they enlarged the space of contradictory materials.
            </p>

            <div className={styles.controlComparison}>
              <div>
                <span>independent parameters</span>
                <strong>roughness</strong>
                <strong>bend stiffness</strong>
                <strong>transmission</strong>
                <strong>mass</strong>
                <small>each control can contradict the others</small>
              </div>
              <div className={styles.controlPreferred}>
                <span>material intent</span>
                <strong>fiber + weave + weight</strong>
                <small>
                  coupled values keep optics and mechanics inside the same
                  family
                </small>
              </div>
            </div>

            <p>
              The useful authoring interface exposes perceptual and structural
              intent, then derives lower-level parameters. A smaller source of
              truth produces a larger range of materials that still feel like
              fabric.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="04"
            id="export"
            title="the material should survive outside the tool"
            className={styles.section}
          >
            <p className={styles.lead}>
              A convincing preview is not enough. The work becomes useful when
              another renderer, tool, or person can understand what was made.
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
              The studio exports named PBR maps, a packed ORM texture, a
              self-contained GLB, cloth-physics values, and provenance
              metadata. Export is not the last button in the interface; it is
              part of the material model.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="05"
            id="boundary"
            title="what the system cannot infer"
            className={styles.section}
          >
            <p className={styles.lead}>
              A flat photograph cannot recover physical truth. The system can
              suggest a useful starting point, but it should not disguise
              uncertainty as measurement.
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
              Every map-derived suggestion stays conservative and overridable.
              The next step is better calibration: reference fabrics with
              known measurements, interaction tests across material families,
              and clearer confidence signals in the authoring interface.
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
