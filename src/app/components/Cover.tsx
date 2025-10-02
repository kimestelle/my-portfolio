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
            Creative Engineer // CS + CG @ UPenn 
            {/* / <img src='/icons/linkedin.svg' className='inline w-[1rem] h-[1rem] mb-1'/> */}
        </h3>
        <br />
        <p>
          Studying Computer Science, Graphics Engineering, and Design through UPenn’s Digital Media Design (BSE) program, c/o 2027
        <Image src="/me-sticker.png" alt="me sticker" width={400} height={400} sizes="400px" 
        className="inline pop-on-touch w-4 h-4 ml-1 align-middle" />
        </p>

        <br />
        <p>
          I’m drawn to building tools that reshape how people think, notice, and create. 
          I focus on coherence and craft, making sure every detail creates an intentional experience.
        </p>

        <br />
        <p>
          From web graphics to full-stack dev and databases, I enjoy picking up new skills on the job. At the core, I care about code that is intuitive and thoughtfully crafted inside-out.
        </p>
        <br/>
        <p>
            <Image src="/heart.png" alt="me sticker" width={400} height={400} sizes="400px" 
            className="inline pop-on-touch w-4 h-4 mr-1 mb-1 align-middle" />
            Thanks for visiting!
        </p>
      </section>

      <section className='w-full max-w-2xl mx-auto overflow-hidden'>
        <h2 className='mb-5'>{'</>'}</h2>
        <div className='relative w-full h-52 flex-row overflow-x-scroll flex gap-4 snap-x snap-mandatory scrollbar-hide'>
          <label className='relative snap-start shrink-0 w-52 h-52 bg-gray-200 shadow overflow-hidden cursor-pointer'>
            <a href='https://2d-softbody-lathe.vercel.app/' target='_blank' rel='noopener noreferrer'>
              <Image src='/cover-images/blob-image.png' alt='2D/3D Blob' width={400} height={400} className='w-full h-full object-cover'/>
              <div className='absolute w-full h-full opacity-0 hover:opacity-100 bg-white/80 top-0 left-0 flex flex-col justify-center items-center transition-opacity transition-duration-400'>
                <p>
                  3D/2D Softbody
                </p>
              </div>
            </a>
          </label>
          <label className='relative snap-start shrink-0 w-52 h-52 bg-gray-200 shadow overflow-hidden cursor-pointer'>
            <a href='https://magnetic-poetry.vercel.app/' target='_blank' rel='noopener noreferrer'>
              <Image src='/cover-images/poetry-image.png' alt='Magnetic Poetry' width={400} height={400} className='w-full h-full object-cover'/>
              <div className='absolute w-full h-full opacity-0 hover:opacity-100 bg-white/80 top-0 left-0 flex flex-col justify-center items-center transition-opacity transition-duration-400'>
                <p>
                  Magnetic Poetry
                </p>
              </div>
            </a>
          </label>
        </div>
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