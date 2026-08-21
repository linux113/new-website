import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { LogoSlot } from "@/components/patterns";
import { PLACEHOLDER_LOGO_COUNT } from "@/content/placeholders";

/**
 * SM–11 / CUSTOMERS.
 * Static strip of neutral logo slots (DS §31.3) — no fake customer
 * wordmarks. When real client logos arrive they populate the same
 * grid via LogoSlot's `logo` prop. No motion (DS composition: static).
 */
export function CustomersSection() {
  return (
    <Section rule aria-labelledby="home-customers">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-customers"
            code="SM–11"
            eyebrow="Customers"
            title="Buyers we serve"
            lede="Customer logos are published only with permission. Slots below are reserved pending client confirmation."
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: PLACEHOLDER_LOGO_COUNT }, (_, i) => (
            <LogoSlot key={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
