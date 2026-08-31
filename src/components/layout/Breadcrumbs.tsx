import Link from "next/link";
import { cn } from "@/lib/cn";

export interface Crumb {
  label: string;
  /** Omit href on the last (current) crumb. */
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

/**
 * Breadcrumb navigation Secondary nav).
 * Mono 12px, slash-separated, Slate; current page in the surface
 * foreground with aria-current. Semantic nav > ol markup with
 * schema.org BreadcrumbList microdata for SEO.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className="flex flex-wrap items-center gap-2 text-mono-meta text-surface-muted"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={`${item.label}-${i}`}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  itemProp="item"
                  className="transition-colors duration-(--duration-fast) hover:text-surface-fg"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  itemProp="name"
                  className={cn(isLast && "text-surface-fg")}
                >
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(i + 1)} />
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
