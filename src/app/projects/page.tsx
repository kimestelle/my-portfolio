'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
} from 'motion/react';
import { useEntranceReady } from '../EntranceReadyContext';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import LazyVideo from './components/DeferredLazyVideo';
import TallyCover from './components/TallyCover';
import {
  PORTFOLIO_PROJECTS,
  PROJECT_SECTIONS,
  type PortfolioProject,
} from './components/projectCopy';

const isFileVideo = (url: string) => /\.(mp4|webm|mov|m4v)$/i.test(url);
const isMuxVideo = (url: string) => !url.includes('/') && !url.includes('.');
const PROJECT_MOTION_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const FULL_MEDIA_TRANSITION = `opacity 280ms ${PROJECT_MOTION_EASE}`;
const VIEW_TRANSITION_EASE = [0.2, 0.72, 0.24, 1] as const;

const IntoTheBlueCaseStudy = dynamic(
  () => import('../field-notes/into-the-blue/page'),
  { loading: () => <CaseStudyLoading /> },
);
const InternetAtlasCaseStudy = dynamic(
  () => import('../field-notes/internet-atlas/page'),
  { loading: () => <CaseStudyLoading /> },
);
const DigitalLoomCaseStudy = dynamic(
  () => import('./case-studies/DigitalLoomCaseStudy'),
  { loading: () => <CaseStudyLoading /> },
);
const TallyCaseStudy = dynamic(
  () => import('./case-studies/TallyCaseStudy'),
  { loading: () => <CaseStudyLoading /> },
);

function CaseStudyLoading() {
  return (
    <div className="grid min-h-[55svh] place-items-center px-5 py-20 text-[color:var(--text-meta)]">
      <span className="type-meta">opening case study…</span>
    </div>
  );
}

function FeaturedCaseStudy({ projectId }: { projectId: string }) {
  if (projectId === 'into-the-blue') {
    return <IntoTheBlueCaseStudy inline />;
  }

  if (projectId === 'internet-atlas') {
    return <InternetAtlasCaseStudy inline />;
  }

  if (projectId === 'digital-loom') {
    return <DigitalLoomCaseStudy inline />;
  }

  if (projectId === 'tally') {
    return <TallyCaseStudy inline />;
  }

  return null;
}

function setScrollPositionInstantly(top: number) {
  const root = document.documentElement;
  const body = document.body;
  const rootBehavior = root.style.scrollBehavior;
  const bodyBehavior = body.style.scrollBehavior;

  root.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';
  window.scrollTo({ top, left: 0, behavior: 'auto' });
  root.style.scrollBehavior = rootBehavior;
  body.style.scrollBehavior = bodyBehavior;
}

function getProjectIdFromLocation() {
  const queryId = new URLSearchParams(window.location.search).get('study');
  if (
    queryId &&
    PORTFOLIO_PROJECTS.some((project) => project.id === queryId)
  ) {
    return queryId;
  }

  const legacyHashId = window.location.hash.slice(1);
  return PORTFOLIO_PROJECTS.some(
    (project) => project.id === legacyHashId,
  )
    ? legacyHashId
    : null;
}

type ProjectLayoutProps = {
  project: PortfolioProject;
  onOpen: () => void;
};

function ProjectMedia({
  project,
  active,
  className = '',
  imageClassName = '',
  sizes,
  priority = false,
}: {
  project: PortfolioProject;
  active: boolean;
  className?: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
}) {
  const preview = project.media?.preview;
  const [mediaReady, setMediaReady] = useState(false);
  const [allowMotion, setAllowMotion] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean };
      }
    ).connection;
    setAllowMotion(!reduceMotion && !connection?.saveData);
  }, []);

  useEffect(() => {
    if (!active) setMediaReady(false);
  }, [active]);

  if (!project.media) {
    return (
      <div
        className={`flex items-end overflow-hidden bg-[url('/textures/textured-paper.png')] bg-cover p-5 ${className}`}
        aria-hidden
      >
        <p className="type-lead max-w-sm text-[color:var(--text-secondary)]">
          {project.collapsed.resultLine}
        </p>
      </div>
    );
  }

  const shouldMountPreview = active && allowMotion && Boolean(preview);

  if (project.id === 'tally') {
    return (
      <TallyCover
        animated={active && allowMotion}
        className={className}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-neutral-950 ${className}`}>
      <Image
        src={project.media.cover}
        alt={`${project.name} preview`}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover motion-reduce:transition-none ${
          active ? 'scale-[1.012]' : 'scale-100'
        } ${imageClassName}`}
        style={{
          transition: `transform 340ms ${PROJECT_MOTION_EASE}`,
        }}
      />

      {shouldMountPreview && preview && isMuxVideo(preview) && (
        <div
          className={`absolute inset-0 ${
            mediaReady ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: FULL_MEDIA_TRANSITION }}
        >
          <LazyVideo
            playbackId={preview}
            poster=""
            muted
            loop
            active
            preload="metadata"
            maxResolution="1080p"
            onReady={() => setMediaReady(true)}
            className="h-full w-full bg-neutral-950 object-cover"
          />
        </div>
      )}

      {shouldMountPreview && preview && isFileVideo(preview) && (
        <video
          src={preview}
          className={`absolute inset-0 h-full w-full bg-neutral-950 object-cover ${
            mediaReady ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: FULL_MEDIA_TRANSITION }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setMediaReady(true)}
          onCanPlay={() => setMediaReady(true)}
        />
      )}
    </div>
  );
}

