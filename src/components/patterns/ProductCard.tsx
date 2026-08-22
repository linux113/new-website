import Link from "next/link";
import { cn } from "@/lib/cn";
import { Hairline, Skeleton } from "@/components/ui";
import type { Product } from "@/content/types";
import { PatternMedia } from "./PatternMedia";

interface ProductCardProps {
  product: Product;
  /** Route prefix for the detail page. */
  hrefBase?: string;
  className?: string;
}

/**
 * Product card (DS §14) — the core commercial unit.
 * 4:3 media on Zinc Wash (ungraded — product truth), mono meta line
 * (CATEGORY · CODE), display name, one-line spec summary, hairline,
 * Enquire ghost link. No prices (B2B, enquiry-driven).
 *
 * Whole card is the link (stretched-link pattern); hover: border →
 * Steel, shadow-raise, image scale 1.04 — all `duration-base`.
 */
export function ProductCard({
  product,
  hrefBase = "/products",
  className,
}: ProductCardProps) {
  const spec = product.specSummary.value ?? product.specSummary.placeholder;

  return (
    <article
      className={cn(
        "group relative flex flex-col border border-edge bg-ink-soft",
        "transition-[border-color,box-shadow,translate] duration-(--duration-base) ease-(--ease-out-quart)",
        "hover:-translate-y-0.5 hover:border-steel hover:shadow-raise",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <PatternMedia
        media={product.media[0] ?? null}
        ratio="4/3"
        sizes="(min-width: 80rem) 25vw, (min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
        surface="sunken"
        hoverScale
      />

      <div className="flex flex-1 flex-col gap-2 p-6 lg:p-8">
        <p className="text-mono-micro text-mist">
          {product.category}
          <span aria-hidden="true"> · </span>
          {product.code}
        </p>

        <h3 className="text-heading-sm font-display font-medium text-paper">
          <Link
            href={`${hrefBase}/${product.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>

        <p className="text-body-sm text-mist line-clamp-1">{spec}</p>

        <Hairline className="mt-auto" />

        <p className="flex items-center gap-2 pt-2 text-label text-paper transition-colors duration-(--duration-base) group-hover:text-accent">
          Enquire
          <span
            aria-hidden="true"
            className="transition-transform duration-(--duration-base) group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </p>
      </div>

      {/* Focus ring for the stretched link (card-level) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 outline-accent group-has-focus-visible:outline-2 group-has-focus-visible:outline-offset-2"
      />
    </article>
  );
}

/**
 * Skeleton variant (DS §27.1): identical geometry to the loaded card
 * — zero CLS. Use inside an aria-busy container.
 */
function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col border border-edge bg-ink-soft",
        className,
      )}
    >
      <Skeleton className="aspect-4/3 w-full" />
      <div className="flex flex-col gap-3 p-6 lg:p-8">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Hairline className="mt-4" />
        <Skeleton className="mt-2 h-4 w-20" />
      </div>
    </div>
  );
}

ProductCard.Skeleton = ProductCardSkeleton;
