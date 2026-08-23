import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout";
import { ProductGrid } from "@/components/patterns";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { getCategoryBySlug } from "@/lib/repositories/categories";
import { getPublishedProducts } from "@/lib/repositories/products";
import { toPatternProduct } from "@/lib/mappers";
import { SITE_URL } from "@/content/site";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return { title: "Category not found" };

  const title = category.seo?.metaTitle ?? `${category.name} — Products`;
  const description =
    category.seo?.metaDescription ??
    category.description ??
    `${category.name} from SRIYAAN METALS — browse and enquire.`;

  return {
    title,
    description,
    alternates: {
      canonical: category.seo?.canonicalUrl ?? `${SITE_URL}/products/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) notFound();

  const products = await getPublishedProducts({ categorySlug: slug, take: 60 }).catch(
    () => [],
  );

  return (
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
          eyebrow="Category"
          title={category.name}
          lede={category.description ?? undefined}
          as="h1"
        />
        <div className="mt-12">
          <ProductGrid
            products={products.map(toPatternProduct)}
            wide
            emptyAction={
              <ButtonLink href="/products" variant="secondary">
                All products
              </ButtonLink>
            }
          />
        </div>
      </Container>
    </Section>
  );
}
