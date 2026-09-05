import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { Container } from "@/components/ui";
import { SITE_URL } from "@/content/site";
import { ManufacturingClient } from "@/components/manufacturing/ManufacturingClient";
import { INFRASTRUCTURE_ITEMS } from "@/content/manufacturing";
import { getPublishedInfrastructure } from "@/lib/repositories/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Manufacturing & Infrastructure",
  description:
    "From sourcing and inspection to warehousing, packaging and dispatch — the sequence every SRIYAAN METALS consignment follows.",
  alternates: { canonical: `${SITE_URL}/manufacturing` },
  openGraph: {
    title: "Manufacturing & Infrastructure — SRIYAAN METALS",
    description:
      "Sourcing, inspection, warehousing and dispatch — the disciplined sequence behind every consignment.",
    url: `${SITE_URL}/manufacturing`,
    type: "website",
  },
};

export default async function ManufacturingPage() {
  // Admin-managed infrastructure items take priority; each row keeps
  // its uploaded image when there is one, otherwise it reuses the
  // matching static photo so a card is never imageless.
  const rows = await getPublishedInfrastructure().catch(() => []);
  const infrastructure = rows.map((row, i) => {
    const base = INFRASTRUCTURE_ITEMS[i % INFRASTRUCTURE_ITEMS.length];
    return {
      caption: row.title,
      description: row.caption ?? base.description,
      image: row.media?.publicUrl ?? base.image,
      alt: row.media?.altText ?? row.title,
    };
  });

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#050708] pb-24 pt-28 text-[#F5F7F8] lg:pb-32 lg:pt-36"
      aria-labelledby="manufacturing-heading"
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
          className="absolute -right-40 top-20 h-[42rem] w-[42rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(214,168,74,0.10) 0%, rgba(214,168,74,0.03) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 0%, transparent 40%, rgba(5,7,8,0.8) 100%)",
          }}
        />
      </div>

      <Container>
        <nav aria-label="Breadcrumb" className="mf-breadcrumb mb-10 mt-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Manufacturing" },
            ]}
          />
        </nav>

        <ManufacturingClient infrastructure={infrastructure} />
      </Container>

      <style>{`
        @keyframes mf-bc-in { from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:none;} }
        .mf-breadcrumb { animation: mf-bc-in 0.7s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>
    </main>
  );
}
