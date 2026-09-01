import type { LucideIcon } from "lucide-react";
import { Factory, ShieldCheck, Search, Warehouse, Package } from "lucide-react";

/**
 * Manufacturing / Infrastructure — structured, admin-ready content.
 *
 * Each array is the single source for the page; swapping in DB/CMS
 * values later only requires mapping records into these shapes. Icons
 * stay on the client (lucide-react); strings are serializable.
 */

export interface ProcessStep {
  index: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    index: "01",
    title: "Sourcing",
    description: "Material sourced against the buyer's specification.",
    icon: Search,
  },
  {
    index: "02",
    title: "Inspection",
    description: "Checked against order requirements before acceptance.",
    icon: ShieldCheck,
  },
  {
    index: "03",
    title: "Warehousing",
    description: "Held and handled to preserve material condition.",
    icon: Warehouse,
  },
  {
    index: "04",
    title: "Packaging & Dispatch",
    description: "Packed and dispatched per the agreed schedule.",
    icon: Package,
  },
];

export interface HeroFeature {
  title: string;
  sub: string;
  icon: LucideIcon;
}

export const HERO_FEATURES: HeroFeature[] = [
  {
    title: "Process Driven",
    sub: "Standardized workflow",
    icon: Factory,
  },
  {
    title: "Quality Assured",
    sub: "Every step verified",
    icon: ShieldCheck,
  },
];

export interface InfrastructureItemData {
  caption: string;
  description: string;
  image: string;
  alt: string;
}

export const INFRASTRUCTURE_ITEMS: InfrastructureItemData[] = [
  {
    caption: "Covered warehousing",
    description: "Covered storage with material segregation.",
    image: "/images/manufacturing/storage.jpg",
    alt: "Steel coils and metal stock organized in industrial warehouse racks",
  },
  {
    caption: "Dispatch coordination",
    description: "Dispatch coordination across India.",
    image: "/images/manufacturing/dispatch.jpg",
    alt: "Industrial logistics truck at a warehouse loading dock with a forklift",
  },
];
