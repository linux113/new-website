"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Site-wide inertial scroll. Instantiated once on the public layout.
 * Disabled entirely when the visitor prefers reduced motion so native
 * scrolling (and CSS scroll-behavior) remain untouched.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.9,
      autoRaf: false,
      respectReducedMotion: false,
    });

    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
