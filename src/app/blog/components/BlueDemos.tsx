import { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';

type VB = { x: number; y: number; w: number; h: number };

export function MiniCameraCutout({
  contentPadding = 0.12,
}: {
  contentPadding?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // match original names
  const [clipPathData, setClipPathData] = useState<Path2D[] | null>(null);
  const [svgPaths, setSvgPaths] = useState<string[] | null>(null);
  const [viewBox, setViewBox] = useState<VB | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageSelected, setImageSelected] = useState<"lion" | "diadems">("lion");

  // camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        console.error('camera error', e);
      }
    })();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  useEffect(() => {
    (async () => {
      const txt = await fetch(`/blog/blue/${imageSelected}.svg`).then(r => r.text());
      const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      const vbAttr = svgEl?.getAttribute('viewBox');
      if (vbAttr) {
        const [x, y, w, h] = vbAttr.trim().split(/\s+/).map(Number);
        setViewBox({ x, y, w, h });
      } else {
        const w = Number(svgEl?.getAttribute('width')) || 300;
        const h = Number(svgEl?.getAttribute('height')) || 360;
        setViewBox({ x: 0, y: 0, w, h });
      }
      const ds = [...doc.querySelectorAll('path')]
        .map(p => p.getAttribute('d') || '')
        .filter(Boolean);
      setSvgPaths(ds);
      setClipPathData(ds.map(d => new Path2D(d)));
    })();
  }, [imageSelected]);

  function toggleImage() {
    setImage(null);
    setImageSelected(prev => (prev === 'lion' ? 'diadems' : 'lion'));
  }

  const capture = () => {
    const v = videoRef.current;
    if (!v || v.readyState < 2 || !viewBox || !clipPathData) return;

    const W = Math.round(viewBox.w);
    const H = Math.round(viewBox.h);

    const rVid = v.videoWidth / v.videoHeight;
    const rBox = W / H;
    let sx = 0, sy = 0, sw = v.videoWidth, sh = v.videoHeight;
    if (rVid > rBox) { sh = v.videoHeight; sw = sh * rBox; sx = (v.videoWidth - sw) / 2; }
    else { sw = v.videoWidth; sh = sw / rBox; sy = (v.videoHeight - sh) / 2; }

    const cvs = document.createElement('canvas');
    cvs.width = W; cvs.height = H;
    const ctx = cvs.getContext('2d')!;

    const scaleInset = 1 - 2 * contentPadding;
    const cx = viewBox.x + viewBox.w / 2;
    const cy = viewBox.y + viewBox.h / 2;

    ctx.save();
    const sxSvg = W / viewBox.w, sySvg = H / viewBox.h;
    ctx.translate(-viewBox.x * sxSvg, -viewBox.y * sySvg);
    ctx.scale(sxSvg, sySvg);

    ctx.translate(cx, cy);
    ctx.scale(scaleInset, scaleInset);
    ctx.translate(-cx, -cy);

    const region = new Path2D();
    for (const p of clipPathData) region.addPath(p);
    ctx.clip(region, 'evenodd');

    // draw the video
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(v, sx, sy, sw, sh, 0, 0, W, H);
    ctx.restore();

    setImage(cvs.toDataURL('image/png')); // triggers post-capture mode
  };

  return (
    <div
      className="relative h-full aspect-[5/6] rounded-md overflow-hidden border"
    >
      <video
        ref={videoRef}
        muted
        playsInline
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
        }}
      />

      {!image && viewBox && (
        <svg
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            pointerEvents: 'none',
          }}
        >
          <g transform={(() => {
            const s = 1 - 2 * contentPadding;
            const cx = viewBox.x + viewBox.w / 2;
            const cy = viewBox.y + viewBox.h / 2;
            return `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`;
          })()}>
            <image
              href={`/blog/blue/${imageSelected}.png`}
              x={viewBox.x}
              y={viewBox.y}
              width={viewBox.w}
              height={viewBox.h}
              opacity="0.85"
            />
          </g>
        </svg>
      )}

      {image && viewBox && (
        <>
          <NextImage
            src={image}
            alt="sticker"
            width={viewBox.w}
            height={viewBox.h}
            style={{
              position: 'absolute', inset: 0, margin: 'auto', zIndex: 2,
              width: '100%', height: '100%', objectFit: 'contain',
            }}
          />
          <svg
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
            preserveAspectRatio="xMidYMid meet"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              pointerEvents: 'none', zIndex: 2,
            }}
          >
            <g transform={(() => {
              const s = 1 - 2 * contentPadding;
              const cx = viewBox.x + viewBox.w / 2;
              const cy = viewBox.y + viewBox.h / 2;
              return `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`;
            })()}>
              {svgPaths?.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="white"
                  strokeWidth={Math.max(viewBox.w, viewBox.h) * 0.015}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="cutout-outline"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </g>
          </svg>

          <div className="absolute inset-0 bg-blue-500 opacity-50"/>
        </>
      )}

      {/* controls */}
      <div className='absolute bottom-2 z-[2] w-full flex gap-2 px-2 justify-between items-center'>
        {!image && (
          <button onClick={toggleImage} className="rounded-full px-2 py-1 bg-white/90 text-black text-xs">
            switch
          </button>
        )}
        {!image && (
          <button onClick={capture} className="rounded-full px-2 py-1 bg-white/90 text-black text-xs">
            ●
          </button>
        )}
        {image && (
          <>
            <button onClick={() => setImage(null)} className="rounded-full px-2 py-1 bg-white/90 text-black text-xs">
              retake
            </button>
            <a href={image} download="sticker.png" className="rounded-full px-2 py-1 bg-black text-white text-xs">
              save
            </a>
          </>
        )}
      </div>

      <style>{`
        .cutout-outline {
          stroke-dasharray: 3000;
          stroke-dashoffset: 3000;
          animation: outline-reveal 2.4s ease-in-out forwards;
        }
        @keyframes outline-reveal {
          0%   { stroke-dashoffset: 3000}
          100% { stroke-dashoffset: 0}
        }
      `}</style>
    </div>
  );
}
