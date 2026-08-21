import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { LogoSlot } from "@/components/patterns";
import { PLACEHOLDER_LOGO_COUNT } from "@/content/placeholders";
import { getPublishedCustomers } from "@/lib/repositories/content";
import { toMediaRef } from "@/lib/mappers";

/**
 * SM–11 / CUSTOMERS.
 * Published + consented customer logos from the database; neutral
 * reserved slots while none exist (DS §31.3 — never fake wordmarks).
 */
export async function CustomersSection() {
  const customers = await getPublishedCustomers().catch(() => []);
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
          {customers.length > 0
            ? customers.map((customer) => (
                <LogoSlot
                  key={customer.id}
                  logo={toMediaRef(customer.logo)}
                  name={customer.name}
                />
              ))
            : Array.from({ length: PLACEHOLDER_LOGO_COUNT }, (_, i) => (
                <LogoSlot key={i} />
              ))}
        </div>
      </Container>
    </Section>
  );
}
