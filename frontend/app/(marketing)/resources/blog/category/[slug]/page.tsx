import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_CATEGORIES, getPostsByCategory } from "@/components/marketing/blog/posts";
import { PostCard } from "@/components/marketing/blog/PostCard";
import { BlogEmptyState } from "@/components/marketing/blog/BlogEmptyState";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = BLOG_CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) return {};
  return {
    title: `${category.name}`,
    description: `ZyncoAI blog posts about ${category.name.toLowerCase()}.`,
    alternates: { canonical: `/resources/blog/category/${category.slug}`, languages: { "en-AU": `/resources/blog/category/${category.slug}`, en: `/resources/blog/category/${category.slug}` } },
  };
}

export default function BlogCategoryPage({ params }: { params: { slug: string } }) {
  const category = BLOG_CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) return notFound();
  const posts = getPostsByCategory(category.slug);

  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Resources", href: "/resources" }, { name: "Blog", href: "/resources/blog" }, { name: category.name, href: `/resources/blog/category/${category.slug}` }]} />
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6366f1]">Topic</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">{category.name}</h1>
      </section>
      <section className="mx-auto max-w-4xl px-6 pb-24 lg:px-8">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <BlogEmptyState label={category.name.toLowerCase()} />
        )}
      </section>
    </div>
  );
}
