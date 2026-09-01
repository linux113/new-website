import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { ProductGrid } from "@/components/patterns";
import { PLACEHOLDER_PRODUCTS } from "@/content/placeholders";
import { getFeaturedProducts } from "@/lib/repositories/products";
import { toPatternProduct } from "@/lib/mappers";

/** Homepage featured products — published + featured from the catalogue. */
export async function FeaturedProductsSection() {
  const dbProducts = await getFeaturedProducts(6).catch(() => []);
  const products =
    dbProducts.length > 0 ? dbProducts.map(toPatternProduct) : PLACEHOLDER_PRODUCTS;
  const live = dbProducts.length > 0;
  return (
    <Section surface="sunken" rule aria-labelledby="home-featured">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-featured"
            eyebrow="Featured"
            title="Selected products"
            lede={
              live
                ? "A selection from the catalogue — every product is enquiry-driven."
                : "The catalogue is being finalised. Send a specification meanwhile — sales responds during working hours."
            }
          />
        </Reveal>

        <Reveal delay={100}>
          <ProductGrid
            products={products}
            className="mt-16"
            emptyAction={
              <ButtonLink href="/products" variant="secondary">
                Browse categories
              </ButtonLink>
            }
          />
        </Reveal>

        <div className="mt-12">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#E5C074] transition-colors hover:text-[#F0C66D]"
          >
            View all products
            <ArrowRight size={14} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
