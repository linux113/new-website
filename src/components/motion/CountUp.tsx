"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "./useReducedMotion";

interface CountUpProps {
  /** Target value. When null, renders the placeholder (DS §31.1). */
  value: number | null;
  /** Placeholder shown when value is null, e.g. "[—]". */
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  /** Decimal places in the rendered number. */
  decimals?: number;
  /** Locale for number formatting. */
  locale?: string;
  className?: string;
}

const EASE_OUT_QUART = (t: number) => 1 - Math.pow(1 - t, 4);
const DURATION = 1200; // --duration-counter (DS §20)

/**
 * Number counter (DS §20 allowed list, item 5).
 * Counts up once on first visibility over --duration-counter with
 * ease-out; tabular-nums so width never shifts (zero CLS). Under
 * reduced motion the final value renders immediately. Never loops.
 * SSR/no-JS renders the final value — the animation only ever
 * *starts* from 0 client-side after the element scrolls into view.
 */
export function CountUp({
  value,
  placeholder = "[—]",
  prefix = "",
  suffix = "",
  decimals = 0,
  locale = "en",
  className,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // null = not animating → render the final value directly.
  const [animated, setAnimated] = useState<number | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (value === null || reduced || done.current) return;
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || done.current) continue;
          done.current = true;
          observer.disconnect();

          const t0 = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - t0) / DURATION, 1);
            if (progress < 1) {
              setAnimated(value * EASE_OUT_QUART(progress));
              raf = requestAnimationFrame(tick);
            } else {
              setAnimated(null); // finished — fall back to exact final value
            }
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, reduced]);

  if (value === null) {
    return (
      <span className={cn("tabular-nums", className)}>{placeholder}</span>
    );
  }

  const current = !reduced && animated !== null ? animated : value;
  const rendered = current.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}
