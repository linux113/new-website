/**
 * WhatsApp click-to-chat helpers (no Business API).
 * Verified numbers; primary default 9619561657. Messages contain
 * only public information (company/product name + public URL) —
 * never personal or sensitive data in URL parameters.
 *
 * Client-safe module (no secrets, no server-only imports).
 */

export const WHATSAPP_NUMBERS = {
  primary: "919619561657",
  secondary: "919819033982",
} as const;

export function whatsappUrl(message?: string, number: string = WHATSAPP_NUMBERS.primary): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** General enquiry chat link. */
export function whatsappGeneralUrl(): string {
  return whatsappUrl("Hello SRIYAAN METALS, I would like to make an enquiry.");
}

/** Product-specific enquiry — dynamic, never hardcoded to one product. */
export function whatsappProductUrl(productName: string, productPath: string, siteUrl: string): string {
  const url = `${siteUrl.replace(/\/$/, "")}${productPath}`;
  return whatsappUrl(
    `Hello SRIYAAN METALS, I would like a quote for: ${productName}\n${url}`,
  );
}
