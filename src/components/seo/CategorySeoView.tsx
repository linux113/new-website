import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { ProductGrid } from "@/components/patterns";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import {
  SEO_PRODUCTS,
  categoryHref,
  productHref,
  type SeoCategory,
} from "@/content/seo-catalog";
import type { Product } from "@/content/types";
import { SeoEnquiry, SeoSections } from "./SeoLanding";

export function CategorySeoView({
  category,
  dbProducts,
}: {
  category: SeoCategory;
  dbProducts: Product[];
}) {
  const seoProducts: Product[] = SEO_PRODUCTS.filter((p) =>
    category.productSlugs.includes(p.slug),
  ).map((p) => ({
    slug: p.slug,
    name: p.name,
    category: category.name,
    code: "SM",
    specSummary: { value: p.specSummary, placeholder: "" },
    media: [],
    href: productHref(p),
  }));

  const merged = [...seoProducts];
  for (const p of dbProducts) {
    if (!merged.some((m) => m.slug === p.slug)) merged.push(p);
  }

  return (
    <>
      <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="category-heading">
        <Container>
          <Breadcrumbs
            className="mb-10"
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: category.name },
            ]}
          />
          <SectionHeading
            id="category-heading"
            code="SM–C"
            eyebrow="Category · Mumbai"
            title={category.h1}
            lede={category.lede}
            as="h1"
            align="start"
          />
          <SeoSections sections={category.sections} />
          <div className="mt-12">
            <ProductGrid
              products={merged}
              wide
              emptyAction={
                <ButtonLink href="/products" variant="secondary">
                  All products
                </ButtonLink>
              }
            />
          </div>
          <p className="mt-10">
            <Link
              href="/enquiry"
              className="text-label text-surface-fg hover:text-accent"
            >
              Request a quote for {category.name} →
            </Link>
          </p>
        </Container>
      </Section>
      <SeoEnquiry productName={category.name} />
    </>
  );
}

export { categoryHref };
