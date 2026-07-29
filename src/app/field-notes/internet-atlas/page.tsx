import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import {
  FieldNoteHeader,
  FieldNoteReader,
  FieldNoteSection,
  FieldNoteSequence,
  FieldNoteSourceLink,
} from '../components/FieldNotePrimitives';
import styles from './internet-atlas.module.css';

export const metadata: Metadata = {
  title: 'Internet Atlas working file · Estelle Kim',
  description:
    'An unlisted build notebook about the questions, teammates, decisions, and commits behind Internet Atlas.',
  robots: {
    index: false,
    follow: false,
  },
};

const mapEntries = [
  ['path', 'a path is not a list of sites'],
  ['team', 'start with what each teammate wanted to learn'],
  ['prototype', 'prove the data path in 2D'],
  ['axes', 'use each Atlas visitor’s words as axes'],
  ['layers', 'move from the whole graph to one participant’s path'],
  ['ship', 'connect the parts and ship'],
  ['preserve', 'replace the live backend with static data'],
  ['improve', 'what i would improve now', 'retrospective'],
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

export default function InternetAtlasFieldNotes() {
  return (
    <main
      className={`responsive-padding ${styles.page}`}
      style={{ '--field-accent': 'rgb(69, 151, 126)' } as CSSProperties}
    >
      <article className="page-frame-wide">
        <FieldNoteHeader
          eyebrow="collaborative project"
          title="internet atlas"
          deck="eight of us turned recorded browsing paths into a layered 3D map that Atlas visitors could rearrange with their own words."
          meta={[
            'frontend + integration lead',
            'built mar–apr 2025',
            '8-person project team',
            'preserved nov 2025',
          ]}
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
          motif={
            <Image
              className={styles.heroOrbits}
              src="/project-images/internet-atlas/field-notes/atlas-orbits.svg"
              alt=""
              width={1728}
              height={1117}
              priority
              aria-hidden="true"
            />
          }
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

        <FieldNoteReader mapLabel="turning points" entries={mapEntries}>
          <FieldNoteSection
            number="00"
            id="path"
            title="a browsing path is not a list of sites"
            className={styles.section}
          >

            <p className={styles.lead}>
              Most of us generate browsing data every day, but only see it
              after a company has interpreted it inside a black box. My friend
              Ruth and I wanted Atlas visitors to choose how the data was
              organized and inspect the paths behind each pattern.
            </p>

            <aside className={styles.marginNote}>
              <span
                className={`star-glyph-detail ${styles.marginGlyph}`}
                aria-hidden="true"
              >
                {'\uE000'}
              </span>
              <span>from the pitch deck</span>
              our first deck named three goals: data autonomy, data
              visualization, and simply making a cool website. We wanted a
              playful interface that kept the complexity visible.
            </aside>

            <p>
              We were inspired by Kevin Kelly&apos;s{' '}
              <FieldNoteSourceLink
                id="01"
                href="https://kk.org/ct2/the-internet-mapping-project/"
              >
                Internet Mapping Project
              </FieldNoteSourceLink>
              , which asked people of different ages and technical backgrounds
              to draw the internet as they saw it, along with other independent
              maps of the web&apos;s cultural regions. Because every map was
              subjective, we let each Atlas visitor shape the geography with
              their own words.
            </p>

            <p>
              The source study gave us websites and transitions from 2,148
              participants, but no definitions for words like <em>fuzzy</em>,{' '}
              <em>organic</em>, or <em>heavy</em>. A source-study participant
              supplied a recorded path; an Atlas visitor supplied the words
              used to interpret it. A history list could preserve the route,
              but not the visitor&apos;s interpretation. We needed to keep each
              path intact while letting those words reorganize the map.
            </p>

            <p>
              We used the research dataset, not an Atlas visitor&apos;s own
              history, to test the interaction model: choose a lens, move
              between the whole graph and individual paths, then inspect the
              sites and journeys behind a pattern.
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
            title="start with what each teammate wanted to learn"
            className={styles.section}
          >

            <p className={styles.lead}>
              Internet Atlas was a semester-long Penn Spark club project. Ruth
              and I expected a mix of designers and developers, but Spark
              matched us with seven developers, leaving Ruth as the only
              designer.
            </p>

            <p>
              We were originally just going to use ChatGPT for the language
              layer. Then teammates wanted to explore clustering, embeddings,
              and vector databases, so the project became unintentionally
              ML-heavy. I spoke with each teammate before splitting up the work
              and shaped the roles around what they wanted to learn.
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
              Those interests led to experiments we would not have planned
              upfront, including PCA clustering, model comparisons, and
              implementation discussions across roles.
            </p>

            <p>
              I hesitated to lead because I knew very little ML then. Eric and
              Joseph knew much more about clustering, vector databases, and
              embeddings, so I asked them to document their research in our
              shared dev doc. I used their notes and our meetings to understand
              the tradeoffs and connect their choices to the interface and API.
              I learned the ML side of the project from them.
            </p>

            <p>
              I did not direct every technical choice. I kept the handoffs
              clear, supported what teammates wanted to try, and handled Git
              practices, merge milestones, API wiring, branch integration, and
              deployment. That let every branch run together in the demo. The{' '}
              <a
                href="https://github.com/PennSpark/sp25-internet-atlas/commit/747b427"
                target="_blank"
                rel="noreferrer"
              >
                first preserved commit ↗
              </a>{' '}
              captures the stack decisions that followed the March 1–2 role
              conversations.
            </p>

            <aside className={styles.marginNote}>
              <span
                className={`star-glyph-detail ${styles.marginGlyph}`}
                aria-hidden="true"
              >
                {'\uE000'}
              </span>
              <span>what surprised me</span>
              I expected the ML teammates to focus on the pipeline. Once their
              clusters and embeddings appeared in the interface, they got
              invested in the interaction and visual framing too.
            </aside>

          </FieldNoteSection>

          <FieldNoteSection
            number="02"
            id="prototype"
            title="prove the data path in 2D"
            className={styles.section}
          >

            <p className={styles.lead}>
              I expected the graph to be the risky part, but first we had to
              prove that data could move cleanly from scraping through
              embeddings, storage, an API, and into the browser.
            </p>

            <div className={styles.decisionList}>
              <article>
                <span>one site record, many participant paths</span>
                <h3>
                  store each site once; keep each participant&apos;s path
                  separate.
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
                  . That let us reuse the semantic index while switching
                  between individual and aggregate views.
                </p>
              </article>

              <article>
                <span>the first end-to-end frontend</span>
                <h3>I built a 100 × 100 D3 grid before committing to 3D.</h3>
                <p>
                  By April 7, we could embed website data, query one backend
                  path, and display coordinates, directed edges, zoom, and
                  selection in the D3 grid. This end-to-end slice was small
                  enough for all eight teammates to debug together.
                </p>
              </article>
            </div>

            <p>
              We focused the March 10–23 faculty reviews on data consistency,
              model tests, architecture, and the point where each
              teammate&apos;s output became another&apos;s input; styling came
              later.
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
            title="use each Atlas visitor's words as axes"
            className={styles.section}
          >

            <p className={styles.lead}>
              Scraped text told us what a site was about, not whether an Atlas
              visitor would call it fuzzy. The ML teammates tested five model
              and parameter combinations; screenshots and summaries added
              context, but there was no ground-truth label.
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
              We stopped treating those words as labels the model needed to
              define. The ML teammates embedded each Atlas visitor&apos;s words
              in the same text + image space as the sites. I wired the
              resulting similarity scores into graph coordinates, so the model
              could position sites relative to an Atlas visitor&apos;s words
              without defining those words or retraining for each one. We used{' '}
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
              The 2D grid proved the logic, but dense clusters and browsing
              paths overlapped. A third axis reduced the overlap, so from April
              13–20 I rebuilt the view in React Three Fiber. I carried over the
              axes, clusters, and selection logic, then added camera
              choreography, nodes, edges, path tracing, and screen-freeze
              behavior.{' '}
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
            title="move from the aggregate graph to one participant's route"
            className={styles.section}
          >

            <p className={styles.lead}>
              I wanted the full graph to stay approachable without flattening
              the data. I structured each selection as a step from the
              aggregate view toward one source-study participant&apos;s route.
            </p>

            <div className={styles.layerList}>
              <article>
                <div className={styles.layerCopy}>
                  <span>01 / aggregate graph</span>
                  <h3>keep the full graph visible.</h3>
                  <p>
                    The overview kept all sites and aggregate transitions
                    visible. Changing the descriptive words rearranged the same
                    graph, so an Atlas visitor could compare interpretations
                    instead of accepting one fixed categorization.
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
                  <h3>mark highly connected hubs; show their statistics.</h3>
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
                  <h3>show which participants made a transition.</h3>
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
                  <h3>trace one participant&apos;s route in place.</h3>
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
              I structured and built these four interaction states, including
              the camera behavior, screen freeze, and node, edge-selection, and
              participant-path overlays. Jimin explored the landmark visuals; I
              integrated them into the graph and selection behavior. Eric and I
              coordinated the data contracts behind each level: aggregate edges
              for the overview, participant lookups for a selected transition,
              and full per-participant paths for the route view. I added the
              node-statistics endpoint for the node-detail level.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="05"
            id="ship"
            title="connect the parts and ship"
            className={styles.section}
          >

            <p className={styles.lead}>
              From April 25–27, I focused on integrating the API, loader, model,
              graph, and feature branches for the class demo.
            </p>

            <div className={styles.ownershipGrid}>
              <div>
                <h3>what I owned by launch</h3>
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
              I merged the branches, resolved a teammate merge conflict, and
              fixed storage, URL, CORS, position, and build failures before
              deployment. The finished graph held more than 300 sites and 1,000
              navigation edges, and more than 40 demo attendees opened it at
              once.{' '}
              <a
                href="https://github.com/PennSpark/sp25-internet-atlas/commit/811685c"
                target="_blank"
                rel="noreferrer"
              >
                see the merge-conflict repair ↗
              </a>
            </p>

            <p>
              Across the project, I authored or merged 63 of 131 commits,
              including the frontend, API wiring, branch integration,
              deployment, and preservation work.
            </p>

          </FieldNoteSection>

          <FieldNoteSection
            number="06"
            id="preserve"
            title="replace the live backend with static data"
            className={styles.section}
          >

            <p className={styles.lead}>
              After the demo, the database, API, and ML services would cost about
              $60 a month even when the Atlas had little traffic. In November,
              I checked which parts of the live stack the finished experience
              still needed.
            </p>

            <p>
              Atlas visitors did not need new sites to be scraped or
              embeddings to be recomputed. I exported the graph data, replaced
              the live endpoints with static files, and repaired the resulting
              type and build errors. Hosting fell to roughly $7 a month while
              selection, path tracing, and camera interactions stayed intact.{' '}
              <a
                href="https://github.com/PennSpark/sp25-internet-atlas/commit/eba0b7c"
                target="_blank"
                rel="noreferrer"
              >
                see the November 14 static-data commit ↗
              </a>
            </p>

            <p>
              I expected the live ML pipeline to remain central, but removing
              it did not change axis selection, path tracing, or graph
              comparison. I would still organize project roles around what each
              teammate wanted to learn, but I would plan the static version
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
            title="what i would improve now"
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
            <a href="#path">back to top ↑</a>
          </div>
        </FieldNoteReader>

        <FieldNoteSequence
          current={1}
          total={3}
          next={{
            href: '/field-notes/into-the-blue',
            title: 'into the blue',
          }}
        />
      </article>
    </main>
  );
}
