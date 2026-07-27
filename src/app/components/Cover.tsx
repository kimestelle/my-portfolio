'use client';

import Image from 'next/image';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import { CursorTooltip } from './Tooltip';

export default function Cover() {
  return (
    <div className="relative w-full pb-16 pt-6 md:pb-16 md:pt-10">
      <header className="grid w-full gap-10 md:grid-cols-[minmax(0,1.45fr)_minmax(15rem,0.75fr)] md:items-end md:gap-14">
        <div className="max-w-xl">
          <ShimmerText as="h1" className="type-identity">
            Estelle Kim
          </ShimmerText>

          <div className="star-line-north mt-2">
            <span className="star-glyph-north" aria-hidden="true">✦</span>
            <ShimmerText as="h2" className="star-copy-north">
              Design engineer building software for how people think, make,
              and explore.
            </ShimmerText>
          </div>

          <p className="mt-3 text-[color:var(--text-secondary)]">
            I work across graphics, full-stack engineering, and design,
            choosing the technology based on what the product needs and how
            people will use it.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
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
              email me ↗
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

        <aside
          aria-label="Current status"
          className="border-t border-[color:var(--line-color)] pt-5 md:relative md:mb-1 md:border-t-0 md:pb-1 md:pl-7 md:pt-0 md:before:absolute md:before:bottom-2 md:before:left-0 md:before:top-2 md:before:w-px md:before:bg-[color:var(--line-color)]"
        >
          <ul className="flex flex-col gap-3">
            <li className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
              <span aria-hidden="true" className="flex justify-center pt-[0.62rem]">
                <span className="h-1 w-1 rounded-full bg-[color:var(--text-meta)]" />
              </span>
              <span>SWE intern @ PayPal</span>
            </li>
            <li className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
              <span aria-hidden="true" className="flex justify-center pt-[0.62rem]">
                <span className="h-1 w-1 rounded-full bg-[color:var(--text-meta)]" />
              </span>
              <span>CS + Computer Graphics @ UPenn</span>
            </li>
            <li className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2">
              <span aria-hidden="true" className="flex justify-center pt-[0.62rem]">
                <span className="h-1 w-1 rounded-full bg-[color:var(--text-secondary)] shadow-[0_0_0_2px_rgba(22,22,22,0.07)]" />
              </span>
              <span>available for full-time roles starting mid-august 2026</span>
            </li>
          </ul>
        </aside>
      </header>
    </div>
  );
}
