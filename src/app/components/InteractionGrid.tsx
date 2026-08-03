'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { InteractionStudy } from '../playground/components/studyData';
import styles from './interaction-grid.module.css';

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';
const MODAL_CLOSE_DURATION = 420;

function StudyMedia({
  study,
  playing,
}: {
  study: InteractionStudy;
  playing: boolean;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [entered, setEntered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!study.video) return;
    const media = mediaRef.current;
    if (!media || typeof IntersectionObserver === 'undefined') {
      setEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setEntered(true);
      },
      { rootMargin: '80px 0px', threshold: 0.08 },
    );

    observer.observe(media);
    return () => observer.disconnect();
  }, [study.video]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      // Calling play initiates loading on mobile browsers that do not emit
      // canplay for metadata-only video until playback has been requested.
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [entered, playing]);

  return (
    <div ref={mediaRef} className={styles.media}>
      <Image
        src={study.image}
        alt={study.imageAlt}
        fill
        sizes="(max-width: 767px) 100vw, 33vw"
        className={`${styles.poster} ${videoReady && playing ? styles.posterHidden : ''}`}
      />
      {study.video && entered ? (
        <video
          ref={videoRef}
          src={study.video}
          className={`${styles.video} ${videoReady && playing ? styles.videoReady : ''} ${study.videoFit === 'contain' ? styles.contain : ''}`}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={study.imageAlt}
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          onPlaying={() => setVideoReady(true)}
        />
      ) : null}
    </div>
  );
}

function StudyActions({ study }: { study: InteractionStudy }) {
  if (!study.deepDiveUrl && !study.liveUrl && !study.githubUrl) return null;

  return (
    <div className={styles.actions}>
      {study.deepDiveUrl ? <a href={study.deepDiveUrl}>case study →</a> : null}
      {study.liveUrl ? <a href={study.liveUrl} target="_blank" rel="noreferrer">try it ↗</a> : null}
      {study.githubUrl ? <a href={study.githubUrl} target="_blank" rel="noreferrer">source ↗</a> : null}
    </div>
  );
}

export default function InteractionGrid({
  studies,
  headingLevel = 4,
  ariaLabel = 'Interaction snippets',
}: {
  studies: InteractionStudy[];
  headingLevel?: 3 | 4;
  ariaLabel?: string;
}) {
  const gridRef = useRef<HTMLOListElement>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileActiveStudy, setMobileActiveStudy] = useState<string | null>(null);
  const [hoveredStudy, setHoveredStudy] = useState<string | null>(null);
  const [activeStudy, setActiveStudy] = useState<InteractionStudy | null>(null);
  const [modalClosing, setModalClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const finishModalClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
    } else {
      setActiveStudy(null);
      setModalClosing(false);
    }
  }, []);

  const requestModalClose = useCallback(() => {
    if (modalClosing) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishModalClose();
      return;
    }

    setModalClosing(true);
    closeTimerRef.current = window.setTimeout(
      finishModalClose,
      MODAL_CLOSE_DURATION,
    );
  }, [finishModalClose, modalClosing]);

  const openStudy = useCallback((
    study: InteractionStudy,
    opener: HTMLButtonElement,
  ) => {
    openerRef.current = opener;
    setModalClosing(false);
    setActiveStudy(study);
  }, []);

  useEffect(() => {
    if (!activeStudy) return;

    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
  }, [activeStudy]);

  useEffect(() => {
    if (!activeStudy) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeStudy]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    let frame = 0;

    const updateActiveStudy = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextMobile = mediaQuery.matches;
        setMobile(nextMobile);
        if (!nextMobile) {
          setMobileActiveStudy(null);
          return;
        }

        const viewportCenter = window.innerHeight / 2;
        const cards = gridRef.current?.querySelectorAll<HTMLElement>('[data-video-study]');
        let closestId: string | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        cards?.forEach((card) => {
          const bounds = card.getBoundingClientRect();
          if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
          const cardCenter = bounds.top + bounds.height / 2;
          const distance = Math.abs(cardCenter - viewportCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestId = card.dataset.videoStudy ?? null;
          }
        });

        setMobileActiveStudy(closestId);
      });
    };

    updateActiveStudy();
    window.addEventListener('scroll', updateActiveStudy, { passive: true });
    window.addEventListener('resize', updateActiveStudy);
    window.visualViewport?.addEventListener('scroll', updateActiveStudy, { passive: true });
    window.visualViewport?.addEventListener('resize', updateActiveStudy);
    mediaQuery.addEventListener('change', updateActiveStudy);

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateActiveStudy);
    if (gridRef.current) resizeObserver?.observe(gridRef.current);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateActiveStudy);
      window.removeEventListener('resize', updateActiveStudy);
      window.visualViewport?.removeEventListener('scroll', updateActiveStudy);
      window.visualViewport?.removeEventListener('resize', updateActiveStudy);
      mediaQuery.removeEventListener('change', updateActiveStudy);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <>
      <ol ref={gridRef} className={styles.grid} aria-label={ariaLabel}>
        {studies.map((study) => (
          <li
            className={styles.card}
            id={study.id}
            key={study.id}
            data-video-study={study.video ? study.id : undefined}
            onMouseEnter={() => setHoveredStudy(study.id)}
            onMouseLeave={() => setHoveredStudy((current) => current === study.id ? null : current)}
          >
            <button
              className={styles.mediaButton}
              type="button"
              aria-label={`Expand ${study.name} interaction`}
              onClick={(event) => openStudy(study, event.currentTarget)}
            >
              <StudyMedia
                study={study}
                playing={!activeStudy && (mobile
                  ? mobileActiveStudy === study.id
                  : hoveredStudy === study.id)}
              />
            </button>
            <div className={styles.copy}>
              {headingLevel === 3 ? (
                <h3 className={styles.name}>{study.name}</h3>
              ) : (
                <h4 className={styles.name}>{study.name}</h4>
              )}
              <p className={styles.meta}>
                {study.category} · <time dateTime={study.dateTime}>{study.date}</time>
                {study.collaboration ? ` · ${study.collaboration}` : null}
              </p>
              <p className={styles.explores}>{study.explores}</p>
              {study.recognition ? <p className={styles.recognition}>✦ {study.recognition}</p> : null}
              <StudyActions study={study} />
            </div>
          </li>
        ))}
      </ol>

      {activeStudy ? (
        <dialog
          ref={dialogRef}
          className={styles.modal}
          data-closing={modalClosing ? 'true' : 'false'}
          aria-label={`${activeStudy.name} interaction preview`}
          onCancel={(event) => {
            event.preventDefault();
            requestModalClose();
          }}
          onClose={() => {
            setActiveStudy(null);
            setModalClosing(false);
            window.requestAnimationFrame(() => {
              openerRef.current?.focus();
              openerRef.current = null;
            });
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) requestModalClose();
          }}
        >
          <div className={styles.modalFrame}>
            {activeStudy.video ? (
              <video
                className={styles.modalMedia}
                src={activeStudy.video}
                poster={activeStudy.image}
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                aria-label={activeStudy.imageAlt}
              />
            ) : (
              <Image
                src={activeStudy.image}
                alt={activeStudy.imageAlt}
                fill
                sizes="96vw"
                className={styles.modalMedia}
              />
            )}
            <button
              className={styles.modalClose}
              type="button"
              aria-label="Close interaction preview"
              onClick={requestModalClose}
              autoFocus
            >
              ×
            </button>
          </div>
        </dialog>
      ) : null}
    </>
  );
}
