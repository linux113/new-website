"use client";

/** File + optional existing preview. Hidden id keeps current media. */
export function MediaFileField({
  name,
  currentUrl,
  currentId,
  accept = "image/jpeg,image/png,image/webp,image/gif,image/avif,application/pdf",
}: {
  name: string;
  currentUrl?: string | null;
  currentId?: string | null;
  accept?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {currentId ? <input type="hidden" name={name} value={currentId} /> : null}
      {currentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUrl}
          alt=""
          className="h-28 w-28 rounded-xs border border-line object-cover"
        />
      ) : null}
      <input
        id={`f-${name}`}
        name={`${name}File`}
        type="file"
        accept={accept}
        className="text-body-sm file:mr-3 file:h-10 file:cursor-pointer file:rounded-xs file:border file:border-line file:bg-paper-sunken file:px-3 file:text-label file:text-ink"
      />
      <p className="text-body-sm text-slate">
        JPEG, PNG, WebP, GIF or PDF — max 10 MB.
        {currentUrl ? " Choose a new file to replace the current image." : ""}
      </p>
    </div>
  );
}
