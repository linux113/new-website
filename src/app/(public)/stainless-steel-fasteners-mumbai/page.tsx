import type { Metadata } from "next";
import { LocationPageView, locationMetadata } from "@/components/seo/LocationPageView";
import { getLocationPage } from "@/content/seo-catalog";

const PAGE = getLocationPage("stainless-steel-fasteners-mumbai")!;

export const metadata: Metadata = locationMetadata(PAGE);

export default function Page() {
  return <LocationPageView slug="stainless-steel-fasteners-mumbai" />;
}
