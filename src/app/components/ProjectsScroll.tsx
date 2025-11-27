'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { projects } from './Projects';

type ProjectsScrollSectionProps = {
  onActiveChange?: (active: boolean) => void;
};

export default function ProjectsScrollSection({ onActiveChange }: ProjectsScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // one ref per card so we can observe them
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollActive, setScrollActive] = useState(false);

  // track vertical scroll across the section for cardHeight
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // observe sentinel to set navbar hidden / wheel "active" state
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const stuck = !entry.isIntersecting;
        setScrollActive(stuck);
        onActiveChange?.(stuck);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onActiveChange]);

  // cards grow height with scroll
  const cardHeight = useTransform(scrollYProgress, [0, 1], ['40vh', '100vh']);

  // scroll when hover
  const handleHoverThumb = (index: number) => {
    setActiveIndex(index);

    const el = cardRefs.current[index];
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  useEffect(() => {
    const currentIndexRef = { current: activeIndex };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idxAttr = (entry.target as HTMLElement).dataset.cardIndex;
          if (idxAttr == null) return;
          const idx = Number(idxAttr);

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            if (currentIndexRef.current !== idx) {
              currentIndexRef.current = idx;
              setActiveIndex(idx);
            }
          }
        });
      },
      {
        root: null, // viewport
        threshold: [0.3, 0.6, 0.9],
        rootMargin: '-10% 0px -10% 0px', // shrink the visible band a bit
      }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeIndex]);


  // wheel layout
  const stepDeg = 26;
  const radius = 220;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-full snap-start"
    >
      <div className="flex flex-col">
        {/* sentinel for sticky detection */}
        <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

        {/* sticky wheel */}
        <div className="sticky z-[10] top-0 h-32 flex items-center justify-center border-b border-dotted border-black/20">
            <div
                className="relative w-[360px] h-20 flex items-center justify-center overflow-visible"
                style={{ perspective: '900px' }}
            >
                {scrollActive &&
                <div className="absolute bg-black w-2 h-2 left-1/2 bottom-0 -translate-x-1 translate-y-2 rounded-full shadow-lg"/>
                }
                <div
                className="relative w-full h-full"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: scrollActive ? `translateZ(-${radius}px)` : '',
                }}
                >
                {!scrollActive &&
                // arrow gradient
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-16 rounded-full bg-gradient-to-b from-black/0 via-black/20 to-black/40 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-b-8 border-b-black"/>
                </div>
                }
                {projects.map((project, index) => {
                    const rel = index - activeIndex;
                    const angle = rel * stepDeg;
                    const isActive = index === activeIndex;

                    return (
                    <button
                        key={project.name}
                        type="button"
                        onMouseEnter={() => handleHoverThumb(index)}
                        className="absolute left-1/2 top-1/2 w-12 h-16 rounded-full overflow-hidden"
                        style={{
                        transform: `
                            rotateY(${scrollActive ? angle : 0}deg)
                            translateZ(${scrollActive ? radius : 0}px)
                            translate(-50%, -50%)
                        `,
                        transformStyle: 'preserve-3d',
                        opacity: Math.abs(rel) > 5 ? 0 : 1,
                        filter: isActive ? 'brightness(1.1)' : 'brightness(0.8)',
                        boxShadow: isActive
                            ? '0 0 16px rgba(255,255,255,0.6)'
                            : '0 0 8px rgba(0,0,0,0.1)',
                        transition:
                            'transform 320ms ease, opacity 200ms ease, filter 200ms ease, box-shadow 200ms ease',
                        }}
                    >
                        <Image
                        src={project.cover}
                        alt={project.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        />
                    </button>
                    );
                })}
                </div>
            </div>
        </div>

        {/* scrolling cards */}
        <motion.div
          style={{ height: cardHeight }}
          className="flex-1 flex items-center justify-center overflow-hidden"
        >
          <div className="relative w-full h-full">
            <div className="flex flex-col min-h-full">
              {projects.map((project, index) => (
                <div
                  key={project.name}
                  data-card-index={index}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="snap-center shrink-0 w-full h-full flex items-center justify-center px-6 py-8"
                >
                  <motion.div
                    className="w-full max-w-4xl h-[100%] gap-5 p-5 md:p-10 overflow-hidden flex flex-col md:flex-row"
                    animate={{
                      scale: index === activeIndex ? 1 : 0.96,
                      opacity: index === activeIndex ? 1 : 0.7,
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                  >
                    <div className="relative w-full md:w-1/2 aspect-[3/2] rounded-md overflow-hidden">
                      <Image
                        src={project.cover}
                        alt={project.name}
                        width={800}
                        height={600}
                      />
                    </div>

                    <div className="w-full h-1/2 md:w-1/2 md:h-full flex md:p-6 pt-0 overflow-y-scroll scrollbar-hide">
                      <div>
                        <h2 className="text-xl font-medium mb-2">
                          {project.name}
                           {project.url && (
                            <span>
                            <a
                            href={project.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs ml-2 mb-2 text-red-500 uppercase tracking-wide hover:bg-white hover:text-black transition-colors"
                            >
                            View project
                            </a>
                            </span>
                        )}
                        </h2>

                        {project.techStack && (
                          <div className="flex flex-wrap gap-1 mb-4 text-xs text-neutral-850">
                            {project.techStack.databases.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-full shadow-inner bg-neutral-100"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.techStack.frameworks.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-full shadow-inner bg-neutral-100"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.techStack.languages.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-full shadow-inner bg-neutral-100"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.techStack.libraries.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-full shadow-inner bg-neutral-100"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.techStack.platforms.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-full shadow-inner bg-neutral-100"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.description && (
                          <p className="text-sm text-neutral-850 split-line leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
