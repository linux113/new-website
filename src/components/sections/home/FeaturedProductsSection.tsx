import { Reveal } from "@/components/motion";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { ProductGrid } from "@/components/patterns";
import { PLACEHOLDER_PRODUCTS } from "@/content/placeholders";

/**
 * SM–04 / FEATURED PRODUCTS.
 * Sunken band. ProductGrid consumes typed placeholder products today;
 * the same props contract later consumes database/CMS data with zero
 * section changes. Cards carry the Enquire pathway (no prices — B2B).
 */
export function FeaturedProductsSection() {
  return (
    <Section surface="sunken" rule aria-labelledby="home-featured">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-featured"
            code="SM–04"
            eyebrow="Featured"
            title="Selected products"
            lede="Product entries are placeholder slots pending the client catalogue. Names, codes and specifications will be populated from verified data only."
          />
        </Reveal>

        <Reveal delay={100}>
          <ProductGrid
            products={PLACEHOLDER_PRODUCTS}
            className="mt-16"
            emptyAction={
              <ButtonLink href="/products" variant="secondary">
                Browse categories
              </ButtonLink>
            }
          />
        </Reveal>

        <div className="mt-12">
          <ButtonLink href="/products" variant="ghost" arrow>
            View all products
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
