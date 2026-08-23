import { cn } from "@/lib/cn";

interface EyebrowProps {
  /** Section code, e.g. "SM–04" (DS §2 "Index Numbering"). */
  code?: string;
  /** Eyebrow label, e.g. "CAPABILITIES". */
  children: React.ReactNode;
  className?: string;
}

/**
 * Mono meta-layer eyebrow (DS §17): `SM–04 / CAPABILITIES`.
 * 12px IBM Plex Mono, uppercase, tracked. The code renders in accent;
 * the label in the surface's muted foreground.
 */
export function Eyebrow({ code, children, className }: EyebrowProps) {
  return (
    <p className={cn("text-mono-meta text-surface-muted", className)}>
      {code ? (
        <>
          <span className="text-accent">{code}</span>
          <span aria-hidden="true"> / </span>
        </>
      ) : null}
      {children}
    </p>
  );
}
