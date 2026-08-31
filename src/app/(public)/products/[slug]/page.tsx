import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { ProductGallery, ProductGrid, SpecTable } from "@/components/patterns";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Hairline,
  Icon,
  Section,
} from "@/components/ui";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getProductBySlug } from "@/lib/repositories/products";
import { toMediaRef, toPatternProduct } from "@/lib/mappers";
import { whatsappProductUrl } from "@/lib/whatsapp";
import { getCompanyInfo } from "@/lib/company";
import { SITE_URL } from "@/content/site";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: "Product not found" };

  const title = product.seo?.metaTitle ?? product.name;
  const description =
    product.seo?.metaDescription ??
    product.shortDescription ??
    `${product.name} — enquire with SRIYAAN METALS for specification and quotation.`;
  const canonical = product.seo?.canonicalUrl ?? `${SITE_URL}/products/${product.slug}`;
  const ogImage = product.seo?.ogImage?.publicUrl ?? product.images[0]?.media.publicUrl;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.seo?.ogTitle ?? title,
      description: product.seo?.ogDescription ?? description,
      url: canonical,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  const company = await getCompanyInfo();
  const media = product.images
    .map((image) => toMediaRef(image.media, image.altText))
    .filter((m): m is NonNullable<typeof m> => m !== null);

  const related = product.relationsFrom
    .map((rel) => rel.relatedProduct)
    .filter((p) => p.status === "PUBLISHED")
    .slice(0, 3);

  /** Product JSON-LD — facts only: no prices, ratings or reviews. */
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: `${SITE_URL}/products/${product.slug}`,
    ...(product.shortDescription ? { description: product.shortDescription } : {}),
    ...(product.productCode ? { sku: product.productCode } : {}),
    ...(media[0]?.src ? { image: media[0].src } : {}),
    brand: { "@type": "Organization", name: company.name },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category.name,
        item: `${SITE_URL}/products/category/${product.category.slug}`,
      },
      { "@type": "ListItem", position: 4, name: product.name },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productSchema, breadcrumbSchema]) }}
      />

      <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="product-heading">
        <Container>
          <Breadcrumbs
            className="mb-10"
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: product.category.name, href: `/products/category/${product.category.slug}` },
              { label: product.name },
            ]}
          />

          <div className="grid grid-cols-4 gap-8 lg:grid-cols-12">
            {/* Gallery — sticky left column ≥ lg */}
            <div className="col-span-4 lg:col-span-7">
              <div className="lg:sticky lg:top-24">
                <ProductGallery
                  media={media.length > 0 ? media : [{ src: null, alt: product.name, placeholderLabel: "IMAGE — [AWAITING CLIENT ASSET]" }]}
                />
              </div>
            </div>

            {/* Details + enquiry */}
            <div className="col-span-4 flex flex-col gap-8 lg:col-span-5">
              <div className="flex flex-col gap-4">
                <Eyebrow code={product.productCode ?? "SM"}>
                  {product.category.name}
                </Eyebrow>
                <h1 id="product-heading" className="text-display-lg">
                  {product.name}
                </h1>
                {product.shortDescription ? (
                  <p className="text-body-lg text-surface-muted max-w-measure">
                    {product.shortDescription}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3">
                <ButtonLink href="#enquire" variant="primary" size="lg" arrow>
                  Get a Quote
                </ButtonLink>
                <ButtonLink
                  href={whatsappProductUrl(product.name, `/products/${product.slug}`, company.siteUrl)}
                  variant="secondary"
                  size="lg"
                  external
                >
                  WhatsApp
                </ButtonLink>
              </div>

              {product.description ? (
                <>
                  <Hairline />
                  <div className="text-body text-surface-muted max-w-measure whitespace-pre-line">
                    {product.description}
                  </div>
                </>
              ) : null}

              {product.specifications.length > 0 ? (
                <div>
                  <h2 className="text-mono-meta text-surface-muted">Specifications</h2>
                  <SpecTable
                    className="mt-4"
                    caption={`${product.name} specifications`}
                    specifications={product.specifications.map((spec) => ({
                      label: spec.name,
                      value: { value: spec.value, placeholder: "" },
                      unit: spec.unit ?? undefined,
                    }))}
                  />
                </div>
              ) : null}

              {product.applications.length > 0 ? (
                <div>
                  <h2 className="text-mono-meta text-surface-muted">Applications</h2>
                  <ul className="mt-4 flex flex-col">
                    {product.applications.map((app, i) => (
                      <li
                        key={app.id}
                        className="flex items-baseline gap-4 border-b border-edge py-3"
                      >
                        <span className="text-mono-micro text-surface-muted tabular-nums">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="text-body-sm">{app.application}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {product.documents.length > 0 ? (
                <div>
                  <h2 className="text-mono-meta text-surface-muted">Documents</h2>
                  <ul className="mt-4 flex flex-col gap-2">
                    {product.documents.map((doc) =>
                      doc.media.publicUrl ? (
                        <li key={doc.id}>
                          <a
                            href={doc.media.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 border border-edge px-4 py-3 text-body-sm text-ink transition-colors duration-(--duration-fast) hover:bg-paper-sunken"
                          >
                            <Icon icon={FileText} size={20} className="text-slate" />
                            {doc.name}
                            <span className="ml-auto text-mono-micro text-slate">{doc.type}</span>
                          </a>
                        </li>
                      ) : null,
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      {/* Enquiry */}
      <Section surface="sunken" rule id="enquire" aria-labelledby="enquire-heading">
        <Container>
          <div className="grid grid-cols-4 gap-8 md:grid-cols-12">
            <div className="col-span-4 md:col-span-5">
              <Eyebrow code="SM–RFQ">Enquiry</Eyebrow>
              <h2 id="enquire-heading" className="text-display-lg mt-4">
                Request a quote for {product.name}
              </h2>
              <p className="text-body text-surface-muted max-w-measure mt-4">
                Share quantity, grade and delivery point. Our sales team responds
                during working hours, {company.hours} IST.
              </p>
            </div>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <EnquiryForm productId={product.id} productName={product.name} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Related */}
      {related.length > 0 ? (
        <Section rule aria-labelledby="related-heading">
          <Container>
            <h2 id="related-heading" className="text-display-md">
              Related products
            </h2>
            <ProductGrid
              className="mt-10"
              products={related.map((p) =>
                toPatternProduct({ ...p, images: p.images ?? [] }),
              )}
            />
            <div className="mt-10">
              <Link href="/products" className="group inline-flex items-center gap-2 text-label text-ink transition-colors duration-(--duration-base) hover:text-accent">
                All products
                <span aria-hidden className="transition-transform duration-(--duration-base) group-hover:translate-x-1 motion-reduce:transition-none">→</span>
              </Link>
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
