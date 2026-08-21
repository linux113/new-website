import Link from "next/link";
import { cn } from "@/lib/cn";
import { IndexNumber } from "@/components/ui";
import type { Industry } from "@/content/types";

interface IndustryRowProps {
  industry: Industry;
  /** 1-based position for the index glyph. */
  position: number;
  /** Total rows (renders "01 / 06" form when set). */
  total?: number;
  className?: string;
}

/**
 * Industry row (DS §11 Card/Row — the preferred "list of things"
 * pattern over card grids). Ruled row: index + name + optional
 * description + arrow. Hover: Zinc Wash bg, index → accent, arrow
 * slides in. Renders a link when `href` exists, else a static row.
 */
export function IndustryRow({
  industry,
  position,
  total,
  className,
}: IndustryRowProps) {
  const inner = (
    <>
      <IndexNumber value={position} of={total} className="pt-1.5" />
      <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
        <span className="text-display-md text-surface-fg">{industry.name}</span>
        {industry.description ? (
          <span className="text-body-sm text-surface-muted max-w-measure">
            {industry.description}
          </span>
        ) : null}
      </span>
      {industry.href ? (
        <span
          aria-hidden="true"
          className="hidden self-center text-heading-sm text-surface-muted opacity-0 transition-[opacity,translate] duration-(--duration-base) group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transition-none sm:block"
        >
          →
        </span>
      ) : null}
    </>
  );

  const rowClass = cn(
    "group flex items-start gap-6 border-b border-edge py-6 lg:py-8",
    "transition-colors duration-(--duration-base) motion-reduce:transition-none",
    industry.href && "hover:bg-paper-sunken",
    className,
  );

  if (industry.href) {
    return (
      <Link href={industry.href} className={rowClass}>
        {inner}
      </Link>
    );
  }

  return <div className={rowClass}>{inner}</div>;
}
