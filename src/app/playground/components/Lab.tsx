'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { LAB_BY_TECH, type LabItem } from './labData';
import BubblePrototype from './BubblePrototype';
import MagnifierImage from './MagnifierImage';

function BrewingBubbles() {
  return (
    <div
      className="playground-gradient relative h-[48svh] max-h-[50svh] overflow-hidden rounded-xl border bg-white/60 backdrop-blur md:h-auto md:max-h-[80svh] md:aspect-[16/9]"
      style={{
        backgroundImage: [
          'radial-gradient(circle 500px at 28% 20%, rgba(122,87,153,.34), transparent 68%)',
          'radial-gradient(circle 460px at 72% 42%, rgba(240,133,71,.3), transparent 68%)',
          'radial-gradient(circle 440px at 45% 84%, rgba(92,179,163,.28), transparent 68%)',
        ].join(', '),
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{ background: "url('/textures/sandpaper.png') 0 0 / 60px 60px repeat" }}
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

export default function LabExperiments() {
  const all = LAB_BY_TECH;

  const initial = useMemo(() => firstItem(all), [all]);
  const [activeId, setActiveId] = useState<string>(initial?.id ?? '');
  const [view, setView] = useState<'brewing' | 'experiment'>('experiment');

  const active = useMemo(() => {
    for (const g of all) {
      const hit = g.items.find((x) => x.id === activeId);
      if (hit) return hit;
    }
    return initial;
  }, [activeId, all, initial]);

  const [previewIndex, setPreviewIndex] = useState(0);

  const previews = active ? getPreviews(active) : [];
  const preview = previews[previewIndex];

  function goPrev() {
    setPreviewIndex((i) => (i - 1 + previews.length) % previews.length);
  }

  function goNext() {
    setPreviewIndex((i) => (i + 1) % previews.length);
  }

  if (!active) return null;

  return (
      <div className="w-full grid grid-cols-1 pt-[6rem] md:grid-cols-[200px_1fr] md:gap-8 overflow-hidden">
        {/* left: list */}
        <aside className="lg:sticky h-fit border-b">
            <button
              type="button"
              onClick={() => setView('brewing')}
              className={`text-left transition-opacity hover:opacity-55 ${view === 'brewing' ? 'opacity-100' : 'opacity-65'}`}
            >
              [what&apos;s brewing ∘˙○˚.•]
            </button>
            <div className="flex flex-col gap-2 md:gap-4 max-h-32 md:max-h-[70vh] overflow-y-auto pr-1 pt-4">
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
                        onClick={() => {
                          setView('experiment');
                          setActiveId(item.id);
                          setPreviewIndex(0);
                        }}
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
          <div className="md:absolute -top-[4.2rem] left-0 z-[100] right-0 flex flex-row justify-between items-baseline">
            <div>
              <h2 className="text-2xl font-medium">{view === 'brewing' ? 'what’s brewing' : active.name}</h2>
              {view === 'brewing' ? (
                <div className="mt-1 text-sm text-neutral-600">click the field to release more · click a bubble to watch</div>
              ) : active.blurb ? (
                <div className="mt-1 text-sm text-neutral-600">{active.blurb}</div>
              ) : null}
            </div>
            
            {
                view === 'experiment' && active.githubUrl &&
              <a className="rounded-lg border bg-white/60 backdrop-blur px-3 py-1 text-sm" href={active.githubUrl} target="_blank" rel="noreferrer">
                <Image src='/icons/gh-logo.svg' alt='GitHub logo' width={16} height={16} className='inline-block'/>
              </a>
            }
          </div>

          {view === 'brewing' ? (
            <BrewingBubbles />
          ) : (
          <div className="rounded-xl border bg-white/60 backdrop-blur overflow-hidden">
            <div className="relative w-full h-[48svh] max-h-[50svh] md:h-auto md:max-h-[80svh] md:aspect-[16/9] bg-neutral-100 flex justify-center items-center overflow-hidden">
              {preview?.type === 'iframe' ? (
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
