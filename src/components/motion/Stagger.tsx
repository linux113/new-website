"use client";

import { Children, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "./useReducedMotion";

interface StaggerProps {
  children: React.ReactNode;
  /** Per-child offset in ms. DS §20: 60–80ms. Default 70. */
  interval?: number;
  /** Base delay before the first child, in ms. */
  delay?: number;
  /** Escape hatch — render children statically. */
  disabled?: boolean;
  /** Wrapper element. Use "ul"/"ol" with li children for lists. */
  as?: "div" | "ul" | "ol";
  /** Element used to wrap each child. Auto-matches list wrappers. */
  itemAs?: "div" | "li";
  className?: string;
  /** Class applied to each item wrapper (e.g. grid cell styles). */
  itemClassName?: string;
}

const MAX_STAGGERED = 6;

/**
 * Staggered entrance (DS §20 allowed list, item 2).
 * Children of a revealed group offset by 60–80ms each. Beyond 6
 * children the remainder reveals together with the sixth (DS §20:
 * "max 6 staggered items — beyond 6, reveal as one").
 * IntersectionObserver on the group; transform+opacity only; runs once.
 */
export function Stagger({
  children,
  interval = 70,
  delay = 0,
  disabled = false,
  as: Tag = "div",
  itemAs,
  className,
  itemClassName,
}: StaggerProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  const inert = disabled || reduced;
  const Item = itemAs ?? (Tag === "div" ? "div" : "li");

  useEffect(() => {
    if (inert) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inert]);

  const items = Children.toArray(children);

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {items.map((child, i) => (
        <Item
          key={i}
          className={cn(
            !inert &&
              "transition-[opacity,translate] duration-(--duration-slow) ease-(--ease-out-quart) motion-reduce:transition-none",
            !inert &&
              (visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
            itemClassName,
          )}
          style={
            !inert
              ? { transitionDelay: `${delay + Math.min(i, MAX_STAGGERED - 1) * interval}ms` }
              : undefined
          }
        >
          {child}
        </Item>
      ))}
    </Tag>
  );
}
