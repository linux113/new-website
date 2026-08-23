import { Reveal } from "@/components/motion";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { CategoryTile } from "@/components/patterns";
import { PLACEHOLDER_CATEGORIES } from "@/content/placeholders";
import { getPublishedCategories } from "@/lib/repositories/categories";
import { toMediaRef } from "@/lib/mappers";

/**
 * SM–03 / PRODUCT CATEGORIES.
 * Editorial asymmetric grid (DS §18): wide 7/12 + narrow 5/12 pair,
 * then flipped — no uniform card wall. Tiles come from the typed
 * placeholder module; clearly-marked slots until the client
 * catalogue lands. Staggered reveal via per-tile delays.
 */
export async function ProductCategoriesSection() {
  const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

  const dbCategories = await getPublishedCategories().catch(() => []);
  const categories =
    dbCategories.length > 0
      ? dbCategories.slice(0, 4).map((cat, i) => ({
          slug: cat.slug,
          index: (i + 1).toString().padStart(2, "0"),
          title: cat.name,
          image: toMediaRef(cat.image) ?? PLACEHOLDER_CATEGORIES[i]?.image ?? null,
          description: cat.description ?? undefined,
        }))
      : PLACEHOLDER_CATEGORIES.slice(0, 4);

  return (
    <Section rule aria-labelledby="home-categories">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-categories"
            code="SM–03"
            eyebrow="Product range"
            title="Material, by category"
            lede="Material organised the way buyers specify it — every category is enquiry-driven."
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
          {categories.map((category, i) => (
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
