/**
 * SRIYAAN METALS — motion layer barrel (FORGE/01).
 *
 * THE ONLY animation layer (docs/COMPONENT-ARCHITECTURE.md §1.4).
 * All scroll/entrance/parallax/counter motion flows through these
 * primitives so IntersectionObserver usage, durations, easing and
 * prefers-reduced-motion are enforced in exactly one place.
 *
 * Rules (DS §20): transform + opacity only, run-once by default,
 * no motion on LCP content, no third-party animation libraries.
 */
export { Reveal } from "./Reveal";
export { Stagger } from "./Stagger";
export { Parallax } from "./Parallax";
export { CountUp } from "./CountUp";
export { useReducedMotion } from "./useReducedMotion";
export { SmoothScroll } from "./SmoothScroll";
