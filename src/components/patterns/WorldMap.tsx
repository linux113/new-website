import { cn } from "@/lib/cn";
import type { MapRegion } from "@/content/types";

interface WorldMapProps {
  /**
   * Confirmed markets (DS §31.5). Ships empty — zero highlighted
   * countries until the client confirms export markets. When data
   * arrives, regions render as highlighted markers/labels and the
   * pending note disappears.
   */
  regions?: MapRegion[];
  /** Mono note shown while regions is empty. */
  pendingNote?: string;
  className?: string;
}

/**
 * Global reach map (DS §31.5) — lightweight neutral state.
 *
 * Deliberately no heavy map dependency: until real export-market data
 * exists there is nothing truthful to plot, so the neutral state is a
 * technical graticule (lat/long grid) panel with the pending note.
 * The component's data contract (MapRegion[]) is the stable
 * architecture; when markets are confirmed, this same component gains
 * a proper landmass layer + highlighted regions without any consumer
 * changes.
 */
export function WorldMap({
  regions = [],
  pendingNote = "EXPORT MARKETS — TO BE CONFIRMED",
  className,
}: WorldMapProps) {
  const hasData = regions.length > 0;

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden border border-edge bg-surface",
        className,
      )}
      role="img"
      aria-label={
        hasData
          ? `Export markets: ${regions.map((r) => r.label).join(", ")}`
          : "World map — export markets to be confirmed"
      }
    >
      {/* Graticule — technical lat/long grid, subtle (DS §2 "subtle grid systems") */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full text-(--surface-edge)"
        viewBox="0 0 640 360"
        preserveAspectRatio="none"
      >
        {/* Meridians */}
        {Array.from({ length: 15 }, (_, i) => (
          <line
            key={`m-${i}`}
            x1={(i + 1) * 40}
            y1="0"
            x2={(i + 1) * 40}
            y2="360"
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
        {/* Parallels */}
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`p-${i}`}
            x1="0"
            y1={(i + 1) * 40}
            x2="640"
            y2={(i + 1) * 40}
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
        {/* Equator + prime meridian, slightly stronger */}
        <line x1="0" y1="180" x2="640" y2="180" stroke="currentColor" strokeWidth="2" />
        <line x1="320" y1="0" x2="320" y2="360" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Corner coordinates — mono meta layer */}
      <p className="absolute top-4 left-4 text-mono-micro text-surface-muted">
        90°N / 180°W
      </p>
      <p className="absolute right-4 bottom-4 text-mono-micro text-surface-muted">
        90°S / 180°E
      </p>

      {hasData ? (
        /* Data-driven region list — plotted markers arrive with real map layer */
        <ul className="absolute inset-x-6 bottom-12 flex flex-wrap gap-2">
          {regions.map((region) => (
            <li
              key={region.code}
              className="border border-edge bg-paper-raised px-2 py-1 text-mono-micro text-ink"
            >
              {region.label}
            </li>
          ))}
        </ul>
      ) : (
        /* Neutral pending state (DS §31.5) */
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <p className="border border-edge bg-surface px-4 py-3 text-mono-meta text-surface-muted">
            {pendingNote}
          </p>
        </div>
      )}
    </div>
  );
}
