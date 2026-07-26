'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
} from 'motion/react';
import { useEntranceReady } from '../EntranceReadyContext';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import LazyVideo, {
  preloadLazyVideo,
} from './components/DeferredLazyVideo';
import {
  PORTFOLIO_PROJECTS,
  PROJECT_SECTIONS,
  type PortfolioProject,
} from './components/projectCopy';

const isFileVideo = (url: string) => /\.(mp4|webm|mov|m4v)$/i.test(url);
const isMuxVideo = (url: string) => !url.includes('/') && !url.includes('.');
const PROJECT_MOTION_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const TOOLTIP_REVEAL_DELAY_MS = 35;
const PROJECT_SWITCH_DELAY_MS = 55;
const TOOLTIP_SPRING_FREQUENCY = 20;
const TOOLTIP_WIDTH = 448;
const TOOLTIP_HEIGHT = 280;
const TOOLTIP_OFFSET = 16;
const TOOLTIP_VIEWPORT_PADDING = 12;
const VIDEO_POSTER_FALLBACK_MS = 250;
const PROJECT_CROSSFADE_MS = 260;
const PREVIEW_TRANSITION = `opacity ${PROJECT_CROSSFADE_MS}ms ${PROJECT_MOTION_EASE}`;
const PREVIEW_HIDE_TRANSITION = `opacity 160ms ${PROJECT_MOTION_EASE}`;
const FULL_MEDIA_TRANSITION = `opacity 280ms ${PROJECT_MOTION_EASE}`;
const STORY_EASE = [0.22, 1, 0.36, 1] as const;
const STORY_REVERSE_EASE = [0.64, 0, 0.78, 0] as const;
const STORY_DURATION_SECONDS = 0.42;
const STORY_SETTLE_DELAY_MS = STORY_DURATION_SECONDS * 1000 + 40;
const PROJECT_LAYOUT_TRANSITION = {
  type: 'tween',
  duration: 0.38,
  ease: STORY_EASE,
} as const;

type ProjectLayoutProps = {
  project: PortfolioProject;
  expanded: boolean;
  onToggle: () => void;
  onPreviewStart: (
    project: PortfolioProject,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
};

function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}

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

