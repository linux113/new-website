import type {
  ContactInfo,
  FooterColumn,
  NavItem,
  SocialLink,
} from "./types";

/**
 * SRIYAAN METALS — site structure & company data.
 *
 * CONTACT/GST/ADDRESS/HOURS below are VERIFIED client-supplied data.
 * Everything bracketed remains PLACEHOLDER-CONTENT (DS §31) awaiting
 * client input. This module is the single sweep point for the shell.
 */

export const SITE_NAME = "SRIYAAN METALS";
export const SITE_DOMAIN = "sriyaanmetals.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;

/** Main navigation. Products carries the mega-menu categories. */
export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    href: "/products",
    children: [
      // PLACEHOLDER-CONTENT: generic neutral category slots, no invented
      // product lines. Replaced wholesale when the client catalogue lands.
      { index: "01", label: "Category A — placeholder", href: "/products", meta: "[RANGE — TBD]" },
      { index: "02", label: "Category B — placeholder", href: "/products", meta: "[RANGE — TBD]" },
      { index: "03", label: "Category C — placeholder", href: "/products", meta: "[RANGE — TBD]" },
      { index: "04", label: "Category D — placeholder", href: "/products", meta: "[RANGE — TBD]" },
    ],
  },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Quality", href: "/quality" },
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "Global Reach", href: "/global-reach" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const QUOTE_CTA = { label: "Get a Quote", href: "/contact" } as const;

/** Footer navigation groups. */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Manufacturing", href: "/manufacturing" },
      { label: "Quality", href: "/quality" },
      { label: "Global Reach", href: "/global-reach" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Products",
    links: [
      // PLACEHOLDER-CONTENT: mirrors mega-menu category slots.
      { label: "Category A — placeholder", href: "/products" },
      { label: "Category B — placeholder", href: "/products" },
      { label: "Category C — placeholder", href: "/products" },
      { label: "Category D — placeholder", href: "/products" },
      { label: "All products", href: "/products" },
    ],
  },
  {
    heading: "Engage",
    links: [
      { label: "Industries", href: "/industries" },
      { label: "Get a Quote", href: "/contact" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** VERIFIED contact data — supplied by SRIYAAN METALS. */
export const CONTACT: ContactInfo = {
  phones: [
    { label: "Phone", value: "+91 96195 61657", href: "tel:+919619561657" },
    { label: "Phone", value: "+91 98190 33982", href: "tel:+919819033982" },
  ],
  whatsapp: [
    { label: "WhatsApp", value: "+91 96195 61657", href: "https://wa.me/919619561657" },
    { label: "WhatsApp", value: "+91 98190 33982", href: "https://wa.me/919819033982" },
  ],
  emails: [
    { label: "General", value: "info@sriyaanmetals.co", href: "mailto:info@sriyaanmetals.co" },
    { label: "Sales", value: "sales@sriyaanmetals.co", href: "mailto:sales@sriyaanmetals.co" },
    { label: "Purchase", value: "purchase@sriyaanmetals.co", href: "mailto:purchase@sriyaanmetals.co" },
    { label: "Accounts", value: "accounts@sriyaanmetals.co", href: "mailto:accounts@sriyaanmetals.co" },
  ],
  addressLines: [
    "Floor-2, 204, Plot No.96/98,",
    "Platinum Arcade, JSS Road,",
    "Central Plaza Cinema Charni Road,",
    "Opera House, Mumbai - 400004",
  ],
  hours: "10:00 AM – 7:00 PM",
  gst: "GSTIN: 27CRKPS0693G1ZB",
};

/** Social profiles — hrefs stay "#" until the client supplies them. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "LinkedIn", href: "#" },
  { label: "X (Twitter)", href: "#" },
  { label: "YouTube", href: "#" },
];

export const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
] as const;
