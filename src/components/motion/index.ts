/**
 * Motion layer — the single animation layer of the site.
 * All scroll/entrance/counter motion flows through these primitives so
 * IntersectionObserver usage, durations, easing and
 * prefers-reduced-motion stay consistent. Transform + opacity only,
 * run-once by default, no motion on LCP content.
 */
export { Reveal } from "./Reveal";
export { CountUp } from "./CountUp";
export { useReducedMotion } from "./useReducedMotion";
export { SmoothScroll } from "./SmoothScroll";
