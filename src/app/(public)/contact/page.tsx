import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactInformation } from "@/components/contact/ContactInformation";
import { EnquirySection } from "@/components/contact/EnquirySection";
import { OfficeLocation } from "@/components/contact/OfficeLocation";
import { MapSection } from "@/components/contact/MapSection";
import { WhatsAppCTA } from "@/components/contact/WhatsAppCTA";
import { FinalCTA } from "@/components/contact/FinalCTA";
import { SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact SRIYAAN METALS — Opera House, Mumbai. Product enquiries, sourcing, vendors and industrial supply. Phone, WhatsApp and email.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

/**
 * Premium contact page — dark, sharp, technical, cinematic.
 *
 * Composition (each section is its own component):
 *   01 ContactHero          — cinematic 70–80vh hero, masked line reveal
 *   02 ContactInformation   — asymmetric technical information rows
 *   03 EnquirySection       — functional validated form (server action)
 *   04 OfficeLocation       — address / GST / hours / directions
 *   05 MapSection           — dark-styled Google map (keyless fallback)
 *   06 WhatsAppCTA          — dedicated WhatsApp channel
 *   08 FinalCTA             — cinematic closing call to action
 *
 * Navbar and footer are provided by the public layout. The form
 * persists to the database and triggers email notifications via the
 * existing secure server action pipeline.
 */
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInformation />
      <EnquirySection />
      <OfficeLocation />
      <MapSection />
      <WhatsAppCTA />
      <FinalCTA />
    </>
  );
}
