"use client";

import Image from "next/image";
import React, {useRef, useState, useMemo} from "react";
import clsx from "clsx";

type MagnifierImageProps = {
  src: string;
  alt: string;
  className?: string;
  zoom?: number;        // 2 = 200%
  radius?: number;      // lens radius in px
  border?: string;      // e.g. "1px solid rgba(255,255,255,.6)"
  shadow?: string;      // e.g. "0 6px 18px rgba(0,0,0,.25)"
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
};

export default function MagnifierImage({
  src,
  alt,
  className,
  zoom = 2.0,
  radius = 120,
  border = "1px solid rgba(255,255,255,.6)",
  shadow = "0 10px 28px rgba(0,0,0,.25)",
  priority,
  sizes = "100vw",
  width = 1600,
  height = 900,
}: MagnifierImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [lens, setLens] = useState({
    show: false,
    x: 0,
    y: 0,
    imgW: 0,
    imgH: 0,
    src: "" as string,
  });

  const lensSize = useMemo(() => radius * 2, [radius]);

  const handleEnter = () => setLens((l) => ({ ...l, show: true }));
  const handleLeave = () => setLens((l) => ({ ...l, show: false }));

  const handleMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!wrapRef.current || !imgRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();

    // pointer position within the image box
    const px = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const py = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);

    const img = imgRef.current;
    const currentSrc = (img as any).currentSrc || img.src;

    // keep track of the rendered CSS size and the natural bitmap size
    const cssW = rect.width;
    const cssH = rect.height;

    const naturalW = img.naturalWidth || cssW;
    const naturalH = img.naturalHeight || cssH;

    // map CSS coords → natural coords for accurate background-position
    const nx = (px / cssW) * naturalW;
    const ny = (py / cssH) * naturalH;

    setLens({
      show: true,
      x: px,
      y: py,
      imgW: naturalW,
      imgH: naturalH,
      src: currentSrc,
    });

    // prevent scrolling on touch while moving
    if (e.pointerType === "touch") e.preventDefault();
  };

  return (
    <div
      ref={wrapRef}
      className={clsx("relative inline-block select-none", className)}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onPointerMove={handleMove}
      onPointerDown={handleMove}
      onPointerUp={handleLeave}
    >
      <div className="absolute -top-8 -left-12 w-8 h-[1px] bg-red-500"></div>
      <Image
        ref={imgRef as any}
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="w-full h-auto block"
      />

      {/* Lens */}
      {lens.show && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: lens.x,
            top: lens.y,
            transform: "translate(-50%, -50%)",
            width: lensSize,
            height: lensSize,
            borderRadius: "9999px",
            overflow: "hidden",
            border,
            boxShadow: shadow,
            pointerEvents: "none",
            // hi-res background tied to the actual served src
            backgroundImage: `url("${lens.src}")`,
            backgroundRepeat: "no-repeat",
            // scale the bitmap by zoom
            backgroundSize: `${lens.imgW * zoom}px ${lens.imgH * zoom}px`,
            // position background so the lens center matches the pointer
            backgroundPosition: `-${(lens.x / (wrapRef.current?.clientWidth || 1)) * lens.imgW * zoom - lensSize / 2}px
                                 -${(lens.y / (wrapRef.current?.clientHeight || 1)) * lens.imgH * zoom - lensSize / 2}px`,
            // nice glassy feel
            backdropFilter: "saturate(130%)",
          }}
        />
      )}
    </div>
  );
}
