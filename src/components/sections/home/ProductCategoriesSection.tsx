import { Reveal } from "@/components/motion";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { CategoryTile } from "@/components/patterns";
import { PLACEHOLDER_CATEGORIES } from "@/content/placeholders";

/**
 * SM–03 / PRODUCT CATEGORIES.
 * Editorial asymmetric grid (DS §18): wide 7/12 + narrow 5/12 pair,
 * then flipped — no uniform card wall. Tiles come from the typed
 * placeholder module; clearly-marked slots until the client
 * catalogue lands. Staggered reveal via per-tile delays.
 */
export function ProductCategoriesSection() {
  const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

  return (
    <Section rule aria-labelledby="home-categories">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-categories"
            code="SM–03"
            eyebrow="Product range"
            title="Material, by category"
            lede="The catalogue is being prepared with the client. Category slots below are placeholders — structure, imagery ratios and navigation are production-ready."
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
          {PLACEHOLDER_CATEGORIES.slice(0, 4).map((category, i) => (
            <Reveal
              key={category.slug}
              delay={i * 70}
              className={`col-span-4 ${spans[i]}`}
            >
              <CategoryTile category={category} ratio="3/2" />
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <ButtonLink href="/products" variant="ghost" arrow>
            View all categories
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
