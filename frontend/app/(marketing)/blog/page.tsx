import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, BLOG_CATEGORIES, BLOG_AUTHOR, getAllTags } from "@/components/marketing/blog/posts";
import { PostCard } from "@/components/marketing/blog/PostCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

const TITLE = "Blog | ZyncoAI";
const DESCRIPTION = "AI receptionist guides for Australian businesses — cost comparisons, industry breakdowns, and how ZyncoAI actually works.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://zyncoai.com/blog",
    siteName: "ZyncoAI",
    locale: "en_AU",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
  alternates: { canonical: "/blog", languages: { "en-AU": "/blog", en: "/blog" } },
};

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const tags = getAllTags();

  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }]} />
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
        <h1 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Blog</h1>
        <p className="mt-4 text-lg leading-relaxed text-[#475569]">
          Guides on AI call answering, industry breakdowns, and honest comparisons — for Australian businesses deciding whether an AI receptionist
          makes sense for them.
        </p>
        <p className="mt-3 text-xs text-[#94a3b8]">
          Written by <Link href={`/blog/author/${BLOG_AUTHOR.slug}`} className="underline hover:text-[#0f172a]">{BLOG_AUTHOR.name}</Link> ·{" "}
          <Link href="/blog/feed.xml" className="underline hover:text-[#0f172a]">RSS feed</Link>
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2">
          {BLOG_CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/blog/category/${c.slug}`} className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-medium text-[#475569] hover:border-[#c7d2fe] hover:text-[#0f172a]">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-14 lg:px-8">
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 lg:px-8">
        <p className="text-xs font-medium text-[#94a3b8]">Tags</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag} href={`/blog/tag/${tag}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-[#475569] hover:bg-slate-200">
              #{tag}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
