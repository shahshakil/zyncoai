import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/components/marketing/blog/posts";
import { PostCard } from "@/components/marketing/blog/PostCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ slug: tag }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const posts = getPostsByTag(params.slug);
  if (posts.length === 0) return {};
  return {
    title: `#${params.slug} | ZyncoAI Blog`,
    description: `ZyncoAI blog posts tagged #${params.slug}.`,
    alternates: { canonical: `/resources/blog/tag/${params.slug}`, languages: { "en-AU": `/resources/blog/tag/${params.slug}`, en: `/resources/blog/tag/${params.slug}` } },
  };
}

export default function BlogTagPage({ params }: { params: { slug: string } }) {
  const posts = getPostsByTag(params.slug);
  if (posts.length === 0) return notFound();

  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Resources", href: "/resources" }, { name: "Blog", href: "/resources/blog" }, { name: `#${params.slug}`, href: `/resources/blog/tag/${params.slug}` }]} />
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6366f1]">Tag</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">#{params.slug}</h1>
      </section>
      <section className="mx-auto max-w-4xl px-6 pb-24 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
