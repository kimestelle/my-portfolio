'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { LAB_BY_TECH, type LabItem } from './labData';
import BubblePrototype from './BubblePrototype';
import MagnifierImage from './MagnifierImage';
import { LAB_COMPONENTS } from './labComponents';

function wallpaperNoise(value: number, seed: number) {
  const hash = (cell: number) => {
    const wave = Math.sin((cell + seed * 31.17) * 127.1) * 43758.5453;
    return wave - Math.floor(wave);
  };
  const cell = Math.floor(value);
  const fraction = value - cell;
  const eased = fraction * fraction * (3 - 2 * fraction);
  return (hash(cell) + (hash(cell + 1) - hash(cell)) * eased) * 2 - 1;
}

function BrewingBubbles() {
  const wallpaperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wallpaper = wallpaperRef.current;
    if (!wallpaper || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let lastPaint = 0;
    const startedAt = performance.now();

    const moveWallpaper = (now: number) => {
      if (now - lastPaint >= 32) {
        const time = (now - startedAt) * 0.000075;
        wallpaper.style.setProperty('--tile-x', `${wallpaperNoise(time * 1.24, 18) * 4}px`);
        wallpaper.style.setProperty('--tile-y', `${wallpaperNoise(time * 0.96, 21) * 4}px`);
        lastPaint = now;
      }
      frame = requestAnimationFrame(moveWallpaper);
    };

    frame = requestAnimationFrame(moveWallpaper);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={wallpaperRef}
      className="relative h-[48svh] max-h-[50svh] overflow-hidden rounded-xl border border-[#70513d]/15 bg-[#fbf6ef] md:h-auto md:max-h-[80svh] md:aspect-[16/9]"
      style={{
        backgroundImage: 'linear-gradient(145deg, #fffaf4 0%, #f7f0e8 100%)',
        boxShadow: [
          'inset 0 1px 0 rgba(255,255,255,.52)',
          'inset 0 0 76px rgba(92,61,42,.028)',
        ].join(', '),
        '--tile-x': '0px',
        '--tile-y': '0px',
      } as CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[4] rounded-[inherit]"
        style={{
          boxShadow: 'inset 0 0 44px rgba(84,53,35,.026), inset 0 0 1px rgba(84,53,35,.06)',
        }}
        aria-hidden="true"
      />
      <BubblePrototype />
    </div>
  );
}

function firstItem(groups: typeof LAB_BY_TECH): LabItem | null {
  for (const g of groups) {
    if (g.items.length) return g.items[0];
  }
  return null;
}

function getPreviews(item: LabItem) {
  if (!item.preview) return [];
  return Array.isArray(item.preview) ? item.preview : [item.preview];
}

function findLabItem(groups: typeof LAB_BY_TECH, id: string) {
  for (const group of groups) {
    const item = group.items.find((candidate) => candidate.id === id);
    if (item) return item;
  }
  return null;
}

export default function LabExperiments() {
  const all = LAB_BY_TECH;

  const initial = useMemo(() => firstItem(all), [all]);
  const [activeId, setActiveId] = useState<string>(initial?.id ?? '');
  const [view, setView] = useState<'brewing' | 'experiment'>('brewing');

  const active = useMemo(() => {
    for (const g of all) {
      const hit = g.items.find((x) => x.id === activeId);
      if (hit) return hit;
    }
    return initial;
  }, [activeId, all, initial]);

  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    const syncViewFromHash = () => {
      const hashId = decodeURIComponent(window.location.hash.slice(1));
      const hashItem = findLabItem(all, hashId);
      if (hashItem) {
        setActiveId(hashItem.id);
        setView('experiment');
        setPreviewIndex(0);
      } else if (!hashId) {
        setView('brewing');
      }
    };

    syncViewFromHash();
    window.addEventListener('hashchange', syncViewFromHash);
    window.addEventListener('popstate', syncViewFromHash);
    return () => {
      window.removeEventListener('hashchange', syncViewFromHash);
      window.removeEventListener('popstate', syncViewFromHash);
    };
  }, [all]);

  const showBrewing = () => {
    setView('brewing');
    setPreviewIndex(0);
    window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
  };

  const showExperiment = (item: LabItem) => {
    setView('experiment');
    setActiveId(item.id);
    setPreviewIndex(0);
    window.history.pushState(null, '', `#${encodeURIComponent(item.id)}`);
  };

  const previews = active ? getPreviews(active) : [];
  const preview = previews[previewIndex];
  const ActiveComponent = active?.component ? LAB_COMPONENTS[active.component] : null;

  function goPrev() {
    setPreviewIndex((i) => (i - 1 + previews.length) % previews.length);
  }

  function goNext() {
    setPreviewIndex((i) => (i + 1) % previews.length);
  }

  if (!active) return null;

  return (
      <div className="w-full grid grid-cols-1 pt-[4rem] md:pt-[6rem] md:grid-cols-[200px_1fr] md:gap-8 overflow-hidden">
        {/* left: list */}
        <aside className="lg:sticky h-fit border-b">
            <button
              type="button"
              onClick={showBrewing}
              className={`text-left transition-opacity hover:opacity-55 ${view === 'brewing' ? 'opacity-100' : 'opacity-65'}`}
            >
              [what&apos;s brewing ∘˙○˚.•]
            </button>
            <div className="flex flex-col gap-2 md:gap-4 max-h-28 shadow-[inset_0_-12px_15px_-12px_rgba(0,0,0,0.22)] md:max-h-[77.8svh] overflow-y-auto pr-1 pt-4">
              {all.map((group) => (
                <div key={group.tech} className="flex flex-col">
                  <h3>
                    {group.tech}
                  </h3>

                  <ul>
                    {group.items.map((item) => (
                      <li
                        className='cursor-pointer'
                        key={item.id}
                        id={item.id}
                        onClick={() => showExperiment(item)}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
        </aside>

        {/* right: content */}
        <main className="relative flex flex-col gap-4 pt-2">
          <div className="md:absolute -top-[4.8rem] left-0 z-[100] right-0 flex flex-row justify-between items-baseline">
            <div>
              <h2 className="text-2xl font-medium">{view === 'brewing' ? 'recent experiments' : active.name}</h2>
              {view === 'brewing' ? (
                <div className="mt-1 text-sm text-neutral-600">
                  hover to play · click to pop
                </div>
              ) : active.blurb ? (
                <div className="mt-1 text-sm text-neutral-600">{active.blurb}</div>
              ) : null}
            </div>
            
            {view !== 'brewing' && active.githubUrl ? (
              <a className="rounded-lg border bg-white/60 backdrop-blur px-3 py-1 text-sm" href={active.githubUrl} target="_blank" rel="noreferrer">
                <Image src='/icons/gh-logo.svg' alt='GitHub logo' width={16} height={16} className='inline-block'/>
              </a>
            ) : null}
          </div>

          {view === 'brewing' ? (
            <BrewingBubbles />
          ) : (
          <div className="rounded-xl border bg-white/60 backdrop-blur overflow-hidden">
            <div className="relative w-full h-[48svh] max-h-[50svh] md:h-auto md:max-h-[80svh] md:aspect-[16/9] bg-neutral-100 flex justify-center items-center overflow-hidden">
              {ActiveComponent ? (
                <ActiveComponent />
              ) : preview?.type === 'iframe' ? (
                <iframe
                  src={preview.src}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allow="microphone; camera; autoplay; clipboard-read; clipboard-write"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                />
              ) : preview?.type === 'video' ? (
                <video
                  src={preview.src}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  playsInline
                  controls
                  preload="metadata"
                />
              ) : preview?.type === 'image' ? (
                <MagnifierImage
                  src={preview.src}
                  alt={active.name}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">
                  add a preview for this experiment
                </div>
              )}

              {previews.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border bg-white/70 backdrop-blur px-3 py-2 text-sm"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border bg-white/70 backdrop-blur px-3 py-2 text-sm"
                  >
                    →
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs">
                    {previewIndex + 1} / {previews.length}
                  </div>
                </>
              )}
            </div>
          </div>
          )}
        </main>
      </div>
  );
}
