'use client';

import Image from 'next/image';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import { CursorTooltip } from './Tooltip';

export default function Cover() {
  return (
    <div className="relative flex w-full flex-col items-center pb-24 pt-6 md:pb-32 md:pt-10">
      <header className="homepage-intro-diffusion flex w-full max-w-2xl shrink-0 flex-col items-start">
        <ShimmerText as="h1" className="type-identity">
          Estelle Kim
        </ShimmerText>

        <div className="star-line-north mt-2 max-w-xl">
          <span className="star-glyph-north" aria-hidden="true">✦</span>
          <ShimmerText as="h2" className="star-copy-north">
            Design engineer building thoughtful, interactive software.
          </ShimmerText>
        </div>

        <p className="mt-1 max-w-[38rem] text-[color:var(--text-secondary)]">
          I work across graphics, full-stack engineering, and design, choosing
          the technology based on what the experience actually needs.
        </p>

        <p className="type-meta mt-3 text-[color:var(--text-meta)]">
          CS + Computer Graphics at Penn · open to opportunities starting
          mid-august 2026
        </p>

        <div className="mt-5 flex items-center gap-3">
          <CursorTooltip content="download resume" placement="bottom">
            <a
              href="/EUNYUL_KIM_2027.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download resume"
              className="p-1 transition-transform duration-200 hover:-translate-y-px"
            >
              <Image
                src="/icons/download.svg"
                alt=""
                width={16}
                height={16}
                className="h-[0.88rem] w-[0.88rem]"
              />
            </a>
          </CursorTooltip>

          <CursorTooltip content="let's chat!" placement="bottom">
            <a
              href="mailto:kestelle@sas.upenn.edu"
              aria-label="Email Estelle"
              className="p-1 transition-transform duration-200 hover:-translate-y-px"
            >
              <Image
                src="/icons/mail-icon-black.svg"
                alt=""
                width={16}
                height={16}
                className="h-[0.9rem] w-4"
              />
            </a>
          </CursorTooltip>

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
      </header>
    </div>
  );
}
