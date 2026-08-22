import type { Metadata } from "next";
import {
  BlogSection,
  CapabilityStrip,
  CustomersSection,
  FeaturedProductsSection,
  GlobalReachSection,
  ImportExportSection,
  IndustriesSection,
  ManufacturingSection,
  ProductCategoriesSection,
  QualitySection,
  QuoteCTASection,
  TestimonialsSection,
  WhyChooseUsSection,
} from "@/components/sections/home";
import { ScrollFrameHero } from "@/components/sections/home/ScrollFrameHero";
import { CONTACT, SITE_NAME, SITE_URL } from "@/content/site";
import { getCompanyInfo } from "@/lib/company";

const DESCRIPTION =
  "SRIYAAN METALS — Mumbai-based metals trading, import and export. Send your specification for a considered quote.";

/** Homepage metadata — admin SEO settings override verified defaults. */
export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyInfo();
  const title =
    company.seo["seo.home.title"] ||
    company.seo["seo.default.title"] ||
    "SRIYAAN METALS — Metals Trading, Import & Export, Mumbai";
  const description =
    company.seo["seo.home.description"] ||
    company.seo["seo.default.description"] ||
    DESCRIPTION;
  const robots = company.seo["seo.robots"] || undefined;

  return {
    title,
    description,
    alternates: { canonical: SITE_URL },
    ...(robots ? { robots } : {}),
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * Organization schema — VERIFIED client-supplied facts only
 * (name, url, address, phones, hours). No invented claims.
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT.emails[0].value,
  telephone: CONTACT.phones.map((p) => p.value),
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Floor-2, 204, Plot No.96/98, Platinum Arcade, JSS Road, Central Plaza Cinema Charni Road, Opera House",
    addressLocality: "Mumbai",
    postalCode: "400004",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
} as const;

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
} as const;

/**
 * SRIYAAN METALS — homepage (Phase 4).
 * Thin composition only; every section is a server component in
 * components/sections/home. Surface rhythm alternates dark/light/
 * sunken per DS §9 — never two darks adjacent.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, websiteSchema]),
        }}
      />
      <ScrollFrameHero />
      <CapabilityStrip />
      <ProductCategoriesSection />
      <FeaturedProductsSection />
      <WhyChooseUsSection />
      <ManufacturingSection />
      <QualitySection />
      <IndustriesSection />
      <GlobalReachSection />
      <ImportExportSection />
      <CustomersSection />
      <TestimonialsSection />
      <BlogSection />
      <QuoteCTASection />
    </>
  );
}
