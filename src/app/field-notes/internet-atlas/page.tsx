import Image from 'next/image';
import {
  FieldNoteHeader,
  FieldNoteProjectSummary,
  FieldNoteReader,
  FieldNoteSection,
  FieldNoteSequence,
  FieldNoteSourceLink,
} from '../components/FieldNotePrimitives';
import FieldNoteScrollLink from '../components/FieldNoteScrollLink';
import styles from './internet-atlas.module.css';

const mapEntries = [
  ['path', 'dataset and visitor input'],
  ['team', 'ownership'],
  ['prototype', '2D system test'],
  ['axes', 'semantic layout'],
  ['layers', 'graph interaction'],
  ['ship', 'integration and launch'],
  ['preserve', 'static preservation'],
  ['improve', 'what i would change', 'retrospective'],
] as const;

function Figure({
  src,
  alt,
  width,
  height,
  caption,
  className = '',
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={`${styles.figure} ${className}`}>
      <div className={`${styles.figureImage} media-clip-surface`}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 767px) 100vw, 46rem"
        />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export default function InternetAtlasFieldNotes({
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
          title="internet atlas"
          deck="3D map of recorded browsing paths. Visitors enter descriptive words, reorganize 300+ websites by semantic similarity, and trace the journeys behind the graph."
          meta={[]}
          links={[
            {
              href: 'https://the-internet-atlas.com/',
              label: 'enter the map ↗',
            },
            {
              href: 'https://github.com/PennSpark/sp25-internet-atlas',
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
            ['role', 'technical lead · graph interaction, APIs, and integration'],
            ['timeline', 'march–april 2025 · static rebuild november 2025'],
            ['team', '7 developers + 1 designer'],
            ['outcome', '300+ sites · 1,000+ edges · 40+ live-demo users'],
          ]}
          keyDetails={[
            'co-led the product and split work around each teammate’s learning goals',
            'built the 2D system test, then the React Three Fiber graph and camera behavior',
            'mapped visitor-entered words to website coordinates through shared embeddings',
            'integrated branches, APIs, data layers, deployment, and the static rebuild',
          ]}
        />

        <Figure
          src="/project-images/covers/atlas-cover.webp"
          alt="The Internet Atlas 3D graph, with hundreds of glowing website nodes connected by browsing paths"
          width={2000}
          height={1500}
          caption={
            <>
              the preserved graph: 300+ website nodes and 1,000 recorded
              transitions, arranged by words chosen by each Atlas visitor.
            </>
          }
          className={styles.heroFigure}
        />

        <FieldNoteReader mapLabel="sections" entries={mapEntries}>
          <FieldNoteSection
            number="00"
            id="path"
            title="dataset and visitor input"
            className={styles.section}
          >

            <p className={styles.lead}>
              Internet Atlas maps recorded paths from a 2,148-participant web
              study. An Atlas visitor enters descriptive words, the sites move
              along those semantic axes, and the original paths stay intact.
            </p>

            <aside className={styles.marginNote}>
              <span
                className={`star-glyph-detail ${styles.marginGlyph}`}
                aria-hidden="true"
              >
                {'\uE000'}
              </span>
              <span>from the pitch deck</span>
              data autonomy, data visualization, and simply making a cool
              website. The third goal was useful.
            </aside>

            <p>
              Kevin Kelly&apos;s{' '}
              <FieldNoteSourceLink
                id="01"
                href="https://kk.org/ct2/the-internet-mapping-project/"
              >
                Internet Mapping Project
              </FieldNoteSourceLink>
              {' '}showed that maps of the web are subjective. We made that
              subjectivity an input: each Atlas visitor chooses the words that
              organize the geography.
            </p>

            <p>
              The source-study participants supply the browsing paths. The
              Atlas visitor supplies words such as <em>fuzzy</em>,{' '}
              <em>organic</em>, or <em>heavy</em>. We used the research dataset,
              not the Atlas visitor&apos;s own history.
            </p>

            <Figure
              src="/project-images/internet-atlas/image-1.png"
              alt="Early Internet Atlas design questions connecting data autonomy to a qualitative 3D map"
              width={1164}
              height={842}
              caption={
                <>
                  the questions from our first pitch deck remained relevant as
                  the implementation changed.{' '}
                  <FieldNoteSourceLink
                    id="02"
                    href="https://docs.google.com/presentation/d/19CMAghK2Ub82e52vwbGTKMA0D1wzHHrFf7xezm7MRYk/edit?usp=sharing"
                  >
                    open the pitch deck
                  </FieldNoteSourceLink>
                </>
              }
            />

            <div className={styles.sourcePair}>
              <Figure
                src="/project-images/internet-atlas/field-notes/project-overview.png"
                alt="The first page of the Internet Atlas comprehensive project document"
                width={1020}
                height={1320}
                caption="the internal overview held the project goals, links, timeline, and role assignments in one working document."
              />
              <Figure
                src="/project-images/internet-atlas/field-notes/source-paper.png"
                alt="The web routineness research paper used as the browsing-data source"
                width={1640}
                height={872}
                caption={
                  <>
                    the source study recorded web routineness across 2,148
                    participants.{' '}
                    <FieldNoteSourceLink
                      id="03"
                      href="https://arxiv.org/abs/2012.15112"
                    >
                      read the paper
                    </FieldNoteSourceLink>
                  </>
                }
              />
            </div>
          </FieldNoteSection>

          <FieldNoteSection
            number="01"
            id="team"
            title="ownership"
            className={styles.section}
          >

            <p className={styles.lead}>
              Ruth and I co-led the product with six other teammates. I led the
              graph interaction, API wiring, branch integration, and
              deployment.
            </p>

            <p>
              I asked each teammate what they wanted to learn before splitting
              the work. That expanded the original language layer into
              clustering, embedding, vector-database, scraping, and model
              experiments.
            </p>

            <div className={styles.peopleGrid} aria-label="Internet Atlas team roles">
              <div className={styles.personHighlight}>
                <span>estelle</span>
                <p>role-setting, frontend, cross-system integration + deployment</p>
              </div>
              <div>
                <span>ruth</span>
                <p>product framing, design + learning code and 3D</p>
              </div>
              <div>
                <span>fiona</span>
                <p>website collection, data formatting + ML exploration</p>
              </div>
              <div>
                <span>eric</span>
                <p>experienced ML, data handling, backend connections + clustering</p>
              </div>
              <div>
                <span>jimin</span>
                <p>graphics-minded frontend + Three.js exploration</p>
              </div>
              <div>
                <span>joseph</span>
                <p>vector database + embedding strategy</p>
              </div>
              <div>
                <span>david</span>
                <p>learning ML through model strategy + testing</p>
              </div>
              <div>
                <span>brandon</span>
                <p>learning ML through model testing</p>
              </div>
            </div>

            <p>
              Eric and Joseph knew more about ML and vector storage than I did.
              They documented their decisions; I connected their outputs to
              the interface and API. I did not direct every model choice. I did
              define handoffs, merge milestones, API contracts, and the final
              integration. The{' '}
              <a
                href="https://github.com/PennSpark/sp25-internet-atlas/commit/747b427"
                target="_blank"
                rel="noreferrer"
              >
                first preserved commit ↗
              </a>{' '}
              captures the stack after the first role split.
            </p>

            <aside className={styles.marginNote}>
              <span
                className={`star-glyph-detail ${styles.marginGlyph}`}
                aria-hidden="true"
              >
                {'\uE000'}
              </span>
              <span>what surprised me</span>
              once clusters and embeddings appeared in the interface, the ML
              work stopped feeling separate from the interaction.
            </aside>

          </FieldNoteSection>

          <FieldNoteSection
            number="02"
            id="prototype"
            title="2D system test"
            className={styles.section}
          >

            <p className={styles.lead}>
              I built a 2D D3 version before the 3D graph. Its job was to prove
              the full path from scraped sites and embeddings to storage, API
              responses, coordinates, and selection in the browser.
            </p>

            <div className={styles.decisionList}>
              <article>
                <span>one site record, many participant paths</span>
                <h3>
                  store sites once; keep participant paths separate.
                </h3>
                <p>
                  I stored each site&apos;s vector once in{' '}
                  <FieldNoteSourceLink id="04" href="https://www.pinecone.io/">
                    Pinecone
                  </FieldNoteSourceLink>{' '}
                  and kept participant-specific edges and paths in{' '}
                  <FieldNoteSourceLink id="05" href="https://supabase.com/">
                    Supabase
                  </FieldNoteSourceLink>
                  . The interface could reuse one semantic index while
                  switching between individual and aggregate paths.
                </p>
              </article>

              <article>
                <span>the first end-to-end frontend</span>
                <h3>100 × 100 D3 grid before 3D.</h3>
                <p>
                  By April 7, the grid displayed coordinates, directed edges,
                  zoom, and selection from live API data. It was small enough
                  for the whole team to debug together.
                </p>
              </article>
            </div>

            <p>
              Early reviews focused on data consistency and the point where one
              teammate&apos;s output became another&apos;s input. Styling came later.
            </p>

            <Figure
              src="/project-images/internet-atlas/image-2.png"
              alt="Internet Atlas data pipeline from website URLs through scraping, embeddings, Pinecone, FastAPI, and Supabase"
              width={1692}
              height={632}
              caption="the final pipeline separated scraping, multimodal embeddings, vector search, API delivery + participant-path storage."
            />

            <Figure
              src="/project-images/internet-atlas/field-notes/midpoint-frontend.png"
              alt="Midpoint slide describing the original 2D D3 frontend"
              width={1200}
              height={675}
              caption={
                <>
                  the working 2D version at midpoint.{' '}
                  <FieldNoteSourceLink
                    id="06"
                    href="https://docs.google.com/presentation/d/1pveBdeJ83FkSXxVUTEQiXXbHF95jV76h1pV6u48ieA/edit?usp=sharing"
                  >
                    open the midpoint deck
                  </FieldNoteSourceLink>
                </>
              }
            />
          </FieldNoteSection>

          <FieldNoteSection
            number="03"
            id="axes"
            title="semantic layout"
            className={styles.section}
          >

            <p className={styles.lead}>
              Atlas embeds the visitor&apos;s words in the same space as the
              websites. Two similarity scores become x and y coordinates; z
              carries time. New words can rearrange the map without retraining
              a model.
            </p>

            <div className={styles.modelResearchGrid}>
              <Figure
                src="/project-images/internet-atlas/field-notes/artifacts/language-model-research.png"
                alt="Language-model research notes comparing text and image models and documenting Pinecone terminology"
                width={1010}
                height={1258}
                caption="early research notes compared text, image, and combined embeddings, then worked through how Pinecone would store and query them."
              />
              <Figure
                src="/project-images/internet-atlas/field-notes/artifacts/embedding-evaluation-plan.png"
                alt="Evaluation plan for embedding models written by Joseph Dattilo, Brandon Yan, and David Lee"
                width={1553}
                height={1361}
                caption="Joseph, Brandon, and David wrote the evaluation criteria before testing: multimodal support, semantic comparability, similarity, clustering, and modularity."
              />
              <Figure
                src="/project-images/internet-atlas/field-notes/artifacts/embedding-query-tests.png"
                alt="Embedding query test log comparing expected and actual website neighbors for qualitative phrases"
                width={935}
                height={1210}
                caption={
                  <>
                    the test log compared expected and actual neighbors for
                    phrases including “chaotic and cluttered,” “childlike and
                    whimsical,” and “warm and hand-crafted.”{' '}
                    <a
                      href="/project-images/internet-atlas/field-notes/artifacts/embedding-test.pdf"
                      target="_blank"
                      rel="noreferrer"
                    >
                      open all nine pages ↗
                    </a>
                  </>
                }
                className={styles.queryArtifact}
              />
            </div>

            <p>
              The words are coordinates, not categories the model has to
              define. The ML team tested text and image embeddings. I wired the
              resulting similarity scores into the graph. We used{' '}
              <FieldNoteSourceLink id="07" href="https://arxiv.org/abs/2103.00020">
                CLIP
              </FieldNoteSourceLink>{' '}
              in the multimodal experiments,{' '}
              <FieldNoteSourceLink id="08" href="https://docs.crawl4ai.com/">
                Crawl4AI
              </FieldNoteSourceLink>{' '}
              for site content, and{' '}
              <FieldNoteSourceLink id="09" href="https://fastapi.tiangolo.com/">
                FastAPI
              </FieldNoteSourceLink>{' '}
              for delivery.
            </p>

            <p>
              The 2D grid proved the data path, but dense clusters and browsing
              paths overlapped. I rebuilt it in React Three Fiber, kept the two
              semantic scores on x and y, and used z for time. I also added
              camera movement, node and edge selection, path tracing, and
              screen-freeze behavior.{' '}
              <a
                href="https://github.com/PennSpark/sp25-internet-atlas/commit/15f30b1"
                target="_blank"
                rel="noreferrer"
              >
                see frontend v1 ↗
              </a>
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="04"
            id="layers"
            title="graph interaction"
            className={styles.section}
          >

            <p className={styles.lead}>
              The graph has four levels: overview, node, edge, and participant
              path. Each selection removes visual noise while keeping the
              recorded route available.
            </p>

            <div className={styles.layerList}>
              <article>
                <div className={styles.layerCopy}>
                  <span>01 / aggregate graph</span>
                  <h3>all sites + aggregate transitions</h3>
                  <p>
                    Changing the descriptive words rearranges the same graph.
                    Sites and aggregate transitions stay visible for comparison.
                  </p>
                </div>
                <div className={`${styles.layerImage} media-clip-surface`}>
                  <Image
                    src="/project-images/internet-atlas/field-notes/layers/whole-graph.webp"
                    alt="The complete Internet Atlas graph with hundreds of website nodes, browsing edges, and teal landmarks"
                    width={1280}
                    height={720}
                    sizes="(max-width: 720px) 100vw, 25rem"
                  />
                </div>
              </article>

              <article>
                <div className={styles.layerCopy}>
                  <span>02 / landmark or node</span>
                  <h3>connected hubs + site statistics</h3>
                  <p>
                    Sites with at least 25 outgoing connections became
                    landmarks; those with at least 40 received a larger aura.
                    Selecting any node moved the camera toward it and showed its
                    visit count, total active time, and average active time.
                  </p>
                </div>
                <div className={`${styles.layerImage} media-clip-surface`}>
                  <Image
                    src="/project-images/internet-atlas/field-notes/layers/landmark-node.webp"
                    alt="A selected teal landmark with its website name, visit count, total time, and average time"
                    width={1280}
                    height={720}
                    sizes="(max-width: 720px) 100vw, 25rem"
                  />
                </div>
              </article>

              <article>
                <div className={styles.layerCopy}>
                  <span>03 / selected edge</span>
                  <h3>participants behind one transition</h3>
                  <p>
                    Selecting an edge revealed the source-study participants who
                    made that transition. The Atlas visitor could then choose
                    one participant and open their full path.
                  </p>
                </div>
                <div className={`${styles.layerImage} media-clip-surface`}>
                  <Image
                    src="/project-images/internet-atlas/field-notes/layers/edge-selection.webp"
                    alt="A selected graph edge with a small panel for choosing a source-study participant"
                    width={1280}
                    height={720}
                    sizes="(max-width: 720px) 100vw, 25rem"
                  />
                </div>
              </article>

              <article>
                <div className={styles.layerCopy}>
                  <span>04 / source-study participant route</span>
                  <h3>one participant&apos;s full route</h3>
                  <p>
                    Choosing a participant froze the camera, dimmed the rest of
                    the graph, and traced their full journey as an animated
                    screen-space path. Each website along it stayed selectable.
                  </p>
                </div>
                <div className={`${styles.layerImage} media-clip-surface`}>
                  <Image
                    src="/project-images/internet-atlas/field-notes/layers/participant-path.webp"
                    alt="One source-study participant's browsing path highlighted over a dimmed Internet Atlas graph"
                    width={1280}
                    height={720}
                    sizes="(max-width: 720px) 100vw, 25rem"
                  />
                </div>
              </article>
            </div>

            <p>
              I structured and built the four interaction states, camera
              behavior, screen freeze, and screen-space overlays. Jimin
              explored the landmark visuals. Eric and I defined the data
              contracts for aggregate edges, participant lookup, full paths,
              and node statistics.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="05"
            id="ship"
            title="integration and launch"
            className={styles.section}
          >

            <p className={styles.lead}>
              Before the class demo, I integrated the API, loader, model,
              graph, and feature branches into one deployment.
            </p>

            <div className={styles.ownershipGrid}>
              <div>
                <h3>what I built by launch</h3>
                <ul>
                  <li>
                    the interaction sequence from the aggregate graph through
                    landmarks, node details, selected edges + participant paths
                  </li>
                  <li>the 2D frontend study, then the React Three Fiber graph</li>
                  <li>camera choreography + node and path selection behavior</li>
                  <li>animated SVG journeys + screen-space overlays</li>
                  <li>
                    frontend-to-API contracts for rankings, aggregate edges,
                    participant paths + node statistics
                  </li>
                  <li>cross-branch integration, deployment + later preservation</li>
                </ul>
              </div>
              <div>
                <h3>who I worked with</h3>
                <ul>
                  <li>Ruth on the product question + visual system</li>
                  <li>Fiona on the shape of collected website data</li>
                  <li>
                    Eric on clustering, aggregate edges, participant lookups +
                    full journeys
                  </li>
                  <li>Jimin on early Three.js + landmark exploration</li>
                  <li>Joseph, David + Brandon across Pinecone, models + testing</li>
                </ul>
              </div>
            </div>

            <p>
              I merged the branches and fixed storage, URL, CORS, position, and
              build failures. The finished graph held{' '}
              <strong>more than 300 sites and 1,000 navigation edges</strong>,
              and more than 40 demo attendees opened it at once.{' '}
              <a
                href="https://github.com/PennSpark/sp25-internet-atlas/commit/811685c"
                target="_blank"
                rel="noreferrer"
              >
                see the merge-conflict repair ↗
              </a>
            </p>

            <p>
              Across the project, I{' '}
              <strong>authored or merged 63 of 131 commits</strong>, including
              the frontend, API wiring, branch integration, deployment, and
              preservation work.
            </p>

          </FieldNoteSection>

          <FieldNoteSection
            number="06"
            id="preserve"
            title="static preservation"
            className={styles.section}
          >

            <p className={styles.lead}>
              The live database, API, and ML services cost about $60 a month.
              In November, I replaced runtime queries with precomputed rankings
              and static graph data.
            </p>

            <p>
              The preserved site did not need to scrape new websites or
              recompute embeddings. I exported the graph data, replaced live
              endpoints with static files, and repaired the resulting type and
              build errors. Hosting fell to roughly $7 a month while selection,
              path tracing, and camera behavior stayed intact.{' '}
              <a
                href="https://github.com/PennSpark/sp25-internet-atlas/commit/eba0b7c"
                target="_blank"
                rel="noreferrer"
              >
                see the November 14 static-data commit ↗
              </a>
            </p>

            <p>
              Removing the live ML pipeline did not change axis selection, path
              tracing, or graph comparison. I would plan the static version
              earlier.
            </p>

            <h3>source files</h3>
            <ol className={styles.references}>
              <li>
                <a
                  href="https://the-internet-atlas.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  the preserved Internet Atlas ↗
                </a>
                <span>the artifact itself</span>
              </li>
              <li>
                <a
                  href="https://github.com/PennSpark/sp25-internet-atlas"
                  target="_blank"
                  rel="noreferrer"
                >
                  PennSpark/sp25-internet-atlas ↗
                </a>
                <span>source, branches, commit trail</span>
              </li>
              <li>
                <a
                  href="https://www.figma.com/design/uVg8VhRe7TIsTCMVXPEDP9/Internet-Islands?node-id=0-1&t=Ov5ACOYVhRTjxoSJ-1"
                  target="_blank"
                  rel="noreferrer"
                >
                  Internet Islands working file ↗
                </a>
                <span>product + visual exploration with Ruth</span>
              </li>
              <li>
                <a
                  href="https://www.figma.com/slides/SI3licnd8qYylLrWRCGyeJ/Internet-Atlas--Spark-Showcase-2025?node-id=1-113&t=cssUFgpePoxUorVi-1"
                  target="_blank"
                  rel="noreferrer"
                >
                  final showcase deck ↗
                </a>
                <span>how the project team presented the system</span>
              </li>
              <li>
                <a
                  href="https://r3f.docs.pmnd.rs/getting-started/introduction"
                  target="_blank"
                  rel="noreferrer"
                >
                  React Three Fiber docs ↗
                </a>
                <span>the 3D rendering framework</span>
              </li>
              <li>
                <a
                  href="https://d3js.org/d3-force"
                  target="_blank"
                  rel="noreferrer"
                >
                  d3-force ↗
                </a>
                <span>the 2D graph prototype</span>
              </li>
              <li>
                <a
                  href="https://arxiv.org/abs/2012.15112"
                  target="_blank"
                  rel="noreferrer"
                >
                  Web Routineness and Limits of Predictability ↗
                </a>
                <span>the source browsing-path study</span>
              </li>
            </ol>

          </FieldNoteSection>

          <FieldNoteSection
            number="07"
            id="improve"
            title="what i would change"
            className={`${styles.section} ${styles.retrospectiveSection}`}
          >
            <p className={styles.lead}>
              I would keep the layered interaction model, but make the
              graph&apos;s choices more explicit and each level easier to
              inspect.
            </p>

            <ol className={styles.improvementList}>
              <li>
                <h3>explain what the map controls</h3>
                <p>
                  An Atlas visitor chooses the axis words, but the graph still
                  decides how distance, prominence, and visibility work. I
                  would explain those choices in the opening and end with a
                  short guide to reading the result, without assigning it one
                  meaning.
                </p>
              </li>
              <li>
                <h3>add depth selectively</h3>
                <p>
                  We had trouble shading hundreds of fast-moving parts. I would
                  use lazy, camera-aware passes so nearby or settled nodes gain
                  dimension without shading the entire graph.
                </p>
              </li>
              <li>
                <h3>make edges easier to touch</h3>
                <p>
                  The visible edge and its hit area were nearly the same size. I
                  would keep the line thin, widen the invisible contact area,
                  and add a hover state before selection.
                </p>
              </li>
              <li>
                <h3>label landmarks in the opening view</h3>
                <p>
                  Landmarks appear in the opening view without labels. I would
                  label them so a first-time Atlas visitor has enough context
                  before moving the camera.
                </p>
              </li>
              <li>
                <h3>support an Atlas visitor&apos;s own browsing history</h3>
                <p>
                  The pipeline and interface already had room for someone to
                  explore their own browsing history. We never completed
                  ingestion or carried it into the static deployment. That
                  would let Atlas visitors inspect their own data instead of
                  only the research dataset.
                </p>
              </li>
            </ol>
          </FieldNoteSection>

          <div className={styles.endMatter}>
            <FieldNoteScrollLink href="#path">
              back to top ↑
            </FieldNoteScrollLink>
          </div>
        </FieldNoteReader>

        {!asProject ? (
          <FieldNoteSequence
            current={1}
            total={3}
            next={{
              href: '/field-notes/into-the-blue',
              title: 'into the blue',
            }}
          />
        ) : null}
      </article>
    </Root>
  );
}
