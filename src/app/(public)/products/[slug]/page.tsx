import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ButtonLink, Container, Section } from "@/components/ui";
import { CategorySeoView } from "@/components/seo/CategorySeoView";
import { DbProductView } from "@/components/seo/DbProductView";
import { getProductBySlug, getPublishedProducts } from "@/lib/repositories/products";
import { toPatternProduct } from "@/lib/mappers";
import { SITE_NAME, SITE_URL } from "@/content/site";
import {
  categoryDbSlugs,
  findSeoProductByLeaf,
  getSeoCategory,
  productHref,
} from "@/content/seo-catalog";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const seoCat = getSeoCategory(slug);
  if (seoCat) {
    return {
      title: { absolute: seoCat.title },
      description: seoCat.description,
      alternates: { canonical: `${SITE_URL}/products/${seoCat.slug}` },
      openGraph: {
        title: seoCat.title,
        description: seoCat.description,
        url: `${SITE_URL}/products/${seoCat.slug}`,
        siteName: SITE_NAME,
        type: "website",
        locale: "en_IN",
      },
    };
  }

  const nested = findSeoProductByLeaf(slug);
  if (nested) {
    return {
      title: { absolute: nested.title },
      description: nested.description,
      alternates: { canonical: `${SITE_URL}${productHref(nested)}` },
    };
  }

  // A failed query (database unreachable) must not be reported as
  // "Product not found" — keep the URL out of the index while the
  // catalogue is briefly offline.
  let product: Awaited<ReturnType<typeof getProductBySlug>> = null;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.error("[product] query failed:", error instanceof Error ? error.message : error);
    return {
      title: { absolute: `Catalogue temporarily unavailable | ${SITE_NAME}` },
      robots: { index: false, follow: true },
    };
  }
  if (!product) return { title: "Product not found" };

  const title = product.seo?.metaTitle ?? `${product.name} Supplier in Mumbai | ${SITE_NAME}`;
  const description =
    product.seo?.metaDescription ??
    product.shortDescription ??
    `${product.name} from SRIYAAN METALS, Mumbai — enquire for specification and quotation.`;
  const canonical = product.seo?.canonicalUrl ?? `${SITE_URL}/products/${product.slug}`;
  const ogImage = product.seo?.ogImage?.publicUrl ?? product.images[0]?.media.publicUrl;

  return {
    title: { absolute: title.includes("|") ? title : `${title} | ${SITE_NAME}` },
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

export default async function ProductOrCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const seoCat = getSeoCategory(slug);
  if (seoCat) {
    if (seoCat.aliases?.includes(slug) && seoCat.slug !== slug) {
      redirect(`/products/${seoCat.slug}`);
    }

    const dbProducts = await getPublishedProducts({
      categorySlugs: categoryDbSlugs(seoCat),
      take: 60,
    }).catch(() => []);
    return (
      <CategorySeoView
        category={seoCat}
        dbProducts={dbProducts.map(toPatternProduct)}
      />
    );
  }

  const nested = findSeoProductByLeaf(slug);
  if (nested) {
    redirect(productHref(nested));
  }

  // Distinguish "product missing" from "database unreachable".
  // A connection failure must render a recoverable "temporarily
  // unavailable" state — never a 404 (which search engines treat as
  // "gone for good" and users read as a broken site).
  let product: Awaited<ReturnType<typeof getProductBySlug>> = null;
  let dbUnavailable = false;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.error("[product] query failed:", error instanceof Error ? error.message : error);
    dbUnavailable = true;
  }

  if (!product) {
    if (dbUnavailable) return <CatalogueUnavailable />;
    notFound();
  }

  return <DbProductView product={product} />;
}

/**
 * Rendered when the catalogue database cannot be reached. Keeps the
 * visitor oriented (products index, contact channels) instead of a
 * dead-end 404 during a transient outage.
 */
function CatalogueUnavailable() {
  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="product-unavailable">
      <Container>
        <div className="border-y border-edge py-16 text-center">
          <p className="text-mono-meta text-surface-muted">CATALOGUE — TEMPORARILY UNAVAILABLE</p>
          <h1 id="product-unavailable" className="mt-3 text-display-md">
            This product page is briefly offline.
          </h1>
          <p className="mt-2 text-body-sm text-surface-muted">
            Our catalogue database did not respond. Please try again shortly, or reach us
            directly by phone or WhatsApp — sales responds during working hours.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/products" variant="primary" arrow>
              Back to products
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
