import { getWorldDotsSvg } from "@/components/global-reach/world-map-data";
import { TradeClient } from "@/components/trade/TradeClient";

/**
 * SM-10 / TRADE (homepage) — server shell.
 *
 * Generates the dotted world map server-side (`dotted-map` is a
 * Node-only package) and hands it to the premium client experience:
 * hero + animated global trade visual + Import/Export cards + trust bar.
 */
export function ImportExportSection() {
  const dotsSvg = getWorldDotsSvg();
  return <TradeClient dotsSvg={dotsSvg} />;
}