function StoryField({
  label,
  children,
  className = '',
  innerClassName = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section className={className}>
      <div className={innerClassName}>
        <ShimmerText
          as="h4"
          className="type-meta mb-3 text-[color:var(--text-meta)]"
        >
          {label}
        </ShimmerText>
        <div className="type-body max-w-[68ch] text-[color:var(--text-primary)]">
          {children}
        </div>
      </div>
    </section>
  );
}

function ProjectActions({ project }: { project: PortfolioProject }) {
  if (
    project.variant !== 'featured' &&
    !project.liveUrl &&
    !project.githubUrl
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3 border-t py-5">
      {project.variant === 'featured' && (
        <Link
          href={`/projects/${project.id}`}
          className="type-meta py-1 underline decoration-black/20 underline-offset-4"
        >
          read the case study →
        </Link>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="type-meta py-1 underline decoration-black/20 underline-offset-4"
        >
          visit project ↗
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="type-meta py-1 underline decoration-black/20 underline-offset-4"
        >
          source ↗
        </a>
      )}
    </div>
  );
}

function ProjectStoryIntro({ project }: { project: PortfolioProject }) {
  const { story } = project;

  return (
    <>
      {project.status && (
        <div className="type-meta border-b py-3 text-[color:var(--text-meta)]">
          <ShimmerText as="span">{project.status}</ShimmerText>
        </div>
      )}

      <div className="grid gap-7 py-7 md:grid-cols-2 md:gap-10 md:py-8">
        <StoryField label="the goal">
          <ShimmerText as="p" className="leading-[1.55]">
            {story.goal}
          </ShimmerText>
        </StoryField>
        <StoryField label="my role">
          <ShimmerText as="p" className="leading-[1.55]">
            {story.role ?? project.metadata.role}
          </ShimmerText>
        </StoryField>
      </div>
    </>
  );
}

function ProjectStoryDetails({ project }: { project: PortfolioProject }) {
  const { story } = project;

  return (
    <div>
      <StoryField
        label="biggest challenge"
        className="py-7 md:py-8"
        innerClassName="mx-auto w-full max-w-[68ch]"
      >
        <ShimmerText as="p" className="leading-[1.55]">
          {story.challenge}
        </ShimmerText>
      </StoryField>

      <StoryField
        label="one decision that mattered"
        className="border-y border-[color:var(--line-color)] py-7 md:py-8"
        innerClassName="mx-auto w-full max-w-[68ch]"
      >
        <ShimmerText as="p" className="leading-[1.55]">
          {story.decision}
        </ShimmerText>
      </StoryField>

      {(story.owned?.length || story.workedWith?.length) && (
        <div className="grid gap-7 py-7 md:grid-cols-2 md:gap-10 md:py-8">
          {story.owned && (
            <StoryField label="what i built">
              <ul className="project-story-list type-body space-y-1.5 text-[color:var(--text-secondary)]">
                {story.owned.map((item) => (
                  <ShimmerText as="li" key={item}>
                    {item}
                  </ShimmerText>
                ))}
              </ul>
            </StoryField>
          )}
          {story.workedWith && (
            <StoryField label="worked with">
              <ul className="project-story-list type-body space-y-1.5 text-[color:var(--text-secondary)]">
                {story.workedWith.map((item) => (
                  <ShimmerText as="li" key={item}>
                    {item}
                  </ShimmerText>
                ))}
              </ul>
            </StoryField>
          )}
        </div>
      )}

      <div className="grid gap-7 border-t border-[color:var(--line-color)] py-7 md:grid-cols-2 md:gap-10 md:py-8">
        <StoryField label="the outcome">
          <ShimmerText as="p" className="leading-[1.55]">
            {story.outcome}
          </ShimmerText>
        </StoryField>
        <StoryField label="what changed my mind">
          <ShimmerText as="p" className="leading-[1.55]">
            {story.changedMind}
          </ShimmerText>
        </StoryField>
      </div>

      <div className="type-meta border-t border-[color:var(--line-color)] py-4 text-[color:var(--text-decorative)]">
        <ShimmerText as="span">{project.metadata.stack}</ShimmerText>
      </div>

      <ProjectActions project={project} />
    </div>
  );
}

