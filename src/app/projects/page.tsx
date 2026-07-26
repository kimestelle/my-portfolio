'use client';

// Projects index with a single shared hover preview that follows the cursor
// and crossfades between projects while the mouse stays in the list. Click a
// row to open the full block.

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
  getCategoryProjects,
  type Project,
  type ProjectCategory,
} from './components/projectData';
import ProjectBlock from './components/ProjectBlock';
import LazyVideo, {
  preloadLazyVideo,
} from './components/DeferredLazyVideo';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import { useEntranceReady } from '../EntranceReadyContext';

const CATEGORIES: { category: ProjectCategory; displayName: string }[] = [
  { category: 'production experience', displayName: 'deployed at scale' },
  { category: 'graphics & simulation', displayName: 'from-scratch graphics' },
  { category: 'creative tools', displayName: 'expressive interfaces' },
];

const TOOLTIP_REVEAL_DELAY_MS = 90;
const PROJECT_SWITCH_DELAY_MS = 110;
const TOOLTIP_SPRING_FREQUENCY = 14;
const TOOLTIP_WIDTH = 448;
const TOOLTIP_HEIGHT = 280;
const TOOLTIP_OFFSET = 16;
const TOOLTIP_VIEWPORT_PADDING = 12;
const VIDEO_POSTER_FALLBACK_MS = 500;
const PROJECT_CROSSFADE_MS = 700;
const PREVIEW_TRANSITION =
  'opacity var(--motion-mood-duration) var(--motion-mood-ease)';
const isFileVideo = (url: string) => /\.(mp4|webm|mov|m4v)$/i.test(url);
// bare strings (no slash, no extension) are Mux playback ids
const isMux = (url: string) => !url.includes('/') && !url.includes('.');

function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

