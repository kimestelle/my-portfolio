'use client';

// Projects index with a single shared hover preview that follows the cursor
// and crossfades between projects while the mouse stays in the list. Click a
// row to open the full block.

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import {
  getCategoryProjects,
  type Project,
  type ProjectCategory,
} from './components/projectData';
import ProjectBlock from './components/ProjectBlock';
import LazyVideo from './components/LazyVideo';

const CATEGORIES: { category: ProjectCategory; displayName: string }[] = [
  { category: 'production experience', displayName: 'deployed at scale' },
  { category: 'graphics & simulation', displayName: 'from-scratch graphics' },
  { category: 'creative tools', displayName: 'expressive interfaces' },
];

const FADE_MS = 260;
const isFileVideo = (url: string) => /\.(mp4|webm|mov|m4v)$/i.test(url);
// bare strings (no slash, no extension) are Mux playback ids
const isMux = (url: string) => !url.includes('/') && !url.includes('.');

function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// a single preview card (media keeps a fixed 16:10 ratio so layers overlap)
function PreviewCard({ project }: { project: Project }) {
  const first = project.details.imageUrls[0];
  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-[280px] w-full overflow-hidden bg-neutral-100 [&>span]:block [&>span]:h-full [&>span]:w-full">
        {first && isFileVideo(first) ? (
          <video
            src={first}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : first && isMux(first) ? (
          <LazyVideo
            playbackId={first}
            muted
            loop
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={project.cover.imageSrc}
            alt={project.name}
            width={896}
            height={560}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex h-[88px] flex-col gap-1 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium">{project.name}</span>
          <span className="shrink-0 text-xs text-neutral-500">{project.date}</span>
        </div>
        <p className="line-clamp-2 text-sm text-neutral-600">{project.cover.blurb}</p>
      </div>
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null); // modal

  // shared hover preview state
  const [present, setPresent] = useState(false);
  const [layerA, setLayerA] = useState<Project | null>(null);
  const [layerB, setLayerB] = useState<Project | null>(null);
  const [front, setFront] = useState<'A' | 'B'>('A');
  const frontRef = useRef<'A' | 'B'>('A');
  const currentId = useRef<string | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const { refs, floatingStyles, update } = useFloating({
    placement: 'right-start',
    middleware: [offset(16), flip(), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
  });
  const virtualEl = useRef({
    getBoundingClientRect: () =>
      new DOMRect(mouse.current.x, mouse.current.y, 0, 0),
  });
  useEffect(() => {
    refs.setReference(virtualEl.current);
  }, [refs]);

  // crossfade to a project by swapping the back layer in, then flipping front
  function showProject(p: Project) {
    if (currentId.current === p.id) return;
    currentId.current = p.id;
    if (frontRef.current === 'A') {
      setLayerB(p);
      frontRef.current = 'B';
      setFront('B');
    } else {
      setLayerA(p);
      frontRef.current = 'A';
      setFront('A');
    }
  }

  function onListMove(e: React.MouseEvent) {
    mouse.current = { x: e.clientX, y: e.clientY };
    if (present) update();
  }
  function onListLeave() {
    setPresent(false);
    currentId.current = null;
  }
  function onRowEnter(p: Project) {
    showProject(p);
    setPresent(true);
    update();
  }

  function openProject(p: Project) {
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
              <h3>✦ {displayName}</h3>

              <ul className="flex flex-col divide-y border-t border-b">
                {list.map((project) => (
                  <li key={project.id} id={project.id}>
                    <div
                      onMouseEnter={() => onRowEnter(project)}
                      onClick={() => openProject(project)}
                      className="flex w-full cursor-pointer flex-col gap-1 py-3 opacity-80 transition-opacity hover:opacity-100 md:flex-row md:items-center md:justify-between md:gap-4"
                    >
                      <p>{project.name}</p>
                      <span className="text-xs text-neutral-500">
                        {project.impact ?? project.date}
                      </span>
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
            ref={refs.setFloating}
            aria-hidden
            className="pointer-events-none z-[60] hidden w-[28rem] overflow-hidden rounded-xl border bg-white shadow-xl md:block"
            style={{
              ...floatingStyles,
              height: '368px',
              opacity: present ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease`,
              willChange: 'opacity',
            }}
          >
            <div className="relative h-full w-full">
              <div
                className="absolute inset-0"
                style={{
                  opacity: front === 'A' ? 1 : 0,
                  transition: `opacity ${FADE_MS}ms ease`,
                }}
              >
                {layerA && <PreviewCard key={layerA.id} project={layerA} />}
              </div>
              <div
                className="absolute inset-0"
                style={{
                  opacity: front === 'B' ? 1 : 0,
                  transition: `opacity ${FADE_MS}ms ease`,
                }}
              >
                {layerB && <PreviewCard key={layerB.id} project={layerB} />}
              </div>
            </div>
          </div>
        </Portal>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center px-6 backdrop-blur-md"
          onClick={() => setActive(null)}
        >
          <div
            className="scrollbar-small relative h-[80svh] w-full max-w-3xl overflow-y-scroll rounded-lg bg-white p-6 md:pt-10"
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