function PreviewMedia({
  project,
  active,
  posterFallbackDelayMs,
  onReady,
}: {
  project: PortfolioProject;
  active: boolean;
  posterFallbackDelayMs: number;
  onReady: () => void;
}) {
  const cover = project.media?.cover;
  const preview = project.media?.preview;
  const hasVideo = Boolean(
    preview && (isFileVideo(preview) || isMuxVideo(preview)),
  );
  const nativeVideoRef = useRef<HTMLVideoElement>(null);
  const reportedReadyRef = useRef(false);
  const videoReadyRef = useRef(false);
  const videoPaintFrameRef = useRef<number | null>(null);
  const [posterReady, setPosterReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    reportedReadyRef.current = false;
    videoReadyRef.current = false;
    setPosterReady(false);
    setVideoReady(false);
    return () => {
      if (videoPaintFrameRef.current !== null) {
        cancelAnimationFrame(videoPaintFrameRef.current);
        videoPaintFrameRef.current = null;
      }
    };
  }, [project.id]);

  const reportReady = useCallback(() => {
    if (reportedReadyRef.current) return;
    reportedReadyRef.current = true;
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (!cover) reportReady();
  }, [cover, reportReady]);

  useEffect(() => {
    if (
      !hasVideo
      || videoReady
      || !posterReady
      || reportedReadyRef.current
    ) {
      return;
    }

    const fallbackTimer = window.setTimeout(
      reportReady,
      posterFallbackDelayMs,
    );
    return () => window.clearTimeout(fallbackTimer);
  }, [
    hasVideo,
    posterFallbackDelayMs,
    posterReady,
    reportReady,
    videoReady,
  ]);

  useEffect(() => {
    const video = nativeVideoRef.current;
    if (!video) return;

    if (active) {
      video.play().catch(() => {
        // Keep the poster visible when autoplay is unavailable.
      });
    } else {
      video.pause();
    }
  }, [active, project.id, videoReady]);

  const revealVideo = () => {
    if (videoReadyRef.current) return;
    videoReadyRef.current = true;
    setVideoReady(true);
    videoPaintFrameRef.current = requestAnimationFrame(() => {
      videoPaintFrameRef.current = requestAnimationFrame(() => {
        videoPaintFrameRef.current = null;
        reportReady();
      });
    });
  };

  const revealPoster = () => {
    setPosterReady(true);
    if (!hasVideo) reportReady();
  };

  if (!cover) {
    return (
      <div className="flex h-full w-full items-end bg-[url('/textures/textured-paper.png')] bg-cover p-5">
        <p className="type-lead max-w-sm text-[color:var(--text-secondary)]">
          {project.collapsed.resultLine}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-950">
      <Image
        src={cover}
        alt=""
        fill
        sizes="28rem"
        className="object-cover"
        onLoad={revealPoster}
        onError={revealPoster}
      />

      {preview && isFileVideo(preview) && (
        <video
          ref={nativeVideoRef}
          src={preview}
          className={`absolute inset-0 h-full w-full bg-neutral-950 object-cover ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: PREVIEW_TRANSITION }}
          preload="auto"
          muted
          loop
          playsInline
          onLoadedData={revealVideo}
          onCanPlay={revealVideo}
        />
      )}

      {preview && isMuxVideo(preview) && (
        <div
          className={`absolute inset-0 bg-neutral-950 [&>span]:h-full [&>span]:min-h-0 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: PREVIEW_TRANSITION }}
        >
          <LazyVideo
            playbackId={preview}
            poster=""
            muted
            loop
            active={active}
            preload="auto"
            maxResolution="720p"
            onReady={revealVideo}
            className="h-full w-full bg-neutral-950 object-cover"
          />
        </div>
      )}
    </div>
  );
}

function PreviewCard({
  project,
  active,
  posterFallbackDelayMs,
  onReady,
}: {
  project: PortfolioProject;
  active: boolean;
  posterFallbackDelayMs: number;
  onReady: () => void;
}) {
  return (
    <div className="h-full w-full overflow-hidden bg-neutral-950 [&>span]:block [&>span]:h-full [&>span]:w-full">
      <PreviewMedia
        project={project}
        active={active}
        posterFallbackDelayMs={posterFallbackDelayMs}
        onReady={onReady}
      />
    </div>
  );
}

function StoryField({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h4 className="type-meta mb-3 text-[color:var(--text-meta)]">
        {label}
      </h4>
      <div className="type-body max-w-[68ch] text-[color:var(--text-primary)]">
        {children}
      </div>
    </section>
  );
}

function ProjectActions({ project }: { project: PortfolioProject }) {
  if (!project.liveUrl && !project.githubUrl) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3 border-t py-5">
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
          {project.status}
        </div>
      )}

      <div className="grid gap-7 py-7 md:grid-cols-2 md:gap-10 md:py-8">
        <StoryField label="the goal">
          <p className="leading-[1.55]">{story.goal}</p>
        </StoryField>
        <StoryField label="my role">
          <p className="leading-[1.55]">
            {story.role ?? project.metadata.role}
          </p>
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
      >
        <p className="leading-[1.55]">{story.challenge}</p>
      </StoryField>

      <StoryField
        label="one decision that mattered"
        className="border-y border-[color:var(--line-color)] py-7 md:py-8"
      >
        <p className="type-lead max-w-[62ch]">
          {story.decision}
        </p>
      </StoryField>

      {(story.owned?.length || story.workedWith?.length) && (
        <div className="grid gap-7 py-7 md:grid-cols-2 md:gap-10 md:py-8">
          {story.owned && (
            <StoryField label="owned">
              <ul className="space-y-1.5">
                {story.owned.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </StoryField>
          )}
          {story.workedWith && (
            <StoryField label="worked with">
              <ul className="space-y-1.5">
                {story.workedWith.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </StoryField>
          )}
        </div>
      )}

      <div className="grid gap-7 border-t border-[color:var(--line-color)] py-7 md:grid-cols-2 md:gap-10 md:py-8">
        <StoryField label="the outcome">
          <p className="leading-[1.55]">{story.outcome}</p>
        </StoryField>
        <StoryField label="what changed my mind">
          <p className="leading-[1.55]">{story.changedMind}</p>
        </StoryField>
      </div>

      <div className="type-meta border-t border-[color:var(--line-color)] py-4 text-[color:var(--text-decorative)]">
        {project.metadata.stack}
      </div>

      <ProjectActions project={project} />
    </div>
  );
}

