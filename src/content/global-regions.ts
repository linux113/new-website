/**
 * Global Reach — structured region data.
 *
 * The map visualisation and region list both read from this shape so
 * the admin panel can later manage regions (name, code, coordinates,
 * status, description) without touching the UI. When the database has
 * published GlobalCountry rows, the page merges them onto this list;
 * the entries below drive the experience.
 *
 * Coordinates use an equirectangular projection in WorldMap.tsx:
 *   x = (lng + 180) / 360 * W
 *   y = (90  - lat) / 180 * H
 */

export interface RegionMarker {
  /** Approximate representative city/landing point for the route. */
  lat: number;
  lng: number;
}

export interface GlobalRegion {
  id: string;
  name: string;
  /** ISO-style code shown in the card meta, e.g. "AE". */
  code: string;
  /** Sequence number. */
  seq: string;
  /** Marker on the map. */
  marker: RegionMarker;
  /** Short supporting line (used in the detail / card). */
  blurb: string;
  /** True when a published market exists. */
  confirmed: boolean;
}

/**
 * Mumbai — the origin hub for every route.
 */
export const MUMBAI_ORIGIN = {
  lat: 19.076,
  lng: 72.8777,
  label: "Mumbai",
  sub: "Global origin",
} as const;

/**
 * The five regions. `confirmed` is overridden at render time from
 * published GlobalCountry rows when available.
 */
export const GLOBAL_REGIONS: GlobalRegion[] = [
  {
    id: "middle-east",
    name: "Middle East",
    code: "AE",
    seq: "01",
    marker: { lat: 25.2, lng: 55.27 },
    blurb: "Gulf cooperation markets — construction, oil & gas supply.",
    confirmed: true,
  },
  {
    id: "europe",
    name: "Europe",
    code: "DE",
    seq: "02",
    marker: { lat: 50.1, lng: 8.68 },
    blurb: "Engineering and industrial buyers across the EU.",
    confirmed: true,
  },
  {
    id: "southeast-asia",
    name: "Southeast Asia",
    code: "SG",
    seq: "03",
    marker: { lat: 1.35, lng: 103.82 },
    blurb: "Singapore-led regional distribution and fabrication demand.",
    confirmed: true,
  },
  {
    id: "africa",
    name: "Africa",
    code: "ZA",
    seq: "04",
    marker: { lat: -26.2, lng: 28.04 },
    blurb: "Infrastructure and mining-driven material requirements.",
    confirmed: true,
  },
  {
    id: "americas",
    name: "Americas",
    code: "US",
    seq: "05",
    marker: { lat: 40.7, lng: -74.0 },
    blurb: "North American industrial and stockist enquiries.",
    confirmed: true,
  },
];

/**
 * Statistics shown under the map.
 *
 * These are LABELS AND UNITS ONLY — the numbers themselves come from
 * admin settings (content.reach.*) so the site never advertises a
 * figure the client has not verified. A stat with no configured value
 * is skipped, and when none are set the whole strip is hidden.
 */
export const GLOBAL_STATS = [
  { key: "content.reach.countries", suffix: "+", label: "Countries connected" },
  { key: "content.reach.shipments", suffix: "+", label: "Shipments delivered" },
  { key: "content.reach.partners", suffix: "+", label: "Trusted partners" },
  { key: "content.reach.compliance", suffix: "%", label: "Compliance & transparency" },
] as const;
