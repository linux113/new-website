/**
 * Skip-to-content link. First element in the DOM;
 * visually hidden until focused, then presented as a solid
 * accent block in the top-left corner.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="text-label sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:block focus-visible:rounded-xs focus-visible:bg-accent focus-visible:px-6 focus-visible:py-3 focus-visible:text-paper-raised"
    >
      Skip to content
    </a>
  );
}
