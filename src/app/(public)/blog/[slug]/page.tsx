import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout";
import { BlogCard } from "@/components/patterns";
import { Container, Eyebrow, Hairline, Section } from "@/components/ui";
import { getPostBySlug, getPublishedPosts } from "@/lib/repositories/blogs";
import { toPatternPost } from "@/lib/mappers";
import { SITE_URL } from "@/content/site";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.status !== "PUBLISHED") return { title: "Article not found" };

  const title = post.seo?.metaTitle ?? post.title;
  const description = post.seo?.metaDescription ?? post.excerpt ?? undefined;
  const canonical = post.seo?.canonicalUrl ?? `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.seo?.ogImage?.publicUrl ?? post.featuredImage?.publicUrl;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: post.seo?.ogTitle ?? title,
      description: post.seo?.ogDescription ?? description,
      url: canonical,
      type: "article",
      ...(post.publishedAt ? { publishedTime: post.publishedAt.toISOString() } : {}),
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

/** Minimal safe Markdown → blocks renderer (no raw HTML injection). */
function renderContent(content: string): React.ReactNode {
  return content.split(/\n{2,}/).map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="text-display-md mt-10">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h2 key={i} className="text-display-md mt-10">
          {trimmed.slice(2)}
        </h2>
      );
    }
    if (/^[-*] /m.test(trimmed)) {
      const items = trimmed.split("\n").filter((l) => /^[-*] /.test(l));
      return (
        <ul key={i} className="mt-5 flex list-disc flex-col gap-2 pl-5 text-body text-surface-muted">
          {items.map((item, j) => (
            <li key={j}>{item.replace(/^[-*] /, "")}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="text-body text-surface-muted mt-5">
        {trimmed}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  // Repository filters PUBLISHED via unique where; double-check status
  // + publication date so drafts/archived/scheduled never render.
  if (!post || post.status !== "PUBLISHED") notFound();
  if (post.publishedAt && post.publishedAt > new Date()) notFound();

  const related = (await getPublishedPosts({ take: 4 }).catch(() => []))
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    url: `${SITE_URL}/blog/${post.slug}`,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt.toISOString() } : {}),
    ...(post.author ? { author: { "@type": "Person", name: post.author.name } } : {}),
    ...(post.featuredImage?.publicUrl ? { image: post.featuredImage.publicUrl } : {}),
    publisher: { "@type": "Organization", name: "SRIYAAN METALS", url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Section rhythm="default" className="pt-32 lg:pt-44">
        <Container>
          <Breadcrumbs
            className="mb-10"
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          <article className="mx-auto max-w-3xl">
            <header className="flex flex-col gap-4">
              <Eyebrow code="SM–B">
                {post.category?.name ?? "Insights"}
                {post.publishedAt ? (
                  <>
                    {" · "}
                    <time dateTime={post.publishedAt.toISOString()}>
                      {post.publishedAt.toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </time>
                  </>
                ) : null}
              </Eyebrow>
              <h1 className="text-display-lg text-balance">{post.title}</h1>
              {post.excerpt ? (
                <p className="text-body-lg text-surface-muted">{post.excerpt}</p>
              ) : null}
              {post.author ? (
                <p className="text-mono-micro text-surface-muted">BY {post.author.name.toUpperCase()}</p>
              ) : null}
            </header>

            {post.featuredImage?.publicUrl ? (
              <div className="relative mt-10 aspect-3/2 overflow-hidden bg-ink">
                <Image
                  src={post.featuredImage.publicUrl}
                  alt={post.featuredImage.altText ?? post.title}
                  fill
                  sizes="(min-width: 48rem) 48rem, 100vw"
                  priority
                  className="object-cover"
                />
              </div>
            ) : null}

            {post.content ? (
              <div className="mt-6">{renderContent(post.content)}</div>
            ) : null}

            {post.tags.length > 0 ? (
              <>
                <Hairline className="mt-12" />
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
                  {post.tags.map(({ tag }) => (
                    <li key={tag.id} className="border border-edge px-2.5 py-1 text-mono-micro text-surface-muted">
                      {tag.name.toUpperCase()}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </article>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section surface="sunken" rule aria-labelledby="related-posts">
          <Container>
            <h2 id="related-posts" className="text-display-md">
              More articles
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {related.map((p) => (
                <BlogCard key={p.slug} post={toPatternPost(p)} className="h-full" />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
