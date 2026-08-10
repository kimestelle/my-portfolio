'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import {
  HOP_CONTENT,
  HOP_SIZE_OPTIONS,
  type IntroPhase,
  type PerformanceStats,
  type PhotoFeedback,
  type SceneSize,
} from './hopContent';
import styles from './hop.module.css';

const SIZE_SELECTOR_INSET = 22;
const SIZE_SELECTOR_SPAN = 100 - SIZE_SELECTOR_INSET * 2;

type HopChromeProps = {
  chromeVisible: boolean;
  colorMode: boolean;
  debugVisible: boolean;
  introPhase: IntroPhase;
  loading: boolean;
  performanceStats: PerformanceStats;
  photoFeedback: PhotoFeedback;
  sceneSize: SceneSize;
  status: string;
  onCapture: () => void;
  onColorMode: () => void;
  onSceneSize: (size: SceneSize) => void;
};

function HopIntro({ phase }: { phase: IntroPhase }) {
  return (
    <section
      className={`${styles.introOverlay} ${
        phase === 'launching' ? styles.introOverlayLaunching : ''
      } ${phase === 'finished' ? styles.introOverlayHidden : ''}`}
      aria-hidden={phase !== 'holding'}
    >
      <div className={styles.introLockup}>
        <ShimmerText as="h1" className={styles.introTitle} priority={0}>
          {HOP_CONTENT.intro.title}
        </ShimmerText>
        <p className={styles.introSubtitle}>
          <ShimmerText as="span" priority={1}>
            {HOP_CONTENT.intro.subtitle}
          </ShimmerText>
          <Image
            className={styles.logo}
            src="/hoptimist-logo.svg"
            alt={HOP_CONTENT.intro.logoAlt}
            width={513}
            height={175}
            priority
          />
        </p>
      </div>
    </section>
  );
}

function HoptimistSilhouette({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 814 1229"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M687.997 816C690.206 816 691.997 817.791 691.997 820V853.995C691.997 855.072 691.564 856.103 690.791 856.853C669.115 877.86 644.625 896.848 618.716 912.663C617.578 913.358 616.854 914.569 616.79 915.9L606.225 1134.92C606.119 1137.11 607.818 1138.98 610.014 1139.12C678.41 1143.35 730.674 1159.86 731.092 1178.47V1193.92C730.628 1214.62 666.02 1229.97 586.787 1228.19C507.554 1226.42 443.699 1208.2 444.163 1187.49V1172.49C444.541 1155.66 487.277 1142.38 545.799 1138.94C548.008 1138.81 549.717 1136.93 549.601 1134.72L540.147 955.119C540.007 952.463 537.362 950.681 534.837 951.516C494.662 964.797 451.716 971.988 407.092 971.998H407C362.375 971.989 319.43 964.797 279.255 951.516C276.729 950.681 274.084 952.463 273.944 955.119L264.491 1134.72C264.375 1136.93 266.084 1138.81 268.293 1138.94C326.815 1142.38 369.551 1155.66 369.929 1172.49V1187.49C370.392 1208.2 306.537 1226.42 227.305 1228.19C148.072 1229.97 83.4638 1214.62 83 1193.92V1178.47C83.4174 1159.86 135.682 1143.35 204.078 1139.12C206.273 1138.98 207.973 1137.11 207.867 1134.92L197.302 915.9C197.238 914.569 196.514 913.358 195.376 912.663C169.466 896.848 144.977 877.86 123.301 856.853C122.528 856.103 122.095 855.072 122.095 853.995V820C122.095 817.791 123.886 816 126.095 816H687.997Z" />
      <path d="M670 772C675.523 772 680 776.477 680 782C680 787.523 675.523 792 670 792H144C138.477 792 134 787.523 134 782C134 776.477 138.477 772 144 772H670Z" />
      <path d="M670 730C675.523 730 680 734.477 680 740C680 745.523 675.523 750 670 750H144C138.477 750 134 745.523 134 740C134 734.477 138.477 730 144 730H670Z" />
      <path d="M424 0C426.209 0 428 1.79086 428 4V90.7305C428 92.8606 429.685 94.6162 431.812 94.7441C645.037 107.567 814 284.551 814 501C814 574.101 794.727 642.7 760.986 701.995C760.279 703.238 758.957 704 757.527 704H56.4727C55.0429 704 53.7208 703.238 53.0137 701.995C19.2731 642.7 0 574.101 0 501C0 284.887 168.44 108.116 381.198 94.8057C383.321 94.6729 385 92.9194 385 90.793V4C385 1.79086 386.791 0 389 0H424Z" />
    </svg>
  );
}

