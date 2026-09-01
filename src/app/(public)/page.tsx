import type { Metadata } from "next";
import {
  BlogSection,
  CapabilityStrip,
  CustomersSection,
  FeaturedProductsSection,
  GlobalReachSection,
  ImportExportSection,
  ManufacturingSection,
  TestimonialsSection,
  WhyChooseUsSection,
} from "@/components/sections/home";
import { Reveal } from "@/components/motion";
import { KineticSection } from "@/components/sections/home/KineticSection";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProducts } from "@/components/home/HomeProducts";
import { HomeIndustries } from "@/components/home/HomeIndustries";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeQuality } from "@/components/home/HomeQuality";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";
import { CONTACT, SITE_NAME, SITE_URL } from "@/content/site";
import { getCompanyInfo } from "@/lib/company";

const DESCRIPTION =
  "SRIYAAN METALS — Mumbai-based metals trading, import & export. A B2B industrial metal supplier offering metal sourcing, specification matching and reliable procurement.";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyInfo();
  const title = company.seo["seo.home.title"] || SITE_NAME;
  const description =
    company.seo["seo.home.description"] || DESCRIPTION;
  const robots = company.seo["seo.robots"] || undefined;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: SITE_URL },
    ...(robots ? { robots } : {}),
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [{ url: "/images/home/hero-metal.jpg", width: 1600, height: 900 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

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
      "Floor-2, 204, Plot No.96/98, Platinum Arcade, JSS Road, Opera House",
    addressLocality: "Mumbai",
    postalCode: "400004",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
};

export default async function HomePage() {
  const company = await getCompanyInfo();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema]),
        }}
      />

      {/* Hero with auto-playing metal frame sequence */}
      <HomeHero
        company={{
          hours: company.hours,
          gst: company.gst,
          phones: company.phones,
          headline: company.content["content.hero.headline"],
          subline: company.content["content.hero.subline"],
        }}
      />

      {/* Sourced. Checked. Delivered. */}
      <KineticSection />

      {/* Products — premium B2B rows */}
      <Reveal className="block">
        <HomeProducts />
      </Reveal>

      <CapabilityStrip />

      <Reveal className="block">
        <FeaturedProductsSection />
      </Reveal>
      <Reveal className="block">
        <WhyChooseUsSection />
      </Reveal>

      {/* Manufacturing — From intake to dispatch */}
      <Reveal className="block">
        <ManufacturingSection />
      </Reveal>

      {/* Quality — Verified, then shipped */}
      <Reveal className="block">
        <HomeQuality />
      </Reveal>

      {/* Industries — Where the material goes */}
      <Reveal className="block">
        <HomeIndustries />
      </Reveal>

      {/* Global Reach — Sourcing and supplying across borders */}
      <Reveal className="block">
        <GlobalReachSection />
      </Reveal>

      {/* About — A Mumbai trading desk */}
      <Reveal className="block">
        <HomeAbout />
      </Reveal>

      {/* Trade — SM-10 / Two directions, one standard */}
      <ImportExportSection />

      <Reveal className="block">
        <CustomersSection />
      </Reveal>
      <Reveal className="block">
        <TestimonialsSection />
      </Reveal>
      <Reveal className="block">
        <BlogSection />
      </Reveal>

      {/* Final CTA */}
      <HomeFinalCTA
        headline={company.content["content.cta.headline"]}
        subline={company.content["content.cta.subline"]}
      />
    </>
  );
}
