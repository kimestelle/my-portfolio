"use client";

import { useCallback, useEffect, useRef } from "react";
import MuxPlayer, { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { useIsVisible } from "../../hooks/use-is-visible";

type LazyVideoProps = {
  playbackId: string;
  poster?: string;
  alt?: string;
  className?: string;
  muted?: boolean;
  loop?: boolean;
};

export default function LazyVideo({
  playbackId,
  poster,
  alt,
  className,
  muted = true,
  loop = true,
}: LazyVideoProps) {
  const { isVisible, targetRef } = useIsVisible(
    { root: null, rootMargin: "200px", threshold: 0.1 },
    false
  );

  const playerRef = useRef<MuxPlayerRefAttributes>(null);

  const play = useCallback(async () => {
    try {
      await playerRef.current?.play();
    } catch {}
  }, []);

  const pause = useCallback(() => {
    try {
      playerRef.current?.pause();
    } catch {}
  }, []);

  useEffect(() => {
    if (isVisible) play();
    else pause();
  }, [isVisible, play, pause]);

  return (
    <span ref={targetRef as any} style={{ position: "relative", minHeight: 50, height: "100%" }}>
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        poster={poster}
        streamType="on-demand"
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        autoPlay={false}
        className={className}
        aria-label={alt || "video"}
      />
    </span>
  );
}
