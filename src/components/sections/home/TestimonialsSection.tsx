import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { Carousel, TestimonialCard } from "@/components/patterns";
import { PLACEHOLDER_TESTIMONIALS } from "@/content/placeholders";
import { getPublishedTestimonials } from "@/lib/repositories/content";
import { toMediaRef } from "@/lib/mappers";

/**
 * SM–12 / TESTIMONIALS.
 * Published testimonials from the database; controlled pending
 * placeholders while none exist (DS §31.3 — never invented voices).
 */
export async function TestimonialsSection() {
  const dbTestimonials = await getPublishedTestimonials().catch(() => []);
  const live = dbTestimonials.length > 0;
  const testimonials = live
    ? dbTestimonials.map((t) => ({
        id: t.id,
        quote: { value: t.quote, placeholder: "" },
        name: t.personName,
        role: t.personRole ?? t.customer?.name ?? "",
        avatar: toMediaRef(t.avatar),
      }))
    : PLACEHOLDER_TESTIMONIALS;
  if (testimonials.length === 0) return null;

  return (
    <Section surface="sunken" rule aria-labelledby="home-testimonials">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-testimonials"
            code="SM–12"
            eyebrow="Testimonials"
            title="What buyers say"
            lede={
              live
                ? undefined
                : "Published once verified customer feedback is supplied — the slots below are placeholders, not quotes."
            }
          />
        </Reveal>

        <Reveal delay={100}>
          <Carousel
            label="Customer testimonials"
            className="mt-16"
            itemClassName="w-[88%] sm:w-[47%] lg:w-[48%]"
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                className="h-full"
              />
            ))}
          </Carousel>
        </Reveal>
      </Container>
    </Section>
  );
}
