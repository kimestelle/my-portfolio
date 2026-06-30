'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CursorTooltip } from './Tooltip';
import Image from 'next/image';

// -----------------------------------------------------------------------------
// Layout + animation
// -----------------------------------------------------------------------------

const FIELD_ASPECT_RATIO = 16 / 10;
const FIELD_MAX_HEIGHT = 410;
const FIELD_HEIGHT_SVH = 42;

const START_DELAY_MS = 500;
const TYPE_MS = 55;
const WORD_HOLD_MS = 170;
const BETWEEN_PIECES_MS = 250;

const NODE_ENTER_MS = 720;
const EDGE_ENTER_MS = 1000;

const STAR_RADIUS = 9;
const WORD_PADDING_X = 12;
const WORD_PADDING_Y = 20;

const FALLBACK_FONT = '400 14px Arial';

// -----------------------------------------------------------------------------
// Hard-coded constellation
//
// x and y are percentages inside a fixed 16:10 field.
// from: 'star' connects from the lead star.
// from: number connects from an earlier PIECES array index.
// -----------------------------------------------------------------------------

type PieceDefinition = {
  text: string;
  x: number;
  y: number;
  from: 'star' | number;
  dashed?: boolean;
};

type Edge = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
};

const STAR = {
  glyph: '✦',
  x: 4,
  y: 70,
};

const PIECES: PieceDefinition[] = [
  { text: 'engineering',          x: 28, y: 30, from: 'star' },
  { text: 'visual design',        x: 36, y: 88, from: 0, dashed: true },
  { text: 'graphics',             x: 75, y: 29, from: 0 },
  { text: 'shaders & renderers',              x: 62, y: 1, from: 2 },
  { text: 'real-time',            x: 90, y: 9, from: 2, dashed: true },
  { text: 'expressive interfaces',           x: 68, y: 75, from: 1 },
  { text: 'full-stack',           x: 47, y: 51, from: 0 },
  { text: '3d art',               x: 58, y: 96, from: 1, dashed: true },
];


type FieldSize = {
  width: number;
  height: number;
};

type NodePoint = {
  x: number;
  y: number;
  halfWidth: number;
  halfHeight: number;
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function measureWordHalfWidth(text: string, font: string) {
  if (typeof document === 'undefined') {
    return text.length * 4.5 + WORD_PADDING_X;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return text.length * 4.5 + WORD_PADDING_X;
  }

  context.font = font;

  return context.measureText(text).width / 2 + WORD_PADDING_X;
}

function pointFromPercent(
  xPercent: number,
  yPercent: number,
  fieldSize: FieldSize,
  halfWidth: number,
  halfHeight: number
): NodePoint {
  return {
    x: (xPercent / 100) * fieldSize.width,
    y: (yPercent / 100) * fieldSize.height,
    halfWidth,
    halfHeight,
  };
}

function trimEdge(start: NodePoint, end: NodePoint) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (dx === 0 && dy === 0) {
    return {
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
    };
  }

  function rectangleExitDistance(node: NodePoint, dirX: number, dirY: number) {
    const xDistance =
      dirX === 0 ? Infinity : node.halfWidth / Math.abs(dirX);

    const yDistance =
      dirY === 0 ? Infinity : node.halfHeight / Math.abs(dirY);

    return Math.min(xDistance, yDistance);
  }

  const length = Math.hypot(dx, dy);
  const unitX = dx / length;
  const unitY = dy / length;

  const startDistance = rectangleExitDistance(start, unitX, unitY);
  const endDistance = rectangleExitDistance(end, unitX, unitY);

  return {
    x1: start.x + unitX * startDistance,
    y1: start.y + unitY * startDistance,
    x2: end.x - unitX * endDistance,
    y2: end.y - unitY * endDistance,
  };
}

