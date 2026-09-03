import type { Metadata } from "next";
import { LocationPageView, locationMetadata } from "@/components/seo/LocationPageView";
import { getLocationPage } from "@/content/seo-catalog";

const PAGE = getLocationPage("fastener-supplier-mumbai")!;

export const metadata: Metadata = locationMetadata(PAGE);

export default function Page() {
  return <LocationPageView slug="fastener-supplier-mumbai" />;
}
