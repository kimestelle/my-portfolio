import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import { FieldNoteDisclosure } from './components/FieldNoteDisclosure';
import { FieldNoteBreadcrumbs } from './components/FieldNotePrimitives';
import styles from './field-notes.module.css';

export const metadata: Metadata = {
  title: 'Working files · Estelle Kim',
  description:
    'Three working files about the conversations, tests, and technical choices behind what shipped.',
  robots: {
    index: false,
    follow: false,
  },
};

const fieldNotes = [
  {
    href: '/field-notes/internet-atlas',
    name: 'internet atlas',
    question: 'can browsing history feel like a place instead of a report?',
    description:
      'I assigned roles around what each teammate wanted to learn, then connected the ML, data, backend, and 3D work.',
    image: '/project-images/covers/atlas-cover.webp',
    alt: 'Internet Atlas rendered as a dense 3D graph of websites and browsing paths',
  },
  {
    href: '/field-notes/into-the-blue',
    name: 'into the blue',
    question:
      'how much can you turn an artifact into a sticker without losing its context?',
    description:
      'I brought rough versions back to Penn Museum staff until the interaction fit the objects, the galleries, and museum visitors.',
    image: '/project-images/covers/museum-cover.webp',
    alt: 'Into the Blue museum experience shown across artifact collection screens',
  },
  {
    href: '/field-notes/material-studies',
    name: 'material studies',
    question: 'which parts of a simulation change the final result?',
    description:
      'I compare the representation, browser API, or approximation I chose with the heavier option I left out.',
    image: '/project-images/covers/loom-cover.webp',
    alt: 'Digital Loom interface with a simulated cloth sample and material controls',
  },
] as const;

const developmentPivots = [
  {
    date: '2021–spring 2024',
    dateTime: '2021',
    location: 'california',
    title: 'policy before code',
    description:
      'Before code, I spent three years in California education policy—helping write legislation, run statewide conferences, coordinate coalitions, and work on funding. It taught me to listen across different priorities and turn messy input into something people could act on.',
  },
  {
    date: 'may 2024–spring 2026',
    dateTime: '2024-05',
    location: 'california → philadelphia',
    title: 'learning by building with people',
    description:
      'I came to computer science sideways. My first project was a full-stack, duck-filled version of the NYT Spelling Bee, based on a game a friend and I loved. That friend brought me to Penn Spark, where I led three projects, contributed to two more, and served as VP External. Building with other people—asking questions and taking on whatever was missing—became how I learned fastest.',
  },
  {
    date: 'late 2025–now',
    dateTime: '2025-10',
    location: 'philadelphia → san jose',
    title: 'narrowing the questions',
    description:
      'I pivoted away from giant, general-purpose graphics systems toward smaller questions about materials, interaction, and generative media. At PayPal, that focus is meeting production reality: the decisions have to survive review, fit an existing system, and make sense to the next person.',
  },
] as const;

const explorations = [
  {
    src: '/creative-images/cardboard-art/cover.png',
    medium: 'sculpture',
    caption:
      'a four-foot installation built from household cardboard during the pandemic.',
    alt: 'A four-foot cardboard installation of shelves and paper-roll towers',
    position: '50% 50%',
    fit: 'cover',
  },
  {
    src: '/creative-images/cardboard-art/image-2.png',
    medium: 'sculpture',
    caption: 'a cardboard installation about where discarded fast fashion ends up.',
    alt: 'A large cardboard storefront installation filled with paper garments',
    position: '50% 45%',
    fit: 'cover',
  },
  {
    src: '/creative-images/cardboard-art/image-6.png',
    medium: 'sculpture',
    caption: 'wire figures moving through a landscape of paper rolls.',
    alt: 'Copper-wire figures arranged on stacked paper rolls',
    position: '50% 50%',
    fit: 'cover',
  },
  {
    src: '/creative-images/8-pager/image-2.png',
    medium: 'publication',
    caption: 'one spread from a 500-copy capital campaign publication.',
    alt: 'A red and white capital campaign publication spread',
    position: '50% 50%',
    fit: 'contain',
  },
  {
    src: '/creative-images/dsgn-0010/image-1.png',
    medium: 'graphic study',
    caption: 'mapping sounds into shape language in Illustrator.',
    alt: 'Black and white graphic compositions mapping sound to form',
    position: '50% 50%',
    fit: 'contain',
  },
  {
    src: '/creative-images/dsgn-0010/image-2.png',
    medium: 'collage',
    caption: 'a surreal composition built from photographed + illustrated fragments.',
    alt: 'A surreal digital collage combining a tomato, koi, landscape, and pixel forms',
    position: '50% 50%',
    fit: 'cover',
  },
  {
    src: '/creative-images/repair-scene/image-2.png',
    medium: '3D modeling',
    caption: 'modeling, texturing, lighting, and rendering a small artist’s workspace.',
    alt: 'A rendered 3D artist’s workspace with a pegboard, brushes, an airbrush, and a paint palette',
    position: '50% 50%',
    fit: 'cover',
  },
  {
    src: '/creative-images/clock-scene.png',
    medium: '3D modeling',
    caption: 'a surreal desk scene built around one impossible clock.',
    alt: 'A surreal alarm clock with distorted numbers in a dark desk scene',
    position: '48% 50%',
    fit: 'cover',
  },
  {
    src: '/creative-images/photo-collage.png',
    medium: 'photography',
    caption: 'photos from walks, windows, concerts, and nighttime city light.',
    alt: 'A grid of photographs of windows, skies, concerts, and city light',
    position: '50% 50%',
    fit: 'cover',
  },
] as const;

