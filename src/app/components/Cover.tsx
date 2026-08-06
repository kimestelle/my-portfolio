'use client';

import Image from 'next/image';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import { StatusMarginNote } from './StatusMarginNote';
import { CursorTooltip } from './Tooltip';

export default function Cover() {
  return (
    <div className="relative w-full pb-12 md:pb-16">
      <header className="grid w-full gap-7 md:grid-cols-[minmax(0,1.33fr)_minmax(15rem,0.72fr)] md:items-end md:gap-10">
        <div className="w-full">
          <ShimmerText as="h1" className="type-identity">
            Estelle Kim
          </ShimmerText>

          <div className="star-line-north mt-2">
            <span className="star-glyph-north" aria-hidden="true">✦</span>
            <ShimmerText as="h2" className="star-copy-north">
              graphics · interaction · engineering
            </ShimmerText>
          </div>

          <p className="mt-2.5 text-[color:var(--text-secondary)]">
            I design and build expressive interfaces, from early ideas through production.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 md:gap-x-4 md:gap-y-2">
            <a
              href="/ESTELLE_KIM.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="type-meta text-[color:var(--text-primary)] transition-transform duration-200 hover:-translate-y-px"
            >
              resume ↗
            </a>
            <a
              href="mailto:kestelle@sas.upenn.edu"
              className="type-meta text-[color:var(--text-primary)] transition-transform duration-200 hover:-translate-y-px"
            >
              email ↗
            </a>
            <span
              aria-hidden
              className="h-3 w-px bg-[color:var(--line-color)]"
            />
            <CursorTooltip content="LinkedIn profile" placement="bottom">
              <a
                href="https://www.linkedin.com/in/estelle-kim-41b1b7218/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="p-1 transition-transform duration-200 hover:-translate-y-px"
              >
                <Image
                  src="/icons/linkedin.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="h-[0.88rem] w-[0.88rem]"
                />
              </a>
            </CursorTooltip>

            <CursorTooltip content="X profile" placement="bottom">
              <a
                href="https://x.com/estellespace"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X profile"
                className="p-1 transition-transform duration-200 hover:-translate-y-px"
              >
                <Image
                  src="/icons/x-logo.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="h-[0.82rem] w-[0.82rem]"
                />
              </a>
            </CursorTooltip>

            <CursorTooltip content="GitHub repos" placement="bottom">
              <a
                href="https://github.com/kimestelle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="p-1 transition-transform duration-200 hover:-translate-y-px"
              >
                <Image
                  src="/icons/gh-logo.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="h-[0.88rem] w-[0.88rem]"
                />
              </a>
            </CursorTooltip>
          </div>
        </div>

        <StatusMarginNote />
      </header>
    </div>
  );
}
