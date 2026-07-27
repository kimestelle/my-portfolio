'use client';

import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import TmiCorner from './components/TmiCorner';

export default function About() {
  return (
    <main className="responsive-padding w-full">
      <div className="page-frame-reading flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <ShimmerText as="h2">hi, I&apos;m Estelle :-)</ShimmerText>
          <div className="star-line-north">
            <span className="star-glyph-north" aria-hidden="true">✦</span>
            <ShimmerText as="span" className="star-copy-north">
              I build software where design, engineering, and interaction feel like one decision.
            </ShimmerText>
          </div>
        </header>

        <section className="flex flex-col gap-4">
          <div className="star-line-section">
            <span className="star-glyph-section" aria-hidden="true">✶</span>
            <ShimmerText as="h3" className="star-copy-section">
              how i work
            </ShimmerText>
          </div>
          <p>
            Most of my work starts with conversations about what an experience
            should feel like. From there, I look for the simplest technology
            that preserves what matters, whether that&apos;s a frontend
            interaction, graphics, AI, or a custom system.
          </p>
          <p>
            I like teams where ideas move between design, engineering, and
            product. I tend to bring structure, communicate early, and ask a
            lot of questions so everyone can contribute without losing room to
            explore.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <div className="star-line-section">
            <span className="star-glyph-section" aria-hidden="true">✶</span>
            <ShimmerText as="h3" className="star-copy-section">
              how i got here
            </ShimmerText>
          </div>
          <p>
            I didn&apos;t really plan to become an engineer. Before computer
            science, I organized activists, built coalitions, and worked in
            education policy. That taught me to start with people, make complex
            ideas legible, and build toward shared goals.
          </p>
          <p>
            Engineering gave those instincts a different medium. I now build
            interactive software because it sits where technical systems and
            human experience meet.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <div className="star-line-section">
            <span className="star-glyph-section" aria-hidden="true">✶</span>
            <ShimmerText as="h3" className="star-copy-section">
              outside of code
            </ShimmerText>
          </div>
          <p>
            I&apos;m usually wandering around the nearest city, listening to
            all kinds of music, or thinking about paper, fabric, light, and the
            small details that make digital things feel tangible.
          </p>

          <details className="glass-interactive ui-radius-panel p-2">
            <summary className="star-line-detail cursor-pointer">
              <span className="star-glyph-detail" aria-hidden="true">
                {'\uE000'}
              </span>
              tmi corner:
            </summary>
            <TmiCorner />
          </details>
        </section>

        <section className="flex flex-col gap-2 border-t pt-8">
          <p>
            I&apos;m always excited to meet thoughtful people building
            interesting things. If that sounds like your kind of work,
            I&apos;d love to chat at{' '}
            <a
              href="mailto:kestelle@sas.upenn.edu"
              className="underline decoration-black/20 underline-offset-4"
            >
              kestelle@sas.upenn.edu
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
