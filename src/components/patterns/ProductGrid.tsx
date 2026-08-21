import { cn } from "@/lib/cn";
import { EmptyState } from "@/components/ui";
import type { Product } from "@/content/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  /** Render skeletons instead of content (DS §27). */
  loading?: boolean;
  /** Skeleton count while loading. */
  skeletonCount?: number;
  /** Allow the 4-up tier on ≥ xl (index pages only — DS §14). */
  wide?: boolean;
  /** Action node for the empty state (Secondary/Ghost, never Primary). */
  emptyAction?: React.ReactNode;
  hrefBase?: string;
  className?: string;
}

/**
 * Product grid (DS §14): 1-up mobile, 2-up ≥ sm, 3-up ≥ lg,
 * 4-up ≥ xl only when `wide` (index pages). Consistent token gutters;
 * loading and empty states built in.
 */
export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 6,
  wide = false,
  emptyAction,
  hrefBase,
  className,
}: ProductGridProps) {
  if (!loading && products.length === 0) {
    return (
      <EmptyState
        title="No products match these filters"
        description="Try clearing the active filters or browsing all categories."
        action={emptyAction}
        className={className}
      />
    );
  }

  return (
    <ul
      aria-busy={loading || undefined}
      className={cn(
        "grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8",
        wide && "xl:grid-cols-4",
        className,
      )}
    >
      {loading
        ? Array.from({ length: skeletonCount }, (_, i) => (
            <li key={`s-${i}`}>
              <ProductCard.Skeleton />
            </li>
          ))
        : products.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} hrefBase={hrefBase} className="h-full" />
            </li>
          ))}
    </ul>
  );
}
