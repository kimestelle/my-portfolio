'use client';

import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import TmiCorner from './components/TmiCorner';

export default function About() {
  return (
    <main className="responsive-padding flex w-full justify-center">
      <div className="flex w-full max-w-2xl flex-col gap-10 pt-8">
        <header className="flex flex-col gap-3">
          <ShimmerText as="h2">hi, I&apos;m Estelle :-)</ShimmerText>
          <div className="star-line-north">
            <span className="star-glyph-north" aria-hidden="true">✦</span>
            <ShimmerText as="span" className="star-copy-north">
              I like building software that feels intentional, where design,
              engineering, and interaction all support the same idea.
            </ShimmerText>
          </div>
        </header>

        <section className="flex flex-col gap-4">
          <div className="star-line-section">
            <span className="star-glyph-section" aria-hidden="true">✶</span>
            <ShimmerText as="h3" className="star-copy-section">
              my approach
            </ShimmerText>
          </div>
          <p>
            Most of my work starts the same way: understanding what the
            experience is supposed to feel like before deciding how to build
            it.
          </p>
          <p>
            Sometimes the right solution is a simple frontend interaction.
            Sometimes it calls for graphics, AI, or a custom system. I enjoy
            figuring out where that line is.
          </p>
          <p>
            I&apos;m less interested in using interesting technology for its
            own sake than I am in choosing the right amount of technology for
            the problem.
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
            I didn&apos;t grow up planning to become a graphics engineer.
          </p>
          <p>
            Before computer science, I spent much of my time organizing
            students, building coalitions, and working on education policy.
            That experience taught me to start with people: understand the
            problem, communicate clearly, and build toward shared goals.
          </p>
          <p>
            When I found engineering, those instincts didn&apos;t disappear.
            They found a different medium.
          </p>
          <p>
            Today I build interactive software because it&apos;s where
            technical systems and human experience meet.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <div className="star-line-section">
            <span className="star-glyph-section" aria-hidden="true">✶</span>
            <ShimmerText as="h3" className="star-copy-section">
              working together
            </ShimmerText>
          </div>
          <p>
            I enjoy small teams where ideas move quickly between design,
            engineering, and product.
          </p>
          <p>
            People I&apos;ve worked with often mention organization, thoughtful
            communication, and asking lots of questions. I like making
            ambitious projects feel structured enough that everyone can
            contribute while still leaving room to explore.
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
            I&apos;m usually wandering around the nearest city, listening to all kinds of music,
            or thinking about materials like
            paper, fabric, and light. I&apos;m drawn to the small details that
            make digital things feel tangible.
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

        <section className="flex flex-col gap-4 border-t pt-8">
          <p>
            I&apos;m always excited to meet thoughtful people building
            interesting things, especially small teams where engineering,
            design, and product shape each other.
          </p>
          <p>
            If that sounds like your kind of work, I&apos;d love to chat at{' '}
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
