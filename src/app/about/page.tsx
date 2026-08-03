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
              I get excited by ideas and like figuring out how to make them real.
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
            I get inspiration from all over: a material, an interaction, or a
            question someone asks in a meeting. I like following those threads
            until they turn into something people can actually use.
          </p>
          <p>
            On a team, I like understanding what we&apos;re making and why,
            writing things down, and sharing what I learn as I go. The best
            projects feel less like rationing work and more like
            learning together.
          </p>

          <div className="glass-surface ui-radius-panel mt-2 grid md:grid-cols-[1.2fr_0.8fr]">
            <figure className="flex flex-col p-5 md:p-6">
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

            <figure className="flex flex-col border-t border-[color:var(--line-color)] p-5 md:border-l md:border-t-0 md:p-6">
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

        <section className="flex flex-col gap-4">
          <div className="star-line-section">
            <span className="star-glyph-section" aria-hidden="true">✶</span>
            <ShimmerText as="h3" className="star-copy-section">
              how i got here
            </ShimmerText>
          </div>
          <p>
            I came to engineering a little sideways. Before computer science, I
            spent most of my time organizing students, building coalitions, and
            working in education policy. It taught me how to listen, make
            complicated ideas easier to act on, and keep people moving toward
            the same goal.
          </p>
          <p>
            Learning to code gave me another way to do something I already
            loved: take a messy idea, give it structure, and bring it to life.
            I ended up in interactive software because I like caring about both
            the system and the person using it.
          </p>

          <ol className="glass-surface ui-radius-panel mt-2">
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
                learned by building with friends: mobile interaction, APIs, user state,
                persistence, and deployment
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
                moved into C++, OpenGL, procedural systems, and real-time
                graphics
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
                built two team products in parallel and learned how much good
                integration depends on communication
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
                turning focused graphics + media experiments into fuller
                creative tools
              </ShimmerText>
            </li>
          </ol>
        </section>

        <section className="flex flex-col gap-4">
          <div className="star-line-section">
            <span className="star-glyph-section" aria-hidden="true">✶</span>
            <ShimmerText as="h3" className="star-copy-section">
              outside of code
            </ShimmerText>
          </div>
          <p>
            I&apos;m rarely interested in only one thing at a time. Outside of
            code, I&apos;m usually scouting wine bars in the city,
            listening to three songs on repeat, collecting images of interesting textures, or reading books with new perspectives.
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
            If you&apos;re making something you care about and think we&apos;d
            get along, let&apos;s talk at{' '}
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