export default function FieldNotesIndex() {
  return (
    <main className={`responsive-padding ${styles.page}`}>
      <article className="page-frame-wide">
        <header className={styles.cover}>
          <div className={styles.coverUtility}>
            <FieldNoteBreadcrumbs current="index" />
            <Link
              href="/"
              className={styles.portfolioReturn}
              aria-label="Return to Estelle Kim’s portfolio"
            >
              ← portfolio
            </Link>
          </div>

          <div className={styles.coverIntroduction}>
            <ShimmerText as="h1" className={styles.coverTitle}>
              how i design & engineer (in long form)
            </ShimmerText>
            <ShimmerText as="p" className={styles.coverDeck} priority={2}>
              three projects with the conversations, tests, and technical
              choices behind what shipped
            </ShimmerText>
          </div>
        </header>

        <nav className={styles.noteShelf} aria-label="Project studies">
          {fieldNotes.map((note, index) => (
            <Link
              key={note.href}
              href={note.href}
              aria-label={`Open ${note.name} study`}
              className={styles.noteCard}
            >
              <article>
                <div className={styles.noteCopy}>
                  <span className={styles.noteIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <ShimmerText as="h2" priority={index + 2}>
                    {note.name}
                  </ShimmerText>
                  <div className={`${styles.noteQuestion} star-line-north`}>
                    <span className="star-glyph-north" aria-hidden="true">
                      ✦
                    </span>
                    <ShimmerText
                      as="p"
                      className="star-copy-north"
                      priority={index + 3}
                    >
                      {note.question}
                    </ShimmerText>
                  </div>
                  <ShimmerText
                    as="p"
                    className={styles.noteDescription}
                    priority={index + 4}
                  >
                    {note.description}
                  </ShimmerText>
                  <ShimmerText
                    as="span"
                    className={styles.studyAction}
                    priority={index + 5}
                  >
                    open study →
                  </ShimmerText>
                </div>

                <div className={`${styles.noteImage} media-clip-surface`}>
                  <Image
                    src={note.image}
                    alt={note.alt}
                    width={1200}
                    height={800}
                    sizes="(max-width: 720px) 100vw, 42vw"
                    priority={index === 0}
                  />
                </div>
              </article>
            </Link>
          ))}
        </nav>

        <FieldNoteDisclosure
          title="some relevant background"
          preview="2021–now · california → philadelphia → san jose"
        >
          <div className={styles.readerAlignedContent}>
            <ol className={styles.developmentPathGrid}>
              {developmentPivots.map((pivot, index) => (
                <li key={pivot.date}>
                  <div className={styles.developmentPathMeta}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <time dateTime={pivot.dateTime}>{pivot.date}</time>
                    <span>{pivot.location}</span>
                  </div>
                  <div className={styles.developmentPathCopy}>
                    <h3>{pivot.title}</h3>
                    <p>{pivot.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </FieldNoteDisclosure>

        <FieldNoteDisclosure
          title="now"
          preview="summer 2026 · san jose, california"
        >
          <div className={styles.readerAlignedContent}>
            <div className={styles.nowCopy}>
              <p className={styles.nowMoment}>
                <time dateTime="2026-06">summer 2026</time>
                <span>san jose, california</span>
              </p>
              <p>
                At PayPal, I took over a project from a senior engineer within a
                broader CTO initiative. Daily check-ins with PMs, data
                engineers, and software engineers keep product questions, data
                constraints, and implementation decisions in the same
                conversation. Because the work was already on the team&apos;s
                roadmap, I&apos;m learning to inherit decisions I didn&apos;t
                make, work within production frontend standards, and respond to
                detailed review.
              </p>
              <p>
                I&apos;m turning the project into a Next.js hub for finding
                checkout friction that disappears in aggregate reporting. It
                began with multi-dimensional visualizations, user journeys, and
                tables so product teammates could move from broad patterns to
                the underlying records. The hub didn&apos;t start as an LLM
                project. When PMs wanted to ask questions in natural language,
                my technical manager set one constraint: every answer should
                still expose its data. I designed and implemented a layer that
                lets teammates ask questions or test hypotheses, review
                generated insights and possible next steps, then use data tags
                and dynamic CSS classes to trace each response to the exact
                cells or marks behind it.
              </p>
              <p>
                One view has already surfaced a large area of previously
                unnoticed friction that engineers are now investigating. The
                hub is separate from PayPal&apos;s modular Checkout codebase.
                Alongside it, I&apos;ve made PRs directly to that production
                codebase; every change goes through full review with my
                engineering buddy and senior engineers.
              </p>
            </div>
          </div>
        </FieldNoteDisclosure>

        <FieldNoteDisclosure
          title="everything but code"
          preview="sculpture, print, photography, 3D scenes, and other ways I work through form"
        >
          <ul
            className={styles.explorationGrid}
            aria-label="Creative work outside of code"
          >
            {explorations.map((item) => (
              <li key={item.src} className={styles.explorationItem}>
                <figure>
                  <div
                    className={`${styles.explorationImage} media-clip-surface`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 760px) 46vw, 31vw"
                      style={{
                        objectFit: item.fit,
                        objectPosition: item.position,
                      }}
                    />
                  </div>
                  <figcaption className={styles.explorationCaption}>
                    <span className={styles.explorationMedium}>
                      {item.medium}
                    </span>
                    <span>{item.caption}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </FieldNoteDisclosure>
      </article>
    </main>
  );
}
