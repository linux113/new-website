import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Category } from "@/content/types";
import { PatternMedia } from "./PatternMedia";

interface CategoryTileProps {
  category: Category;
  hrefBase?: string;
  /** Aspect ratio of the tile media. Editorial default 3:2. */
  ratio?: "3/2" | "4/3" | "16/9" | "4/5";
  className?: string;
}

/**
 * Editorial category tile (DS §11 Card/Media + §2 signature moves).
 * Graded image (Steel Duotone) with mono index + title overlaid in
 * the lower-left third (DS §25.3); subtle image scale on hover.
 * Missing images degrade to the honest placeholder panel.
 */
export function CategoryTile({
  category,
  hrefBase = "/products",
  ratio = "3/2",
  className,
}: CategoryTileProps) {
  return (
    <Link
      href={`/products/category/${category.slug}`}
      className={cn("group relative block", className)}
    >
      <PatternMedia
        media={category.image}
        ratio={ratio}
        sizes="(min-width: 64rem) 50vw, 100vw"
        surface="media"
        graded
        hoverScale
      />

      {/* Carbon overlay for text legibility (DS §25.1) */}
      {category.image?.src ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-ink/28 transition-colors duration-(--duration-base) group-hover:bg-ink/20"
        />
      ) : null}

      {/* Text block — lower/left third (DS §25.3) */}
      <div
        data-surface="dark"
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 lg:p-8",
          !category.image?.src && "text-ink",
        )}
      >
        <p
          className={cn(
            "text-mono-meta tabular-nums",
            category.image?.src ? "text-paper/80" : "text-slate",
          )}
        >
          {category.index}
        </p>
        <p
          className={cn(
            "text-display-md flex items-baseline gap-3",
            category.image?.src ? "text-paper" : "text-ink",
          )}
        >
          {category.title}
          <span
            aria-hidden="true"
            className="text-heading-sm opacity-0 transition-[opacity,translate] duration-(--duration-base) group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transition-none"
          >
            →
          </span>
        </p>
        {category.description ? (
          <p
            className={cn(
              "text-body-sm max-w-measure",
              category.image?.src ? "text-paper/70" : "text-slate",
            )}
          >
            {category.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
