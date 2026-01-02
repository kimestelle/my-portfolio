'use client';
import Image from 'next/image';
import CodeDemo, {CodeDemoProps} from '../components/CodeDemo';
import BouncingText from '@/app/components/BouncingText';

export default function MagneticPoetry_DemoNotes() {
  const demos: readonly CodeDemoProps[] = [
    { id : '01',
      title: '01 — curating words',
      blurb:
        "Words are individual draggable magnets. In addition to giving the user freedom to insert their own words, I used Allison Parrish's Gutenberg Poetry Corpus to pre-select a set of commonly used words in poetry.",
      notices: ['Python script cleaned, filtered, and ranked words, wrote most popular words into a txt file', 
        'Selecting popular words ensures essential grammatical functions while allowing expressive terms', 
        'Manually screened dataset for appropriateness and resonance'],
      },
    {
      id: '02',
      title: '02 — board setup',
      blurb: 'centered, 3:4, soft noise and depth using layered and blurred animated svg + noise texture.',
      demo: (
            <div className="w-full h-full flex flex-col items-center justify-center py-2 user-select-none">
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  aspectRatio: '3 / 4',
                  backgroundColor: '#f5f5f5', 
                  overflow: 'hidden',
                  userSelect: 'none',
                }}
              >

                {/* Static background */}
                  <Image
                    src="/blog/magnetic-poetry/red-grad-animated.svg"
                    alt="background"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'blur(18px)',
                      zIndex: 0,
                      pointerEvents: 'none',
                    }}
                    width={400}
                    height={533}
                  />

                <div style={{backgroundImage: "url('/blog/magnetic-poetry/noise.png')",
                  position: 'absolute', inset: 0,
                  zIndex: 1,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '100px 100px',
                  backgroundPosition: 'center',
                  mixBlendMode: 'screen',
                  opacity: 1
                }}/>
              </div>
            </div>
      ),
      notices: [],
      codeTitle: 'tiny code',
      code: `
PoemBoard() {(
  <div style={{position:'relative', aspectRatio:'3/4', overflow:'hidden', borderRadius:12}}>
    <img src="/blog/magnetic-poetry/red-grad-animated.svg"
        style={{position:'absolute', inset:0, filter:'blur(18px)'}} aria-hidden />
    <div style={{
      position:'absolute', inset:0,
      background:"url('/blog/magnetic-poetry/noise.png') repeat 0 0 / 100px 100px",
      mixBlendMode:'screen', opacity:.9
    }}/>
    {children}
  </div>
)}
      `,
    },
    {
      id: '03',
      title: '03 — under-finger drag',
      blurb:
        'measure from magnet’s center → measure size and position in board % → clamp to 0..100.',
      demo: (
          <video
            src="/blog/magnetic-poetry/drag-demo.mp4"
            autoPlay
            loop
            muted
            className="rounded-md w-full"
          />
      ),
      notices: ['subtle lifting effect when pressed', 'word stays centered under finger', "consistent size / positions after window resize", 'mouse and touch feel the same'],
    },
    {
      id: '04',
      title: '04 — delete (only on drop)',
      blurb:
        'magnet gets smaller when you drag it downwards, and deletes on drop.',
      demo: (
          <video
            src="/blog/magnetic-poetry/delete-demo.mp4"
            autoPlay
            loop
            muted
            className="rounded-md w-full"
          />
      ),
      notices: ['feedback ≠ action (scaling is only a hint)', "'trash box' doesn't interfere with user experience", '*however, lack of clear visual cue may confuse users who want to delete an item*'],
      codeTitle: 'core idea (tiny code)',
    },
    {
      id: '05',
      title: '05 — export that stays crisp',
      blurb: 'DOM snapshot via html2canvas; many DOM elements could not be captured directly so I reconstructed the entire board proportionally on a hidden HiDPI canvas.',
      demo: (
<div className="flex w-full gap-4">
  <div className="group h-60 relative">
    <Image
      src="/blog/magnetic-poetry/screenshotted.png"
      alt="screenshotted"
      width={300}
      height={400}
      className="block h-60 object-contain"
    />
    <div className="pointer-events-none flex justify-center items-center absolute inset-0 bg-white/50 opacity-0 transition group-hover:opacity-100">
      <p>screenshot</p>
    </div>
  </div>

  <div className="group h-60 relative">
    <Image
      src="/blog/magnetic-poetry/downloaded.png"
      alt="downloaded"
      width={300}
      height={400}
      className="block h-60 object-contain"
    />
    <div className="pointer-events-none flex justify-center items-center absolute inset-0 bg-white/50 opacity-0 transition group-hover:opacity-100">
    <p>downloaded image</p>
    </div>
  </div>
</div>
      ),
  notices: [
    'Background pass: draw gradient | webcam feed | white background, apply blur',
    'Noise + Magnets pass: screen-blend noise texture, measureText for box width, white fill + hairline stroke + DPR-scaled shadow.',
    'Capture guard (ref) prevents duplicate downloads.',
  ],
  codeTitle: 'tiny code',
code: ``,
    }
  ] as const;

  return (
    <div className="blog-formatting max-w-2xl">
      <h1 className="text-3xl font-bold">watercolor drip shader</h1>
      <p className="text-gray-500 mt-1 half-margin"><span className='italic text-gray-600'>~ case study ~ </span>November 1, 2025</p>
      <hr className="mb-4" />

      <a href="https://watercolor-drip-shader.vercel.app/" target="_blank">
        <p className="blue text-underline">{'<'}link to demo{'/>'}</p>
      </a>

      <p>I&apos;ve wanted to build a watercolor shader for a long time, but struggled to find a good use or </p>
      <ul>
        <li>Simple, intuitive interface like a pocket of physical space inside a screen</li>
        <li>Board that remains consistent and reliable while I move words around</li>
        <li>Word choices that are open-ended but not overwhelmingly freeing</li>
      </ul>

      {demos.map(({ id, title, blurb, demo, notices, codeTitle, code }) => (
            <CodeDemo
              key={id}
              id={id}
              title={title}
              blurb={blurb}
              notices={notices}
              codeTitle={codeTitle}
              code={code}
              demo={demo}
              defaultOpen={false}
            />
      ))}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">next steps</h2>
        <ul className="list-disc ml-6 text-gray-800">
          <li>real-time collaborative canvas, drawing inspiration from Spencer Chang&apos;s <a className='blue' href="https://playhtml.fun/" target="_blank">playhtml</a></li>
        </ul>
      </section>

      <hr className="mt-8"/>
      <section className="mt-8">
        <BouncingText>{"thanks for reading :-)"}</BouncingText>
      </section>
    </div>
  );
}
