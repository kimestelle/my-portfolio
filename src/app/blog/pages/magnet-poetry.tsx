'use client'
import Image from "next/image";

export default function MagneticPoetry_DemoNotes() {
  return (
    <div className="blog-formatting responsive-padding">
      <h1 className="text-3xl font-bold">magnet poetry board</h1>
      <p className="text-gray-500 mt-1 half-margin">July 22, 2025</p>
      <p className="text-gray-600 italic half-margin">wip</p>
      <hr className="mb-4"/>

      <p>
        I wanted:
      </p>
      <ul>
        <li>
          A simple, quiet interface that feels like a pocket of physical space inside a screen
        </li>
        <li>
          A board that holds its shape and reliable feel while I move words around
        </li>
        <li>
          Word choices that are open-ended but not overwhelmingly freeing
        </li>
      </ul>

      {/* ---------- DEMO 1: Board shape ---------- */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">01 — board shape</h2>
        <p className="text-gray-600 half-margin">centered, 3:4, soft depth. positions live in percentages, not pixels.</p>

        <div className="demo-block mt-3 rounded-lg border bg-white/60 p-3">
          <label className="block mb-2">
            <span className="text-sm text-gray-500">demo</span>
            <Image
              src="/blog/magnetic-poetry/board.png"
              alt="board layout"
              width={720}
              height={480}
              className="rounded-md mt-2"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-md bg-neutral-50 p-3 border">
              <p className="text-sm font-medium mb-1">what to notice</p>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                <li>3:4 frame stays centered</li>
                <li>quiet shadow, no chrome</li>
                <li>percent coords = stable layout on resize</li>
              </ul>
            </div>
            <details className="rounded-md bg-neutral-50 p-3 border">
              <summary className="cursor-pointer text-sm font-medium">core idea (tiny code)</summary>
              <pre className="mt-2 overflow-x-auto text-xs"><code>{`type WordItem = {
  id: string; text: string;
  xPercent: number; // 0..100
  yPercent: number; // 0..100
};`}</code></pre>
            </details>
          </div>
        </div>
      </section>

      {/* ---------- DEMO 2: Under-finger drag ---------- */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">02 — under-finger drag</h2>
        <p className="text-gray-600 half-margin">measure from the magnet’s center → convert to board % → clamp to 0..100.</p>

        <div className="demo-block mt-3 rounded-lg border bg-white/60 p-3">
          <label className="block mb-2">
            <span className="text-sm text-gray-500">demo</span>
            <video
              src="/blog/magnetic-poetry/drag-demo.mp4"
              controls
              className="rounded-md mt-2 w-full"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-md bg-neutral-50 p-3 border">
              <p className="text-sm font-medium mb-1">what to notice</p>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                <li>the word stays under your finger</li>
                <li>no “snap” to top-left</li>
                <li>mouse and touch feel the same</li>
              </ul>
            </div>
            <details className="rounded-md bg-neutral-50 p-3 border">
              <summary className="cursor-pointer text-sm font-medium">core idea (tiny code)</summary>
              <pre className="mt-2 overflow-x-auto text-xs"><code>{`const clamp = (v:number, lo=0, hi=100) => Math.min(Math.max(v, lo), hi);
const posFromClient = (cx:number, cy:number, board:DOMRect, off={x:0,y:0}) => ({
  xPercent: clamp(((cx - board.left - off.x) / board.width)  * 100),
  yPercent: clamp(((cy - board.top  - off.y) / board.height) * 100),
});`}</code></pre>
            </details>
          </div>
        </div>
      </section>

      {/* ---------- DEMO 3: Delete dock ---------- */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">03 — delete (only on drop)</h2>
        <p className="text-gray-600 half-margin">the dock glows while you hover with a drag. nothing happens until you drop.</p>

        <div className="demo-block mt-3 rounded-lg border bg-white/60 p-3">
          <label className="block mb-2">
            <span className="text-sm text-gray-500">demo</span>
            <video
              src="/blog/magnetic-poetry/delete-demo.mp4"
              controls
              className="rounded-md mt-2 w-full"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-md bg-neutral-50 p-3 border">
              <p className="text-sm font-medium mb-1">what to notice</p>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                <li>feedback ≠ action (glow is only a hint)</li>
                <li>drop to confirm deletion</li>
                <li>forgiving target area</li>
              </ul>
            </div>
            <details className="rounded-md bg-neutral-50 p-3 border">
              <summary className="cursor-pointer text-sm font-medium">core idea (tiny code)</summary>
              <pre className="mt-2 overflow-x-auto text-xs"><code>{`const overlaps = (a:DOMRect, b:DOMRect) =>
  !(a.right<b.left || a.left>b.right || a.bottom<b.top || a.top>b.bottom);

// while dragging:
setInDelete(overlaps(new DOMRect(cx, cy, 1, 1), dockRect));

// on drop:
if (inDelete) removeWord(dragId);`}</code></pre>
            </details>
          </div>
        </div>
      </section>

      {/* ---------- DEMO 4: Export ---------- */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">04 — export that stays crisp</h2>
        <p className="text-gray-600 half-margin">dom snapshot via <code>html2canvas</code>; scale by devicePixelRatio for hidpi.</p>

        <div className="demo-block mt-3 rounded-lg border bg-white/60 p-3">
          <label className="block mb-2">
            <span className="text-sm text-gray-500">demo</span>
            <Image
              src="/blog/magnetic-poetry/export.png"
              alt="export result png"
              width={720}
              height={480}
              className="rounded-md mt-2"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-md bg-neutral-50 p-3 border">
              <p className="text-sm font-medium mb-1">what to notice</p>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                <li>text edges stay sharp on retina</li>
                <li>one click → png</li>
                <li>works with html magnets</li>
              </ul>
            </div>
            <details className="rounded-md bg-neutral-50 p-3 border">
              <summary className="cursor-pointer text-sm font-medium">core idea (tiny code)</summary>
              <pre className="mt-2 overflow-x-auto text-xs"><code>{`import html2canvas from 'html2canvas';
async function exportPNG(boardEl: HTMLElement) {
  const scale = window.devicePixelRatio || 1;
  const canvas = await html2canvas(boardEl, { scale });
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png'); a.download = 'poem.png'; a.click();
}`}</code></pre>
            </details>
          </div>
        </div>
      </section>

      {/* ---------- DEMO 5: Spawn behavior ---------- */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">05 — spawning (near center)</h2>
        <p className="text-gray-600 half-margin">words come from <code>public/words.txt</code>. spawn near the middle so i’m not chasing them.</p>

        <div className="demo-block mt-3 rounded-lg border bg-white/60 p-3">
          <label className="block mb-2">
            <span className="text-sm text-gray-500">demo</span>
            <video
              src="/blog/magnetic-poetry/spawn-demo.mp4"
              controls
              className="rounded-md mt-2 w-full"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-md bg-neutral-50 p-3 border">
              <p className="text-sm font-medium mb-1">what to notice</p>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                <li>spawn zone is centered</li>
                <li>small random offset for variety</li>
                <li>no initial overlaps (future pass)</li>
              </ul>
            </div>
            <details className="rounded-md bg-neutral-50 p-3 border">
              <summary className="cursor-pointer text-sm font-medium">core idea (tiny code)</summary>
              <pre className="mt-2 overflow-x-auto text-xs"><code>{`const spawn = () => ({
  xPercent: 50 + (Math.random() - 0.5) * 30,
  yPercent: 50 + (Math.random() - 0.5) * 30,
});`}</code></pre>
            </details>
          </div>
        </div>
      </section>

      {/* ---------- MICRO POLISH ---------- */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">small choices that help</h2>
        <ul className="list-disc ml-6 text-gray-800">
          <li><span className="font-medium">select-none</span> on the board + magnets → no accidental highlights</li>
          <li><span className="font-medium">clamp</span> to 0..100% → magnets don’t drift off-board</li>
          <li><span className="font-medium">delete only on drop</span> → glow is feedback, not action</li>
          <li><span className="font-medium">tap size</span> ~28–32px, rounded + soft shadow → low fatigue</li>
        </ul>
        <p className="text-gray-600 mt-2">
          next tiny passes: arrow-key nudge (1% / 5% with Shift), json export/import, and a lightweight overlap guard on spawn.
        </p>
      </section>
    </div>
  );
}