function PreviewMedia({
  project,
  active,
  posterFallbackDelayMs,
  onReady,
}: {
  project: Project;
  active: boolean;
  posterFallbackDelayMs: number;
  onReady: () => void;
}) {
  const first = project.details.imageUrls[0];
  const hasVideo = Boolean(first && (isFileVideo(first) || isMux(first)));
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
    // Let the decoded first frame reach the compositor before exposing this
    // layer. Readiness events can fire one paint earlier than the video image.
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

  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-950">
      <Image
        src={project.cover.imageSrc}
        alt=""
        fill
        sizes="28rem"
        className="object-cover"
        onLoad={revealPoster}
        onError={revealPoster}
      />

      {first && isFileVideo(first) && (
        <video
          ref={nativeVideoRef}
          src={first}
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

      {first && isMux(first) && (
        <div
          className={`absolute inset-0 bg-neutral-950 [&>span]:h-full [&>span]:min-h-0 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: PREVIEW_TRANSITION }}
        >
          <LazyVideo
            playbackId={first}
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

// A single media-only preview. Project metadata already sits under the cursor,
// so repeating it here adds weight without adding information.
function PreviewCard({
  project,
  active,
  posterFallbackDelayMs,
  onReady,
}: {
  project: Project;
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

export default function Projects() {
  type PreviewLayer = {
    project: Project;
    requestId: number;
    posterFallbackDelayMs: number;
  };

  const [active, setActive] = useState<Project | null>(null); // modal
  const entranceReady = useEntranceReady();

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

  // shared hover preview state
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
  const queuedProject = useRef<Project | null>(null);
  const tooltipShell = useRef<HTMLDivElement | null>(null);
  const positionFrame = useRef<number | null>(null);
  const positionTime = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });

  const mouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });

  useEffect(() => () => {
    if (positionFrame.current !== null) {
      cancelAnimationFrame(positionFrame.current);
    }
    if (hoverSwitchTimer.current !== null) {
      window.clearTimeout(hoverSwitchTimer.current);
    }
    if (crossfadeTimer.current !== null) {
      window.clearTimeout(crossfadeTimer.current);
    }
  }, []);

  function applyTooltipPosition() {
    const shell = tooltipShell.current;
    if (!shell) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    let x = mouse.current.x + TOOLTIP_OFFSET;
    if (
      x + TOOLTIP_WIDTH
      > viewportWidth - TOOLTIP_VIEWPORT_PADDING
    ) {
      x = mouse.current.x - TOOLTIP_WIDTH - TOOLTIP_OFFSET;
    }
    x = Math.max(
      TOOLTIP_VIEWPORT_PADDING,
      Math.min(x, viewportWidth - TOOLTIP_WIDTH - TOOLTIP_VIEWPORT_PADDING),
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

  // Keep the current preview visible while the next video's first frame loads.
  // Posters surface immediately only for the first preview, or after a stall.
  function showProject(p: Project) {
    if (readyProjectId.current === p.id) {
      currentId.current = p.id;
      pendingLayer.current = null;
      pendingRequestId.current = null;
      setPresent(true);
      return;
    }

    if (crossfadeLocked.current) {
      queuedProject.current = p;
      return;
    }

    if (currentId.current === p.id) {
      return;
    }

    currentId.current = p.id;
    const nextRequestId = ++requestId.current;
    const nextLayer = frontRef.current === 'A' ? 'B' : 'A';
    pendingLayer.current = nextLayer;
    pendingRequestId.current = nextRequestId;
    const nextPreview = {
      project: p,
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
      pendingLayer.current !== layer ||
      pendingRequestId.current !== readyRequestId
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

    // Do not replace the layer that is still fading out. Rapid pointer
    // movement only queues the latest project until this crossfade settles.
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

  function onListMove(e: React.MouseEvent) {
    targetMouse.current = { x: e.clientX, y: e.clientY };
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
  function onRowEnter(p: Project, e: React.MouseEvent) {
    if (!entranceReady) return;
    hoveringList.current = true;
    hoveredProjectId.current = p.id;
    targetMouse.current = { x: e.clientX, y: e.clientY };
    schedulePositionUpdate(!present);

    if (hoverSwitchTimer.current !== null) {
      window.clearTimeout(hoverSwitchTimer.current);
    }
    if (readyProjectId.current === p.id) {
      hoverSwitchTimer.current = null;
      showProject(p);
      return;
    }
    hoverSwitchTimer.current = window.setTimeout(() => {
      hoverSwitchTimer.current = null;
      if (
        hoveringList.current
        && hoveredProjectId.current === p.id
      ) {
        showProject(p);
      }
    }, PROJECT_SWITCH_DELAY_MS);
  }

  function openProject(p: Project) {
    if (!entranceReady) return;
    if (hoverSwitchTimer.current !== null) {
      window.clearTimeout(hoverSwitchTimer.current);
      hoverSwitchTimer.current = null;
    }
    setPresent(false); // hide hover preview so it can't intercept modal clicks
    setActive(p);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex flex-col responsive-padding items-center">
      <div
        className="flex w-full max-w-3xl flex-col gap-10"
        onMouseMove={onListMove}
        onMouseLeave={onListLeave}
      >
        {CATEGORIES.map(({ category, displayName }) => {
          const list = getCategoryProjects(category);
          if (!list.length) return null;

          return (
            <section key={category} className="flex flex-col gap-3">
              <ShimmerText as="h3">{`✦ ${displayName}`}</ShimmerText>

              <ul className="flex cursor-pointer flex-col divide-y border-t border-b">
                {list.map((project) => (
                  <li
                    key={project.id}
                    id={project.id}
                    className="group cursor-pointer"
                    onMouseEnter={(event) => onRowEnter(project, event)}
                    onClick={() => openProject(project)}
                  >
                    <div
                      className="flex w-full flex-col gap-1 py-3 opacity-80 transition-opacity group-hover:opacity-100 md:flex-row md:items-center md:justify-between md:gap-4"
                    >
                      <ShimmerText>{project.name}</ShimmerText>
                      <ShimmerText as="span" className="text-xs text-neutral-500">
                        {project.impact ?? project.date}
                      </ShimmerText>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* shared, cursor-following, crossfading preview (hidden while modal open) */}
      {!active && (
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
                : PREVIEW_TRANSITION,
              willChange: 'transform, opacity',
            }}
          >
            <div className="ui-radius-surface relative h-full w-full overflow-hidden border border-black/20 bg-neutral-950 shadow-xl">
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

      {active && (
        <div
          className="project-detail-enter fixed inset-0 z-[80] flex flex-col items-center justify-center px-6 backdrop-blur-md"
          onClick={() => setActive(null)}
        >
          <div
            className="ui-radius-surface scrollbar-small relative h-[80svh] w-full max-w-3xl overflow-y-scroll bg-white p-6 md:pt-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-6 top-3 text-2xl text-red-500 hover:text-red-200"
              onClick={() => setActive(null)}
            >
              &times;
            </button>
            <ProjectBlock project={active} />
          </div>
        </div>
      )}
    </div>
  );
}
