import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { Container } from "@/components/ui";
import { SITE_URL } from "@/content/site";
import { getPublishedGlobalCountries } from "@/lib/repositories/content";
import { GlobalReachClient } from "@/components/global-reach/GlobalReachClient";
import { getWorldDotsSvg } from "@/components/global-reach/world-map-data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Global Reach",
  description:
    "SRIYAAN METALS import and export operations run from Mumbai to confirmed markets across the Middle East, Europe, Southeast Asia, Africa and the Americas.",
  alternates: { canonical: `${SITE_URL}/global-reach` },
};

export default async function GlobalReachPage() {
  const countries = await getPublishedGlobalCountries().catch(() => []);
  const confirmedCodes = countries.map((c) => c.code.toLowerCase());
  const dotsSvg = getWorldDotsSvg();

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#050708] pb-24 pt-28 text-[#F5F7F8] lg:pb-32 lg:pt-36"
      aria-labelledby="global-heading"
    >
      {/* Background atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Fine technical grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "88px 88px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)",
          }}
        />
        {/* Warm gold wash behind the map area (right side) */}
        <div
          className="absolute -right-40 top-24 h-[42rem] w-[42rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(214,168,74,0.10) 0%, rgba(214,168,74,0.03) 40%, transparent 70%)",
          }}
        />
        {/* Deep vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 0%, transparent 40%, rgba(5,7,8,0.8) 100%)",
          }}
        />
      </div>

      <Container>
        <nav
          aria-label="Breadcrumb"
          className="gr-breadcrumb"
        >
          <Breadcrumbs
            className="mb-10"
            items={[
              { label: "Home", href: "/" },
              { label: "Global Reach" },
            ]}
          />
        </nav>

        <GlobalReachClient confirmedCodes={confirmedCodes} dotsSvg={dotsSvg} />
      </Container>

      <style>{`
        @keyframes gr-bc-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .gr-breadcrumb { animation: gr-bc-in 0.7s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>
    </main>
  );
}
