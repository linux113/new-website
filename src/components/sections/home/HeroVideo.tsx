"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/components/motion";

/**
 * Hero video plate.
 * Plays the client's sequence ONCE and freezes on the final frame
 * (the 3D SRIYAAN METALS logo wall) — no endless looping. `loop` is
 * intentionally absent; `onEnded` pins the last frame explicitly so
 * every browser holds it. Reduced motion: video never plays; the
 * final frame renders as a static poster.
 *
 * Positioned right-weighted (the reference's "right-side video
 * atmosphere"): object-position favors the right on wide screens
 * where the left is covered by the scrim anyway.
 */
export function HeroVideo() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduced) {
      video.pause();
      return;
    }

    const pinLastFrame = () => {
      // Seek a hair before the end so the exact closing frame stays.
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.max(video.duration - 0.05, 0);
      }
      video.pause();
    };
    video.addEventListener("ended", pinLastFrame);
    // Autoplay can be blocked; try once, fall back to poster silently.
    video.play().catch(() => undefined);

    return () => video.removeEventListener("ended", pinLastFrame);
  }, [reduced]);

  if (reduced) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-[position:70%_top]"
        style={{ backgroundImage: "url(/hero-frames/frame-46.jpg)" }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-[70%_top] lg:object-[right_top]"
      src="/hero.mp4"
      poster="/hero-frames/frame-01.jpg"
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
