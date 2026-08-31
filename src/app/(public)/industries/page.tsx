import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { Container } from "@/components/ui";
import { SITE_URL } from "@/content/site";
import { IndustriesClient } from "@/components/industries/IndustriesClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title:
    "Industries — Construction, Automotive, Engineering & Infrastructure | SRIYAAN METALS",
  description:
    "SRIYAAN METALS supplies industrial metals across construction, automotive, engineering and infrastructure. A Mumbai-based metal supplier offering B2B metal sourcing, procurement and import/export.",
  alternates: { canonical: `${SITE_URL}/industries` },
  openGraph: {
    title: "Industries We Serve — SRIYAAN METALS",
    description:
      "Metal sourcing and supply for construction, automotive, engineering and infrastructure applications.",
    url: `${SITE_URL}/industries`,
    type: "website",
  },
};

export default function IndustriesPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#05080B] pb-20 pt-28 text-[#F5F7F8] lg:pt-36"
      aria-labelledby="industries-heading"
    >
      {/* Background atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "88px 88px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%,#000 20%,transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%,#000 20%,transparent 80%)",
          }}
        />
        <div
          className="absolute -right-40 top-0 h-[42rem] w-[42rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(216,168,78,0.10) 0%, rgba(142,161,174,0.05) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,#05080B 0%, rgba(8,12,16,0.5) 40%, #05080B 100%)",
          }}
        />
      </div>

      <Container>
        <nav aria-label="Breadcrumb" className="in-bc mb-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Industries" },
            ]}
          />
        </nav>

        <IndustriesClient />
      </Container>

      <style>{`
        @keyframes in-bc { from{opacity:0;transform:translateY(-6px);} to{opacity:1;transform:none;} }
        .in-bc { animation: in-bc .6s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>
    </main>
  );
}
