'use client';

import { useId, useState, type ReactNode } from 'react';
import styles from '../field-notes.module.css';

export function FieldNoteDisclosure({
  title,
  preview,
  children,
  defaultOpen = false,
}: {
  title: string;
  preview: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const disclosureId = useId();
  const contentId = `${disclosureId}-content`;
  const headingId = `${disclosureId}-heading`;

  return (
    <section
      className={`${styles.disclosure} ${
        isOpen ? styles.disclosureOpen : ''
      }`}
    >
      <h2 id={headingId} className={styles.disclosureHeading}>
        <button
          type="button"
          className={styles.disclosureButton}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className={styles.disclosureLabel}>
            <span className="star-glyph-section" aria-hidden="true">
              ✶
            </span>
            <span className="star-copy-section">{title}</span>
          </span>
          <span className={styles.disclosurePreview}>{preview}</span>
          <span className={styles.disclosureToggle} aria-hidden="true">
            {isOpen ? '−' : '+'}
          </span>
        </button>
      </h2>

      <div
        id={contentId}
        className={styles.disclosureBody}
        role="region"
        aria-labelledby={headingId}
        aria-hidden={!isOpen}
      >
        <div className={styles.disclosureClip}>
          <div className={styles.disclosureContent}>{children}</div>
        </div>
      </div>
    </section>
  );
}
