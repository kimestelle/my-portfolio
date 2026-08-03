import Image from 'next/image';
import styles from './tally-cover.module.css';

export default function TallyCover({
  animated = false,
  compact = false,
  className = '',
}: {
  animated?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${styles.cover} ${compact ? styles.compact : ''} ${className}`}
      aria-label="Tally mobile product states from contract setup through activation"
    >
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.identity} aria-hidden="true">
        <span>commitment / proof / consequence</span>
        <strong>tally.</strong>
      </div>

      <div className={styles.phoneCluster} aria-hidden="true">
        <div className={`${styles.phone} ${styles.phoneLeft}`}>
          <Image
            src="/project-images/tally/demo/configure.png"
            alt=""
            fill
            sizes={compact ? '6rem' : '(max-width: 720px) 24vw, 16rem'}
            className={styles.phoneMedia}
          />
        </div>

        <div className={`${styles.phone} ${styles.phoneCenter}`}>
          <Image
            src="/project-images/tally/demo/personalized.png"
            alt=""
            fill
            priority
            sizes={compact ? '7rem' : '(max-width: 720px) 34vw, 22rem'}
            className={styles.phoneMedia}
          />
          {animated ? (
            <video
              className={styles.coverVideo}
              src="/project-images/tally/demo/personalize-and-activate.m4v"
              poster="/project-images/tally/demo/personalized.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : null}
        </div>

        <div className={`${styles.phone} ${styles.phoneRight}`}>
          <Image
            src="/project-images/tally/demo/contract-ready.png"
            alt=""
            fill
            sizes={compact ? '6rem' : '(max-width: 720px) 24vw, 16rem'}
            className={styles.phoneMedia}
          />
        </div>
      </div>

      <div className={styles.stateRail} aria-hidden="true">
        <span>01 / configure</span>
        <span>02 / stake</span>
        <span>03 / activate</span>
      </div>
    </div>
  );
}
