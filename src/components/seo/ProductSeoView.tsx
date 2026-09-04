import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Hairline,
  Section,
} from "@/components/ui";
import { SEO_CATEGORIES, type SeoProduct } from "@/content/seo-catalog";
import { SeoEnquiry, SeoSections } from "./SeoLanding";

export function ProductSeoView({ product }: { product: SeoProduct }) {
  const category = SEO_CATEGORIES.find((c) => c.slug === product.categorySlug);

  return (
    <>
      <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="product-heading">
        <Container>
          <Breadcrumbs
            className="mb-10"
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              {
                label: category?.name ?? "Category",
                href: category ? `/products/${category.slug}` : "/products",
              },
              { label: product.name },
            ]}
          />

          <div className="grid grid-cols-4 gap-8 lg:grid-cols-12">
            <div className="col-span-4 lg:col-span-7">
              {product.image?.src ? (
                <div className="mb-8 overflow-hidden border border-edge bg-ink-soft">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    width={1280}
                    height={960}
                    priority
                    className="aspect-4/3 w-full object-cover"
                  />
                </div>
              ) : null}
              <Eyebrow code="SM">{category?.name ?? "Product"}</Eyebrow>
              <h1 id="product-heading" className="text-display-lg mt-4 text-surface-fg">
                {product.h1}
              </h1>
              <p className="text-body-lg text-surface-muted max-w-measure mt-5">
                {product.description}
              </p>
              <p className="text-body-sm text-surface-muted mt-4">{product.specSummary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="#enquire" variant="primary" size="lg" arrow>
                  Get a Quote
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary" size="lg">
                  WhatsApp / Call
                </ButtonLink>
              </div>
              <Hairline className="mt-10" />
              <SeoSections sections={product.sections} />
            </div>
            <aside className="col-span-4 lg:col-span-5">
              <div className="border border-edge bg-ink-soft p-6 lg:sticky lg:top-24">
                <p className="text-mono-meta text-surface-muted">Mumbai supply</p>
                <p className="text-body mt-3 text-surface-fg">
                  Share grade, size, standard, coating and quantity. We quote
                  from the Mumbai desk during working hours.
                </p>
                <ButtonLink href="#enquire" variant="primary" className="mt-6" arrow>
                  Enquire
                </ButtonLink>
                {category ? (
                  <p className="mt-6">
                    <Link
                      href={`/products/${category.slug}`}
                      className="text-label text-surface-fg hover:text-accent"
                    >
                      All {category.name} →
                    </Link>
                  </p>
                ) : null}
              </div>
            </aside>
          </div>
        </Container>
      </Section>
      <SeoEnquiry productName={product.name} />
    </>
  );
}
