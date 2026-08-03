import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShimmerText } from '../../design-deets/text-shimmer/TextShimmer';
import styles from './field-note-primitives.module.css';

export type FieldNoteMapEntry = readonly [
  id: string,
  label: string,
  kind?: 'retrospective',
];

type FieldNoteLink = {
  href: string;
  label: string;
  external?: boolean;
};

export function FieldNoteBreadcrumbs({
  current,
  rootHref = '/field-notes',
  rootLabel = 'field notes',
}: {
  current: string;
  rootHref?: string;
  rootLabel?: string;
}) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      {current === 'index' && rootHref === '/field-notes' ? (
        <span aria-current="page">{rootLabel}</span>
      ) : (
        <>
          <Link href={rootHref}>{rootLabel}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{current}</span>
        </>
      )}
    </nav>
  );
}

export function FieldNoteHeader({
  eyebrow,
  title,
  deck,
  meta,
  links,
  motif,
  breadcrumbRoot,
  hideBreadcrumb = false,
}: {
  eyebrow: string;
  title: string;
  deck: string;
  meta: string[];
  links: FieldNoteLink[];
  motif?: ReactNode;
  breadcrumbRoot?: {
    href: string;
    label: string;
  };
  hideBreadcrumb?: boolean;
}) {
  return (
    <header className={styles.hero}>
      {motif ? <div className={styles.heroMotif}>{motif}</div> : null}
      <div className={styles.heroCopy}>
        {!hideBreadcrumb ? (
          <FieldNoteBreadcrumbs
            current={title}
            rootHref={breadcrumbRoot?.href}
            rootLabel={breadcrumbRoot?.label}
          />
        ) : null}
        <ShimmerText as="p" className={styles.heroEyebrow} priority={1}>
          {eyebrow}
        </ShimmerText>
        <ShimmerText as="h1" className={styles.heroTitle}>
          {title}
        </ShimmerText>
        <div className={`${styles.heroDeck} star-line-north`}>
          <span className="star-glyph-north" aria-hidden="true">
            ✦
          </span>
          <ShimmerText as="p" className="star-copy-north" priority={2}>
            {deck}
          </ShimmerText>
        </div>
      </div>

      {meta.length ? (
        <div className={styles.heroMeta}>
          {meta.map((item) => (
            <ShimmerText as="span" key={item} priority={3}>
              {item}
            </ShimmerText>
          ))}
        </div>
      ) : null}

      <nav className={styles.heroLinks} aria-label="Project links">
        {links.map((item) => {
          const external = item.external ?? item.href.startsWith('http');
          const label = (
            <ShimmerText as="span" priority={4}>
              {item.label}
            </ShimmerText>
          );

          return external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {label}
            </a>
          ) : (
            <Link key={item.href} href={item.href}>
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export function FieldNoteProjectSummary({
  facts,
  keyDetails,
}: {
  facts: readonly (readonly [label: string, value: string])[];
  keyDetails: readonly string[];
}) {
  return (
    <section className={styles.projectSummary} aria-label="Project summary">
      <dl className={styles.summaryFacts}>
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.summaryDetails}>
        <p>key details</p>
        <ul>
          {keyDetails.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FieldNoteReader({
  mapLabel,
  entries,
  children,
}: {
  mapLabel: string;
  entries: readonly FieldNoteMapEntry[];
  children: ReactNode;
}) {
  return (
    <div className={styles.reader}>
      <nav className={styles.mapRail} aria-label={mapLabel}>
        <div className={styles.mapCard}>
          <p className={styles.mapLabel}>{mapLabel}</p>
          <ol className={styles.constellationMap}>
            {entries.map(([id, entryLabel, kind], index) => (
              <li
                key={id}
                className={
                  kind === 'retrospective'
                    ? styles.mapItemRetrospective
                    : undefined
                }
              >
                <span
                  className={`${styles.mapMarker} ${
                    kind === 'retrospective'
                      ? `star-glyph-section ${styles.mapMarkerRetrospective}`
                      : ''
                  }`}
                  aria-hidden="true"
                >
                  {kind === 'retrospective' ? '✶' : index === 0 ? '●' : '○'}
                </span>
                <a href={`#${id}`}>
                  <span className={styles.mapIndex}>
                    {String(index).padStart(2, '0')}
                  </span>
                  <span>{entryLabel}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <div className={styles.story}>{children}</div>
    </div>
  );
}

export function FieldNoteSection({
  number,
  id,
  title,
  className,
  children,
}: {
  number: string;
  id: string;
  title: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${className} reading-flow`}>
      <header
        id={`${id}-heading`}
        className={`${styles.sectionHeading} star-line-section`}
      >
        <span className="star-glyph-section" aria-hidden="true">
          ✶
        </span>
        <span className={styles.sectionNumber}>{number}</span>
        <h2 className={`star-copy-section ${styles.sectionTitle}`}>
          {title}
        </h2>
        <a
          className={styles.hashLink}
          href={`#${id}`}
          aria-label={`Link to ${title}`}
        >
          #
        </a>
      </header>
      {children}
    </section>
  );
}

export function FieldNoteFigure({
  src,
  alt,
  width,
  height,
  caption,
  className = '',
  imageClassName = '',
  sizes = '(max-width: 767px) 100vw, 46rem',
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: ReactNode;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`${styles.figure} ${className}`}>
      <div
        className={`${styles.figureImage} media-clip-surface ${imageClassName}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
        />
      </div>
      <figcaption>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

export function FieldNoteSourceLink({
  id,
  href,
  children,
}: {
  id: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      className={styles.sourceLink}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <span className={styles.sourceNumber}>[{id}]</span>
    </a>
  );
}

export function FieldNoteDetail({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <aside className={styles.detailNote}>
      <span
        className={`star-glyph-detail ${styles.detailGlyph}`}
        aria-hidden="true"
      >
        {'\uE000'}
      </span>
      <span className={styles.detailLabel}>{label}</span>
      <div>{children}</div>
    </aside>
  );
}

type SequenceLink = {
  href: string;
  title: string;
};

export function FieldNoteSequence({
  current,
  total,
  previous,
  next,
}: {
  current: number;
  total: number;
  previous?: SequenceLink;
  next?: SequenceLink;
}) {
  return (
    <nav className={styles.sequence} aria-label="Working file sequence">
      <p>
        <Link href="/field-notes">all studies</Link>
        <span aria-hidden="true"> / </span>
        study {String(current).padStart(2, '0')} of{' '}
        {String(total).padStart(2, '0')}
      </p>
      <div className={styles.sequenceLinks}>
        {previous ? (
          <Link className={styles.sequencePrevious} href={previous.href}>
            <span>← previous</span>
            <strong>{previous.title}</strong>
          </Link>
        ) : null}
        {next ? (
          <Link className={styles.sequenceNext} href={next.href}>
            <span>next →</span>
            <strong>{next.title}</strong>
          </Link>
        ) : (
          <Link className={styles.sequenceEnd} href="/field-notes">
            <span>back to</span>
            <strong>all studies</strong>
          </Link>
        )}
      </div>
    </nav>
  );
}
