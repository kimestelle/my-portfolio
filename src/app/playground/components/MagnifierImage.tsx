"use client";

import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
import clsx from "clsx";

type Props = {
  src: string;
  alt: string;
  className?: string;

  zoom?: number; // base zoom
  radius?: number;

  priority?: boolean;
  sizes?: string;
  fit?: "contain" | "cover";
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function getContentRect(
  boxW: number,
  boxH: number,
  naturalW: number,
  naturalH: number,
  fit: "contain" | "cover"
) {
  // image scale to fit box
  const scale =
    fit === "contain"
      ? Math.min(boxW / naturalW, boxH / naturalH)
      : Math.max(boxW / naturalW, boxH / naturalH);

  const contentW = naturalW * scale;
  const contentH = naturalH * scale;

  // centered object position
  const offX = (boxW - contentW) / 2;
  const offY = (boxH - contentH) / 2;

  return { scale, offX, offY, contentW, contentH };
}

export default function MagnifierImage({
  src,
  alt,
  className,
  zoom = 2,
  radius = 120,
  priority,
  sizes = "100vw",
  fit = "contain",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const [meta, setMeta] = useState({
    currentSrc: src,
    naturalW: 0,
    naturalH: 0,
  });

  const [lens, setLens] = useState({
    show: false,
    cx: 0,
    cy: 0,
    nx: 0,
    ny: 0,
  });

  const lensSize = useMemo(() => radius * 2, [radius]);

  function updateFromClient(clientX: number, clientY: number) {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const naturalW = meta.naturalW || rect.width || 1;
    const naturalH = meta.naturalH || rect.height || 1;

    const { scale, offX, offY, contentW, contentH } = getContentRect(
      rect.width,
      rect.height,
      naturalW,
      naturalH,
      fit
    );

    // only show lens while pointer is in image
    const inImage =
      x >= offX && x <= offX + contentW && y >= offY && y <= offY + contentH;

    if (!inImage) {
      setLens((l) => (l.show ? { ...l, show: false } : l));
      return;
    }

    // wrapper to natural coords
    const nx = clamp((x - offX) / scale, 0, naturalW);
    const ny = clamp((y - offY) / scale, 0, naturalH);

    setLens({ show: true, cx: x, cy: y, nx, ny });
  }

  const onMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    updateFromClient(e.clientX, e.clientY);
    if (e.pointerType === "touch") e.preventDefault();
  };

  const onDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    updateFromClient(e.clientX, e.clientY);
    if (e.pointerType === "touch") e.preventDefault();
  };

  const onUp: React.PointerEventHandler<HTMLDivElement> = () => {
    setLens((l) => ({ ...l, show: false }));
  };

  // background position for lens
  const bgX = -(lens.nx * zoom - lensSize / 2);
  const bgY = -(lens.ny * zoom - lensSize / 2);

  return (
    <div
      ref={wrapRef}
      className={clsx("relative select-none", className)}
      style={{ touchAction: "none" }}
      onPointerMove={onMove}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        draggable={false}
        className={clsx("block", fit === "contain" ? "object-contain" : "object-cover")}
        onLoadingComplete={(img) => {
          const currentSrc = (img as any).currentSrc || img.src || src;
          setMeta({
            currentSrc,
            naturalW: img.naturalWidth || 0,
            naturalH: img.naturalHeight || 0,
          });
        }}
      />

      {lens.show && (
        <div
          aria-hidden
          className="pointer-events-none"
          style={{
            position: "absolute",
            left: lens.cx,
            top: lens.cy,
            transform: "translate(-50%, -50%)",
            width: lensSize,
            height: lensSize,
            borderRadius: "9999px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.6)",
            boxShadow: "0 10px 28px rgba(0,0,0,.25)",
            backgroundImage: `url("${meta.currentSrc}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${(meta.naturalW || 1) * zoom}px ${(meta.naturalH || 1) * zoom}px`,
            backgroundPosition: `${bgX}px ${bgY}px`,
          }}
        />
      )}
    </div>
  );
}
