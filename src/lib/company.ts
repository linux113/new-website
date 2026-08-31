import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { CONTACT, SITE_NAME, SITE_URL } from "@/content/site";
import type { ContactInfo } from "@/content/types";

/**
 * THE server-side source of truth for company information.
 *
 * Layering: verified client-supplied values (content/site.ts) are
 * the base; admin-edited WebsiteSetting rows override them when
 * present. Components never hardcode contact data — they call
 * getCompanyInfo(). Cached per-request; safe when the DB is down
 * (falls back to verified static values).
 */

export interface CompanyInfo extends ContactInfo {
  name: string;
  siteUrl: string;
  social: { label: string; href: string }[];
  content: Record<string, string>;
  seo: Record<string, string>;
}

function digits(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

export const getCompanyInfo = cache(async (): Promise<CompanyInfo> => {
  let settings: Record<string, string> = {};
  try {
    const rows = await db.websiteSetting.findMany({
      where: { group: { in: ["contact", "social", "content", "seo"] } },
    });
    settings = Object.fromEntries(
      rows.map((row) => [row.key, String(row.value ?? "")]),
    );
  } catch (error) {
    console.error(
      "[company] settings unavailable, using verified defaults:",
      error instanceof Error ? error.message : error,
    );
  }

  const get = (key: string, fallback: string): string =>
    settings[key]?.trim() ? settings[key].trim() : fallback;

  const phone1 = get("contact.phone1", CONTACT.phones[0].value);
  const phone2 = get("contact.phone2", CONTACT.phones[1].value);
  const whatsapp1 = get("contact.whatsapp1", CONTACT.whatsapp[0].value);
  const whatsapp2 = get("contact.whatsapp2", CONTACT.whatsapp[1].value);
  const address = get("contact.address", CONTACT.addressLines.join("\n"));

  // Only absolute http(s) URLs pass — blocks javascript:/data: injection
  // through the settings panel and drops empty values.
  const safeHttpUrl = (raw: string | undefined): string | null => {
    if (!raw) return null;
    try {
      const u = new URL(raw.trim());
      return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
    } catch {
      return null;
    }
  };
  const social = [
    { label: "LinkedIn", href: safeHttpUrl(settings["social.linkedin"]) },
    { label: "X (Twitter)", href: safeHttpUrl(settings["social.x"]) },
    { label: "YouTube", href: safeHttpUrl(settings["social.youtube"]) },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return {
    name: SITE_NAME,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || SITE_URL,
    phones: [
      { label: "Phone", value: phone1, href: `tel:+${digits(phone1)}` },
      { label: "Phone", value: phone2, href: `tel:+${digits(phone2)}` },
    ],
    whatsapp: [
      { label: "WhatsApp", value: whatsapp1, href: `https://wa.me/${digits(whatsapp1)}` },
      { label: "WhatsApp", value: whatsapp2, href: `https://wa.me/${digits(whatsapp2)}` },
    ],
    emails: [
      { label: "General", value: get("contact.email.info", CONTACT.emails[0].value), href: `mailto:${get("contact.email.info", CONTACT.emails[0].value)}` },
      { label: "Sales", value: get("contact.email.sales", CONTACT.emails[1].value), href: `mailto:${get("contact.email.sales", CONTACT.emails[1].value)}` },
      { label: "Purchase", value: get("contact.email.purchase", CONTACT.emails[2].value), href: `mailto:${get("contact.email.purchase", CONTACT.emails[2].value)}` },
      { label: "Accounts", value: get("contact.email.accounts", CONTACT.emails[3].value), href: `mailto:${get("contact.email.accounts", CONTACT.emails[3].value)}` },
    ],
    addressLines: address.split("\n").filter(Boolean),
    hours: get("contact.hours", CONTACT.hours),
    gst: get("contact.gst", CONTACT.gst),
    social,
    content: Object.fromEntries(
      Object.entries(settings).filter(([key]) => key.startsWith("content.")),
    ),
    seo: Object.fromEntries(
      Object.entries(settings).filter(([key]) => key.startsWith("seo.")),
    ),
  };
});
