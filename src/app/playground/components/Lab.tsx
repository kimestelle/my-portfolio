'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { LAB_BY_TECH, type LabItem } from './labData';
import MagnifierImage from './MagnifierImage';

function firstItem(groups: typeof LAB_BY_TECH): LabItem | null {
  for (const g of groups) {
    if (g.items.length) return g.items[0];
  }
  return null;
}

export default function LabExperiments() {
  const all = LAB_BY_TECH;

  const initial = useMemo(() => firstItem(all), [all]);
  const [activeId, setActiveId] = useState<string>(initial?.id ?? '');

  const active = useMemo(() => {
    for (const g of all) {
      const hit = g.items.find((x) => x.id === activeId);
      if (hit) return hit;
    }
    return initial;
  }, [activeId, all, initial]);

  if (!active) return null;

  return (
      <div className="w-full grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
        {/* left: list */}
        <aside className="lg:sticky lg:top-24 h-fit glass-card">
            <span>[what&apos;s brewing ∘˙○˚.•]</span>
            <div className="flex flex-col gap-4 max-h-32 md:max-h-[70vh] overflow-y-auto pr-1 pt-4">
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
                        onClick={() => setActiveId(item.id)}
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
        <main className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-baseline">
            <div>
              <h2 className="text-2xl font-medium">{active.name}</h2>
              {active.blurb ? <div className="mt-1 text-sm text-neutral-600">{active.blurb}</div> : null}
            </div>
            
            {
                active.githubUrl &&
              <a className="rounded-lg border bg-white/60 backdrop-blur px-3 py-1 text-sm" href={active.githubUrl} target="_blank" rel="noreferrer">
                <Image src='/icons/gh-logo.svg' alt='GitHub logo' width={16} height={16} className='inline-block'/>
              </a>
            }
          </div>

          <div className="rounded-xl border bg-white/60 backdrop-blur overflow-hidden">
            <div className="relative w-full aspect-[9/16] md:aspect-[16/9] bg-neutral-100 flex justify-center items-center overflow-hidden">
              {active.preview?.type === 'iframe' ? (
                <iframe
                  src={active.preview.src}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allow="microphone; camera; autoplay; clipboard-read; clipboard-write"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                />
              ) : active.preview?.type === 'video' ? (
                <video
                  src={active.preview.src}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  playsInline
                  controls
                  preload="metadata"
                />
              ) : active.preview?.type === 'image' ? (
                <MagnifierImage
                  src={active.preview.src}
                  alt={active.name}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">
                  add a preview for this experiment
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
  );
}
