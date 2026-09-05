import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProductSeoView } from "@/components/seo/ProductSeoView";
import { DbProductView } from "@/components/seo/DbProductView";
import { getProductBySlug } from "@/lib/repositories/products";
import {
  SEO_PRODUCTS,
  getSeoProduct,
  productHref,
} from "@/content/seo-catalog";
import { SITE_NAME, SITE_URL } from "@/content/site";

// Nested product URLs can also serve database catalogue products, so this
// route must refresh on the same cadence as the rest of the catalogue.
export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string; product: string }>;
}

export function generateStaticParams() {
  return SEO_PRODUCTS.map((p) => ({ slug: p.nest, product: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, product: leaf } = await params;
  const product = getSeoProduct(slug, leaf);
  if (!product) {
    const dbProduct = await getProductBySlug(leaf).catch(() => null);
    if (dbProduct) {
      const title =
        dbProduct.seo?.metaTitle ??
        `${dbProduct.name} Supplier in Mumbai | ${SITE_NAME}`;
      return {
        title: { absolute: title },
        description:
          dbProduct.seo?.metaDescription ?? dbProduct.shortDescription ?? undefined,
        alternates: { canonical: `${SITE_URL}/products/${slug}/${leaf}` },
      };
    }
    return { title: "Product not found" };
  }
  return {
    title: { absolute: product.title },
    description: product.description,
    alternates: { canonical: `${SITE_URL}${productHref(product)}` },
    openGraph: {
      title: product.title,
      description: product.description,
      url: `${SITE_URL}${productHref(product)}`,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
    },
  };
}

export default async function NestedProductPage({ params }: PageProps) {
  const { slug, product: leaf } = await params;
  const product = getSeoProduct(slug, leaf);
  if (!product) {
    const maybe = SEO_PRODUCTS.find((p) => p.slug === leaf);
    if (maybe) redirect(productHref(maybe));

    // Catalogue products whose slug collides with a category landing page
    // are linked here so they get a collision-free URL — render them.
    const dbProduct = await getProductBySlug(leaf).catch(() => null);
    if (dbProduct) return <DbProductView product={dbProduct} />;

    notFound();
  }
  return <ProductSeoView product={product} />;
}
