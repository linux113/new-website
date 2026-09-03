import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui";
import {
  getLocationPage,
  type LocationPage,
} from "@/content/seo-catalog";
import { SITE_NAME, SITE_URL } from "@/content/site";
import {
  SeoCtaLinks,
  SeoEnquiry,
  SeoHero,
  SeoSections,
} from "./SeoLanding";

export function locationMetadata(page: LocationPage): Metadata {
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: `${SITE_URL}/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${SITE_URL}/${page.slug}`,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
    },
  };
}

export function LocationPageView({ slug }: { slug: string }) {
  const page = getLocationPage(slug);
  if (!page) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: `${SITE_URL}/${page.slug}`,
    description: page.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400004",
      addressCountry: "IN",
    },
    areaServed: ["Mumbai", "India"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <SeoHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: page.h1 },
        ]}
        eyebrow="Mumbai"
        h1={page.h1}
        lede={page.lede}
        id={`${page.slug}-heading`}
      />
      <Section>
        <Container>
          <SeoSections sections={page.sections} />
          <h2 className="text-heading-sm text-surface-fg mt-12">Explore</h2>
          <SeoCtaLinks links={page.links} />
        </Container>
      </Section>
      <SeoEnquiry />
    </>
  );
}
