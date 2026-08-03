import Image from 'next/image';
import {
  FieldNoteDetail,
  FieldNoteFigure,
  FieldNoteHeader,
  FieldNoteProjectSummary,
  FieldNoteReader,
  FieldNoteSection,
  FieldNoteSequence,
  FieldNoteSourceLink,
} from '../components/FieldNotePrimitives';
import FieldNoteScrollLink from '../components/FieldNoteScrollLink';
import styles from './into-the-blue.module.css';

const mapEntries = [
  ['brief', 'visitor flow and constraints'],
  ['gallery', 'artifact selection'],
  ['assets', 'shared camera geometry'],
  ['camera', 'sticker processing'],
  ['integration', 'offline storage and recovery'],
  ['launch', 'testing and launch'],
  ['improve', 'what i would change', 'retrospective'],
] as const;

export default function IntoTheBlueFieldNotes({
  asProject = false,
  inline = false,
}: {
  asProject?: boolean;
  inline?: boolean;
}) {
  const Root = inline ? 'div' : 'main';

  return (
    <Root
      className={`${inline ? 'project-case-study-inline-content' : 'responsive-padding'} ${asProject || inline ? 'case-study-reading-scope' : ''} ${styles.page}`}
    >
      <article className={inline ? undefined : 'page-frame-wide'}>
        <FieldNoteHeader
          eyebrow="collaborative project"
          title="into the blue"
          deck="Mobile scavenger hunt for Penn Museum. Visitors photograph selected artifacts through a guide, save the cutouts as stickers, and arrange a personal stickerboard."
          meta={[]}
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
          breadcrumbRoot={
            asProject
              ? { href: '/projects', label: 'selected work' }
              : undefined
          }
          hideBreadcrumb={inline}
        />

        <FieldNoteProjectSummary
          facts={[
            ['role', 'frontend developer · camera, stickers, and local storage'],
            ['timeline', 'february–april 2025 · deployed about nine months'],
            ['team', '5 developers within an 8-person project group'],
            ['outcome', 'shipped in eight weeks for Penn Museum'],
          ]}
          keyDetails={[
            'proposed and built the guided camera capture + SVG cutout pipeline',
            'aligned guides, masks, crops, and stickers in one 300 × 360 coordinate system',
            'stored stickers and progress in IndexedDB so visits survived refreshes',
            'co-built the stickerboard and adapted the flow to museum constraints',
          ]}
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

        <FieldNoteReader mapLabel="sections" entries={mapEntries}>
          <FieldNoteSection
            number="00"
            id="brief"
            title="visitor flow and constraints"
            className={styles.section}
          >

            <p className={styles.lead}>
              Visitors scan a QR code, find a selected blue artifact,
              photograph it inside a guide, and keep the cutout as a sticker.
            </p>

            <p>
              Museum staff wanted the interaction to point back to the real
              object, not turn culturally significant artifacts into animated
              props. The app also had to work from a QR code, without accounts,
              with little text and almost no support burden. I owned the first
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
            title="artifact selection"
            className={styles.section}
          >

            <p className={styles.lead}>
              A gallery walk changed the route and the artifact list.
            </p>

            <p>
              Families could enter from different floors or find the QR code
              halfway through a visit, so we removed the prescribed route.
              Every gallery module became a valid starting point.
            </p>

            <p>
              More than 200 objects were blue. Many were too high, dim,
              distant, hard to frame, or not appropriate as collectibles.
              Museum staff, designers, and developers reduced the list to
              roughly three dozen objects that worked for both the visit and
              the camera.
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
            title="shared camera geometry"
            className={styles.section}
          >

            <p className={styles.lead}>
              The camera guide, crop mask, and saved sticker needed to align on
              different phones.
            </p>

            <p>
              I worked with the lead designer on one asset contract: a PNG
              guide, one or more SVG cutout paths, tagged metadata, and the same
              300 × 360 viewBox for every layer. Per-screen offsets worked in a
              prototype, then drifted across artifacts and devices.
            </p>

            <p>
              Shared geometry kept the guide, outline, camera crop, and sticker
              aligned. It also gave the design team one way to prepare new
              artifacts when gallery content changed.
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
            title="sticker processing"
            className={styles.section}
          >

            <p className={styles.lead}>
              My first prototype clipped the live camera feed against the SVG
              on every frame. It proved the interaction and made the preview
              do too much work.
            </p>

            <p>
              Handles, holes, beads, and disconnected parts needed multiple SVG
              paths combined into one even-odd clipping region. I first proved
              the{' '}
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
              Recomputing the multi-path crop continuously slowed the preview.
              I kept the live guide light and moved the full cutout to the
              moment after the visitor pressed the shutter. The{' '}
              <FieldNoteSourceLink
                id="03"
                href="https://github.com/PennSpark/into-the-blue/commit/0b43dd5"
              >
                capture-time version
              </FieldNoteSourceLink>{' '}
              kept the same output without processing every frame.
            </p>

            <p>
              Museum review also caught difficult objects, unclear progress,
              thin context, and a stickerbook that felt too much like Facebook.
              We revised the object list, progress labels, and stickerboard
              before launch.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="04"
            id="integration"
            title="offline storage and recovery"
            className={styles.section}
          >

            <p className={styles.lead}>
              Stickers and progress stayed on the visitor&apos;s device so a
              refresh or bad museum Wi-Fi did not erase the visit.
            </p>

            <p>
              I built the{' '}
              <FieldNoteSourceLink
                id="04"
                href="https://github.com/PennSpark/into-the-blue/commit/c85e372"
              >
              first IndexedDB image store
              </FieldNoteSourceLink>{' '}
              keyed by artifact ID. Captures survived refreshes without visitor
              accounts or a media backend. The team connected that local data
              to gallery progress, labels, the ending, analytics, and
              deployment.
            </p>

            <p>
              I also built the first stickerboard export and the rasterized
              outline pipeline for{' '}
              <FieldNoteSourceLink
                id="05"
                href="https://github.com/PennSpark/into-the-blue/commit/759bc07"
              >
                capture-time sticker processing
              </FieldNoteSourceLink>
              . Other developers later refactored the production camera and
              extended the local database and stickerboard.
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
            title="testing and launch"
            className={styles.section}
          >

            <p className={styles.lead}>
              The five-person development team shipped the experience in eight
              weeks for opening weekend. It stayed deployed for roughly nine
              months.
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
              I expected camera math to drive most decisions. Object choice,
              cultural context, and maintenance changed more. The route,
              assets, storage, and copy all had to keep pointing visitors back
              to the museum object.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="06"
            id="improve"
            title="what i would change"
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
            <FieldNoteScrollLink href="#brief">
              back to top ↑
            </FieldNoteScrollLink>
          </div>
        </FieldNoteReader>

        {!asProject ? (
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
        ) : null}
      </article>
    </Root>
  );
}
