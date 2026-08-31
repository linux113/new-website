import {
  Building2,
  Car,
  Cog,
  Construction,
  ArrowRight,
  ClipboardList,
  MessagesSquare,
  FileCheck2,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface IndustryData {
  slug: string;
  index: string;
  total: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  icon: LucideIcon;
}

export const INDUSTRIES: IndustryData[] = [
  {
    slug: "construction",
    index: "01",
    total: "04",
    name: "Construction",
    description:
      "Structural steel, reinforcement products and metal materials for commercial, residential and industrial construction projects.",
    image: "/images/industries/construction.jpg",
    alt: "Steel framework of a building under construction with cranes at golden hour",
    icon: Building2,
  },
  {
    slug: "automotive",
    index: "02",
    total: "04",
    name: "Automotive",
    description:
      "Metal grades, sheets, components and processed materials supporting automotive manufacturing and component supply.",
    image: "/images/industries/automotive.jpg",
    alt: "Robotic arms welding a car body on an automotive manufacturing line",
    icon: Car,
  },
  {
    slug: "engineering",
    index: "03",
    total: "04",
    name: "Engineering",
    description:
      "Metal stock and engineered materials for fabrication, machinery, industrial equipment and general engineering applications.",
    image: "/images/industries/engineering.jpg",
    alt: "CNC machine cutting steel with sparks in a precision engineering workshop",
    icon: Cog,
  },
  {
    slug: "infrastructure",
    index: "04",
    total: "04",
    name: "Infrastructure",
    description:
      "Materials supporting roads, bridges, utilities, transport systems and large-scale infrastructure projects.",
    image: "/images/industries/infrastructure.jpg",
    alt: "Large steel bridge at dusk with structural beams and warm lights",
    icon: Construction,
  },
];

export const TRUST = [
  { icon: ClipboardList, title: "Specification-focused sourcing", sub: "Material matched to the requirement" },
  { icon: MessagesSquare, title: "Transparent communication", sub: "Clear updates at every stage" },
  { icon: FileCheck2, title: "Documentation-driven procurement", sub: "Test certificates and compliance papers" },
  { icon: Truck, title: "Reliable delivery coordination", sub: "Planned dispatch and logistics" },
];

export { ArrowRight };