function HopSizeControl({
  colorMode,
  sceneSize,
  onSceneSize,
}: Pick<HopChromeProps, 'colorMode' | 'sceneSize' | 'onSceneSize'>) {
  const [dragPosition, setDragPosition] = useState<number | null>(null);
  const [pointerActive, setPointerActive] = useState(false);
  const scaleRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const pointerStartXRef = useRef(0);
  const pointerDraggedRef = useRef(false);
  const sizeIndex = HOP_SIZE_OPTIONS.findIndex(
    (option) => option.value === sceneSize,
  );
  const visualIndex = dragPosition ?? sizeIndex;
  const activeIndex = Math.round(visualIndex);
  const progress = visualIndex / (HOP_SIZE_OPTIONS.length - 1);

  const positionFromPointer = (clientX: number) => {
    const bounds = scaleRef.current?.getBoundingClientRect();
    if (!bounds) return sizeIndex;
    const trackInset = bounds.width * (SIZE_SELECTOR_INSET / 100);
    const trackWidth = bounds.width - trackInset * 2;
    const ratio = Math.min(
      1,
      Math.max(0, (clientX - bounds.left - trackInset) / trackWidth),
    );
    return ratio * (HOP_SIZE_OPTIONS.length - 1);
  };

  const commitSize = (nextIndex: number) => {
    const option = HOP_SIZE_OPTIONS[nextIndex];
    if (option) onSceneSize(option.value);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (colorMode) return;
    draggingRef.current = true;
    pointerStartXRef.current = event.clientX;
    pointerDraggedRef.current = false;
    setPointerActive(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || colorMode) return;
    if (
      !pointerDraggedRef.current
      && Math.abs(event.clientX - pointerStartXRef.current) < 4
    ) return;
    pointerDraggedRef.current = true;
    setDragPosition(positionFromPointer(event.clientX));
  };

  const finishPointerChange = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const nextIndex = Math.round(positionFromPointer(event.clientX));
    draggingRef.current = false;
    pointerDraggedRef.current = false;
    setPointerActive(false);
    commitSize(nextIndex);
    setDragPosition(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const cancelPointerChange = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    pointerDraggedRef.current = false;
    setPointerActive(false);
    setDragPosition(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (colorMode) return;
    let nextIndex = sizeIndex;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') nextIndex -= 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') nextIndex += 1;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = HOP_SIZE_OPTIONS.length - 1;
    else return;
    event.preventDefault();
    commitSize(Math.min(HOP_SIZE_OPTIONS.length - 1, Math.max(0, nextIndex)));
  };

  return (
    <div
      ref={scaleRef}
      className={`${styles.sizeSlider} ${
        dragPosition === null ? '' : styles.sizeSliderDragging
      } ${pointerActive ? styles.sizeSliderInteracting : ''} ${
        colorMode ? styles.sizeSliderDisabled : ''
      }`}
      style={{
        '--hop-size-position': `${
          SIZE_SELECTOR_INSET + progress * SIZE_SELECTOR_SPAN
        }%`,
        '--hop-size-scale': 0.54 + progress * 0.72,
      } as CSSProperties}
      role="slider"
      tabIndex={colorMode ? -1 : 0}
      aria-label={HOP_CONTENT.navigation.sizeGroupLabel}
      aria-valuemin={1}
      aria-valuemax={HOP_SIZE_OPTIONS.length}
      aria-valuenow={sizeIndex + 1}
      aria-valuetext={HOP_SIZE_OPTIONS[sizeIndex].label}
      aria-disabled={colorMode}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerChange}
      onPointerCancel={cancelPointerChange}
    >
      <span className={styles.sizeDots} aria-hidden="true">
        {HOP_SIZE_OPTIONS.map((option, index) => (
          <span
            key={option.value}
            className={`${styles.sizeDot} ${
              index === activeIndex ? styles.sizeDotActive : ''
            }`}
            style={{
              '--hop-dot-position': `${
                SIZE_SELECTOR_INSET
                + (index / (HOP_SIZE_OPTIONS.length - 1)) * SIZE_SELECTOR_SPAN
              }%`,
            } as CSSProperties}
          />
        ))}
      </span>
      <span className={styles.sizeThumb} aria-hidden="true">
        <HoptimistSilhouette className={styles.sizeThumbGlyph} />
      </span>
    </div>
  );
}

