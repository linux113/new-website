import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface SectionHeadingProps {
  /** Section code for the eyebrow, e.g. "SM–04". */
  code?: string;
  /** Eyebrow label, e.g. "CAPABILITIES". */
  eyebrow?: string;
  /** The heading itself. */
  title: string;
  /** Optional lede paragraph (body-lg, max 65ch). */
  lede?: string;
  /**
   * Layout (DS §18 "Editorial offsets"):
   * - "offset": heading cols 1–5, lede cols 7–12 (the signature split)
   * - "start":  stacked, left-aligned
   */
  align?: "offset" | "start";
  /** Heading level for document outline (default h2). */
  as?: "h1" | "h2" | "h3";
  /** id for aria-labelledby wiring on the parent <Section>. */
  id?: string;
  className?: string;
}

/**
 * The mandatory section heading pattern (DS §17):
 * mono eyebrow → display-lg title → optional body-lg lede,
 * set on the 12-column editorial grid.
 */
export function SectionHeading({
  code,
  eyebrow,
  title,
  lede,
  align = "offset",
  as: Tag = "h2",
  id,
  className,
}: SectionHeadingProps) {
  if (align === "start") {
    return (
      <header className={cn("flex flex-col gap-4", className)}>
        {eyebrow ? <Eyebrow code={code}>{eyebrow}</Eyebrow> : null}
        <Tag id={id} className="text-display-lg text-surface-fg text-balance">
          {title}
        </Tag>
        {lede ? (
          <p className="text-body-lg text-surface-muted max-w-measure mt-2">
            {lede}
          </p>
        ) : null}
      </header>
    );
  }

  return (
    <header
      className={cn("grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8", className)}
    >
      <div className="col-span-4 flex flex-col gap-4 md:col-span-5">
        {eyebrow ? <Eyebrow code={code}>{eyebrow}</Eyebrow> : null}
        <Tag id={id} className="text-display-lg text-surface-fg text-balance">
          {title}
        </Tag>
      </div>
      {lede ? (
        <div className="col-span-4 md:col-span-5 md:col-start-7 lg:col-start-8 md:self-end">
          <p className="text-body-lg text-surface-muted max-w-measure">
            {lede}
          </p>
        </div>
      ) : null}
    </header>
  );
}