function ExpandedProject({
  project,
  onClose,
}: {
  project: PortfolioProject;
  onClose?: () => void;
}) {
  const isFeaturedCaseStudy = project.variant === 'featured';

  return (
    <div
      data-project-story
      className={`project-story-panel ui-radius-surface ${
        isFeaturedCaseStudy ? 'project-case-study-inline' : ''
      }`}
    >
      {onClose && (
        <header
          className={`border-b border-[color:var(--line-color)] px-4 py-4 md:px-5 ${
            isFeaturedCaseStudy ? 'project-case-study-toolbar' : ''
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="group flex w-full items-center justify-between gap-6 text-left"
            aria-label={`Return to projects from ${project.name}`}
          >
            <ShimmerText
              as={isFeaturedCaseStudy ? 'span' : 'h2'}
              className={
                isFeaturedCaseStudy ? 'type-meta' : 'type-project-title'
              }
            >
              {isFeaturedCaseStudy ? '← all projects' : project.name}
            </ShimmerText>
            <span className="flex items-center gap-4">
              <ShimmerText
                as="span"
                className="type-meta hidden text-right text-[color:var(--text-meta)] sm:block"
              >
                {project.collapsed.resultLine}
              </ShimmerText>
              {!isFeaturedCaseStudy ? (
                <span
                  aria-hidden
                  className="type-meta shrink-0 text-[color:var(--text-meta)] transition-transform duration-[180ms] ease-out group-hover:-translate-x-1"
                >
                  ←
                </span>
              ) : null}
            </span>
          </button>
        </header>
      )}

      {isFeaturedCaseStudy ? (
        <FeaturedCaseStudy projectId={project.id} />
      ) : (
        <>
          <div className="type-meta grid gap-3 border-b border-[color:var(--line-color)] px-4 py-3 text-[color:var(--text-meta)] sm:grid-cols-2 md:px-5">
            <ShimmerText as="span">{project.metadata.date}</ShimmerText>
            <ShimmerText as="span" className="sm:text-right">
              {project.collapsed.roleLine}
            </ShimmerText>
          </div>

          <div className="px-4 md:px-5">
            <ProjectStoryIntro project={project} />
            {project.story.feedback && (
              <StoryField
                label="how feedback shaped it"
                className="border-t border-[color:var(--line-color)] py-7 md:py-8"
                innerClassName="mx-auto w-full max-w-[68ch]"
              >
                <ShimmerText as="p" className="leading-[1.55]">
                  {project.story.feedback}
                </ShimmerText>
              </StoryField>
            )}
          </div>

          <ProjectMedia
            project={project}
            active
            sizes="(max-width: 767px) 100vw, 48rem"
            className="aspect-[16/10] w-full border-y border-[color:var(--line-color)]"
          />

          <div className="px-4 md:px-5">
            <ProjectStoryDetails project={project} />
          </div>
        </>
      )}
    </div>
  );
}

function ProjectRow({
  project,
  onOpen,
}: ProjectLayoutProps) {
  const hasCover = Boolean(project.media?.cover);

  return (
    <article
      id={project.id}
      className="project-row-shell group relative scroll-mt-28 border-b last:border-b-0"
    >
      <button
        type="button"
        className="project-row-trigger w-full py-3 text-left"
        aria-label={`Open ${project.name}`}
        onClick={onOpen}
      >
        <div
          className={`grid items-center gap-4 md:gap-5 ${
            hasCover
              ? 'grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] md:grid-cols-[10rem_minmax(0,1fr)_auto]'
              : 'grid-cols-[minmax(0,1fr)_auto]'
          }`}
        >
          {project.media?.cover ? (
            <div
              className="media-clip-surface relative aspect-[16/10] w-full bg-neutral-950"
              aria-hidden="true"
            >
              {project.id === 'tally' ? (
                <TallyCover compact className="h-full" />
              ) : (
                <Image
                  src={project.media.cover}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 5.5rem, (max-width: 767px) 7.5rem, 10rem"
                  className="object-cover"
                />
              )}
            </div>
          ) : null}

          <div className="min-w-0">
            <ShimmerText as="h4" className="type-project-title">
              {project.name}
            </ShimmerText>
            <ShimmerText
              as="p"
              className="mt-1 max-w-[46rem] text-[color:var(--text-secondary)]"
            >
              {project.collapsed.indexLine}
            </ShimmerText>
          </div>

          <span
            aria-hidden
            className="type-meta shrink-0 pt-0.5 text-[color:var(--text-meta)]"
          >
            →
          </span>
        </div>
      </button>
    </article>
  );
}

function ProjectDetailView({
  project,
  onClose,
}: {
  project: PortfolioProject;
  onClose: () => void;
}) {
  return (
    <motion.section
      aria-label={`${project.name} project details`}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.26, ease: VIEW_TRANSITION_EASE }}
    >
      <ExpandedProject project={project} onClose={onClose} />
    </motion.section>
  );
}

export default function Projects() {
  const entranceReady = useEntranceReady();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [transitionTarget, setTransitionTarget] = useState<
    string | 'index' | null
  >(null);
  const listScrollPosition = useRef(0);
  const selectedProject =
    PORTFOLIO_PROJECTS.find((project) => project.id === expandedId) ?? null;

  useLayoutEffect(() => {
    const projectId = getProjectIdFromLocation();
    setExpandedId(projectId);
    if (projectId) {
      if (!window.location.search.includes('study=')) {
        window.history.replaceState(
          null,
          '',
          `/projects?study=${projectId}`,
        );
      }
      setScrollPositionInstantly(0);
    }
  }, []);

  useEffect(() => {
    const openFromLocation = () => {
      const projectId = getProjectIdFromLocation();
      setExpandedId((currentProjectId) => {
        if (projectId && projectId !== currentProjectId) {
          setScrollPositionInstantly(0);
        }
        return projectId;
      });
    };
    window.addEventListener('hashchange', openFromLocation);
    window.addEventListener('popstate', openFromLocation);
    return () => {
      window.removeEventListener('hashchange', openFromLocation);
      window.removeEventListener('popstate', openFromLocation);
    };
  }, []);

  useEffect(() => {
    if (!expandedId) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setTransitionTarget('index');
      window.history.replaceState(null, '', '/projects');
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [expandedId]);

  const openProject = useCallback((projectId: string) => {
    if (!entranceReady || transitionTarget) return;

    listScrollPosition.current = window.scrollY;
    setTransitionTarget(projectId);
    window.history.replaceState(null, '', `/projects?study=${projectId}`);
  }, [entranceReady, transitionTarget]);

  const closeProject = useCallback(() => {
    if (transitionTarget) return;
    setTransitionTarget('index');
    window.history.replaceState(null, '', '/projects');
  }, [transitionTarget]);

  const completeProjectTransition = useCallback(() => {
    if (!transitionTarget) return;

    if (transitionTarget === 'index') {
      setExpandedId(null);
      setScrollPositionInstantly(listScrollPosition.current);
    } else {
      setScrollPositionInstantly(0);
      setExpandedId(transitionTarget);
    }
    setTransitionTarget(null);
  }, [transitionTarget]);

  return (
    <main className="responsive-padding w-full">
      <div className="page-frame-wide">
        <MotionConfig reducedMotion="user">
          <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={completeProjectTransition}
          >
            {!transitionTarget && (
              selectedProject ? (
                <ProjectDetailView
                  key={`detail-${selectedProject.id}`}
                  project={selectedProject}
                  onClose={closeProject}
                />
              ) : (
                <motion.div
                  key="project-index"
                  className="flex flex-col gap-10"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{
                    duration: 0.26,
                    ease: VIEW_TRANSITION_EASE,
                  }}
                >
                  {PROJECT_SECTIONS.map((section) => {
                    const projects = PORTFOLIO_PROJECTS.filter(
                      (project) => project.section === section.id,
                    );
                    const label = section.label;

                    return (
                      <section
                        key={section.id}
                        className="flex flex-col gap-3"
                      >
                        <div className="star-line-section">
                          <span
                            className="star-glyph-section"
                            aria-hidden="true"
                          >
                            ✶
                          </span>
                          <ShimmerText as="h3" className="star-copy-section">
                            {label}
                          </ShimmerText>
                        </div>

                        <div className="project-list border-y">
                          {projects.map((project) => (
                            <ProjectRow
                              key={project.id}
                              project={project}
                              onOpen={() => openProject(project.id)}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </motion.div>
              )
            )}
          </AnimatePresence>
        </MotionConfig>
      </div>
    </main>
  );
}