function HopNavigation({
  chromeVisible,
  colorMode,
  sceneSize,
  onAbout,
  onColorMode,
  onSceneSize,
}: Pick<HopChromeProps, 'chromeVisible' | 'colorMode' | 'sceneSize' | 'onColorMode' | 'onSceneSize'> & {
  onAbout: () => void;
}) {
  return (
    <nav
      className={`${styles.hopNav} ${chromeVisible ? styles.chromeVisible : ''}`}
      aria-label={HOP_CONTENT.navigation.label}
    >
      <span className={`glass-surface ui-radius-pill ${styles.navShell}`} aria-hidden="true" />
      <Link
        className={styles.portfolioLink}
        href="/"
        aria-label={HOP_CONTENT.navigation.portfolioAriaLabel}
      >
        <span aria-hidden="true">←</span>
        {HOP_CONTENT.navigation.portfolioLabel}
      </Link>
      <span className={styles.navDivider} aria-hidden="true" />
      <button
        className={styles.navTitle}
        type="button"
        onClick={onAbout}
        aria-label={HOP_CONTENT.navigation.aboutAriaLabel}
      >
        {HOP_CONTENT.navigation.title}
      </button>
      <HopSizeControl
        colorMode={colorMode}
        sceneSize={sceneSize}
        onSceneSize={onSceneSize}
      />
      <button
        className={`${styles.colorButton} ${colorMode ? styles.colorButtonActive : ''}`}
        type="button"
        onClick={onColorMode}
        aria-label={
          colorMode
            ? HOP_CONTENT.navigation.closeColorLabel
            : HOP_CONTENT.navigation.openColorLabel
        }
        aria-pressed={colorMode}
      >
        <span className={styles.colorIcon} aria-hidden="true">
          <span className={styles.colorWheelGlyph} />
          <svg
            className={styles.returnGlyph}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 3H3V7M13 3H17V7M17 13V17H13M7 17H3V13" />
            <circle cx="10" cy="10" r="2.25" />
          </svg>
        </span>
      </button>
    </nav>
  );
}

function HopAboutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className={styles.aboutOverlay}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`glass-surface ui-radius-panel ${styles.aboutCard}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hop-about-title"
      >
        <button
          ref={closeRef}
          className={styles.aboutClose}
          type="button"
          onClick={onClose}
          aria-label={HOP_CONTENT.about.closeLabel}
        >
          <span aria-hidden="true">×</span>
        </button>
        <h2 id="hop-about-title" className={styles.aboutTitle}>
          {HOP_CONTENT.about.title}
        </h2>
        <p className={styles.aboutBody}>{HOP_CONTENT.about.body}</p>
        <div className={styles.aboutCredit}>
          <span>{HOP_CONTENT.about.creditPrefix}</span>
          <Image
            className={styles.aboutLogo}
            src="/hoptimist-logo.svg"
            alt={HOP_CONTENT.about.creditLogoAlt}
            width={513}
            height={175}
          />
        </div>
      </section>
    </div>
  );
}

function PhotoControl({
  chromeVisible,
  loading,
  photoFeedback,
  onCapture,
}: Pick<
  HopChromeProps,
  'chromeVisible' | 'loading' | 'photoFeedback' | 'onCapture'
>) {
  return (
    <button
      className={`${styles.photoHint} ${chromeVisible ? styles.chromeVisible : ''} ${
        photoFeedback === 'saved' ? styles.photoHintSaved : ''
      }`}
      type="button"
      onClick={onCapture}
      disabled={loading || photoFeedback === 'capturing'}
      aria-label={HOP_CONTENT.photo.ariaLabel}
    >
      <kbd className={styles.spacebarKey} aria-hidden="true">
        <span />
      </kbd>
      <svg
        className={styles.cameraGlyph}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path d="M8.4 6.5 9.5 4.8h5l1.1 1.7h2.9a2 2 0 0 1 2 2v8.7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h2.9Z" />
        <circle cx="12" cy="12.7" r="3.4" />
      </svg>
      <span className={styles.photoLabel}>{HOP_CONTENT.photo[photoFeedback]}</span>
    </button>
  );
}

function PerformanceHud({ stats }: { stats: PerformanceStats }) {
  return (
    <output className={styles.performanceHud} aria-label={HOP_CONTENT.performance.label}>
      <span>{stats.fps.toFixed(0)} fps</span>
      <span>{stats.frameMs.toFixed(1)} ms</span>
      <span>{stats.drawCalls} calls</span>
      <span>{Math.round(stats.triangles / 1000)}k tris</span>
      <small>{HOP_CONTENT.performance.hideHint}</small>
    </output>
  );
}

export default function HopChrome({
  chromeVisible,
  colorMode,
  debugVisible,
  introPhase,
  loading,
  performanceStats,
  photoFeedback,
  sceneSize,
  status,
  onCapture,
  onColorMode,
  onSceneSize,
}: HopChromeProps) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const openAbout = useCallback(() => setAboutOpen(true), []);
  const closeAbout = useCallback(() => setAboutOpen(false), []);

  return (
    <>
      <HopIntro phase={introPhase} />
      <HopNavigation
        chromeVisible={chromeVisible}
        colorMode={colorMode}
        sceneSize={sceneSize}
        onAbout={openAbout}
        onColorMode={onColorMode}
        onSceneSize={onSceneSize}
      />
      <HopAboutModal open={aboutOpen} onClose={closeAbout} />
      <PhotoControl
        chromeVisible={chromeVisible}
        loading={loading}
        photoFeedback={photoFeedback}
        onCapture={onCapture}
      />
      <p className={styles.status} aria-live="polite">
        {status}
      </p>
      {debugVisible && <PerformanceHud stats={performanceStats} />}
    </>
  );
}
