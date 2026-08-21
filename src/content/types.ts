/**
 * SRIYAAN METALS — content type contracts (FORGE/01).
 * Frontend/domain types only — NOT database models. Components consume
 * these types so swapping placeholder data for real client content
 * later is a data change, not a component change (DS §31.7).
 */

/** A value that may not have been supplied by the client yet (DS §31). */
export interface Placeholder<T> {
  value: T | null;
  /** Rendered when value is null, e.g. "[—]" or "[PENDING CLIENT INPUT]". */
  placeholder: string;
}

/* ---------------------------------------------------------------- */
/* Media                                                            */
/* ---------------------------------------------------------------- */

/** Reference to a media asset. `src: null` = awaiting client asset. */
export interface MediaRef {
  src: string | null;
  /** Meaningful alt text (DS §23.4); "" for decorative. */
  alt: string;
  /** Mono label shown when src is null, e.g. "[AWAITING CLIENT ASSET]". */
  placeholderLabel?: string;
  /** Media kind tag for gallery thumbs (DS §15). */
  kind?: "img" | "dwg" | "vid";
}

/* ---------------------------------------------------------------- */
/* Navigation                                                       */
/* ---------------------------------------------------------------- */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem extends NavLink {
  /** Present when the item opens a mega-menu panel. */
  children?: NavCategory[];
}

/** Product category entry in the mega menu — placeholder until client data. */
export interface NavCategory {
  index: string; // "01", "02" … (DS §2 Index Numbering)
  label: string;
  href: string;
  /** Short mono meta line, e.g. "[RANGE — TBD]". */
  meta: string;
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export interface ContactPlaceholders {
  phone: string;
  email: string;
  address: string;
  hours: string;
  gst: string;
}

export interface SocialLink {
  label: string;
  href: string; // "#" until client supplies profiles
}

/* ---------------------------------------------------------------- */
/* Catalogue                                                        */
/* ---------------------------------------------------------------- */

export interface Category {
  slug: string;
  title: string;
  /** Zero-padded index string, e.g. "01". */
  index: string;
  image: MediaRef | null;
  description?: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Category label shown in the card meta line. */
  category: string;
  /** Internal code, e.g. "SM-[XXX]" while pending. */
  code: string;
  /** One-line spec summary — placeholder until client data (DS §31.4). */
  specSummary: Placeholder<string>;
  media: MediaRef[];
  specifications?: Specification[];
}

/** A single specification row (DS §14/§10 SpecTable). */
export interface Specification {
  label: string;
  value: Placeholder<string>;
  /** Optional unit, rendered mono, e.g. "mm", "MT". */
  unit?: string;
}

/* ---------------------------------------------------------------- */
/* Company / marketing                                              */
/* ---------------------------------------------------------------- */

export interface Metric {
  id: string;
  label: string;
  value: Placeholder<number>;
  prefix?: string;
  suffix?: string;
}

export interface Industry {
  slug: string;
  name: string;
  index: string;
  description?: string;
  href?: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string | null; // ISO date; null while placeholder
  category: string;
  excerpt: string;
  image: MediaRef | null;
  href: string;
}

export interface Testimonial {
  id: string;
  /** Quote text — placeholder until real testimonials exist (DS §31.3). */
  quote: Placeholder<string>;
  name: string; // "[Name — pending]" until supplied
  role: string; // "[Role, Company — pending]"
  avatar?: MediaRef | null;
}

/** Certification slot — never an invented certification (DS §31.2). */
export interface Certification {
  id: string;
  /** Real name only when the client provides documents; else null. */
  name: string | null;
  status: "pending" | "provided";
  /** Document/scan reference once provided. */
  document?: MediaRef | null;
}

/** Global reach map region — empty until markets are confirmed (DS §31.5). */
export interface MapRegion {
  /** ISO 3166-1 alpha-2 code, lowercase. */
  code: string;
  label: string;
}
