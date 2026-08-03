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

function SelectedProjectCard({ project }: { project: PortfolioProject }) {
  const [active, setActive] = useState(false);
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
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
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
                  className="object-cover transition duration-500 ease-out group-hover:scale-[1.018] group-hover:saturate-[1.03]"
                />

                {allowMotion && preview && isMuxVideo(preview) ? (
                  <div
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
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
                    className={`pointer-events-none absolute inset-0 h-full w-full bg-neutral-950 object-contain transition-opacity duration-300 ${
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

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <section className="w-full">
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
            <SelectedProjectCard key={project.id} project={project} />
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
