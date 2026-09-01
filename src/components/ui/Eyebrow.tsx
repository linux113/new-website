import { cn } from "@/lib/cn";

interface EyebrowProps {
  /**
   * Deprecated section code (e.g. "SM–04"). No longer rendered —
   * kept as an accepted prop so existing call sites keep working.
   */
  code?: string;
  /** Eyebrow label, e.g. "FEATURED". */
  children: React.ReactNode;
  className?: string;
}

/** Section label — FEATURED, CATALOGUE, INSIGHTS, etc. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-[1rem] font-semibold uppercase tracking-[0.16em] text-[#C8A45D]",
        className,
      )}
    >
      {children}
    </p>
  );
}
