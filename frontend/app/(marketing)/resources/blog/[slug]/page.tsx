import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS, BLOG_CATEGORIES, BLOG_AUTHOR, getBlogPost, type BlogBlock } from "@/components/marketing/blog/posts";
import { INDUSTRIES } from "@/components/marketing/receptionist/data";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  // `absolute` bypasses the root layout's title.template ("%s | ZyncoAI") —
  // without it, a plain string here got that template applied ON TOP of the
  // already-appended suffix below, doubling to "... | ZyncoAI | ZyncoAI" in
  // the live <title> tag (confirmed, and what Bing flagged as too long).
  // Posts whose own title already names ZyncoAI skip the suffix entirely
  // rather than repeat the brand twice in one title bar.
  const pageTitle = post.title.toLowerCase().includes("zyncoai") ? post.title : `${post.title} | ZyncoAI`;
  return {
    title: { absolute: pageTitle },
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://zyncoai.com/resources/blog/${post.slug}`,
      siteName: "ZyncoAI",
      locale: "en_AU",
      type: "article",
      publishedTime: post.publishedAt,
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: ["/opengraph-image"] },
    alternates: { canonical: `/resources/blog/${post.slug}`, languages: { "en-AU": `/resources/blog/${post.slug}`, en: `/resources/blog/${post.slug}` } },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

function Block({ block, isLede }: { block: BlogBlock; isLede?: boolean }) {
  if (block.type === "h2") return <h2 className="mt-12 text-2xl font-bold tracking-tight text-[#0f172a]">{block.text}</h2>;
  if (block.type === "ul")
    return (
      <ul className="mt-4 list-disc space-y-3 pl-5 text-lg leading-relaxed text-[#334155]">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  return (
    <p className={isLede ? "mt-6 text-xl font-medium leading-relaxed text-[#334155]" : "mt-5 text-lg leading-relaxed text-[#475569]"}>{block.text}</p>
  );
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) return notFound();
  const category = BLOG_CATEGORIES.find((c) => c.slug === post.category);
  const relatedIndustries = INDUSTRIES.filter((i) => post.relatedIndustrySlugs.includes(i.slug));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    // Same real, resolving image this page already uses for og:image/
    // twitter:image below (see metadata.openGraph.images) — not a
    // per-post screenshot (none exists), but a real generated asset, not
    // a fabricated/stock placeholder.
    image: "https://zyncoai.com/opengraph-image",
    author: { "@type": "Organization", name: BLOG_AUTHOR.name },
    publisher: {
      "@type": "Organization",
      name: "ZyncoAI",
      logo: { "@type": "ImageObject", url: "https://zyncoai.com/icon.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://zyncoai.com/resources/blog/${post.slug}` },
  };

  return (
    <div className="bg-[#f8fafc] pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Resources", href: "/resources" }, { name: "Blog", href: "/resources/blog" }, { name: post.title, href: `/resources/blog/${post.slug}` }]} />
      <article className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
        <Link href="/resources/blog" className="text-sm font-medium text-[#6366f1] hover:underline">
          ← All articles
        </Link>

        {category && (
          <Link
            href={`/resources/blog/category/${category.slug}`}
            className="mt-6 inline-block rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4f46e5] hover:bg-[#e0e7ff]"
          >
            {category.name}
          </Link>
        )}
        <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-[#0f172a] sm:text-5xl">{post.title}</h1>

        <div className="mt-6 flex items-center gap-3 border-b border-[#e2e8f0] pb-6">
          <Link href={`/resources/blog/author/${BLOG_AUTHOR.slug}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] text-xs font-bold text-white">
            ZA
          </Link>
          <div className="text-sm">
            <Link href={`/resources/blog/author/${BLOG_AUTHOR.slug}`} className="font-semibold text-[#0f172a] hover:underline">
              {BLOG_AUTHOR.name}
            </Link>
            <p className="text-[#94a3b8]">
              {formatDate(post.publishedAt)} · {post.readingMinutes} min read
            </p>
          </div>
        </div>

        <div className="mt-2">
          {post.blocks.map((block, i) => (
            <Block key={i} block={block} isLede={i === 0} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/resources/blog/tag/${tag}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-[#475569] hover:bg-slate-200">
              #{tag}
            </Link>
          ))}
        </div>

        {relatedIndustries.length > 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-[#e2e8f0] bg-slate-50 p-5">
            <p className="text-xs font-medium text-[#94a3b8]">Related</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {relatedIndustries.map((i) => (
                <Link key={i.slug} href={`/solutions/${i.slug}`} className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-medium text-[#475569] hover:border-[#c7d2fe] hover:text-[#0f172a]">
                  {i.name}
                </Link>
              ))}
              <Link href="/pricing" className="rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-medium text-[#475569] hover:border-[#c7d2fe] hover:text-[#0f172a]">
                Pricing
              </Link>
            </div>
          </div>
        )}

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
