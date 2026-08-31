import { cn } from "@/lib/cn";

interface EmptyStateProps {
  /** Mono meta line, e.g. "NO RESULTS". */
  meta?: string;
  /** Short factual heading. */
  title: string;
  /** One sentence of guidance. */
  description?: string;
  /** One Secondary button or Ghost link (never Primary —. */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Empty state. Honest and useful: centered in the content
 * region (not the viewport), max-width 420px, no illustrations or
 * mascots, no functional colors (empty ≠ error).
 */
export function EmptyState({
  meta = "NO RESULTS",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-105 flex-col items-center gap-4 py-16 text-center",
        className,
      )}
    >
      <p className="text-mono-meta text-surface-muted">{meta}</p>
      <p className="text-display-md text-surface-fg">{title}</p>
      {description ? (
        <p className="text-body-sm text-surface-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
