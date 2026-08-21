"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "./useReducedMotion";

interface ParallaxProps {
  /** The image (typically next/image with `fill`). */
  children: React.ReactNode;
  /**
   * Travel as a fraction of container height (DS §21: ≤ 0.08).
   * Values above 0.08 are clamped.
   */
  range?: number;
  /** Fixed aspect ratio of the frame — required, prevents CLS. */
  ratio?: "16/9" | "3/2" | "4/3" | "1/1" | "4/5";
  /** Disable entirely (renders a static clipped frame). */
  disabled?: boolean;
  className?: string;
}

const RATIO_CLASS: Record<NonNullable<ParallaxProps["ratio"]>, string> = {
  "16/9": "aspect-video",
  "3/2": "aspect-3/2",
  "4/3": "aspect-4/3",
  "1/1": "aspect-square",
  "4/5": "aspect-4/5",
};

/**
 * Image parallax (DS §21). Images shift like heavy plates — slightly.
 *
 * Implementation: the child layer is rendered ~116% height inside an
 * overflow-hidden fixed-ratio frame and translated with transform only.
 * Scroll progress is computed in a passive scroll handler that merely
 * schedules a requestAnimationFrame write (no layout work in the
 * scroll callback; reads are cached per-frame). An IntersectionObserver
 * gates the whole thing so offscreen frames cost nothing.
 *
 * Kill switches (DS §21.5): prefers-reduced-motion, `disabled` prop,
 * and touch/coarse-pointer devices below lg — all render static.
 */
export function Parallax({
  children,
  range = 0.08,
  ratio = "16/9",
  disabled = false,
  className,
}: ParallaxProps) {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const travel = Math.min(Math.max(range, 0), 0.08);

  useEffect(() => {
    if (disabled || reduced) return;

    // Kill switch: touch devices < lg (DS §21.5)
    const coarse = window.matchMedia(
      "(pointer: coarse) and (max-width: 63.9375rem)",
    ).matches;
    if (coarse) return;

    const frame = frameRef.current;
    const layer = layerRef.current;
    if (!frame || !layer) return;

    let active = false;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress of the frame through the viewport: 0 (entering) → 1 (leaving)
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.min(Math.max(progress, 0), 1);
      const shift = (clamped - 0.5) * 2 * travel * rect.height;
      layer.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    };

    const schedule = () => {
      if (active && raf === 0) raf = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        active = entry.isIntersecting;
        if (active) schedule();
      }
    });

    observer.observe(frame);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [disabled, reduced, travel]);

  const still = disabled || reduced;

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative overflow-hidden bg-ink", // surface-media: no white flash (DS §9)
        RATIO_CLASS[ratio],
        className,
      )}
    >
      <div
        ref={layerRef}
        className={cn(
          "absolute inset-x-0 will-change-transform",
          // Layer is oversized so travel never exposes edges (no CLS):
          still ? "inset-y-0" : "-top-[8%] -bottom-[8%]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
