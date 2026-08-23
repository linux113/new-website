/**
 * Type shim for the untyped `threejs-components` package
 * (used by components/ui/firework-cursor.tsx). The library exposes
 * factory functions keyed by effect name; the wrapper treats the
 * returned app object as opaque.
 */
declare module "threejs-components" {
  type EffectFactory = (
    canvas: HTMLCanvasElement,
    config?: Record<string, unknown>,
  ) => unknown;

  export const cursors: Record<string, EffectFactory> | undefined;

  const defaultExport: {
    cursors?: Record<string, EffectFactory>;
  };
  export default defaultExport;
}

declare module "threejs-components/build/cursors/particles1.min.js" {
  const Particles1Cursor: (
    canvas: HTMLCanvasElement,
    config?: Record<string, unknown>,
  ) => unknown;
  export default Particles1Cursor;
}
