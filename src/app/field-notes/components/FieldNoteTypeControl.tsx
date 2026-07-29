'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import styles from './field-note-type-control.module.css';

const STORAGE_KEY = 'estelle-portfolio:field-notes-text-size';
const sizes = [
  'compact',
  'small',
  'standard',
  'large',
  'extra-large',
] as const;
type ReadingSize = (typeof sizes)[number];
let sessionReadingSize: ReadingSize | null = null;

const sizeLabels: Record<ReadingSize, string> = {
  compact: 'compact text',
  small: 'small text',
  standard: 'standard text',
  large: 'large text',
  'extra-large': 'extra-large text',
};

export default function FieldNoteTypeControl({
  children,
}: {
  children: ReactNode;
}) {
  const [size, setSize] = useState<ReadingSize>(
    sessionReadingSize ?? 'standard',
  );
  const [dragPosition, setDragPosition] = useState<number | null>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const sizeIndex = sizes.indexOf(size);
  const visualIndex = dragPosition ?? sizeIndex;
  const activeIndex = Math.round(visualIndex);
  const position = `${(visualIndex / (sizes.length - 1)) * 100}%`;

  useEffect(() => {
    if (sessionReadingSize) return;

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (sizes.includes(saved as ReadingSize)) {
        sessionReadingSize = saved as ReadingSize;
        setSize(sessionReadingSize);
      } else {
        sessionReadingSize = 'standard';
      }
    } catch {
      // The larger default still works when storage is unavailable.
      sessionReadingSize = 'standard';
    }
  }, []);

  const updateSize = (nextIndex: number) => {
    const nextSize = sizes[nextIndex];
    if (!nextSize) return;

    sessionReadingSize = nextSize;
    setSize(nextSize);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextSize);
    } catch {
      // Keep the preference in memory for this visit.
    }
  };

  const positionFromPointer = (clientX: number) => {
    const bounds = scaleRef.current?.getBoundingClientRect();
    if (!bounds) return sizeIndex;

    const ratio = Math.min(
      1,
      Math.max(0, (clientX - bounds.left) / bounds.width),
    );
    return ratio * (sizes.length - 1);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragPosition(positionFromPointer(event.clientX));
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    setDragPosition(positionFromPointer(event.clientX));
  };

  const finishPointerChange = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;

    const nextIndex = Math.round(positionFromPointer(event.clientX));
    draggingRef.current = false;
    updateSize(nextIndex);
    setDragPosition(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const cancelPointerChange = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    setDragPosition(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextIndex = sizeIndex;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      nextIndex -= 1;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      nextIndex += 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = sizes.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    updateSize(Math.min(sizes.length - 1, Math.max(0, nextIndex)));
  };

  return (
    <div className={styles.scope} data-reading-size={size}>
      <div
        className={styles.control}
        aria-label="Reading controls"
      >
        <div
          ref={scaleRef}
          className={`${styles.scale} ${
            dragPosition === null ? '' : styles.dragging
          }`}
          style={{ '--reading-position': position } as CSSProperties}
          role="slider"
          tabIndex={0}
          aria-label="Reading text size"
          aria-valuemin={1}
          aria-valuemax={sizes.length}
          aria-valuenow={sizeIndex + 1}
          aria-valuetext={sizeLabels[size]}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointerChange}
          onPointerCancel={cancelPointerChange}
        >
          <span className={styles.rail} aria-hidden="true" />
          <span className={styles.dots} aria-hidden="true">
            {sizes.map((item, index) => (
              <span
                key={item}
                className={`${styles.dot} ${
                  index === activeIndex ? styles.activeDot : ''
                }`}
              />
            ))}
          </span>
          <span className={styles.thumb} aria-hidden="true">
            Aa
          </span>
          <span className={styles.srOnly} aria-live="polite">
            {sizeLabels[size]}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
