import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { BlogCard } from "@/components/patterns";
import { Container, EmptyState, Section, SectionHeading } from "@/components/ui";
import { getPublishedPosts } from "@/lib/repositories/blogs";
import { toPatternPost } from "@/lib/mappers";
import { SITE_URL } from "@/content/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical guides, industry knowledge and company updates from SRIYAAN METALS.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts({ take: 24 }).catch(() => []);

  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="blog-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        />
        <SectionHeading
          id="blog-heading"
          code="SM–B"
          eyebrow="Insights"
          title="From the desk"
          lede="Technical guides, industry knowledge and company updates."
          as="h1"
        />

        {posts.length === 0 ? (
          <div className="mt-16 border-y border-edge">
            <EmptyState
              meta="INSIGHTS — SM/PENDING"
              title="Articles are in preparation"
              description="Published articles will appear here."
            />
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={toPatternPost(post)} className="h-full" />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
