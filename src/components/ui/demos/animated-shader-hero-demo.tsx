"use client";

import { useRouter } from "next/navigation";
import Hero from "@/components/ui/animated-shader-hero";

/**
 * Demo — animated shader hero, wired to SRIYAAN METALS actions.
 * Copy adapted to the project (no invented claims).
 */
export function AnimatedShaderHeroDemo() {
  const router = useRouter();

  return (
    <Hero
      trustBadge={{
        text: "Precision metals, supplied without compromise.",
        icons: ["✦"],
      }}
      headline={{
        line1: "SRIYAAN",
        line2: "METALS",
      }}
      subtitle="Mumbai-based metals trading, import and export — built on exact specification, dependable supply and direct communication."
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
  );
}
