import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_CATEGORIES, getPostsByCategory } from "@/components/marketing/blog/posts";
import { PostCard } from "@/components/marketing/blog/PostCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = BLOG_CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) return {};
  return {
    title: `${category.name} | ZyncoAI Blog`,
    description: `ZyncoAI blog posts about ${category.name.toLowerCase()}.`,
    alternates: { canonical: `/blog/category/${category.slug}`, languages: { "en-AU": `/blog/category/${category.slug}`, en: `/blog/category/${category.slug}` } },
  };
}

export default function BlogCategoryPage({ params }: { params: { slug: string } }) {
  const category = BLOG_CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) return notFound();
  const posts = getPostsByCategory(category.slug);

  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: category.name, href: `/blog/category/${category.slug}` }]} />
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
        <h1 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">{category.name}</h1>
      </section>
      <section className="mx-auto max-w-3xl px-6 pb-20 lg:px-8">
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-[#94a3b8]">No posts in this category yet.</p>
        )}
      </section>
    </div>
  );
}
