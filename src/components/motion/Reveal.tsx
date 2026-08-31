"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "./useReducedMotion";

interface RevealProps {
  children: React.ReactNode;
  /** Extra delay in ms after the element becomes visible. */
  delay?: number;
  /** Re-animate every time it enters the viewport. Default: once. */
  once?: boolean;
  /** Escape hatch — render children statically with zero motion. */
  disabled?: boolean;
  /** Wrapper element. Default "div". */
  as?: "div" | "section" | "ul" | "li" | "span";
  className?: string;
}

/**
 * Scroll reveal allowed list, item 1).
 * opacity 0→1 + translateY 16px→0 over --duration-slow with
 * ease-out-quart, triggered at 20% visibility via IntersectionObserver.
 * Runs once per page load by default. Under reduced motion (or
 * `disabled`), renders the final state with no transition.
 *
 * Apply to section blocks, not individual paragraphs.
 * Never wrap the LCP/hero content in a Reveal.
 */
export function Reveal({
  children,
  delay = 0,
  once = true,
  disabled = false,
  as: Tag = "div",
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  const inert = disabled || reduced;

  useEffect(() => {
    if (inert) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inert, once]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn(
        !inert &&
          "transition-[opacity,translate] duration-(--duration-slow) ease-(--ease-out-quart) motion-reduce:transition-none",
        !inert && (visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
        className,
      )}
      style={!inert && delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
