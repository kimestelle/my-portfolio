'use client';

import type { MouseEvent, ReactNode } from 'react';
import styles from './field-note-primitives.module.css';

const MOTION_CURVE = [0.22, 0.7, 0.25, 1] as const;

function cubicBezierAt(progress: number) {
  const [x1, y1, x2, y2] = MOTION_CURVE;
  const curve = (time: number, point1: number, point2: number) => {
    const inverse = 1 - time;
    return (
      3 * inverse * inverse * time * point1 +
      3 * inverse * time * time * point2 +
      time * time * time
    );
  };
  const slope = (time: number, point1: number, point2: number) => {
    const inverse = 1 - time;
    return (
      3 * inverse * inverse * point1 +
      6 * inverse * time * (point2 - point1) +
      3 * time * time * (1 - point2)
    );
  };

  let time = progress;
  for (let iteration = 0; iteration < 5; iteration += 1) {
    const currentX = curve(time, x1, x2) - progress;
    const currentSlope = slope(time, x1, x2);
    if (Math.abs(currentSlope) < 0.0001) break;
    time = Math.min(1, Math.max(0, time - currentX / currentSlope));
  }

  return curve(time, y1, y2);
}

export default function FieldNoteScrollLink({
  href,
  children,
}: {
  href: `#${string}`;
  children: ReactNode;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    event.preventDefault();

    const start = window.scrollY;
    const scrollMargin = Number.parseFloat(
      window.getComputedStyle(target).scrollMarginTop,
    );
    const destination = Math.max(
      0,
      target.getBoundingClientRect().top +
        start -
        (Number.isFinite(scrollMargin) ? scrollMargin : 0),
    );
    const distance = destination - start;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, destination);
      window.history.replaceState(null, '', href);
      return;
    }

    const duration = Math.min(700, Math.max(420, Math.abs(distance) * 0.32));
    const startedAt = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      window.scrollTo(0, start + distance * cubicBezierAt(progress));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        window.history.replaceState(null, '', href);
      }
    };

    window.requestAnimationFrame(step);
  };

  return (
    <a className={styles.scrollLink} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
