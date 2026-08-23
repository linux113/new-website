import type { Metadata } from "next";
import { AnimatedShaderHeroDemo } from "@/components/ui/demos/animated-shader-hero-demo";
import { SplineSceneBasic } from "@/components/ui/demos/spline-scene-demo";
import FireworkCursor from "@/components/ui/firework-cursor";
import StarCursor from "@/components/ui/star-cursor";
import { Container, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Component Lab",
  robots: { index: false, follow: false },
};

/**
 * COMPONENT LAB — internal showcase for vendored third-party
 * components (animated shader hero, Spline 3D scene, firework
 * cursor). noindex; not linked from site navigation. These effects
 * intentionally live OUTSIDE the FORGE/01 design system — the
 * production homepage is unaffected (DS §2, §20 restraint rules).
 */
export default function ComponentLabPage() {
  return (
    <>
      {/* 1 — Animated shader hero (WebGL2) */}
      <AnimatedShaderHeroDemo />

      {/* 2 — Spline 3D scene + spotlight card */}
      <Section surface="dark" rule aria-labelledby="lab-spline">
        <Container>
          <SectionHeading
            id="lab-spline"
            code="LAB–02"
            eyebrow="Spline 3D"
            title="Interactive 3D scene"
            align="start"
          />
          <div className="mt-10">
            <SplineSceneBasic />
          </div>
        </Container>
      </Section>

      {/* 3 — Firework GPGPU cursor field */}
      <Section rule aria-labelledby="lab-cursor">
        <Container>
          <SectionHeading
            id="lab-cursor"
            code="LAB–03"
            eyebrow="Firework cursor"
            title="GPGPU particle trail"
            align="start"
          />
          <div className="mt-10 h-[420px] border border-edge bg-ink">
            <FireworkCursor
              labelText="HOVER AROUND"
              colors={["#C8461B", "#E0592B"]}
              color="#C8461B"
            />
          </div>
        </Container>
      </Section>

      {/* 4 — Star / glitter cursor trail */}
      <Section surface="dark" rule aria-labelledby="lab-star">
        <Container>
          <SectionHeading
            id="lab-star"
            code="LAB–04"
            eyebrow="Glitter cursor"
            title="Star particle trail"
            align="start"
          />
          <div className="mt-10 h-[420px] border border-line-dark bg-black">
            <StarCursor
              labelText="HOVER AROUND"
              starColor="#C8461B"
              labelColor="#9AA7B4"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
