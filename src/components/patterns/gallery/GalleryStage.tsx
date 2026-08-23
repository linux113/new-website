"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import type { MediaRef } from "@/content/types";

interface GalleryStageProps {
  media: MediaRef | null;
  /** 1-based index and total, announced + shown in the mono counter. */
  index: number;
  total: number;
  /** Open the lightbox (zoom affordance). */
  onZoom?: () => void;
  className?: string;
}

/**
 * Gallery main stage (DS §15).
 * 4:3 media surface (Carbon behind — no white flash), crossfade
 * handled by keyed opacity in the parent; click/Enter zooms into the
 * lightbox. Technical drawings (kind: "dwg") render on White for
 * legibility, not Zinc (DS §15).
 */
export function GalleryStage({
  media,
  index,
  total,
  onZoom,
  className,
}: GalleryStageProps) {
  const isDrawing = media?.kind === "dwg";

  const frame = cn(
    "relative aspect-4/3 w-full overflow-hidden",
    isDrawing ? "bg-paper-raised" : "bg-ink",
    className,
  );

  if (!media?.src) {
    return (
      <div
        className={cn(frame, "bg-paper-sunken")}
        role="img"
        aria-label={media?.alt || "Product image pending"}
      >
        <div className="absolute inset-0 flex items-center justify-center border border-edge p-4">
          <p className="text-mono-micro text-center text-mist">
            {media?.placeholderLabel ?? "IMAGE — [AWAITING CLIENT ASSET]"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onZoom}
      aria-label={`Zoom image ${index} of ${total}: ${media.alt}`}
      className={cn(frame, "block cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent")}
    >
      <Image
        key={media.src}
        src={media.src}
        alt={media.alt}
        fill
        sizes="(min-width: 64rem) 58vw, 100vw"
        priority={index === 1}
        className={cn(
          isDrawing ? "object-contain p-6" : "object-cover",
          "animate-[fade-in_250ms_var(--ease-inout)] motion-reduce:animate-none",
        )}
      />
      <span className="absolute bottom-3 left-3 bg-ink/70 px-2 py-1 text-mono-micro text-paper">
        {index} / {total}
      </span>
    </button>
  );
}
