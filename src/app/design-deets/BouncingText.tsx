"use client";

import React from "react";

type Props = {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  durationMs?: number;
  staggerMs?: number;
  amplitudeEm?: number;
};

function splitGraphemes(str: string): string[] {
  // @ts-ignore
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    // @ts-ignore
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(str), (s: any) => s.segment);
  }
  return Array.from(str);
}

export default function BouncingText({
  children,
  as: Tag = "p",
  className,
  durationMs = 900,
  staggerMs = 80,
  amplitudeEm = 0.2,
}: Props) {
  const letters = React.useMemo(() => splitGraphemes(children), [children]);

  const rootStyle = {
    // @ts-ignore
    "--duration": `${durationMs}ms`,
    // @ts-ignore
    "--stagger": `${staggerMs}ms`,
    // @ts-ignore
    "--amp": `${amplitudeEm}em`,
  } as React.CSSProperties;

  return (
    <Tag className={`bouncing-text${className ? " " + className : ""}`} style={rootStyle}>
      {letters.map((ch, i) => (
        <span
          key={i}
          className='select-none'
          // @ts-ignore
          style={{ "--i": i } as React.CSSProperties}
          aria-hidden="true"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
      {/* hidden original text */}
      <span className="sr-only">{children}</span>

      <style jsx>{`
        .bouncing-text {
          display: inline-block;
          white-space: pre-wrap;
          position: relative;
        }

        .bouncing-text > span {
          display: inline-block;
          transform-origin: 50% 100%;
          animation: bounce var(--duration) infinite;
          animation-delay: calc(var(--i) * var(--stagger));
          animation-timing-function: cubic-bezier(0.25, 0.9, 0.25, 1.2); /* subtle rebound */
          will-change: transform;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0) scaleY(1);
          }
          35% {
            transform: translateY(calc(-1 * var(--amp))) scaleY(1.02);
          }
          55% {
            transform: translateY(0) scaleY(0.98); /* first rebound */
          }
          70% {
            transform: translateY(calc(-0.25 * var(--amp))) scaleY(1.005); /* tiny overshoot */
          }
          85% {
            transform: translateY(0) scaleY(0.995); /* settle */
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bouncing-text > span {
            animation: none !important;
          }
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </Tag>
  );
}