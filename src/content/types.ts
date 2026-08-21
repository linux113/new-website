/**
 * SRIYAAN METALS — content type contracts (FORGE/01).
 * Components consume these types only; swapping placeholder data for
 * real client content later is a data change, not a component change.
 */

/** A value that may not have been supplied by the client yet (DS §31). */
export interface Placeholder<T> {
  value: T | null;
  /** Rendered when value is null, e.g. "[—]" or "[PENDING CLIENT INPUT]". */
  placeholder: string;
}

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
