'use client';

import React, { useState } from 'react';

export default function AboutMeBlurb() {
  const [version, setVersion] = useState<'technical' | 'personal'>('technical');

  const toggleVersion = () => {
    setVersion((prev) => (prev === 'technical' ? 'personal' : 'technical'));
  };

  return (
    <section className="max-w-xl mx-auto px-4 py-8 text-gray-800">
      <button
        onClick={toggleVersion}
        className="mb-6 text-sm text-blue-600 underline hover:text-blue-800 transition"
      >
        Switch to {version === 'technical' ? 'personal' : 'technical'} version
      </button>

      {version === 'technical' ? (
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            I like building things that feel intentional — responsive interfaces,
            custom data flows, or full-stack systems that leave room for play.
            I&apos;m drawn to interaction models that make people pause, explore, or
            reflect without friction.
          </p>
          <p>
            I think deeply about systems — how rendering pipelines behave, how
            memory conventions shape performance, how to scale something while
            keeping it personal. But beyond the technical, I care just as much
            about how tools feel in someone&apos;s hands. I write code with that
            balance in mind: structural, efficient, and grounded in human
            experience.
          </p>
          <p>
            To me, good engineering is quiet — it shows up in the moments where
            everything just works, and the user never has to think about why.
          </p>
        </div>
      ) : (
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            I care about how things feel — not just how they look or work. I’m
            drawn to ideas that hold emotion, memory, or meaning, especially
            when they unfold through interaction. The projects I love most invite
            people in gently, and give them space to make something their own.
          </p>
          <p>
            I think in layers — visual, structural, emotional — and I like
            connecting them in ways that feel effortless. Whether I’m building a
            journaling app, writing an application statement, or sketching a
            sound interface, I’m always asking: <em>what does this feel like to
            use?</em>
          </p>
          <p>
            My work isn’t about impressing people. It’s about helping them feel
            something real — even if it’s subtle, even if it’s small.
          </p>
        </div>
      )}
    </section>
  );
}
