import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { deleteMediaAction } from "@/lib/admin/settings-actions";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { MediaAltForm } from "@/components/admin/MediaAltForm";
import { MediaUploadForm } from "@/components/admin/MediaUploadForm";
import { AdminEmptyState, AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "Media" };

const PAGE_SIZE = 24;

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Media library. Listing/alt-editing/deletion over the MediaAsset
 * model. Uploads intentionally absent this phase — the storage
 * abstraction (storageProvider/storageKey) is ready for the R2
 * integration; nothing is faked.
 */
export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = q
    ? {
        OR: [
          { filename: { contains: q, mode: "insensitive" as const } },
          { altText: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [assets, total] = await Promise.all([
    db.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.mediaAsset.count({ where }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Media library"
        crumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Media" }]}
      />

      <div className="mb-4">
        <MediaUploadForm />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <AdminSearch basePath="/admin/media" placeholder="Search filename or alt text…" />
        <p className="text-mono-micro text-slate">{total} assets</p>
      </div>

      {assets.length === 0 ? (
        <AdminEmptyState
          title={q ? `No results for “${q}”` : "No media yet"}
          description="Upload the first asset above. Without R2 credentials, files store locally for development."
        />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {assets.map((asset) => (
            <li key={asset.id} className="flex flex-col border border-line bg-paper-raised">
              <div className="relative aspect-square bg-paper-sunken">
                {asset.publicUrl && asset.type === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.publicUrl}
                    alt={asset.altText ?? asset.filename}
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-mono-micro text-mist">{asset.type}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1.5 p-3">
                <p className="truncate text-body-sm font-medium text-ink" title={asset.filename}>
                  {asset.filename}
                </p>
                <p className="text-mono-micro text-slate">
                  {asset.width && asset.height ? `${asset.width}×${asset.height} · ` : ""}
                  {formatSize(asset.size)} · {asset.mimeType}
                </p>
                <MediaAltForm id={asset.id} altText={asset.altText ?? ""} />
                <div className="mt-1 flex justify-end">
                  <ConfirmDelete
                    label="asset"
                    description="Deletes the media record. Assets referenced by products or content cannot be deleted."
                    action={deleteMediaAction.bind(null, asset.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
