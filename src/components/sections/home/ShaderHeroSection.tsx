"use client";

import { useRouter } from "next/navigation";
import Hero from "@/components/ui/animated-shader-hero";
import StarCursor from "@/components/ui/star-cursor";

/**
 * SM–01 / HERO (shader edition — client-requested).
 * Full-screen WebGL shader hero with the star-trail cursor overlaid,
 * both in brand Furnace Orange. Verified company positioning only —
 * no invented claims. CTAs route to the live enquiry and catalogue
 * pages. Both effects self-disable under prefers-reduced-motion.
 */
export function ShaderHeroSection() {
  const router = useRouter();

  return (
    <section aria-label="SRIYAAN METALS — hero" className="relative" data-surface="dark">
      <Hero
        trustBadge={{
          text: "Metals · Trading · Import / Export — Mumbai, IN",
          icons: ["✦"],
        }}
        headline={{
          line1: "SRIYAAN",
          line2: "METALS",
        }}
        subtitle="Precision metals, supplied without compromise — built on exact specification, dependable supply and direct communication."
        buttons={{
          primary: {
            text: "Get a Quote",
            onClick: () => router.push("/enquiry"),
          },
          secondary: {
            text: "Explore Products",
            onClick: () => router.push("/products"),
          },
        }}
      />

      {/* Star cursor trail — overlay on the hero only, never blocks clicks */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <StarCursor label={false} starColor="#E0592B" hideNativePointer={false} />
      </div>
    </section>
  );
}
