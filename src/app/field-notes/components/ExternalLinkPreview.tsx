'use client';

import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './external-link-preview.module.css';

type Preview = {
  frameHref: string | null;
  href: string;
  host: string;
  label: string;
};

const CLOSE_DURATION = 150;

function getFrameHref(url: URL) {
  if (
    url.hostname === 'github.com'
    || url.hostname.endsWith('.github.com')
  ) {
    return null;
  }

  if (url.hostname === 'arxiv.org' || url.hostname.endsWith('.arxiv.org')) {
    const paper = url.pathname.match(/^\/abs\/([^/]+)/);
    if (paper) return `https://arxiv.org/pdf/${paper[1]}`;
  }

  if (url.hostname === 'docs.google.com') {
    const googleFile = url.pathname.match(
      /^\/(document|presentation|spreadsheets)\/d\/([^/]+)/,
    );

    if (googleFile) {
      return `https://docs.google.com/${googleFile[1]}/d/${googleFile[2]}/preview`;
    }
  }

  if (url.hostname === 'figma.com' || url.hostname === 'www.figma.com') {
    const embedUrl = new URL(url.href);
    embedUrl.hostname = 'embed.figma.com';
    embedUrl.searchParams.set('embed-host', 'share');
    return embedUrl.href;
  }

  return url.href;
}

export default function ExternalLinkPreview({
  children,
}: {
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLAnchorElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [closing, setClosing] = useState(false);

  const finishClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
    } else {
      setPreview(null);
      setClosing(false);
    }
  }, []);

  const requestClose = useCallback(() => {
    if (closing) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClose();
      return;
    }

    setClosing(true);
    closeTimerRef.current = window.setTimeout(finishClose, CLOSE_DURATION);
  }, [closing, finishClose]);

  const handleExternalLink = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (
        !['http:', 'https:'].includes(url.protocol)
        || url.origin === window.location.origin
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      openerRef.current = anchor;
      setLoaded(false);
      setClosing(false);
      setPreview({
        frameHref: getFrameHref(url),
        href: url.href,
        host: url.hostname.replace(/^www\./, ''),
        label:
          anchor.dataset.previewTitle
          || anchor.textContent?.replace(/\s+/g, ' ').trim()
          || url.hostname,
      });
    },
    [],
  );

  useEffect(() => {
    if (!preview) return;

    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    dialog.showModal();
  }, [preview]);

  useEffect(() => {
    if (!preview) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [preview]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  const handleClosed = useCallback(() => {
    setPreview(null);
    setLoaded(false);
    setClosing(false);

    window.requestAnimationFrame(() => {
      openerRef.current?.focus();
      openerRef.current = null;
    });
  }, []);

  return (
    <>
      <div className={styles.linkScope} onClickCapture={handleExternalLink}>
        {children}
      </div>

      {preview ? (
        <dialog
          ref={dialogRef}
          className={styles.dialog}
          data-closing={closing ? 'true' : 'false'}
          aria-labelledby="external-preview-title"
          onCancel={(event) => {
            event.preventDefault();
            requestClose();
          }}
          onClose={handleClosed}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) requestClose();
          }}
        >
          <div className={styles.window}>
            <header className={styles.toolbar}>
              <div className={styles.source}>
                <strong id="external-preview-title">{preview.label}</strong>
                <span>{preview.host}</span>
              </div>
              <a
                className={styles.directLink}
                href={preview.href}
                target="_blank"
                rel="noreferrer"
              >
                open ↗
              </a>
              <button
                className={styles.closeButton}
                type="button"
                onClick={requestClose}
                autoFocus
                aria-label="Close preview"
              >
                ×
              </button>
            </header>

            <div className={styles.frameArea}>
              {preview.frameHref ? (
                <>
                  {!loaded ? (
                    <span className={styles.loading}>
                      loading {preview.host}
                    </span>
                  ) : null}
                  <iframe
                    key={preview.frameHref}
                    className={styles.frame}
                    src={preview.frameHref}
                    title={`${preview.label} on ${preview.host}`}
                    loading="eager"
                    referrerPolicy="strict-origin-when-cross-origin"
                    sandbox="allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    allow="camera; clipboard-read; clipboard-write; fullscreen"
                    onLoad={() => setLoaded(true)}
                  />
                </>
              ) : (
                <div className={styles.blocked}>
                  <p>{preview.host} does not allow embedded previews.</p>
                  <a href={preview.href} target="_blank" rel="noreferrer">
                    open the source ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
}
