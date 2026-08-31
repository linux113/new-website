import { cn } from "@/lib/cn";

interface IndexNumberProps {
  /** 1-based position; rendered zero-padded ("01", "02", …). */
  value: number;
  /** Total count for the "01 / 06" form. Omit for plain "01". */
  of?: number;
  /** Visual scale: meta (12px, default) or micro (11px). */
  size?: "meta" | "micro";
  className?: string;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Engineering-drawing style index glyph "Index Numbering"):
 * "01" or "01 / 06". Mono, tabular, muted; turns accent on parent
 * hover via group-hover, Card/Row).
 */
export function IndexNumber({
  value,
  of,
  size = "meta",
  className,
}: IndexNumberProps) {
  return (
    <span
      className={cn(
        size === "meta" ? "text-mono-meta" : "text-mono-micro",
        "text-surface-muted tabular-nums transition-colors duration-(--duration-base) group-hover:text-accent",
        className,
      )}
    >
      {pad(value)}
      {typeof of === "number" ? (
        <span aria-hidden="true"> / {pad(of)}</span>
      ) : null}
    </span>
  );
}
