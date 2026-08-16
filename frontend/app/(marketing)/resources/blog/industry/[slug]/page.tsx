import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDUSTRIES } from "@/components/marketing/receptionist/data";
import { getPostsByIndustry } from "@/components/marketing/blog/posts";
import { PostCard } from "@/components/marketing/blog/PostCard";
import { BlogEmptyState } from "@/components/marketing/blog/BlogEmptyState";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const industry = INDUSTRIES.find((i) => i.slug === params.slug);
  if (!industry) return {};
  return {
    title: `${industry.name} articles | ZyncoAI Blog`,
    description: `ZyncoAI blog posts relevant to ${industry.name.toLowerCase()}.`,
    alternates: {
      canonical: `/resources/blog/industry/${industry.slug}`,
      languages: { "en-AU": `/resources/blog/industry/${industry.slug}`, en: `/resources/blog/industry/${industry.slug}` },
    },
  };
}

export default function BlogIndustryPage({ params }: { params: { slug: string } }) {
  const industry = INDUSTRIES.find((i) => i.slug === params.slug);
  if (!industry) return notFound();
  const posts = getPostsByIndustry(industry.slug);

  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
          { name: "Blog", href: "/resources/blog" },
          { name: industry.name, href: `/resources/blog/industry/${industry.slug}` },
        ]}
      />
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6366f1]">Industry</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">{industry.name}</h1>
      </section>
      <section className="mx-auto max-w-4xl px-6 pb-24 lg:px-8">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <BlogEmptyState label={industry.name.toLowerCase()} />
        )}
      </section>
    </div>
  );
}
