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
  FieldNoteSourceLink,
} from '../components/FieldNotePrimitives';
import styles from './into-the-blue.module.css';

export const metadata: Metadata = {
  title: 'Into the Blue working file · Estelle Kim',
  description:
    'An unlisted build notebook about the museum conversations, camera geometry, and shared decisions behind Into the Blue.',
  robots: {
    index: false,
    follow: false,
  },
};

const mapEntries = [
  ['brief', 'make stickers without losing artifact context'],
  ['gallery', 'the gallery changed the plan'],
  ['assets', 'one format for every artifact asset'],
  ['camera', 'the camera prototype changed'],
  ['integration', 'keep captures local and reduce support work'],
  ['launch', 'launch + later fixes'],
  ['improve', 'what i would improve now', 'retrospective'],
] as const;

export default function IntoTheBlueFieldNotes() {
  return (
    <main
      className={`responsive-padding ${styles.page}`}
      style={{ '--field-accent': 'rgb(53, 126, 179)' } as CSSProperties}
    >
      <article className="page-frame-wide">
        <FieldNoteHeader
          eyebrow="collaborative project"
          title="into the blue"
          deck="how much can you turn an artifact into a collectible without losing its context?"
          meta={[
            'camera prototype, local media + integration',
            'built feb–apr 2025',
            '5-person development team',
            'updated through sep 2025',
          ]}
          links={[
            {
              href: 'https://penn.museum/sites/blue/welcome/',
              label: 'enter the experience ↗',
            },
            {
              href: 'https://github.com/PennSpark/into-the-blue',
              label: 'browse the source ↗',
            },
          ]}
          motif={
            <div className={styles.heroArtifacts} aria-hidden="true">
              <Image
                src="/blog/blue/lion.png"
                alt=""
                width={300}
                height={360}
                priority
              />
              <Image
                src="/blog/blue/diadems.png"
                alt=""
                width={300}
                height={360}
                priority
              />
              <Image
                src="/blog/blue/ram.png"
                alt=""
                width={300}
                height={360}
                priority
              />
            </div>
          }
        />

        <FieldNoteFigure
          src="/project-images/covers/museum-cover.webp"
          alt="Into the Blue mobile screens showing the camera cutout, artifact collection, and stickerbook"
          width={2000}
          height={1500}
          caption={
            <>
              the final system. it launched during the exhibition&apos;s opening
              weekend and remained deployed for roughly nine months at a museum
              receiving more than 180,000 visitors annually.
            </>
          }
          className={styles.heroFigure}
          priority
        />

        <FieldNoteReader mapLabel="decision trace" entries={mapEntries}>
          <FieldNoteSection
            number="00"
            id="brief"
            title="make stickers without losing artifact context"
            className={styles.section}
          >

            <p className={styles.lead}>
              <strong>dec 29–jan 31.</strong> Into the Blue started with a
              simple loop: find a blue object, photograph it, and keep the
              cutout as a sticker.
            </p>

            <p>
              The project leads interviewed museum staff and chose the
              collect-a-thon from four early concepts. The playfulness was
              useful, but staff did not want culturally significant objects
              treated like props or made to &quot;come to life.&quot; The
              interaction needed to keep a short piece of context and point
              visitors back to the physical object and label.
            </p>

            <p>
              It also had to begin from a QR code, use little text, work
              without visitor accounts, and create almost no support burden. I
              joined for implementation and took on the first
              camera-to-cutout prototype and local image store.
            </p>

            <FieldNoteFigure
              src="/project-images/into-the-blue/field-notes/collect-them-all.png"
              alt="Early Collect them All concept deck with camera, artifact, and collection screens"
              width={1600}
              height={900}
              caption="one of four early directions. we kept the collect-and-save interaction, removed the linear route, and changed the camera flow."
            />
          </FieldNoteSection>

          <FieldNoteSection
            number="01"
            id="gallery"
            title="the gallery changed the plan"
            className={styles.section}
          >

            <p className={styles.lead}>
              <strong>feb 03–07.</strong> A gallery walk made two assumptions
              in the early concept fall apart.
            </p>

            <p>
              First, Public Programs pointed out that families enter from
              different floors and could find the QR code halfway through a
              visit. The project leads and Penn Museum staff dropped the
              prescribed route. The five-person development team made each
              gallery module work as a starting point instead.
            </p>

            <p>
              Second, more than 200 museum objects were blue, but many were too
              high, dim, distant, hard to frame, or not appropriate to turn
              into a collectible. Museum staff, designers, and developers
              walked the galleries together and reduced the list to roughly
              three dozen objects that worked for both the visit and the
              camera.
            </p>

            <FieldNoteFigure
              src="/project-images/into-the-blue/image-1.png"
              alt="Visitors gathered in the Into the Blue exhibition at Penn Museum"
              width={801}
              height={540}
              caption="gallery layout, lighting, and viewing distance determined which objects visitors could find and photograph."
            />
          </FieldNoteSection>

          <FieldNoteSection
            number="02"
            id="assets"
            title="one format for every artifact asset"
            className={styles.section}
          >

            <p className={styles.lead}>
              Once we had an object list, the designers and camera pipeline
              needed to describe every artifact the same way.
            </p>

            <p>
              I worked with the lead designer to establish the handoff: a PNG
              overlay so visitors could see what they were looking for, one or
              more SVG paths for tracing and sticker cutting, tagged metadata,
              and the same 300 × 360 viewBox for every layer. Earlier
              screen-by-screen offsets worked for a prototype, then drifted
              across objects and devices.
            </p>

            <p>
              The shared geometry let the overlay, outline, captured crop, and
              final sticker line up without a separate set of corrections for
              every object. It also gave the design team a repeatable way to
              prepare new artifacts as gallery content changed.
            </p>

            <FieldNoteFigure
              src="/project-images/into-the-blue/field-notes/artifact-sizing-guidelines.png"
              alt="Figma artifact sizing guidelines showing PNG cutouts, camera overlays, and bordered stickers aligned within shared frames"
              width={1890}
              height={1476}
              caption="the asset contract the lead designer and i used across design and engineering."
            />
          </FieldNoteSection>

          <FieldNoteSection
            number="03"
            id="camera"
            title="the camera prototype changed"
            className={styles.section}
          >

            <p className={styles.lead}>
              <strong>feb 16–mar 02.</strong> My first prototype clipped the
              live camera feed against the artifact SVG on every frame. It
              proved the idea and made the preview do too much work.
            </p>

            <p>
              A single outline was not enough. Handles, holes, beads, and
              disconnected pieces needed several SVG paths combined into one
              even-odd clipping region. I first proved the{' '}
              <FieldNoteSourceLink
                id="01"
                href="https://github.com/PennSpark/into-the-blue/commit/5ef5aed"
              >
                single-path camera cutout
              </FieldNoteSourceLink>
              , then added{' '}
              <FieldNoteSourceLink
                id="02"
                href="https://github.com/PennSpark/into-the-blue/commit/c4e72b1"
              >
                multi-path clipping
              </FieldNoteSourceLink>
              .
            </p>

            <div className={styles.artifactGeometry}>
              <figure>
                <div className={`${styles.artifactImage} media-clip-surface`}>
                  <Image
                    src="/blog/blue/diadems.png"
                    alt="A cutout photograph of a Middle Eastern diadem"
                    width={300}
                    height={360}
                  />
                </div>
                <figcaption>the captured artifact layer</figcaption>
              </figure>
              <span aria-hidden="true">+</span>
              <figure>
                <div className={`${styles.artifactImage} media-clip-surface`}>
                  <Image
                    src="/blog/blue/diadems.svg"
                    alt="The multi-path SVG outline used to clip the diadem"
                    width={300}
                    height={360}
                  />
                </div>
                <figcaption>the multi-path clipping geometry</figcaption>
              </figure>
            </div>

            <p>
              The multi-path result was right, but recomputing it continuously
              made the preview less responsive. I kept the live view light and
              moved the full cutout to the moment after the visitor pressed the
              shutter. The{' '}
              <FieldNoteSourceLink
                id="03"
                href="https://github.com/PennSpark/into-the-blue/commit/0b43dd5"
              >
                capture-time version
              </FieldNoteSourceLink>{' '}
              kept the same result without running the multi-path crop on every
              frame.
            </p>

            <p>
              A museum review from feb 22–mar 02 also caught difficult objects,
              unclear progress, context that was too thin, and a stickerbook
              that felt too much like Facebook. The designers and developers
              revised the progress labels and stickerbook before launch instead
              of treating the camera prototype as the only task.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="04"
            id="integration"
            title="keep captures local and reduce support work"
            className={styles.section}
          >

            <p className={styles.lead}>
              <strong>feb 19–mar 29.</strong> The app could not turn Visitor
              Services into a support desk, so progress and captured media
              stayed on the visitor&apos;s device.
            </p>

            <p>
              I built the{' '}
              <FieldNoteSourceLink
                id="04"
                href="https://github.com/PennSpark/into-the-blue/commit/c85e372"
              >
              first IndexedDB image store
              </FieldNoteSourceLink>{' '}
              keyed by artifact ID. Captures could survive refreshes without a
              visitor account or a new media backend. The development team then
              integrated that local data with gallery content, progress,
              labels, the ending, analytics, static routes, and deployment.
            </p>

            <p>
              I also built the first stickerboard export and the rasterized
              outline pipeline used in{' '}
              <FieldNoteSourceLink
                id="05"
                href="https://github.com/PennSpark/into-the-blue/commit/759bc07"
              >
                capture-time sticker processing
              </FieldNoteSourceLink>
              . The production camera was substantially refactored after my
              prototype, and other developers extended the local database and
              stickerboard.
            </p>

            <div className={styles.ownershipGrid}>
              <div>
                <h3>I originated or directly built</h3>
                <ul>
                  <li>the first camera-to-cutout prototype</li>
                  <li>multi-path even-odd clipping</li>
                  <li>the first IndexedDB media store</li>
                  <li>capture-time sticker processing + outline pipeline</li>
                  <li>the first stickerboard export</li>
                  <li>later touch, zoom + pinch behavior</li>
                </ul>
              </div>
              <div>
                <h3>museum staff, designers + developers refined together</h3>
                <ul>
                  <li>the production camera and gallery data flow</li>
                  <li>PNG, SVG + metadata guidelines for artifact assets</li>
                  <li>
                    progress, local persistence + private browsing behavior
                  </li>
                  <li>stickerboard controls, bounds + composition</li>
                  <li>content, analytics, deployment + launch fixes</li>
                  <li>gallery-rotation updates after opening</li>
                </ul>
              </div>
            </div>
          </FieldNoteSection>

          <FieldNoteSection
            number="05"
            id="launch"
            title="launch + later fixes"
            className={styles.section}
          >

            <p className={styles.lead}>
              <strong>mar 05–sep 20.</strong> The five-person development team
              integrated and launched the experience for the
              exhibition&apos;s opening weekend. It stayed deployed for roughly
              nine months.
            </p>

            <p>
              After launch, I returned for artifact alignment, zoom, pinch, and
              device-specific fixes, including a{' '}
              <FieldNoteSourceLink
                id="06"
                href="https://github.com/PennSpark/into-the-blue/commit/7d7de7c"
              >
                pinch-to-zoom correction
              </FieldNoteSourceLink>
              . Museum staff, designers, and developers kept refining content,
              private-browsing behavior, analytics, and updates for rotating
              gallery objects.
            </p>

            <FieldNoteFigure
              src="/project-images/into-the-blue/image-2.png"
              alt="Museum visitors using Into the Blue on their phones"
              width={802}
              height={540}
              caption="museum visitors used the app while standing and moving through the galleries, often while talking with their companions."
            />

            <p>
              I expected the camera math to take most of the work. In practice,
              object choice, cultural context, and maintenance changed more
              decisions. The route, assets, storage, and copy kept pointing
              visitors back to the museum object.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="06"
            id="improve"
            title="what i would improve now"
            className={`${styles.section} ${styles.retrospectiveSection}`}
          >
            <p className={styles.lead}>
              I would keep the offline-first camera and sticker loop. I would
              change three things.
            </p>

            <ol className={styles.improvementList}>
              <li>
                <h3>make the cutout feel like it is being formed</h3>
                <p>
                  The outline currently reads as a finished mask. I would make
                  it thin and black, then animate a bright glint along the
                  moving edge so the sticker feels laser-cut in real time.
                </p>
              </li>
              <li>
                <h3>use a small backend for sharing + multiplayer</h3>
                <p>
                  Keeping everything local protected visitor privacy and
                  reduced operational risk. Those were good reasons, but I was
                  still too conservative about compute and storage. A small
                  backend could have enabled shareable dynamic artifacts and
                  multiplayer without making the whole system heavy. Sometimes
                  more infrastructure is worth it if it makes the experience
                  more fun.
                </p>
              </li>
              <li>
                <h3>go to the launch gala</h3>
                <p>I missed it :(</p>
              </li>
            </ol>
          </FieldNoteSection>

          <FieldNoteDetail label="supporting files">
            <ol className={styles.references}>
              <li>
                <a
                  href="https://penn.museum/sites/blue/welcome/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Into the Blue live experience ↗
                </a>
                <span>the deployed artifact</span>
              </li>
              <li>
                <a
                  href="https://github.com/PennSpark/into-the-blue"
                  target="_blank"
                  rel="noreferrer"
                >
                  PennSpark/into-the-blue ↗
                </a>
                <span>source, branches + full commit trail</span>
              </li>
              <li>
                <span className={styles.archiveReference}>
                  Stakeholder Meeting Presentation.pptx
                </span>
                <span>four early concepts + museum discussion</span>
              </li>
              <li>
                <span className={styles.archiveReference}>
                  Lo-fi Walkthrough.mov / Spark app 03.06 prototype.mov
                </span>
                <span>the feb 18 to mar 06 prototype change</span>
              </li>
              <li>
                <span className={styles.archiveReference}>
                  Estelle Kim Portfolio Slides.pdf / p. 4
                </span>
                <span>
                  earlier implementation retrospective; terminology checked
                  against the repository
                </span>
              </li>
            </ol>
          </FieldNoteDetail>

          <div className={styles.endMatter}>
            <a href="#brief">back to top ↑</a>
          </div>
        </FieldNoteReader>

        <FieldNoteSequence
          current={2}
          total={3}
          previous={{
            href: '/field-notes/internet-atlas',
            title: 'internet atlas',
          }}
          next={{
            href: '/field-notes/material-studies',
            title: 'material studies',
          }}
        />
      </article>
    </main>
  );
}
