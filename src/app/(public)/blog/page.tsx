import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { Container } from "@/components/ui";
import { SITE_URL } from "@/content/site";
import {
  getPublishedPosts,
  getBlogCategories,
} from "@/lib/repositories/blogs";
import { InsightsClient, type InsightPost } from "@/components/insights/InsightsClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Insights — Steel, Stainless & Industrial Knowledge",
  description:
    "Explore SRIYAAN METALS insights, technical guides, steel industry knowledge, material specifications, quality practices and company updates for buyers and engineering professionals.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "SRIYAAN METALS Insights",
    description:
      "Technical guides, industry knowledge and company updates for buyers, engineers and partners.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SRIYAAN METALS Insights",
    description:
      "Technical guides, industry knowledge and company updates for buyers, engineers and partners.",
  },
};

function estimateReadTime(content: string | null): string {
  const words = (content ?? "").trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(iso: Date): string {
  return iso.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function InsightsPage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts({ take: 24 }).catch(() => []),
    getBlogCategories().catch(() => []),
  ]);

  const mapped: InsightPost[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    category: p.category?.name ?? "Updates",
    categorySlug: p.category?.slug ?? "updates",
    date: p.publishedAt?.toISOString() ?? "",
    dateLabel: p.publishedAt
      ? formatDate(p.publishedAt).toUpperCase()
      : "",
    readTime: estimateReadTime(p.content),
    image: p.featuredImage?.publicUrl
      ? {
          src: p.featuredImage.publicUrl,
          alt: p.title,
        }
      : null,
  }));

  const catCounts = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: mapped.filter((p) => p.categorySlug === c.slug).length,
  }));

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#05080B] pb-20 pt-28 text-[#F5F7F8] lg:pt-36"
      aria-labelledby="insights-heading"
    >
      {/* Background atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "88px 88px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%,#000 20%,transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%,#000 20%,transparent 80%)",
          }}
        />
        <div
          className="absolute -left-40 top-20 h-[38rem] w-[38rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(142,161,174,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container>
        <nav aria-label="Breadcrumb" className="in-bc mb-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Insights" },
            ]}
          />
        </nav>

        <InsightsClient posts={mapped} categories={catCounts} />
      </Container>

      <style>{`
        @keyframes in-bc { from{opacity:0;transform:translateY(-6px);} to{opacity:1;transform:none;} }
        .in-bc { animation: in-bc .6s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>
    </main>
  );
}
