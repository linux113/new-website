import { cn } from "@/lib/cn";

interface EyebrowProps {
  /**
   * Deprecated section code (e.g. "SM–04"). No longer rendered —
   * kept as an accepted prop so existing call sites keep working.
   */
  code?: string;
  /** Eyebrow label, e.g. "CAPABILITIES". */
  children: React.ReactNode;
  className?: string;
}

/**
 * Mono meta-layer eyebrow (DS §17): `CAPABILITIES`.
 * 12px IBM Plex Mono, uppercase, tracked, in the surface's muted
 * foreground. The legacy "SM–NN / " code prefix has been removed
 * from the design — only the label renders.
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return <p className={cn("text-mono-meta text-surface-muted", className)}>{children}</p>;
}
