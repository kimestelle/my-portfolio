'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';
import {
  FEATURED_PROJECT_IDS,
  PORTFOLIO_PROJECTS,
  type PortfolioProject,
} from '../projects/components/projectCopy';
import LazyVideo from '../projects/components/DeferredLazyVideo';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import InteractionStudiesPreview from './InteractionStudiesPreview';

const selectedProjects = FEATURED_PROJECT_IDS
  .map((id) => PORTFOLIO_PROJECTS.find((project) => project.id === id))
  .filter((project): project is PortfolioProject => Boolean(project));

const EMAIL = 'kestelle@sas.upenn.edu';

const isMuxVideo = (url: string) => !url.includes('/') && !url.includes('.');
const isFileVideo = (url: string) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
const isAnimatedImage = (url: string) => /\.webp(\?.*)?$/i.test(url);

function SelectedProjectCard({
  project,
  active,
  onActivate,
  onDeactivate,
}: {
  project: PortfolioProject;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const [mediaReady, setMediaReady] = useState(false);
  const [allowMotion, setAllowMotion] = useState(false);
  const fileVideoRef = useRef<HTMLVideoElement>(null);
  const preview = project.media?.preview;

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    setAllowMotion(!reduceMotion && !connection?.saveData);
  }, []);

  useEffect(() => {
    if (!fileVideoRef.current) return;

    if (active && allowMotion) {
      fileVideoRef.current.play().catch(() => undefined);
    } else {
      fileVideoRef.current.pause();
    }
  }, [active, allowMotion]);

  const showPreview = active && allowMotion && mediaReady;

  return (
    <Link
      href={`/projects#${project.id}`}
      scroll={false}
      className="group block"
      data-preview-id={preview ? project.id : undefined}
      data-preview-active={active ? 'true' : undefined}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      <article>
        <div className="homepage-project-window ui-radius-surface relative aspect-[16/10] bg-neutral-950">
          <div className="media-clip-surface absolute inset-0">
            {project.media ? (
              <>
                <Image
                  src={project.media.cover}
                  alt={`${project.name} preview`}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className={`object-cover transition-[opacity,transform,filter] duration-[420ms] ease-[var(--motion-mood-ease)] motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.018] group-hover:saturate-[1.03] ${
                    active ? 'scale-[1.018] saturate-[1.03]' : ''
                  } ${
                    showPreview ? 'opacity-0' : 'opacity-100'
                  }`}
                />

                {allowMotion && preview && isMuxVideo(preview) ? (
                  <div
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-[420ms] ease-[var(--motion-mood-ease)] motion-reduce:transition-none ${
                      showPreview ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden="true"
                  >
                    <LazyVideo
                      playbackId={preview}
                      poster=""
                      muted
                      loop
                      active={active}
                      preload="metadata"
                      maxResolution="720p"
                      objectFit="contain"
                      onReady={() => setMediaReady(true)}
                      className="h-full w-full bg-neutral-950 object-contain"
                    />
                  </div>
                ) : null}

                {allowMotion && preview && isFileVideo(preview) ? (
                  <video
                    ref={fileVideoRef}
                    src={preview}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedData={() => setMediaReady(true)}
                    onCanPlay={() => setMediaReady(true)}
                    className={`pointer-events-none absolute inset-0 h-full w-full bg-neutral-950 object-contain transition-opacity duration-[420ms] ease-[var(--motion-mood-ease)] motion-reduce:transition-none ${
                      showPreview ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden="true"
                  />
                ) : null}

                {allowMotion && active && preview && isAnimatedImage(preview) ? (
                  <Image
                    key="animated-preview"
                    src={preview}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 767px) 100vw, 50vw"
                    onLoad={() => setMediaReady(true)}
                    className={`pointer-events-none object-cover transition-opacity duration-300 ${
                      mediaReady ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
              </>
            ) : (
              <div className="h-full w-full bg-[url('/textures/textured-paper.png')] bg-cover" />
            )}
          </div>
        </div>

        <div className="pt-3">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="type-project-title">{project.name}</h4>
            <span className="type-meta text-[color:var(--text-decorative)] transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-neutral-700">
              ↗
            </span>
          </div>
          <p className="type-meta mt-2 text-[color:var(--text-meta)]">
            {project.collapsed.roleLine}
          </p>
          <p className="mt-1.5 text-[color:var(--text-secondary)]">
            {project.collapsed.purpose}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default function ProjectHTML() {
  const [copied, setCopied] = useState(false);
  const [scrollPreviewId, setScrollPreviewId] = useState<string | null>(null);
  const [manualPreviewId, setManualPreviewId] = useState<string | null>(null);
  const previewSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = previewSectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    if (reduceMotion || connection?.saveData) return;

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>('[data-preview-id]')
    );
    if (!cards.length) return;

    let frame = 0;

    const selectVisiblePreview = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const targetY = viewportHeight * 0.52;
      const sectionRect = section.getBoundingClientRect();
      const sectionProgress = Math.min(
        1,
        Math.max(
          0,
          (targetY - sectionRect.top) / Math.max(sectionRect.height, 1)
        )
      );
      const targetIndex = sectionProgress * (cards.length - 1);

      const visibleCards = cards
        .map((card, index) => {
          const rect = card.getBoundingClientRect();
          const visibleHeight = Math.max(
            0,
            Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
          );

          return {
            id: card.dataset.previewId ?? '',
            index,
            visibleHeight,
            score:
              Math.abs(index - targetIndex) * viewportHeight +
              Math.abs(rect.top + rect.height / 2 - targetY) * 0.15 -
              visibleHeight * 0.2,
          };
        })
        .filter(({ id, visibleHeight }) => id && visibleHeight >= 24)
        .sort((a, b) => a.score - b.score || a.index - b.index);

      const nextId = visibleCards[0]?.id ?? null;
      setScrollPreviewId((currentId) =>
        currentId === nextId ? currentId : nextId
      );
    };

    const scheduleSelection = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(selectVisiblePreview);
    };

    const observer = new IntersectionObserver(scheduleSelection, {
      threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
    });

    cards.forEach((card) => observer.observe(card));
    scheduleSelection();
    document.addEventListener('scroll', scheduleSelection, {
      capture: true,
      passive: true,
    });
    window.addEventListener('resize', scheduleSelection);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('scroll', scheduleSelection, true);
      window.removeEventListener('resize', scheduleSelection);
    };
  }, []);

  const activePreviewId = manualPreviewId ?? scrollPreviewId;

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <section ref={previewSectionRef} className="w-full">
        <div className="mb-5 flex items-center gap-4">
          <div className="star-line-section shrink-0">
            <span className="star-glyph-section" aria-hidden="true">✶</span>
            <ShimmerText as="h3" className="star-copy-section">
              selected work
            </ShimmerText>
          </div>
          <span className="h-px flex-1 bg-[color:var(--line-color)]" />
          <Link
            href="/projects"
            className="type-meta shrink-0 text-[color:var(--text-primary)] transition-transform duration-200 hover:-translate-y-px"
          >
            all projects ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2">
          {selectedProjects.map((project) => (
            <SelectedProjectCard
              key={project.id}
              project={project}
              active={activePreviewId === project.id}
              onActivate={() => setManualPreviewId(project.id)}
              onDeactivate={() =>
                setManualPreviewId((currentId) =>
                  currentId === project.id ? null : currentId
                )
              }
            />
          ))}
        </div>
      </section>

      <InteractionStudiesPreview />

      <button
        type="button"
        onClick={copyEmail}
        className="contact-button glass-interactive ui-radius-panel mt-20 flex w-full cursor-copy flex-col gap-2 px-4 py-3 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-8"
        aria-label={`Copy ${EMAIL}`}
      >
        <div className="star-line-detail max-w-2xl">
          <span className="star-glyph-detail" aria-hidden="true">
            {copied ? (
              <FiCheck className="inline-block" />
            ) : (
              <FiCopy className="inline-block" />
            )}
          </span>
          <p className="star-copy-detail text-[color:var(--text-secondary)]">
            I&apos;m always interested in teams where engineering, design, and
            product shape each other.
          </p>
        </div>
        <span
          className="type-meta shrink-0 pl-[1.45rem] text-[color:var(--text-primary)] sm:pl-0"
          aria-live="polite"
        >
          {copied ? 'email copied!' : 'copy email'}
        </span>
      </button>
    </>
  );
}
