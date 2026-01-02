'use client';
import Link from 'next/link';
import CodeDemo, { CodeDemoProps } from '../components/CodeDemo';
import { MiniCameraCutout } from '../components/BlueDemos';
import BouncingText from '@/app/components/BouncingText';

export default function Blue_DemoNotes() {
  const demos: readonly CodeDemoProps[] = [
    { id : '01',
      title: '01 — communicating with stakeholders',
      blurb:
        'Continual communication with the Museum team kept goals, product details, and tech requirements aligned.',
      notices: [
        'We explored the Museum to pick blue artifacts and map routes.',
        'For a younger audience, we created a scavenger hunt to prompt exploration across different galleries and close looking at artifacts.',
      ],
    },
        {
      id: '02',
      title: '02 — my contribution: sticker cutout feature',
      blurb:
        'The Museum requested that we do not distort the appearance or cultural meaning of artifacts. During initial team discussions, I proposed a cutout feature to preserve original images while allowing playful physical collection, outlining a technical approach involving HTML canvas and SVG masks.',
      demo: (
        <MiniCameraCutout/>
      ),
      notices: [
        'communicated with designers to generate SVG outlines and PNG overlays w/ same viewbox dimensions',
        'implemented dynamic routing with json data for modularity',
        'aligned clipping/sizing across devices',
        "initial iteration didn't work with complex paths; implemented even-odd clipping to cut multiple shapes and holes",
        "Zoom feature to help users fit artifact in cutout area",
      ]
    },
    {
      id: '03',
      title: '03 — my contribution: storage pipeline',
      blurb: 'WiFi in the Museum is spotty; we needed an offline-first solution to store stickers reliably. I proposed using IndexedDB for persistent local storage (even when the device restarts!).',
      notices: [
        'immediate write to IndexedDB (PNG + metadata) & update on progress pages and stickerboard.',
        'converted image into blob for efficient storage and retrieval',
        'key-ed by artifact ID for easy retrieval and preventing duplication',
      ],
    },
    {
      id: '04',
      title: '04 — my co-contribution: stickerboard',
      blurb: 'Drag-Drop board with custom stickers and export feature.',
      notices: [
        'collaborated with another dev to implement custom drag-drop after unsuccessful iterations with npm libraries',
        'developed modals for adding user-collected artifact stickers that switch categories upon button tap + swipe gesture',
        'export to PNG using html2canvas',
      ],
    },
  ] as const;

  return (
    <div className="blog-formatting max-w-2xl">
      <h1 className="text-3xl font-bold">Scavenger Hunt in the Penn Museum</h1>
      <p className="text-gray-500 mt-1 half-margin">
        <span className='italic text-gray-600'>~ Into the Blue: case study ~ </span>October 30, 2025
      </p>
      <hr className="mb-4" />

      <p>
        <a href="https://www.penn.museum/sites/blue/welcome/" target="_blank">
          <span className="blue text-underline">{'<'}link to demo{'/>'} </span>
        </a>
        <a href="https://github.com/PennSpark/into-the-blue" target="_blank" className="ml-2">
          <span className="blue text-underline">{'<'}github repo{'/>'}</span>
        </a>
      </p>

      <p>
        With its new exhibition <em>Into the Blue</em>, the Museum wanted a virtual companion. We built an offline-first web app
        that guides visitors to find blue artifacts, “cut” them in place, and keep + share a personal digital sticker collection.
      </p>
      <ul>
        <li><span className="font-semibold">client project</span> with <Link href="https://pennspark.org/" target="_blank" className="blue">Penn Spark</Link> (team of 8 leads, devs, & designers)</li>
        <li>my role: <span className="font-semibold">frontend developer</span></li>
        <li>tech stack: <span className="font-semibold">NextJS / React/ Typescript</span></li>
        <li>project timeline: <span className="font-semibold">February - April</span></li>
        <li>continuing deployment + maintenance for 9 months</li>
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
        <h2 className="text-xl font-semibold">lessons learned</h2>
        <ul className="list-disc ml-6 text-gray-800">
          <li>translating designers&apos; intent into measurable rules (shared viewBox, aspect ratios, error guards) that hold across edge cases and devices</li>
          <li>one source of geometry: derive every size, transform, clip, and export from the same reference box (plus DPR + cover-fit) for pixel-perfect alignment</li>
          <li>staging dynamic flow: guide - capture - reveal, with subtle feedback (zoom, outline animation) that speaks clearly without distorting content</li>
        </ul>
      </section>

      <hr className="mt-8"/>
      <section className="mt-8">
        <BouncingText>{"thanks for reading :-)"}</BouncingText>
      </section>
    </div>
  );
}
