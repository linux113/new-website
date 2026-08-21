import { Reveal } from "@/components/motion";
import {
  ButtonLink,
  Container,
  EmptyState,
  Section,
  SectionHeading,
} from "@/components/ui";
import { BlogCard } from "@/components/patterns";
import { BLOG_CATEGORIES, PLACEHOLDER_POSTS } from "@/content/placeholders";

/**
 * SM–13 / BLOG.
 * Ready to consume CMS/database posts through the typed Post
 * contract. Ships with zero posts — no fabricated company news —
 * so the honest EmptyState renders with the planned editorial
 * categories as mono labels.
 */
export function BlogSection() {
  const hasPosts = PLACEHOLDER_POSTS.length > 0;

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
            {PLACEHOLDER_POSTS.slice(0, 3).map((post, i) => (
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
