import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { Carousel, TestimonialCard } from "@/components/patterns";
import { PLACEHOLDER_TESTIMONIALS } from "@/content/placeholders";

/**
 * SM–12 / TESTIMONIALS.
 * Sunken band, carousel of TestimonialCards. Quotes render the
 * controlled pending state — bracketed, muted, clearly placeholder
 * (DS §31.3). No invented customer voices; if the placeholder array
 * is emptied the section hides cleanly.
 */
export function TestimonialsSection() {
  if (PLACEHOLDER_TESTIMONIALS.length === 0) return null;

  return (
    <Section surface="sunken" rule aria-labelledby="home-testimonials">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-testimonials"
            code="SM–12"
            eyebrow="Testimonials"
            title="What buyers say"
            lede="Published once verified customer feedback is supplied — the slots below are placeholders, not quotes."
          />
        </Reveal>

        <Reveal delay={100}>
          <Carousel
            label="Customer testimonials"
            className="mt-16"
            itemClassName="w-[88%] sm:w-[47%] lg:w-[48%]"
          >
            {PLACEHOLDER_TESTIMONIALS.map((testimonial) => (
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
