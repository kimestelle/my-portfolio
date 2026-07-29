'use client';

import { useEffect, useState, type ReactNode } from 'react';
import styles from './field-note-type-control.module.css';

const STORAGE_KEY = 'estelle-portfolio:field-notes-text-size';
const sizes = ['compact', 'standard', 'large'] as const;
type ReadingSize = (typeof sizes)[number];

const sizeLabels: Record<ReadingSize, string> = {
  compact: 'small text',
  standard: 'medium text',
  large: 'large text',
};

export default function FieldNoteTypeControl({
  children,
}: {
  children: ReactNode;
}) {
  const [size, setSize] = useState<ReadingSize>('standard');
  const sizeIndex = sizes.indexOf(size);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (sizes.includes(saved as ReadingSize)) {
        setSize(saved as ReadingSize);
      }
    } catch {
      // The larger default still works when storage is unavailable.
    }
  }, []);

  const updateSize = (nextIndex: number) => {
    const nextSize = sizes[nextIndex];
    if (!nextSize) return;

    setSize(nextSize);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextSize);
    } catch {
      // Keep the preference in memory for this visit.
    }
  };

  return (
    <div className={styles.scope} data-reading-size={size}>
      <div
        className={`${styles.control} glass-surface`}
        role="group"
        aria-label="Reading text size"
      >
        <button
          type="button"
          onClick={() => updateSize(sizeIndex - 1)}
          disabled={sizeIndex === 0}
          aria-label="Make reading text smaller"
        >
          −
        </button>
        <span className={styles.sample} aria-live="polite">
          <span aria-hidden="true">Aa</span>
          <span className={styles.srOnly}>{sizeLabels[size]}</span>
        </span>
        <button
          type="button"
          onClick={() => updateSize(sizeIndex + 1)}
          disabled={sizeIndex === sizes.length - 1}
          aria-label="Make reading text larger"
        >
          +
        </button>
      </div>
      {children}
    </div>
  );
}
