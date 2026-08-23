"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * The shared reduced-motion hook (DS §20).
 * Every component in src/components/motion/ MUST consume this —
 * it is the single enforcement point for prefers-reduced-motion.
 *
 * Server snapshot returns false so SSR markup matches the common
 * case; components are designed so pre-hydration content is always
 * visible/final regardless (no motion primitive may hide the LCP).
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
