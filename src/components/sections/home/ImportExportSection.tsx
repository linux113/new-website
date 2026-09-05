import { TradeClient } from "@/components/trade/TradeClient";
import { getCompanyInfo } from "@/lib/company";

/**
 * SM-10 / TRADE (homepage) — server shell.
 *
 * Generates the dotted world map server-side (`dotted-map` is a
 * Node-only package) and hands it to the premium client experience:
 * hero + animated global trade visual + Import/Export cards + trust bar.
 *
 * The small status line on each card comes from admin settings
 * (content.trade.*.meta). Unset → the footer row is omitted rather than
 * rendering a placeholder.
 */
export async function ImportExportSection() {
  const company = await getCompanyInfo();
  return (
    <TradeClient
      importMeta={company.content["content.trade.import.meta"]?.trim() || undefined}
      exportMeta={company.content["content.trade.export.meta"]?.trim() || undefined}
    />
  );
}
