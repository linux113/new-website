import type {
  ContactPlaceholders,
  FooterColumn,
  NavItem,
  SocialLink,
} from "./types";

/**
 * SRIYAAN METALS — site structure & placeholder contact data.
 *
 * PLACEHOLDER-CONTENT (DS §31): every bracketed value below awaits
 * real client input. Nothing here is a business claim. This module is
 * the single sweep point for the layout shell.
 */

export const SITE_NAME = "SRIYAAN METALS";

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

/** Contact placeholders (DS §31.6) — never invented values. */
export const CONTACT: ContactPlaceholders = {
  phone: "[+00 000 000 0000]",
  email: "[info@ — pending]",
  address: "[Registered address — pending client input]",
  hours: "[Working hours — pending client input]",
  gst: "GSTIN: [PENDING CLIENT INPUT]",
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
