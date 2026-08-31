import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Post } from "@/content/types";
import { PatternMedia } from "./PatternMedia";

interface BlogCardProps {
  post: Post;
  className?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/**
 * Blog card Card/Media): 3:2 media, mono date · category
 * meta line, display title, 3-line excerpt, ghost "Read" link.
 * Whole card is the link; missing images degrade to the honest
 * placeholder panel.
 */
export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col border border-edge bg-ink-soft",
        "transition-[border-color,box-shadow,translate] duration-(--duration-base) ease-(--ease-out-quart)",
        "hover:-translate-y-0.5 hover:border-steel hover:shadow-raise",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <PatternMedia
        media={post.image}
        ratio="3/2"
        sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
        surface="media"
        graded
        hoverScale
      />

      <div className="flex flex-1 flex-col gap-3 p-6 lg:p-8">
        <p className="text-mono-micro text-mist">
          {post.date ? (
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          ) : (
            <span>[DATE — PENDING]</span>
          )}
          <span aria-hidden="true"> · </span>
          {post.category}
        </p>

        <h3 className="text-heading-sm font-display font-medium text-paper">
          <Link
            href={post.href}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-body-sm text-mist line-clamp-3">{post.excerpt}</p>

        <p className="mt-auto flex items-center gap-2 pt-3 text-label text-paper transition-colors duration-(--duration-base) group-hover:text-accent">
          Read
          <span
            aria-hidden="true"
            className="transition-transform duration-(--duration-base) group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </p>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 outline-accent group-has-focus-visible:outline-2 group-has-focus-visible:outline-offset-2"
      />
    </article>
  );
}
