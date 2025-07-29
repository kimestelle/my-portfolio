'use client'
import Image from 'next/image';
import { allPostsSorted } from '../blog/posts';
import MoodRingBackground from './MoodRingShader';
import CourseWork from "./Coursework";
import Timeline from './Timeline';

export default function Home() {
  return (
    <>
    <MoodRingBackground />
    <main className="min-h-screen w-full text-gray-900 p-6 md:p-12 py-12 flex flex-col justify-center gap-12 md:gap-24">
      <section className="w-full max-w-2xl mx-auto">
        <br />
        <br />
        <h1>Estelle Kim</h1>
        <h3>
            CS + CG @ UPenn
        </h3>
        <br />
        <p>
        Undergrad studying Computer Science, Graphics Engineering, and Design through UPenn’s Digital Media Design (BSE) program
        <Image src="/me-sticker.png" alt="me sticker" width={400} height={400} className="inline pop-on-touch w-4 h-4 ml-1 align-middle" />
        </p>

        <br />
        <p>
            I’m drawn to projects that help people think clearly, notice more, or create freely. I&apos;m learning how technology can support that by offering the right structure at the right time.
        </p>
        <br />
        <p>
            From full-stack development to databases, I enjoy learning new tools on the job. At the core, I care about code that is intuitive and thoughtfully crafted inside-out.
        </p>
        <br/>
        <p>
            <Image src="/heart.png" alt="me sticker" width={400} height={400} className="inline pop-on-touch w-4 h-4 mr-1 mb-1 align-middle" />
            Thanks for visiting!
        </p>
      </section>

      <section className="w-full max-w-2xl mx-auto">
            <CourseWork />
        </section>

      {/* Blog Preview */}
      <section className="w-full max-w-2xl mx-auto">
        <h2 className="mb-5">Recent Posts</h2>
        <ul className="space-y-4">
          {allPostsSorted.slice(0, 3).map(({ title, slug, description }) => (
            <li key={title}>
              <a href={`/blog/${slug}`} className="block hover:underline">
                <h3>{title}</h3>
                <p>{description}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Experience */}
      <section className="w-full max-w-2xl mx-auto">
        <Timeline/>
      </section>
    </main>
    </>
  );
}