'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  FEATURED_PROJECT_IDS,
  PORTFOLIO_PROJECTS,
  type PortfolioProject,
} from '../projects/components/projectCopy';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';

const selectedProjects = FEATURED_PROJECT_IDS
  .map((id) => PORTFOLIO_PROJECTS.find((project) => project.id === id))
  .filter((project): project is PortfolioProject => Boolean(project));

export default function ProjectHTML() {
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

        <div className="grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-3">
          {selectedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects#${project.id}`}
              scroll={false}
              className="group block"
            >
              <article>
                <div className="homepage-project-window ui-radius-surface relative aspect-[16/10]">
                  <div className="media-clip-surface absolute inset-0">
                    {project.media ? (
                      <Image
                        src={project.media.cover}
                        alt={`${project.name} preview`}
                        fill
                        sizes="(max-width: 767px) 100vw, 33vw"
                        className="object-cover transition duration-500 ease-out group-hover:scale-[1.018] group-hover:saturate-[1.03]"
                      />
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
                  <p className="mt-1.5 text-[color:var(--text-secondary)]">
                    {project.collapsed.purpose}
                  </p>
                  <p className="type-meta mt-2 text-[color:var(--text-meta)]">
                    {project.collapsed.resultLine}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <a
        href="mailto:kestelle@sas.upenn.edu"
        className="contact-button glass-interactive ui-radius-panel mt-20 flex w-full flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
      >
        <div className="star-line-detail max-w-2xl">
          <span className="star-glyph-detail" aria-hidden="true">
            {'\uE000'}
          </span>
          <p className="star-copy-detail text-[color:var(--text-secondary)]">
            I&apos;m always interested in teams where engineering, design, and
            product shape each other.
          </p>
        </div>
        <span className="type-meta shrink-0 pl-[1.45rem] text-[color:var(--text-primary)] sm:pl-0">
          let&apos;s talk! ↗
        </span>
      </a>
    </>
  );
}
