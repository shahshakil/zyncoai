import Link from "next/link";
import type { BlogPost } from "./posts";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
    >
      <p className="text-xs font-medium text-[#94a3b8]">
        {formatDate(post.publishedAt)} · {post.readingMinutes} min read
      </p>
      <h2 className="mt-2 text-xl font-semibold text-[#0f172a]">{post.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#475569]">{post.description}</p>
    </Link>
  );
}
