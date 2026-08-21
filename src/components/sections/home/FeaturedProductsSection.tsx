import { Reveal } from "@/components/motion";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { ProductGrid } from "@/components/patterns";
import { PLACEHOLDER_PRODUCTS } from "@/content/placeholders";
import { getFeaturedProducts } from "@/lib/repositories/products";
import { toPatternProduct } from "@/lib/mappers";

/**
 * SM–04 / FEATURED PRODUCTS.
 * Sunken band. Renders published featured products from the database;
 * falls back to typed placeholder slots while the catalogue is empty
 * (graceful, DS §31). Cards carry the Enquire pathway (no prices — B2B).
 */
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
            code="SM–04"
            eyebrow="Featured"
            title="Selected products"
            lede={
              live
                ? "A selection from the catalogue — every product is enquiry-driven."
                : "Product entries are placeholder slots pending the client catalogue. Names, codes and specifications will be populated from verified data only."
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
          <ButtonLink href="/products" variant="ghost" arrow>
            View all products
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
