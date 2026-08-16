import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "./posts";
import { BLOG_CATEGORIES } from "./posts";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

export function PostCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  const category = BLOG_CATEGORIES.find((c) => c.slug === post.category);

  if (featured) {
    return (
      <Link
        href={`/resources/blog/${post.slug}`}
        className="group block rounded-3xl border border-[#e2e8f0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:p-10"
      >
        <div className="flex flex-wrap items-center gap-3">
          {category && (
            <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4f46e5]">{category.name}</span>
          )}
          <span className="text-xs font-medium text-[#94a3b8]">Latest</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-[#0f172a] group-hover:text-[#4338ca] sm:text-3xl">{post.title}</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#475569]">{post.description}</p>
        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#6366f1]">
          <span>
            {formatDate(post.publishedAt)} · {post.readingMinutes} min read
          </span>
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/resources/blog/${post.slug}`}
      className="group block rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:-translate-y-px hover:border-[#c7d2fe] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
    >
      {category && <span className="text-xs font-semibold uppercase tracking-wide text-[#6366f1]">{category.name}</span>}
      <h3 className="mt-2 text-xl font-semibold leading-snug text-[#0f172a] group-hover:text-[#4338ca]">{post.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#475569]">{post.description}</p>
      <p className="mt-4 text-xs font-medium text-[#94a3b8]">
        {formatDate(post.publishedAt)} · {post.readingMinutes} min read
      </p>
    </Link>
  );
}
