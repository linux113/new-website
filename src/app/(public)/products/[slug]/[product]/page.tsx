import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProductSeoView } from "@/components/seo/ProductSeoView";
import {
  SEO_PRODUCTS,
  getSeoProduct,
  productHref,
} from "@/content/seo-catalog";
import { SITE_NAME, SITE_URL } from "@/content/site";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string; product: string }>;
}

export function generateStaticParams() {
  return SEO_PRODUCTS.map((p) => ({ slug: p.nest, product: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, product: leaf } = await params;
  const product = getSeoProduct(slug, leaf);
  if (!product) return { title: "Product not found" };
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
    notFound();
  }
  return <ProductSeoView product={product} />;
}
