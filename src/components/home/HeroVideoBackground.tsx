"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/components/motion";

/**
 * Hero background — the client's brand video as a smooth native
 * <video> (no frame crossfading, no jank).
 *
 *   - autoplays muted + inline, full-bleed object-cover
 *   - plays through, holds ~1.8s on the final frame, then replays
 *   - cinematic grade + bottom fade keep the foreground text legible
 *   - prefers-reduced-motion: static poster, no playback
 */
export function HeroVideoBackground() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hold on the final frame briefly before replaying.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onEnded = () => {
      timer = setTimeout(() => {
        video.play().catch(() => {});
      }, 1800);
    };
    video.addEventListener("ended", onEnded);
    video.play().catch(() => {});
    return () => {
      video.removeEventListener("ended", onEnded);
      if (timer) clearTimeout(timer);
    };
  }, [reduced]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-[#05080B]">
      <video
        ref={videoRef}
        src="/videos/workers-loading-cargo-truck.mp4"
        poster="/images/home/hero-metal.jpg"
        muted
        playsInline
        preload="auto"
        autoPlay={!reduced}
        className="absolute inset-0 h-full w-full scale-[1.02] object-cover"
      />

      {/* Even vertical scrim — no side/horizontal shading (that used to
          darken one half of the video). Becomes progressively heavier
          toward the bottom two-thirds where the headline, copy, CTAs and
          info bar sit, so text stays legible on bright footage frames
          while the footage remains clearly visible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,8,11,0.40) 0%, rgba(5,8,11,0.34) 32%, rgba(5,8,11,0.52) 58%, rgba(5,8,11,0.70) 78%, rgba(5,8,11,0.88) 100%)",
        }}
      />
    </div>
  );
}
