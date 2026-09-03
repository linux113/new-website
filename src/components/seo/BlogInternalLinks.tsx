import Link from "next/link";
import { blogLinksFor } from "@/content/seo-catalog";

export function BlogInternalLinks({
  title,
  excerpt,
  content,
}: {
  title: string;
  excerpt?: string | null;
  content?: string | null;
}) {
  const groups = blogLinksFor(title, excerpt, content);
  return (
    <aside className="mt-12 border-t border-edge pt-8" aria-label="Related products">
      {groups.map((g) => (
        <div key={g.heading} className="mt-6 first:mt-0">
          <h2 className="text-heading-sm text-surface-fg">{g.heading}</h2>
          <ol className="mt-3 flex flex-col gap-2">
            {g.links.map((l, i) => (
              <li key={l.href} className="flex items-baseline gap-3">
                <span className="text-mono-micro text-surface-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link
                  href={l.href}
                  className="text-body text-surface-fg underline-offset-4 hover:text-accent hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </aside>
  );
}
