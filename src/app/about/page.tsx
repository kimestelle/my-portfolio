'use client';

import Link from 'next/link';
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
              design engineer / frontend engineer
            </ShimmerText>
          </div>
        </header>

        <section className="flex flex-col gap-6">
          <div className="star-line-section">
            <span className="star-glyph-section" aria-hidden="true">✶</span>
            <ShimmerText as="h3" className="star-copy-section">
              where i fit on a team
            </ShimmerText>
          </div>
          <div className="prose-stack">
            <p>
              I like joining while the product and interaction are still being
              worked out. I work with designers, engineers, and product people
              to make decisions concrete, prototype them, and build the
              frontend.
            </p>
            <p>
              I&apos;m equally comfortable bringing an interaction idea, developing
              someone else&apos;s direction, or connecting systems that need to work
              together. I ask questions early and share what I learn as I go.
            </p>
          </div>

          <dl className="glass-surface ui-radius-panel">
            <div className="grid gap-2 border-b border-[color:var(--line-color)] p-4 sm:grid-cols-[9rem_1fr] sm:gap-5">
              <dt>
                <Link
                  href="/projects/into-the-blue"
                  className="underline decoration-black/20 underline-offset-4"
                >
                  Into the Blue ↗
                </Link>
              </dt>
              <dd className="text-[color:var(--text-secondary)]">
                Proposed the camera-to-sticker flow; built capture + offline
                storage; worked with the lead designer on a shared asset system.
              </dd>
            </div>
            <div className="grid gap-2 border-b border-[color:var(--line-color)] p-4 sm:grid-cols-[9rem_1fr] sm:gap-5">
              <dt>
                <Link
                  href="/projects/internet-atlas"
                  className="underline decoration-black/20 underline-offset-4"
                >
                  Internet Atlas ↗
                </Link>
              </dt>
              <dd className="text-[color:var(--text-secondary)]">
                Co-led the product; connected the team&apos;s ML pipeline to a 3D
                graph organized by visitor-chosen words.
              </dd>
            </div>
            <div className="grid gap-2 p-4 sm:grid-cols-[9rem_1fr] sm:gap-5">
              <dt>PayPal</dt>
              <dd className="text-[color:var(--text-secondary)]">
                Joined a senior engineer&apos;s existing project to build the
                production frontend / UI for a Next.js data hub; now iterate with
                PMs, data engineers, and software engineers.
              </dd>
            </div>
          </dl>

          <div className="glass-surface ui-radius-panel grid md:grid-cols-[1.2fr_0.8fr]">
            <figure className="flex flex-col p-4">
              <blockquote className="font-body font-normal leading-[1.5]">
                “Working with you felt like everything was very planned out and
                organized. When we needed to speed things up, you made sure to
                communicate that well with everyone. We asked each other a lot
                of questions, so we learned together.”
              </blockquote>
              <figcaption className="type-meta mt-4 text-[color:var(--text-meta)]">
                collaborator at Penn Spark
              </figcaption>
            </figure>

            <figure className="flex flex-col border-t border-[color:var(--line-color)] p-4 md:border-l md:border-t-0">
              <blockquote className="font-body font-normal leading-[1.5]">
                “Estelle&apos;s work ethic and enthusiasm for learning have
                been evident in all her projects.”
              </blockquote>
              <figcaption className="type-meta mt-4 text-[color:var(--text-meta)]">
                Aleksandr Dmitriev · Data Engineering Manager, Southern
                California Edison
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="star-line-section">
            <span className="star-glyph-section" aria-hidden="true">✶</span>
            <ShimmerText as="h3" className="star-copy-section">
              how i got here
            </ShimmerText>
          </div>
          <div className="prose-stack">
            <p>
              I came to engineering a little sideways. Before computer science,
              I worked in student organizing and education policy. That taught
              me to listen, clarify complicated ideas, and keep groups aligned.
            </p>
            <p>
              I started coding in 2024, then moved from mobile apps and APIs into
              C++, OpenGL, real-time graphics, and production frontend work. I
              stayed with interactive software because I like caring about both
              the system and the person using it.
            </p>
          </div>

          <ol className="glass-surface ui-radius-panel">
            <li className="grid gap-1 border-b border-[color:var(--line-color)] p-4 sm:grid-cols-[8.5rem_1fr] sm:gap-5">
              <ShimmerText
                as="span"
                className="font-medium text-[color:var(--text-primary)]"
              >
                may–sep 2024
              </ShimmerText>
              <ShimmerText
                as="span"
                className="text-[color:var(--text-secondary)]"
              >
                built City Skyline + Better Spelling Bee; learned React, APIs,
                user state, persistence, and deployment
              </ShimmerText>
            </li>
            <li className="grid gap-1 border-b border-[color:var(--line-color)] p-4 sm:grid-cols-[8.5rem_1fr] sm:gap-5">
              <ShimmerText
                as="span"
                className="font-medium text-[color:var(--text-primary)]"
              >
                nov–dec 2024
              </ShimmerText>
              <ShimmerText
                as="span"
                className="text-[color:var(--text-secondary)]"
              >
                built C++ / OpenGL projects around procedural systems +
                real-time graphics
              </ShimmerText>
            </li>
            <li className="grid gap-1 border-b border-[color:var(--line-color)] p-4 sm:grid-cols-[8.5rem_1fr] sm:gap-5">
              <ShimmerText
                as="span"
                className="font-medium text-[color:var(--text-primary)]"
              >
                feb–apr 2025
              </ShimmerText>
              <ShimmerText
                as="span"
                className="text-[color:var(--text-secondary)]"
              >
                shipped Into the Blue + Internet Atlas with two Penn Spark teams
              </ShimmerText>
            </li>
            <li className="grid gap-1 p-4 sm:grid-cols-[8.5rem_1fr] sm:gap-5">
              <ShimmerText
                as="span"
                className="font-medium text-[color:var(--text-primary)]"
              >
                late 2025–now
              </ShimmerText>
              <ShimmerText
                as="span"
                className="text-[color:var(--text-secondary)]"
              >
                building graphics + media experiments into fuller creative tools
              </ShimmerText>
            </li>
          </ol>
        </section>

        <section className="flex flex-col gap-6">
          <div className="star-line-section">
            <span className="star-glyph-section" aria-hidden="true">✶</span>
            <ShimmerText as="h3" className="star-copy-section">
              outside of code
            </ShimmerText>
          </div>
          <p>
            Outside code, I scout wine bars, listen to three songs on repeat,
            collect texture references, and read.
          </p>

          <details className="glass-interactive ui-radius-panel p-4">
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
            Want to work together? Email me at{' '}
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
