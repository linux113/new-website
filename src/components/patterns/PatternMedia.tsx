import Image from "next/image";
import { cn } from "@/lib/cn";
import type { MediaRef } from "@/content/types";

type Ratio = "16/9" | "3/2" | "4/3" | "1/1" | "4/5";

const RATIO_CLASS: Record<Ratio, string> = {
  "16/9": "aspect-video",
  "3/2": "aspect-3/2",
  "4/3": "aspect-4/3",
  "1/1": "aspect-square",
  "4/5": "aspect-4/5",
};

interface PatternMediaProps {
  media: MediaRef | null;
  /** Fixed aspect ratio — mandatory, prevents CLS (DS §25.2). */
  ratio: Ratio;
  /** next/image sizes attribute (DS §25.6 — mandatory when src set). */
  sizes: string;
  /** LCP image only (DS §25.6). */
  priority?: boolean;
  /**
   * Surface behind the image / placeholder. "media" = Carbon
   * (editorial, DS §9); "sunken" = Zinc Wash (product truth, DS §14).
   */
  surface?: "media" | "sunken";
  /** Apply the Steel Duotone grade (editorial imagery only, DS §25.1). */
  graded?: boolean;
  /** Scale image on group hover (DS §22 — inside clipped frame). */
  hoverScale?: boolean;
  className?: string;
}

/**
 * Shared media block for all patterns (DS §25).
 * Renders next/image inside a fixed-ratio clipped frame; when
 * `media.src` is null, renders the honest placeholder panel with a
 * mono label — never a fake photo (DS §25.7).
 */
export function PatternMedia({
  media,
  ratio,
  sizes,
  priority = false,
  surface = "sunken",
  graded = false,
  hoverScale = false,
  className,
}: PatternMediaProps) {
  const frame = cn(
    "relative overflow-hidden",
    RATIO_CLASS[ratio],
    surface === "media" ? "bg-ink" : "bg-paper-sunken",
    className,
  );

  if (!media?.src) {
    return (
      <div className={frame} role="img" aria-label={media?.alt || "Image pending"}>
        <div className="absolute inset-0 flex items-center justify-center border border-edge p-4">
          <p className="text-mono-micro text-center text-mist">
            {media?.placeholderLabel ?? "IMAGE — [AWAITING CLIENT ASSET]"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={frame}>
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover",
          graded && "brightness-[0.98] contrast-[1.06] saturate-[0.72]",
          hoverScale &&
            "transition-transform duration-(--duration-base) ease-(--ease-out-quart) group-hover:scale-104 motion-reduce:transition-none motion-reduce:group-hover:scale-100",
        )}
      />
    </div>
  );
}
