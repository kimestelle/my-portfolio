'use client'
import Image from 'next/image';
import { allPostsSorted } from '../blog/posts';
import MoodRingBackground from './MoodRingShader';
import CoverCarousel from './CoverCarousel';
import ProjectsScroll from './ProjectsScroll';
import BouncingText from './BouncingText';

type CoverProps = {
  onScrollZoneActive?: (active: boolean) => void;
};

export default function Home({ onScrollZoneActive }: CoverProps) {
  return (
    <>
    <MoodRingBackground />
    <main className="w-[100svw] text-gray-900 flex flex-col justify-start items-start gap-8">
      <section className="w-full max-w-2xl mx-auto p-10 pt-24 pb-48 -mb-40 max-h-[100svh] min-h-[100svh] flex flex-col gap-10 items-between">
        <div className='w-full h-full flex flex-col justify-start items-start gap-1'>
        <h1>Estelle Kim</h1>
        <h3>
            Creative Developer<br/>
            CS + CG @ UPenn 
            <a href='https://www.linkedin.com/in/estelle-kim-41b1b7218/' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <img src='/icons/linkedin.svg' className='inline w-[1rem] h-[1rem] mb-1'/>
            </a>
            <a href='https://github.com/kimestelle' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <img src='/icons/gh-logo.svg' className='inline w-[1rem] h-[1rem] mb-1'/>
            </a>
            <a href='https://x.com/estelleeykim' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <img src='/icons/x-logo.svg' className='inline w-[1rem] h-[1rem] mb-1'/>
            </a>
        </h3>
        <p className='px-1 mt-1 w-fit text-light/800 text-neutral-600 rounded-sm shadow-inner text-sm select-none cursor-pointer hover:bg-neutral-200 transition-duration-300'
          onClick={() => {
            window.open('/EUNYUL_KIM_2027.pdf', '_blank');
          }}
        >
          {'<'}resume link{'>'}
        </p>
              <section className='w-full mx-auto border border-0.5 bg-neutral-100/50 backdrop-hue-rotate-[3rad] shadow-inner rounded-sm p-2 overflow-hidden flex flex-col gap-2 justify-center md:justify-start'>
        <div className='relative w-full flex-row flex gap-2 md:gap-1'>
          <label className='relative snap-start shrink-0 w-16 h-16 md:w-24 md:h-24 bg-gray-200 shadow overflow-hidden cursor-pointer'>
            <a href='https://watercolor-drip-shader.vercel.app/' target='_blank' rel='noopener noreferrer'>
              <Image src='/cover-images/watercolor-image.png' alt='Watercolor Shader' width={400} height={400} className='w-full h-full object-cover'/>
              <div className='absolute w-full h-full p-2 text-xs md:text-sm opacity-0 hover:opacity-100 bg-white/80 top-0 left-0 flex flex-col justify-center items-center transition-opacity transition-duration-400'>
                <p>
                  Watercolor Shader
                </p>
              </div>
            </a>
          </label>
          <label className='relative snap-start shrink-0 w-16 h-16 md:w-24 md:h-24 bg-gray-200 shadow overflow-hidden cursor-pointer'>
            <a href='https://textellation.vercel.app/' target='_blank' rel='noopener noreferrer'>
              <Image src='/cover-images/textellation-image.png' alt='Textellation' width={400} height={400} className='w-full h-full object-cover'/>
              <div className='absolute w-full h-full p-2 text-xs md:text-sm opacity-0 hover:opacity-100 bg-white/80 top-0 left-0 flex flex-col justify-center items-center transition-opacity transition-duration-400'>
                <p>
                  textellation
                </p>
              </div>
            </a>
          </label>
          <label className='relative snap-start shrink-0 w-16 h-16 md:w-24 md:h-24 bg-gray-200 shadow overflow-hidden cursor-pointer'>
            <a href='https://2d-softbody-lathe.vercel.app/' target='_blank' rel='noopener noreferrer'>
              <Image src='/cover-images/blob-image.png' alt='2D/3D Blob' width={400} height={400} className='w-full h-full object-cover'/>
              <div className='absolute w-full h-full p-2 text-xs md:text-sm opacity-0 hover:opacity-100 bg-white/80 top-0 left-0 flex flex-col justify-center items-center transition-opacity transition-duration-400'>
                <p>
                  3D/2D Softbody
                </p>
              </div>
            </a>
          </label>
          <label className='relative snap-start shrink-0 w-16 h-16 md:w-24 md:h-24 bg-gray-200 shadow overflow-hidden cursor-pointer'>
            <a href='https://magnetic-poetry.vercel.app/' target='_blank' rel='noopener noreferrer'>
              <Image src='/cover-images/poetry-image.png' alt='Magnetic Poetry' width={400} height={400} className='w-full h-full object-cover'/>
              <div className='absolute w-full h-full p-2 text-xs md:text-sm opacity-0 hover:opacity-100 bg-white/80 top-0 left-0 flex flex-col justify-center items-center transition-opacity transition-duration-400'>
                <p>
                  Magnetic Poetry
                </p>
              </div>
            </a>
          </label>
        </div>
        <section className="w-full max-w-2xl mx-auto">
        <ul>
          {allPostsSorted.slice(0, 2).map(({ title, slug, description }) => (
            <li key={title}>
              <a href={`/blog/${slug}`} className="block text-light hover:underline"
              style={{fontWeight: 400}}>
                <p>{title}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
      </section>
        </div>
        <CoverCarousel />
        <section className="hidden md:flex w-full mx-auto flex-row gap-5 md:gap-10">
        <div className='flex flex-1 flex-col justify-start items-start'>
          <h3>I build:</h3>
          <ol>
            <li>WebGL/WebGPU and thoughtful frontend UI</li>
            <li>Full-stack websites & apps</li>
            <li>Pixel-perfect graphics that run on mobile</li>
          </ol>
        </div>
        <div className='flex flex-1 flex-col justify-start items-start'>
          <h3>
            I work with:
          </h3>
          <ol>
            <li>Modern web: TS/JS, React</li>
            <li>Graphics & shader programming</li>
            <li>APIs, databases, and client-side storage</li>
          </ol>
        </div>
        <div className='flex flex-1 flex-col justify-start items-start'>
          <h3>
            I&apos;m looking for:
          </h3>
          <ol>
            <li>Interactive / Design-Eng roles</li>
            <li>Studios, startups, or product teams</li>
            <li>Internships or part-time work</li>
            <li><a href="https://x.com/estelleeykim" target="_blank">Cool conversations!</a><Image src="/me-sticker.png" alt="me sticker" width={400} height={400} sizes="400px" 
        className="inline pop-on-touch w-4 h-4 ml-1 align-middle" /></li>
          </ol>
        </div>
      </section>
      </section>

      <ProjectsScroll onActiveChange={onScrollZoneActive}/>

      {/* <section className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-start md:items-end">
        <BouncingText>{"thanks for stopping by :-)"}</BouncingText>
      </section> */}
    </main>
    </>
  );
}