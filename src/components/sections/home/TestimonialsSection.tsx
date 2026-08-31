import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { Carousel, TestimonialCard } from "@/components/patterns";
import { getPublishedTestimonials } from "@/lib/repositories/content";
import { toMediaRef, stripDemoMarkers } from "@/lib/mappers";

/**
 * SM–12 / TESTIMONIALS.
 * Published testimonials from the database; controlled pending
 * placeholders while none exist (DS §31.3 — never invented voices).
 */
export async function TestimonialsSection() {
  const dbTestimonials = await getPublishedTestimonials().catch(() => []);
  // Never render placeholder quotes on the live site — the section
  // appears only once verified customer feedback is published.
  if (dbTestimonials.length === 0) return null;

  const testimonials = dbTestimonials.map((t) => ({
    id: t.id,
    quote: { value: t.quote, placeholder: "" },
    name: stripDemoMarkers(t.personName),
    role: stripDemoMarkers(t.personRole ?? t.customer?.name ?? ""),
    avatar: toMediaRef(t.avatar),
  }));

  return (
    <Section surface="sunken" rule aria-labelledby="home-testimonials">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-testimonials"
            eyebrow="Testimonials"
            title="What buyers say"
            lede="Verified feedback from buyers we supply."
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
