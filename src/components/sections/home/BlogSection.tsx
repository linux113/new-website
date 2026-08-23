import { Reveal } from "@/components/motion";
import {
  ButtonLink,
  Container,
  EmptyState,
  Section,
  SectionHeading,
} from "@/components/ui";
import { BlogCard } from "@/components/patterns";
import { BLOG_CATEGORIES } from "@/content/placeholders";
import { getPublishedPosts } from "@/lib/repositories/blogs";
import { toPatternPost } from "@/lib/mappers";

/**
 * SM–13 / BLOG.
 * Published posts from the database; the honest EmptyState with the
 * planned editorial categories while none exist.
 */
export async function BlogSection() {
  const dbPosts = await getPublishedPosts({ take: 3 }).catch(() => []);
  const posts = dbPosts.map(toPatternPost);
  const hasPosts = posts.length > 0;

  return (
    <Section rule aria-labelledby="home-blog">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-blog"
            code="SM–13"
            eyebrow="Insights"
            title="From the desk"
            lede="Technical guides and company updates will publish here."
          />
        </Reveal>

        {hasPosts ? (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 70}>
                <BlogCard post={post} className="h-full" />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={100}>
            <div className="mt-16 border-y border-edge">
              <EmptyState
                meta="INSIGHTS — SM/PENDING"
                title="Articles are in preparation"
                description="Planned editorial series:"
                action={
                  <div className="flex flex-wrap justify-center gap-3">
                    {BLOG_CATEGORIES.map((category) => (
                      <span
                        key={category}
                        className="border border-edge px-3 py-1.5 text-mono-micro text-surface-muted"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                }
              />
            </div>
          </Reveal>
        )}

        {hasPosts ? (
          <div className="mt-12">
            <ButtonLink href="/blog" variant="ghost" arrow>
              All articles
            </ButtonLink>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
