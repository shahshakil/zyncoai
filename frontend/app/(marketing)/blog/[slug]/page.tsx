import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS, getBlogPost, type BlogBlock } from "@/components/marketing/blog/posts";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | ZyncoAI`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://zyncoai.com/blog/${post.slug}`,
      siteName: "ZyncoAI",
      locale: "en_AU",
      type: "article",
      publishedTime: post.publishedAt,
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: ["/opengraph-image"] },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

function Block({ block }: { block: BlogBlock }) {
  if (block.type === "h2") return <h2 className="mt-8 text-xl font-bold text-[#0f172a]">{block.text}</h2>;
  if (block.type === "ul")
    return (
      <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-[#475569]">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  return <p className="mt-4 text-base leading-relaxed text-[#475569]">{block.text}</p>;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) return notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: "ZyncoAI" },
    publisher: {
      "@type": "Organization",
      name: "ZyncoAI",
      logo: { "@type": "ImageObject", url: "https://zyncoai.com/icon.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://zyncoai.com/blog/${post.slug}` },
  };

  return (
    <div className="bg-[#f8fafc] pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <article className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
        <Link href="/blog" className="text-sm font-medium text-[#6366f1] hover:underline">
          ← All articles
        </Link>
        <p className="mt-6 text-xs font-medium text-[#94a3b8]">
          {formatDate(post.publishedAt)} · {post.readingMinutes} min read
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-[#0f172a] sm:text-4xl">{post.title}</h1>
        <div className="mt-8">
          {post.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <h2 className="text-lg font-bold text-[#0f172a]">See how ZyncoAI works for your business</h2>
          <p className="mt-2 text-sm text-[#475569]">7-day free trial, no credit card required.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-6 py-3 text-sm font-semibold text-[#0f172a] hover:bg-slate-50">
              View pricing
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
