import Link from "next/link";
import { cn } from "@/lib/cn";
import { AdminEmptyState } from "./ui";

/**
 * Admin data table (server component).
 * Search + pagination are URL-driven (?q=&page=) so list pages stay
 * server-rendered; row actions are links or small client islands.
 * < md, cells marked `primary` stay visible and others stack into a
 * definition-style block — no unusable horizontal overflow.
 */

export interface Column<Row> {
  key: string;
  header: string;
  primary?: boolean;
  render: (row: Row) => React.ReactNode;
}

interface DataTableProps<Row> {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  page: number;
  pageCount: number;
  basePath: string;
  query?: string;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
}

export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  page,
  pageCount,
  basePath,
  query,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: DataTableProps<Row>) {
  if (rows.length === 0) {
    return (
      <AdminEmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
    );
  }

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="border border-line bg-paper-raised">
      {/* ≥ md: table */}
      <table className="hidden w-full border-collapse md:table">
        <thead>
          <tr className="border-b border-line">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-left text-mono-micro font-normal text-slate"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-line last:border-b-0 hover:bg-paper-sunken"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-body-sm text-ink">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* < md: stacked rows */}
      <ul className="md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="border-b border-line p-4 last:border-b-0">
            <div className="flex flex-col gap-2">
              {columns.map((col) => (
                <div key={col.key} className={cn(!col.primary && "flex items-baseline gap-2")}>
                  {!col.primary ? (
                    <span className="text-mono-micro text-slate">{col.header}</span>
                  ) : null}
                  <span className={cn("text-body-sm", col.primary && "text-heading-sm")}>
                    {col.render(row)}
                  </span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {pageCount > 1 ? (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between border-t border-line px-4 py-3"
        >
          <PaginationLink href={pageHref(page - 1)} disabled={page <= 1}>
            ← Previous
          </PaginationLink>
          <span className="text-mono-micro text-slate tabular-nums">
            Page {page} of {pageCount}
          </span>
          <PaginationLink href={pageHref(page + 1)} disabled={page >= pageCount}>
            Next →
          </PaginationLink>
        </nav>
      ) : null}
    </div>
  );
}

function PaginationLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span aria-disabled="true" className="text-body-sm text-mist">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className="text-body-sm text-ink hover:text-accent">
      {children}
    </Link>
  );
}