export default function Home() {
  const [typedText, setTypedText] = useState('');
  const [revealedCount, setRevealedCount] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [font, setFont] = useState(FALLBACK_FONT);
  const [fieldSize, setFieldSize] = useState<FieldSize>({
    width: 640,
    height: 400,
  });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fieldRef = useRef<HTMLDivElement>(null);
  const wordMeasureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    const updatePreference = () => {
      setReduceMotion(mediaQuery.matches);
    };

    updatePreference();

    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    const measureElement = wordMeasureRef.current;

    if (!field) return;

    if (measureElement) {
      setFont(window.getComputedStyle(measureElement).font);
    }

    const observer = new ResizeObserver(() => {
      setFieldSize({
        width: field.clientWidth,
        height: field.clientHeight,
      });
    });

    observer.observe(field);

    setFieldSize({
      width: field.clientWidth,
      height: field.clientHeight,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setTypedText('');
      setRevealedCount(PIECES.length);
      setAnimationComplete(true);
      return;
    }

    let cancelled = false;
    const timeoutIds: number[] = [];

    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, duration);
        timeoutIds.push(id);
      });

    const runAnimation = async () => {
      await wait(START_DELAY_MS);

      for (let pieceIndex = 0; pieceIndex < PIECES.length; pieceIndex += 1) {
        if (cancelled) return;

        const piece = PIECES[pieceIndex];

        for (
          let characterIndex = 1;
          characterIndex <= piece.text.length;
          characterIndex += 1
        ) {
          if (cancelled) return;

          setTypedText(piece.text.slice(0, characterIndex));
          await wait(TYPE_MS);
        }

        await wait(WORD_HOLD_MS);

        if (cancelled) return;

        setRevealedCount(pieceIndex + 1);
        setTypedText('');

        await wait(BETWEEN_PIECES_MS);
      }

      if (!cancelled) {
        setAnimationComplete(true);
      }
    };

    runAnimation();

    return () => {
      cancelled = true;

      timeoutIds.forEach((id) => {
        window.clearTimeout(id);
      });
    };
  }, [reduceMotion]);

  const starNode = useMemo(
    () =>
      pointFromPercent(
        STAR.x,
        STAR.y,
        fieldSize,
        STAR_RADIUS,
        STAR_RADIUS
      ),
    [fieldSize]
  );

  const pieceNodes = useMemo(
    () =>
      PIECES.map((piece) =>
        pointFromPercent(
          piece.x,
          piece.y,
          fieldSize,
          measureWordHalfWidth(piece.text, font),
          WORD_PADDING_Y
        )
      ),
    [fieldSize, font]
  );

  const fieldHeight = `min(${FIELD_HEIGHT_SVH}svh, ${FIELD_MAX_HEIGHT}px, calc((100vw - 2rem) / ${FIELD_ASPECT_RATIO}))`;
  const fieldWidth = `min(calc(${FIELD_HEIGHT_SVH}svh * ${FIELD_ASPECT_RATIO}), ${FIELD_MAX_HEIGHT * FIELD_ASPECT_RATIO}px, calc(100vw - 2rem))`;

  return (
    <div className="relative min-h-[100svh] w-full flex flex-col items-center pb-[7svh]">
      <style>{`
        @keyframes caret-blink {
          0%, 55% { opacity: 1; }
          56%, 100% { opacity: 0.15; }
        }

        @keyframes caret-rest {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="w-full max-w-2xl shrink-0 flex flex-col justify-start items-start">
        <h1>Estelle Kim</h1>

        <h3>
          CS & CG @ Penn
        </h3>

        <div className="w-full my-4 flex items-center gap-3">
          <CursorTooltip content="download resume" placement="bottom">
            <a
              href="/EUNYUL_KIM_2027.pdf"
              className="ml-0.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/download.svg"
                className="inline w-[0.9rem] h-[0.9rem] mb-1"
                alt="Resume icon"
                width={50}
                height={50}
              />
            </a>
          </CursorTooltip>

          <CursorTooltip content="let's chat!" placement="bottom">
            <a
              href="mailto:kestelle@sas.upenn.edu"
              className="ml-2"
            >
              <Image
                src="/icons/mail-icon-black.svg"
                className="inline w-[1rem] h-[0.9rem] mb-0.5"
                alt="Email icon"
                width={50}
                height={50}
              />
            </a>
          </CursorTooltip>

          <CursorTooltip content="LinkedIn profile" placement="bottom">
            <a
              href="https://www.linkedin.com/in/estelle-kim-41b1b7218/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              <Image
                src="/icons/linkedin.svg"
                className="inline w-[0.9rem] h-[0.9rem] mb-1"
                alt="LinkedIn icon"
                width={50}
                height={50}
              />
            </a>
          </CursorTooltip>

          <CursorTooltip content="GitHub repos" placement="bottom">
            <a
              href="https://github.com/kimestelle"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              <Image
                src="/icons/gh-logo.svg"
                className="inline w-[0.9rem] h-[0.9rem] mb-1"
                alt="Github icon"
                width={50}
                height={50}
              />
            </a>
          </CursorTooltip>

          <CursorTooltip content="X handle" placement="bottom">
            <a
              href="https://x.com/estellespace"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              <Image
                src="/icons/x-logo.svg"
                className="inline w-[0.9rem] h-[0.9rem] mb-1"
                alt="X icon"
                width={50}
                height={50}
              />
            </a>
          </CursorTooltip>

          <div className="h-px flex-1 bg-black/10" />
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center mt-[3svh]">
        <div
          ref={fieldRef}
          // md:mix-blend-difference 
          className="pointer-events-none relative shrink-0"
          style={{
            width: fieldWidth,
            height: fieldHeight,
            aspectRatio: `${FIELD_ASPECT_RATIO}`,
          }}
        >
          <span
            ref={wordMeasureRef}
            className="absolute invisible whitespace-nowrap"
            aria-hidden="true"
          >
            measure
          </span>

          {mounted && <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            aria-hidden="true"
          >
            {PIECES.map((piece, index) => {
              const end = pieceNodes[index];

              const start =
                piece.from === 'star'
                  ? starNode
                  : pieceNodes[piece.from];

              const edge = trimEdge(start, end);

              const isVisible = index < revealedCount;

              return (
                <line
                  key={`edge-${piece.text}`}
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke={'#000000'}
                  strokeWidth={0.8}
                  strokeDasharray={piece.dashed ? '1.5 3' : undefined}
                  style={{
                    opacity: isVisible ? 0.42 : 0,
                    strokeDashoffset: isVisible ? 0 : 22,
                    transition: [
                      `opacity ${EDGE_ENTER_MS}ms ease`,
                      `stroke-dashoffset ${EDGE_ENTER_MS}ms cubic-bezier(.22,.61,.36,1)`,
                    ].join(', '),
                  }}
                />
              );
            })}
          </svg>}

          <span
            className="absolute"
            style={{
              left: `${STAR.x}%`,
              top: `${STAR.y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: 1,
            }}
          >
            {STAR.glyph}
          </span>

          {PIECES.map((piece, index) => {
            const isVisible = index < revealedCount;

            return (
              <span
                key={piece.text}
                className="absolute whitespace-nowrap font-medium"
                style={{
                  left: `${piece.x}%`,
                  top: `${piece.y}%`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? 'translate(-50%, -50%) scale(1)'
                    : 'translate(-50%, -50%) scale(0.96)',
                  transition: [
                    `opacity ${NODE_ENTER_MS}ms ease`,
                    `transform ${NODE_ENTER_MS}ms cubic-bezier(.22,.61,.36,1)`,
                  ].join(', '),
                }}
              >
                {piece.text}
              </span>
            );
          })}
        </div>

        <h4 className="mt-[3svh] min-h-[1.5em] text-center">
          {typedText}{' '}
          {!animationComplete && (
            <span
              style={{
                animation:
                  typedText.length > 0
                    ? 'caret-blink 1s steps(1) infinite'
                    : 'caret-rest 3.2s ease-in-out infinite',
              }}
            >
              &#10022;
            </span>
          )}
        </h4>

        <div className="h-[18svh] w-px bg-gradient-to-b from-black/20 to-transparent" />
      </div>
    </div>
  );
}