import { cn } from "@/lib/cn";
import type { Specification } from "@/content/types";

interface SpecTableProps {
  specifications: Specification[];
  /** Accessible caption (visually hidden). */
  caption?: string;
  className?: string;
}

/**
 * Specification table (DS §24.5).
 * ≥ md: semantic two-column table with row headers.
 * < md: stacked definition-list style (mono label above value).
 * Missing values render their explicit placeholder — never invented
 * specifications (DS §31). Tabular numerals throughout.
 */
export function SpecTable({
  specifications,
  caption = "Specifications",
  className,
}: SpecTableProps) {
  if (specifications.length === 0) return null;

  return (
    <div className={className}>
      {/* ≥ md: semantic table */}
      <table className="hidden w-full border-collapse md:table">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {specifications.map((spec) => {
            const value = spec.value.value ?? spec.value.placeholder;
            const pending = spec.value.value === null;
            return (
              <tr key={spec.label} className="border-b border-edge transition-colors duration-(--duration-fast) hover:bg-paper-sunken">
                <th
                  scope="row"
                  className="w-2/5 py-4 pr-8 text-left text-mono-meta font-normal text-surface-muted"
                >
                  {spec.label}
                </th>
                <td
                  className={cn(
                    "py-4 text-body-sm tabular-nums",
                    pending ? "text-mist" : "text-surface-fg",
                  )}
                >
                  {value}
                  {spec.unit && !pending ? (
                    <span className="text-mono-micro text-slate"> {spec.unit}</span>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* < md: stacked definition list */}
      <dl className="md:hidden">
        {specifications.map((spec) => {
          const value = spec.value.value ?? spec.value.placeholder;
          const pending = spec.value.value === null;
          return (
            <div key={spec.label} className="border-b border-edge py-4">
              <dt className="text-mono-meta text-surface-muted">{spec.label}</dt>
              <dd
                className={cn(
                  "mt-1 text-body-sm tabular-nums",
                  pending ? "text-mist" : "text-surface-fg",
                )}
              >
                {value}
                {spec.unit && !pending ? (
                  <span className="text-mono-micro text-slate"> {spec.unit}</span>
                ) : null}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
