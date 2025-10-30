'use client';
import Image from 'next/image';
import CodeDemo, {CodeDemoProps} from '../components/CodeDemo';
import BouncingText from '@/app/components/BouncingText';
import Link from 'next/link';

export default function Blue_DemoNotes() {
  const demos: readonly CodeDemoProps[] = [] as const;

  return (
    <div className="blog-formatting responsive-padding">
      <h1 className="text-3xl font-bold">Into the Blue</h1>
      <p className="text-gray-500 mt-1 half-margin"><span className='italic text-gray-600'>~ case study ~ </span>October 30, 2025</p>
      <hr className="mb-4" />

      <a href="https://www.penn.museum/sites/blue/welcome/" target="_blank">
        <p className="blue text-underline">{'<'}link to demo{'/>'}</p>
      </a>

      <p>coming soon: collaborative client project for the Penn Museum</p>
      <ul>
        <li>meanwhile, check out my <Link href="/blog/magnet-poetry" className="blue">magnet poetry board case study</Link></li>
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

      {/* <section className="mt-8">
        <h2 className="text-xl font-semibold">next steps</h2>
        <ul className="list-disc ml-6 text-gray-800">
          <li>real-time collaborative canvas, drawing inspiration from Spencer Chang&apos;s <a className='blue' href="https://playhtml.fun/" target="_blank">playhtml</a></li>
        </ul>
      </section> */}

      <hr className="mt-8"/>
      <section className="mt-8">
        <BouncingText>{"thanks for reading :-)"}</BouncingText>
      </section>
    </div>
  );
}
