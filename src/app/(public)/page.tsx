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
import { HOME_DESCRIPTION, HOME_TITLE } from "@/content/seo-catalog";
import { getCompanyInfo } from "@/lib/company";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyInfo();
  const title = company.seo["seo.home.title"] || HOME_TITLE;
  const description =
    company.seo["seo.home.description"] || HOME_DESCRIPTION;
  const robots = company.seo["seo.robots"] || undefined;

  return {
    // `absolute` opts out of the root layout's "%s | SRIYAAN METALS"
    // template. The homepage title is admin-editable
    // (seo.home.title) and already contains the brand, so without this
    // it renders "SRIYAAN METALS | … | SRIYAAN METALS" — 87 characters,
    // well past Google's ~60-character truncation point. Using
    // `absolute` also means whatever the admin types is what ships.
    title: { absolute: title },
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
  // Google reads `logo` to source the icon shown beside the site name
  // in search results. It must be a square, crawlable, absolute URL —
  // /brand/logo-square.png is the emblem on a solid white background
  // (the wordmark version is too wide, and the white-on-transparent
  // variant is invisible against Google's white result page).
  logo: `${SITE_URL}/brand/logo-square.png`,
  image: `${SITE_URL}/brand/logo-square.png`,
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
