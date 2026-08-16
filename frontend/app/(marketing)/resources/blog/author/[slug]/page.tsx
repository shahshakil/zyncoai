import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_AUTHOR, BLOG_POSTS } from "@/components/marketing/blog/posts";
import { PostCard } from "@/components/marketing/blog/PostCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export function generateStaticParams() {
  return [{ slug: BLOG_AUTHOR.slug }];
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  if (params.slug !== BLOG_AUTHOR.slug) return {};
  return {
    title: `${BLOG_AUTHOR.name} | ZyncoAI Blog`,
    description: BLOG_AUTHOR.bio,
    alternates: { canonical: `/resources/blog/author/${BLOG_AUTHOR.slug}`, languages: { "en-AU": `/resources/blog/author/${BLOG_AUTHOR.slug}`, en: `/resources/blog/author/${BLOG_AUTHOR.slug}` } },
  };
}

export default function BlogAuthorPage({ params }: { params: { slug: string } }) {
  if (params.slug !== BLOG_AUTHOR.slug) return notFound();

  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Resources", href: "/resources" }, { name: "Blog", href: "/resources/blog" }, { name: BLOG_AUTHOR.name, href: `/resources/blog/author/${BLOG_AUTHOR.slug}` }]} />
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] text-lg font-bold text-white">
          ZA
        </div>
        <h1 className="mt-4 text-3xl font-bold text-[#0f172a] sm:text-4xl">{BLOG_AUTHOR.name}</h1>
        <p className="mt-2 text-[#475569]">{BLOG_AUTHOR.bio}</p>
      </section>
      <section className="mx-auto max-w-4xl px-6 pb-24 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
