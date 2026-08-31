import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { ProductGrid } from "@/components/patterns";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { getPublishedCategories } from "@/lib/repositories/categories";
import { getPublishedProducts } from "@/lib/repositories/products";
import { toPatternProduct } from "@/lib/mappers";
import { SITE_URL } from "@/content/site";
import { cn } from "@/lib/cn";

export const revalidate = 300; // revalidated on-demand after admin mutations

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the SRIYAAN METALS product range. Send a specification for a considered quote.",
  alternates: { canonical: `${SITE_URL}/products` },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let products: Awaited<ReturnType<typeof getPublishedProducts>> = [];
  let categories: Awaited<ReturnType<typeof getPublishedCategories>> = [];
  let dbError = false;
  try {
    [products, categories] = await Promise.all([
      getPublishedProducts({ categorySlug: category, take: 60 }),
      getPublishedCategories(),
    ]);
  } catch (error) {
    console.error("[products] query failed:", error instanceof Error ? error.message : error);
    dbError = true;
  }

  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="products-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Products" }]}
        />
        <SectionHeading
          id="products-heading"
          code="SM–P"
          eyebrow="Catalogue"
          title="Products"
          lede="Every listed product is enquiry-driven — send the specification and receive a considered response."
          as="h1"
        />

        {/* Category filter */}
        {categories.length > 0 ? (
          <nav aria-label="Filter by category" className="mt-12 flex flex-wrap gap-2">
            <Link
              href="/products"
              className={cn(
                "border px-3 py-2 text-mono-meta transition-colors duration-(--duration-fast)",
                !category
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-slate hover:border-steel hover:text-surface-fg",
              )}
            >
              ALL
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products/category/${cat.slug}`}
                className={cn(
                  "border px-3 py-2 text-mono-meta transition-colors duration-(--duration-fast)",
                  category === cat.slug
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-slate hover:border-steel hover:text-surface-fg",
                )}
              >
                {cat.name.toUpperCase()}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="mt-12">
          {dbError ? (
            <div className="border-y border-edge py-16 text-center">
              <p className="text-mono-meta text-surface-muted">ERROR — DATABASE</p>
              <p className="mt-3 text-display-md">The catalogue is temporarily unavailable.</p>
              <p className="mt-2 text-body-sm text-surface-muted">
                Please try again shortly, or reach us directly by phone or WhatsApp.
              </p>
            </div>
          ) : (
            <ProductGrid
              products={products.map(toPatternProduct)}
              wide
              emptyAction={
                <ButtonLink href="/contact" variant="secondary">
                  Contact us
                </ButtonLink>
              }
            />
          )}
        </div>
      </Container>
    </Section>
  );
}
