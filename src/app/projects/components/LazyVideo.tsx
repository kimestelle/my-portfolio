"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MuxPlayer, {
  MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from "@mux/mux-player-react";
import { useIsVisible } from "../../hooks/use-is-visible";

export type LazyVideoProps = {
  playbackId: string;
  poster?: string;
  alt?: string;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  active?: boolean;
  preload?: "none" | "metadata" | "auto";
  maxResolution?: MuxPlayerProps["maxResolution"];
  onReady?: () => void;
};

export default function LazyVideo({
  playbackId,
  poster,
  alt,
  className,
  muted = true,
  loop = true,
  active,
  preload = "metadata",
  maxResolution,
  onReady,
}: LazyVideoProps) {
  const { isVisible, targetRef } = useIsVisible(
    { root: null, rootMargin: "200px", threshold: 0.1 },
    false
  );

  const playerRef = useRef<MuxPlayerRefAttributes>(null);
  const reportedReadyRef = useRef(false);
  const [mediaReady, setMediaReady] = useState(false);
  const shouldPlay = active ?? isVisible;

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
    if (shouldPlay) play();
    else pause();
  }, [mediaReady, shouldPlay, play, pause]);

  useEffect(() => {
    reportedReadyRef.current = false;
    setMediaReady(false);
  }, [playbackId]);

  const reportReady = useCallback(() => {
    setMediaReady(true);
    if (reportedReadyRef.current) return;
    reportedReadyRef.current = true;
    onReady?.();
  }, [onReady]);

  return (
    <span
      ref={targetRef as any}
      style={{
        display: "block",
        position: "relative",
        minHeight: 50,
        width: "100%",
        height: "100%",
      }}
    >
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        poster={poster}
        streamType="on-demand"
        muted={muted}
        loop={loop}
        playsInline
        preload={preload}
        maxResolution={maxResolution}
        autoPlay={false}
        onLoadedData={reportReady}
        onCanPlay={reportReady}
        onPlaying={reportReady}
        className={className}
        aria-label={alt || "video"}
      />
    </span>
  );
}
