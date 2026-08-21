import { cn } from "@/lib/cn";
import type { MediaRef } from "@/content/types";
import { PatternMedia } from "./PatternMedia";

interface MediaFigureProps {
  media: MediaRef | null;
  /** Figure number → renders mono "FIG. 04". */
  figure?: number;
  /**
   * Caption text. Do not invent captions — pass placeholder copy
   * (e.g. "[DESCRIPTION PLACEHOLDER]") until client content exists.
   */
  caption?: string;
  ratio?: "16/9" | "3/2" | "4/3" | "1/1";
  sizes?: string;
  priority?: boolean;
  /** Editorial imagery gets the Steel Duotone grade (DS §25.1). */
  graded?: boolean;
  className?: string;
}

/**
 * Media figure (DS §25.4): graded editorial image + mono caption in
 * the "FIG. 04 — [DESCRIPTION]" format. Fixed ratio (zero CLS),
 * next/image via PatternMedia, honest placeholder when src is null.
 */
export function MediaFigure({
  media,
  figure,
  caption,
  ratio = "3/2",
  sizes = "(min-width: 64rem) 50vw, 100vw",
  priority = false,
  graded = true,
  className,
}: MediaFigureProps) {
  const label =
    figure !== undefined
      ? `FIG. ${figure.toString().padStart(2, "0")}`
      : undefined;

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <PatternMedia
        media={media}
        ratio={ratio}
        sizes={sizes}
        priority={priority}
        surface="media"
        graded={graded}
      />
      {label || caption ? (
        <figcaption className="text-mono-micro text-surface-muted">
          {label}
          {label && caption ? <span aria-hidden="true"> — </span> : null}
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
