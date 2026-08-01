import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/components/marketing/blog/posts";

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
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="bg-[#f8fafc] pt-8">
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
        <h1 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Blog</h1>
        <p className="mt-4 text-lg leading-relaxed text-[#475569]">
          Guides on AI call answering, industry breakdowns, and honest comparisons — for Australian businesses deciding whether an AI receptionist
          makes sense for them.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 lg:px-8">
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            >
              <p className="text-xs font-medium text-[#94a3b8]">
                {formatDate(post.publishedAt)} · {post.readingMinutes} min read
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#0f172a]">{post.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">{post.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
