import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Hairline,
  Section,
} from "@/components/ui";
import type { SeoSection } from "@/content/seo-catalog";

export function SeoSections({ sections }: { sections: SeoSection[] }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
      {sections.map((s) => (
        <article key={s.heading} className="border-t border-edge pt-5">
          <h2 className="text-heading-sm text-surface-fg">{s.heading}</h2>
          <p className="text-body text-surface-muted mt-3">{s.body}</p>
        </article>
      ))}
    </div>
  );
}

export function SeoCtaLinks({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <ul className="mt-6 flex flex-col gap-2">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="group inline-flex items-center gap-2 text-label text-surface-fg transition-colors hover:text-accent"
          >
            {l.label}
            <span
              aria-hidden
              className="transition-transform duration-(--duration-base) group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SeoEnquiry({ productName }: { productName?: string }) {
  return (
    <Section surface="sunken" rule id="enquire" aria-labelledby="enquire-heading">
      <Container>
        <div className="grid grid-cols-4 gap-8 md:grid-cols-12">
          <div className="col-span-4 md:col-span-5">
            <Eyebrow code="SM–RFQ">Enquiry</Eyebrow>
            <h2 id="enquire-heading" className="text-display-lg mt-4">
              Request a quote
            </h2>
            <p className="text-body text-surface-muted max-w-measure mt-4">
              Share quantity, grade, size and delivery point. Our Mumbai sales
              team responds during working hours.
            </p>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <EnquiryForm productName={productName} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function SeoHero({
  crumbs,
  eyebrow,
  h1,
  lede,
  id,
}: {
  crumbs: { label: string; href?: string }[];
  eyebrow: string;
  h1: string;
  lede: string;
  id: string;
}) {
  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby={id}>
      <Container>
        <Breadcrumbs className="mb-10" items={crumbs} />
        <Eyebrow code="SM–MUM">{eyebrow}</Eyebrow>
        <h1 id={id} className="text-display-lg mt-4 max-w-measure text-surface-fg">
          {h1}
        </h1>
        <p className="text-body-lg text-surface-muted max-w-measure mt-5">{lede}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="#enquire" variant="primary" size="lg" arrow>
            Get a Quote
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" size="lg">
            Contact Mumbai desk
          </ButtonLink>
        </div>
        <Hairline className="mt-12" />
      </Container>
    </Section>
  );
}