function ExpandedProject({ project }: { project: PortfolioProject }) {
  return (
    <div
      data-project-story
      className="project-story-panel ui-radius-surface"
    >
      <div className="type-meta grid gap-3 border-b border-[color:var(--line-color)] px-4 py-3 text-[color:var(--text-meta)] sm:grid-cols-2 md:px-5">
        <span>{project.metadata.date}</span>
        <span className="sm:text-right">{project.collapsed.roleLine}</span>
      </div>

      <div className="px-4 md:px-5">
        <ProjectStoryIntro project={project} />
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
    </div>
  );
}

function ExpandedRegion({
  project,
  expanded,
}: {
  project: PortfolioProject;
  expanded: boolean;
}) {
  return (
    <AnimatePresence initial={false}>
      {expanded && (
        <motion.div
          key={`${project.id}-story`}
          id={`${project.id}-story`}
          data-project-story
          initial={{
            gridTemplateRows: '0fr',
            opacity: 0,
          }}
          animate={{
            gridTemplateRows: '1fr',
            opacity: 1,
            transition: {
              duration: STORY_DURATION_SECONDS,
              ease: STORY_EASE,
            },
          }}
          exit={{
            gridTemplateRows: '0fr',
            opacity: 0,
            transition: {
              duration: STORY_DURATION_SECONDS,
              ease: STORY_REVERSE_EASE,
            },
          }}
          className="-mx-6 -mb-2 -mt-2 grid overflow-hidden"
          style={{ willChange: 'grid-template-rows, opacity' }}
        >
          <div className="min-h-0 overflow-hidden px-6 pb-6 pt-2">
            <ExpandedProject project={project} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectRow({
  project,
  expanded,
  onToggle,
  onPreviewStart,
}: ProjectLayoutProps) {
  return (
    <motion.article
      layout="position"
      transition={{ layout: PROJECT_LAYOUT_TRANSITION }}
      id={project.id}
      className="group relative scroll-mt-28 border-b last:border-b-0"
      onMouseEnter={(event) => onPreviewStart(project, event)}
    >
      <button
        type="button"
        className="project-row-trigger w-full py-3 text-left"
        aria-expanded={expanded}
        aria-controls={`${project.id}-story`}
        onClick={onToggle}
      >
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-6">
          <ShimmerText as="h4" className="type-project-title">
            {project.name}
          </ShimmerText>
          <span className="flex items-center justify-between gap-4 md:justify-end">
            <span className="type-meta text-[color:var(--text-meta)] md:text-right">
              {project.collapsed.resultLine}
            </span>
            <span
              aria-hidden
              className="type-meta shrink-0 text-[color:var(--text-meta)] transition-transform duration-[180ms] ease-out group-hover:translate-y-0.5"
            >
              {expanded ? '−' : '+'}
            </span>
          </span>
        </div>
      </button>

      <ExpandedRegion project={project} expanded={expanded} />
    </motion.article>
  );
}

export default function Projects() {
  type PreviewLayer = {
    project: PortfolioProject;
    requestId: number;
    posterFallbackDelayMs: number;
  };

  const entranceReady = useEntranceReady();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [present, setPresent] = useState(false);
  const [layerA, setLayerA] = useState<PreviewLayer | null>(null);
  const [layerB, setLayerB] = useState<PreviewLayer | null>(null);
  const [front, setFront] = useState<'A' | 'B'>('A');
  const frontRef = useRef<'A' | 'B'>('A');
  const currentId = useRef<string | null>(null);
  const requestId = useRef(0);
  const pendingLayer = useRef<'A' | 'B' | null>(null);
  const pendingRequestId = useRef<number | null>(null);
  const readyProjectId = useRef<string | null>(null);
  const hoveringList = useRef(false);
  const hoveredProjectId = useRef<string | null>(null);
  const hoverSwitchTimer = useRef<number | null>(null);
  const crossfadeTimer = useRef<number | null>(null);
  const crossfadeLocked = useRef(false);
  const queuedProject = useRef<PortfolioProject | null>(null);
  const tooltipShell = useRef<HTMLDivElement | null>(null);
  const positionFrame = useRef<number | null>(null);
  const positionTime = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });
  const projectScrollTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!entranceReady) return;

    let cancelled = false;
    const warmMuxPlayer = () => {
      if (cancelled) return;
      void preloadLazyVideo().catch(() => {
        // A later hover or project open can retry the deferred chunk.
      });
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(warmMuxPlayer, {
        timeout: 2500,
      });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timer = globalThis.setTimeout(warmMuxPlayer, 250);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timer);
    };
  }, [entranceReady]);

  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.slice(1);
      setExpandedId(
        PORTFOLIO_PROJECTS.some((project) => project.id === id) ? id : null,
      );
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  useEffect(() => () => {
    if (positionFrame.current !== null) {
      window.cancelAnimationFrame(positionFrame.current);
    }
    if (hoverSwitchTimer.current !== null) {
      window.clearTimeout(hoverSwitchTimer.current);
    }
    if (crossfadeTimer.current !== null) {
      window.clearTimeout(crossfadeTimer.current);
    }
    if (projectScrollTimer.current !== null) {
      window.clearTimeout(projectScrollTimer.current);
    }
  }, []);

  function applyTooltipPosition() {
    const shell = tooltipShell.current;
    if (!shell) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    let x = mouse.current.x + TOOLTIP_OFFSET;
    if (x + TOOLTIP_WIDTH > viewportWidth - TOOLTIP_VIEWPORT_PADDING) {
      x = mouse.current.x - TOOLTIP_WIDTH - TOOLTIP_OFFSET;
    }
    x = Math.max(
      TOOLTIP_VIEWPORT_PADDING,
      Math.min(
        x,
        viewportWidth - TOOLTIP_WIDTH - TOOLTIP_VIEWPORT_PADDING,
      ),
    );
    const y = Math.max(
      TOOLTIP_VIEWPORT_PADDING,
      Math.min(
        mouse.current.y,
        viewportHeight - TOOLTIP_HEIGHT - TOOLTIP_VIEWPORT_PADDING,
      ),
    );
    shell.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function schedulePositionUpdate(snap = false) {
    if (snap) {
      mouse.current = { ...targetMouse.current };
      velocity.current = { x: 0, y: 0 };
      positionTime.current = 0;
    }
    if (positionFrame.current !== null) return;

    const step = (time: number) => {
      positionFrame.current = null;
      const elapsed = positionTime.current
        ? Math.min(1 / 30, (time - positionTime.current) / 1000)
        : 1 / 60;
      positionTime.current = time;

      const dx = targetMouse.current.x - mouse.current.x;
      const dy = targetMouse.current.y - mouse.current.y;
      const frequencySquared =
        TOOLTIP_SPRING_FREQUENCY * TOOLTIP_SPRING_FREQUENCY;
      const criticalDamping = 2 * TOOLTIP_SPRING_FREQUENCY;
      velocity.current.x += (
        dx * frequencySquared - velocity.current.x * criticalDamping
      ) * elapsed;
      velocity.current.y += (
        dy * frequencySquared - velocity.current.y * criticalDamping
      ) * elapsed;
      mouse.current.x += velocity.current.x * elapsed;
      mouse.current.y += velocity.current.y * elapsed;
      applyTooltipPosition();

      const remainingDistance = Math.abs(dx) + Math.abs(dy);
      const remainingVelocity =
        Math.abs(velocity.current.x) + Math.abs(velocity.current.y);
      if (remainingDistance > 0.2 || remainingVelocity > 1) {
        positionFrame.current = requestAnimationFrame(step);
      } else {
        mouse.current = { ...targetMouse.current };
        velocity.current = { x: 0, y: 0 };
        positionTime.current = 0;
      }
    };

    positionFrame.current = requestAnimationFrame(step);
  }

  function showProject(project: PortfolioProject) {
    if (readyProjectId.current === project.id) {
      currentId.current = project.id;
      pendingLayer.current = null;
      pendingRequestId.current = null;
      setPresent(true);
      return;
    }

    if (crossfadeLocked.current) {
      queuedProject.current = project;
      return;
    }

    if (currentId.current === project.id) return;

    currentId.current = project.id;
    const nextRequestId = ++requestId.current;
    const nextLayer = frontRef.current === 'A' ? 'B' : 'A';
    pendingLayer.current = nextLayer;
    pendingRequestId.current = nextRequestId;
    const nextPreview = {
      project,
      requestId: nextRequestId,
      posterFallbackDelayMs:
        readyProjectId.current === null ? 0 : VIDEO_POSTER_FALLBACK_MS,
    };

    if (nextLayer === 'B') {
      setLayerB(nextPreview);
    } else {
      setLayerA(nextPreview);
    }
  }

  function showReadyLayer(
    layer: 'A' | 'B',
    readyRequestId: number,
    projectId: string,
  ) {
    if (
      pendingLayer.current !== layer
      || pendingRequestId.current !== readyRequestId
    ) {
      return;
    }
    if (hoveredProjectId.current !== projectId) {
      pendingLayer.current = null;
      pendingRequestId.current = null;
      if (currentId.current === projectId) currentId.current = null;
      return;
    }

    frontRef.current = layer;
    pendingLayer.current = null;
    pendingRequestId.current = null;
    readyProjectId.current = projectId;
    setFront(layer);
    if (hoveringList.current) setPresent(true);

    crossfadeLocked.current = true;
    if (crossfadeTimer.current !== null) {
      window.clearTimeout(crossfadeTimer.current);
    }
    crossfadeTimer.current = window.setTimeout(() => {
      crossfadeTimer.current = null;
      crossfadeLocked.current = false;
      const nextProject = queuedProject.current;
      queuedProject.current = null;
      if (
        nextProject
        && hoveringList.current
        && hoveredProjectId.current === nextProject.id
      ) {
        showProject(nextProject);
      }
    }, PROJECT_CROSSFADE_MS);
  }

  function onListMove(event: React.MouseEvent) {
    targetMouse.current = { x: event.clientX, y: event.clientY };
    if (hoveringList.current) schedulePositionUpdate(!present);
  }

  function onListLeave() {
    hoveringList.current = false;
    hoveredProjectId.current = null;
    queuedProject.current = null;
    if (hoverSwitchTimer.current !== null) {
      window.clearTimeout(hoverSwitchTimer.current);
      hoverSwitchTimer.current = null;
    }
    setPresent(false);
  }

  const startPreview = (
    project: PortfolioProject,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    if (!entranceReady || expandedId) return;
    hoveringList.current = true;
    hoveredProjectId.current = project.id;
    targetMouse.current = { x: event.clientX, y: event.clientY };
    schedulePositionUpdate(!present);

    if (hoverSwitchTimer.current !== null) {
      window.clearTimeout(hoverSwitchTimer.current);
    }
    if (readyProjectId.current === project.id) {
      hoverSwitchTimer.current = null;
      showProject(project);
      return;
    }
    hoverSwitchTimer.current = window.setTimeout(() => {
      hoverSwitchTimer.current = null;
      if (
        hoveringList.current
        && hoveredProjectId.current === project.id
      ) {
        showProject(project);
      }
    }, PROJECT_SWITCH_DELAY_MS);
  };

  const toggleProject = useCallback((projectId: string) => {
    if (!entranceReady) return;

    const next = expandedId === projectId ? null : projectId;
    if (hoverSwitchTimer.current !== null) {
      window.clearTimeout(hoverSwitchTimer.current);
      hoverSwitchTimer.current = null;
    }
    hoveringList.current = false;
    hoveredProjectId.current = null;
    setPresent(false);
    setExpandedId(next);

    if (projectScrollTimer.current !== null) {
      window.clearTimeout(projectScrollTimer.current);
      projectScrollTimer.current = null;
    }
    if (next) {
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      const scrollDelay = reduceMotion ? 0 : STORY_SETTLE_DELAY_MS;
      projectScrollTimer.current = window.setTimeout(() => {
        projectScrollTimer.current = null;
        const project = document.getElementById(next);
        project?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }, scrollDelay);
    }

    window.history.replaceState(
      null,
      '',
      next ? `/projects#${next}` : '/projects',
    );
  }, [entranceReady, expandedId]);

  return (
    <main className="responsive-padding flex w-full justify-center">
      <div className="w-full max-w-3xl pb-20">
        <MotionConfig reducedMotion="user">
          <LayoutGroup id="portfolio-projects">
            <div
              className="flex flex-col gap-10"
              onMouseMove={onListMove}
              onMouseLeave={onListLeave}
            >
              {PROJECT_SECTIONS.map((section) => {
                const projects = PORTFOLIO_PROJECTS.filter(
                  (project) => project.section === section.id,
                );
                const label = section.label;

                return (
                  <motion.section
                    layout="position"
                    key={section.id}
                    className="flex flex-col gap-3"
                    transition={{ layout: PROJECT_LAYOUT_TRANSITION }}
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

                    <div className="border-y">
                      {projects.map((project) => (
                        <ProjectRow
                          key={project.id}
                          project={project}
                          expanded={expandedId === project.id}
                          onToggle={() => toggleProject(project.id)}
                          onPreviewStart={startPreview}
                        />
                      ))}
                    </div>
                  </motion.section>
                );
              })}
            </div>
          </LayoutGroup>
        </MotionConfig>
      </div>

      {!expandedId && (
        <Portal>
          <div
            ref={tooltipShell}
            aria-hidden
            className="pointer-events-none z-[60] hidden aspect-[16/10] w-[28rem] md:block"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              opacity: present && entranceReady ? 1 : 0,
              transition: present && entranceReady
                ? `${PREVIEW_TRANSITION} ${TOOLTIP_REVEAL_DELAY_MS}ms`
                : PREVIEW_HIDE_TRANSITION,
              willChange: 'transform, opacity',
            }}
          >
            <div className="ui-radius-surface relative h-full w-full overflow-hidden bg-neutral-950 shadow-xl">
              <div
                className="absolute inset-0"
                style={{
                  opacity: front === 'A' ? 1 : 0,
                  transition: PREVIEW_TRANSITION,
                }}
              >
                {layerA && (
                  <PreviewCard
                    key={`${layerA.project.id}-${layerA.requestId}`}
                    project={layerA.project}
                    active={present && entranceReady && front === 'A'}
                    posterFallbackDelayMs={layerA.posterFallbackDelayMs}
                    onReady={() => showReadyLayer(
                      'A',
                      layerA.requestId,
                      layerA.project.id,
                    )}
                  />
                )}
              </div>
              <div
                className="absolute inset-0"
                style={{
                  opacity: front === 'B' ? 1 : 0,
                  transition: PREVIEW_TRANSITION,
                }}
              >
                {layerB && (
                  <PreviewCard
                    key={`${layerB.project.id}-${layerB.requestId}`}
                    project={layerB.project}
                    active={present && entranceReady && front === 'B'}
                    posterFallbackDelayMs={layerB.posterFallbackDelayMs}
                    onReady={() => showReadyLayer(
                      'B',
                      layerB.requestId,
                      layerB.project.id,
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </main>
  );
}
