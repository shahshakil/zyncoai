import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, BLOG_CATEGORIES, BLOG_AUTHOR, getAllTags } from "@/components/marketing/blog/posts";
import { INDUSTRIES } from "@/components/marketing/receptionist/data";
import { PostCard } from "@/components/marketing/blog/PostCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

const TITLE = "Blog";
const DESCRIPTION = "AI receptionist guides for Australian businesses — cost comparisons, industry breakdowns, and how ZyncoAI actually works.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://zyncoai.com/resources/blog",
    siteName: "ZyncoAI",
    locale: "en_AU",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
  alternates: { canonical: "/resources/blog", languages: { "en-AU": "/resources/blog", en: "/resources/blog" } },
};

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const [latest, ...rest] = posts;
  const tags = getAllTags();

  // Only verticals a real post actually relates to — showing all 10 with
  // 9 empty would bury the ones that matter under noise. The honest-empty
  // state still applies per-industry once you click through (a vertical
  // could show here today and have zero posts tomorrow if content changes).
  const industriesWithPosts = INDUSTRIES.filter((i) => posts.some((p) => p.relatedIndustrySlugs.includes(i.slug)));

  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Resources", href: "/resources" }, { name: "Blog", href: "/resources/blog" }]} />

      <section className="mx-auto max-w-3xl px-6 pb-10 pt-10 text-center lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#0f172a] sm:text-5xl">The ZyncoAI Blog</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#475569]">
          Honest guides on AI call answering, industry breakdowns, and real comparisons — for Australian businesses deciding whether an AI receptionist
          makes sense for them.
        </p>
        <p className="mt-4 text-xs text-[#94a3b8]">
          Written by <Link href={`/resources/blog/author/${BLOG_AUTHOR.slug}`} className="underline hover:text-[#0f172a]">{BLOG_AUTHOR.name}</Link>
          {" · "}
          <Link href="/resources/blog/feed.xml" className="underline hover:text-[#0f172a]">RSS feed</Link>
        </p>
      </section>

      {posts.length === 0 ? (
        <section className="mx-auto max-w-2xl px-6 pb-24 lg:px-8">
          <div className="rounded-3xl border border-dashed border-[#cbd5e1] bg-white/60 px-8 py-20 text-center">
            <h2 className="text-lg font-semibold text-[#0f172a]">First articles coming soon</h2>
            <p className="mt-2 text-sm text-[#64748b]">
              We&apos;re writing them now — honest, practical guides for Australian businesses, not filler. Subscribe to the{" "}
              <Link href="/resources/blog/feed.xml" className="underline hover:text-[#0f172a]">RSS feed</Link> to be the first to know.
            </p>
          </div>
        </section>
      ) : (
        <>
          <section className="mx-auto max-w-4xl px-6 pb-14 lg:px-8">
            <PostCard post={latest} featured />
          </section>

          {rest.length > 0 && (
            <section className="mx-auto max-w-4xl px-6 pb-16 lg:px-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#94a3b8]">More articles</h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}

          <section className="mx-auto max-w-4xl px-6 pb-16 lg:px-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#94a3b8]">Browse by topic</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/resources/blog/category/${c.slug}`}
                  className="rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#475569] hover:border-[#c7d2fe] hover:text-[#0f172a]"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </section>

          {industriesWithPosts.length > 0 && (
            <section className="mx-auto max-w-4xl px-6 pb-16 lg:px-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#94a3b8]">Browse by industry</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {industriesWithPosts.map((i) => (
                  <Link
                    key={i.slug}
                    href={`/resources/blog/industry/${i.slug}`}
                    className="rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#475569] hover:border-[#c7d2fe] hover:text-[#0f172a]"
                  >
                    {i.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mx-auto max-w-4xl px-6 pb-24 lg:px-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#94a3b8]">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag} href={`/resources/blog/tag/${tag}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-[#475569] hover:bg-slate-200">
                  #{tag}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
