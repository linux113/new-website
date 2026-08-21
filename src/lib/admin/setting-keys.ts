/**
 * Whitelisted website-setting keys (key → group/label).
 * Only these keys are writable through the admin — no arbitrary
 * key injection into WebsiteSetting.
 */

export interface SettingDef {
  group: "contact" | "social" | "content" | "seo";
  label: string;
  multiline?: boolean;
}

export const SETTING_KEYS: Record<string, SettingDef> = {
  // group: contact (managed under /admin/settings)
  "contact.phone1": { group: "contact", label: "Phone 1" },
  "contact.phone2": { group: "contact", label: "Phone 2" },
  "contact.whatsapp1": { group: "contact", label: "WhatsApp 1" },
  "contact.whatsapp2": { group: "contact", label: "WhatsApp 2" },
  "contact.email.info": { group: "contact", label: "Email — info" },
  "contact.email.sales": { group: "contact", label: "Email — sales" },
  "contact.email.purchase": { group: "contact", label: "Email — purchase" },
  "contact.email.accounts": { group: "contact", label: "Email — accounts" },
  "contact.hours": { group: "contact", label: "Working hours" },
  "contact.address": { group: "contact", label: "Address", multiline: true },
  "contact.gst": { group: "contact", label: "GSTIN" },
  // group: social
  "social.linkedin": { group: "social", label: "LinkedIn URL" },
  "social.x": { group: "social", label: "X (Twitter) URL" },
  "social.youtube": { group: "social", label: "YouTube URL" },
  // group: content (managed under /admin/content)
  "content.hero.headline": { group: "content", label: "Hero headline", multiline: true },
  "content.hero.subline": { group: "content", label: "Hero supporting copy", multiline: true },
  "content.cta.headline": { group: "content", label: "Quote CTA headline", multiline: true },
  "content.cta.subline": { group: "content", label: "Quote CTA copy", multiline: true },
  "content.footer.description": { group: "content", label: "Footer company line", multiline: true },
  // group: seo (managed under /admin/seo)
  "seo.default.title": { group: "seo", label: "Default meta title" },
  "seo.default.description": { group: "seo", label: "Default meta description", multiline: true },
  "seo.home.title": { group: "seo", label: "Homepage meta title" },
  "seo.home.description": { group: "seo", label: "Homepage meta description", multiline: true },
  "seo.robots": { group: "seo", label: "Robots directive (e.g. index,follow)" },
};

export function isSettingKey(key: string): boolean {
  return key in SETTING_KEYS;
}

export function getSettingDefs(group: SettingDef["group"]) {
  return Object.entries(SETTING_KEYS)
    .filter(([, def]) => def.group === group)
    .map(([key, def]) => ({ key, ...def }));
}
