'use client';
import { useEffect, useRef, useState } from 'react';

export default function CoverCarousel() {
  const panels = [
    {
      title: 'I build',
      items: [
        'WebGL/WebGPU + frontend UI',
        'Full-stack websites & apps',
        'Pixel-perfect graphics that run on mobile',
      ],
    },
    {
      title: 'I work with',
      items: [
        'Modern web: TS/JS, React',
        'Graphics & shader programming',
        'APIs, databases, client-side storage',
      ],
    },
    {
      title: "I'm looking for",
      items: [
        'Interactive / Design-Eng roles',
        'Studios, startups, or product teams',
        'Internships or part-time work',
      ],
    },
  ];

  const [i, setI] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const prefersReduced = typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const start = () => {
    if (prefersReduced) return;
    stop();
    intervalRef.current = window.setInterval(() => {
      setI((v) => (v + 1) % panels.length);
    }, 5000);
  };
  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const advancePanel = () => {
    setI((v) => (v + 1) % panels.length);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="md:hidden w-full max-w-2xl mx-auto"
      onMouseEnter={stop}
      onMouseLeave={start}
      onTouchStart={stop}
      onTouchEnd={start}
      aria-roledescription="carousel"
      aria-label="About panels"
    >
        <div className="mb-3 flex items-center justify-start gap-2">
            {panels.map((_, idx) => (
            <button
                key={idx}
                aria-label={`Show panel ${idx + 1}`}
                aria-current={i === idx}
                onClick={() => setI(idx)}
                className={[
                'h-0.5 w-2 transition-all duration-300 ease-out',
                i === idx ? 'bg-neutral-900 w-6' : 'bg-neutral-300 hover:bg-neutral-400'
                ].join(' ')}
            />
            ))}
        </div>
        {/* Panel */}
        <div
            key={i}
            className="relative group cursor-pointer select-none transition-all duration-300"
            onClick={advancePanel}
        >
            <h3>{panels[i].title}...</h3>
            <ul className="list-disc list-inside">
            {panels[i].items.map((t) => (
                <li key={t}>{t}</li>
            ))}
            </ul>
        </div>
    </div>
  );
}
