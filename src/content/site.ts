import type {
  ContactInfo,
  FooterColumn,
  NavItem,
  SocialLink,
} from "./types";

/**
 * SRIYAAN METALS — site structure & company data.
 * Contact, GST, address and hours are client-verified values; this
 * module is the single place to update the site shell.
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
      { index: "01", label: "Bolts, Studs & Screws", href: "/products/bolts-studs-screws", meta: "Hex bolts, studs & threaded rods" },
      { index: "02", label: "Nuts & Washers", href: "/products/nuts-washers", meta: "Hex, slotted, coupling & plain" },
      { index: "03", label: "Anchors & Foundation Bolts", href: "/products/anchor-foundation-bolts", meta: "Anchor & J-type foundation bolts" },
      { index: "04", label: "Rivets & Inserts", href: "/products/rivets-inserts", meta: "Rivet nuts & threaded inserts" },
      { index: "05", label: "Pipe Fittings", href: "/products/pipe-fittings", meta: "BW / SW / threaded fittings" },
      { index: "06", label: "Pipe Flanges", href: "/products/pipe-flanges", meta: "Forged flanges, ASTM / DIN / JIS" },
      { index: "07", label: "Carbon Steel Pipes", href: "/products/carbon-steel-pipes", meta: "Dimensions per ASTM B36.10" },
    ],
  },
  { label: "Industries", href: "/industries" },
  {
    label: "Company",
    href: "/about",
    children: [
      { index: "01", label: "About", href: "/about", meta: "A Mumbai trading desk" },
      { index: "02", label: "Quality", href: "/quality", meta: "Verified, then shipped" },
      { index: "03", label: "Manufacturing", href: "/manufacturing", meta: "From intake to dispatch" },
      { index: "04", label: "Global Reach", href: "/global-reach", meta: "Import & export lanes" },
    ],
  },
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
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Products",
    links: [
      // mirrors mega-menu category slots.
      { label: "Bolts, Studs & Screws", href: "/products/bolts-studs-screws" },
      { label: "Nuts & Washers", href: "/products/nuts-washers" },
      { label: "Anchors & Foundation Bolts", href: "/products/anchor-foundation-bolts" },
      { label: "Rivets & Inserts", href: "/products/rivets-inserts" },
      { label: "Pipe Fittings", href: "/products/pipe-fittings" },
      { label: "Pipe Flanges", href: "/products/pipe-flanges" },
      { label: "Carbon Steel Pipes", href: "/products/carbon-steel-pipes" },
      { label: "All products", href: "/products" },
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
    { label: "General", value: "info@sriyaanmetals.com", href: "mailto:info@sriyaanmetals.com" },
    { label: "Sales", value: "sales@sriyaanmetals.com", href: "mailto:sales@sriyaanmetals.com" },
    { label: "Purchase", value: "purchase@sriyaanmetals.com", href: "mailto:purchase@sriyaanmetals.com" },
    { label: "Accounts", value: "accounts@sriyaanmetals.com", href: "mailto:accounts@sriyaanmetals.com" },
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
