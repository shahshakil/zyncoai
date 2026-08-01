import type { MetadataRoute } from "next";
import { INDUSTRIES, USE_CASES, COMPANY_SIZES } from "@/components/marketing/receptionist/data";
import { BLOG_POSTS } from "@/components/marketing/blog/posts";

// Every real, public, statically-crawlable marketing route — cross-checked
// against the actual .next build output and middleware.ts's PUBLIC_PATHS/
// PUBLIC_PREFIXES (a route login-protects Googlebot too if it's not listed
// there, so a route absent from that allowlist has no business being in
// this sitemap regardless of whether a page.tsx exists for it).
// Deliberately excludes: /dashboard, /platform-admin, /(auth)/*,
// /onboarding, /checkin/[token] (tokenized, per-patient), /app/* (the
// authenticated product surface, route group (app)), /dev/*, any
// dynamic [id] route with no generateStaticParams (platform/connectors/[id],
// executions/[id] — unbounded per-record pages, not discoverable content),
// and /privacy + /terms (low-value boilerplate pages, kept crawlable via
// robots.txt but not worth a sitemap entry).
type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: ChangeFreq }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/demo", priority: 0.8, changeFrequency: "weekly" },
  { path: "/product", priority: 0.8, changeFrequency: "weekly" },
  { path: "/enterprise", priority: 0.7, changeFrequency: "monthly" },
  { path: "/integrations", priority: 0.7, changeFrequency: "weekly" },
  { path: "/ai-brain/live-voice-assistant", priority: 0.7, changeFrequency: "monthly" },
  { path: "/ai-brain/reminders", priority: 0.6, changeFrequency: "monthly" },
  { path: "/ai", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/ai-transparency", priority: 0.5, changeFrequency: "monthly" },
  { path: "/security", priority: 0.6, changeFrequency: "monthly" },
  { path: "/observability", priority: 0.6, changeFrequency: "monthly" },
  { path: "/governance", priority: 0.6, changeFrequency: "monthly" },
  { path: "/capabilities/ai-automation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/capabilities/integrations", priority: 0.6, changeFrequency: "monthly" },
  { path: "/capabilities/security", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs", priority: 0.6, changeFrequency: "weekly" },
  { path: "/templates", priority: 0.6, changeFrequency: "weekly" },
  { path: "/addons", priority: 0.6, changeFrequency: "weekly" },
  { path: "/products/forms", priority: 0.6, changeFrequency: "monthly" },
  { path: "/products/tables", priority: 0.6, changeFrequency: "monthly" },
  { path: "/products/zyns", priority: 0.6, changeFrequency: "monthly" },
  { path: "/resources", priority: 0.6, changeFrequency: "weekly" },
  { path: "/resources/api", priority: 0.5, changeFrequency: "monthly" },
  { path: "/resources/changelog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/resources/docs", priority: 0.5, changeFrequency: "monthly" },
  { path: "/resources/help", priority: 0.5, changeFrequency: "monthly" },
  { path: "/resources/status", priority: 0.4, changeFrequency: "daily" },
  { path: "/resources/trust", priority: 0.5, changeFrequency: "monthly" },
  { path: "/platform", priority: 0.7, changeFrequency: "monthly" },
  { path: "/platform/connectors", priority: 0.6, changeFrequency: "weekly" },
  { path: "/agentops", priority: 0.7, changeFrequency: "monthly" },
  { path: "/workflowops", priority: 0.7, changeFrequency: "monthly" },
  { path: "/executions", priority: 0.5, changeFrequency: "monthly" },
  { path: "/use-cases", priority: 0.6, changeFrequency: "monthly" },
  { path: "/use-cases/marketing-teams", priority: 0.6, changeFrequency: "monthly" },
  { path: "/workflowops/automation-analytics", priority: 0.6, changeFrequency: "monthly" },
  { path: "/workflowops/workflow-builder", priority: 0.6, changeFrequency: "monthly" },
  { path: "/whats-new/agents", priority: 0.5, changeFrequency: "monthly" },
  { path: "/whats-new/canvas", priority: 0.5, changeFrequency: "monthly" },
  { path: "/whats-new/chatbots", priority: 0.5, changeFrequency: "monthly" },
  { path: "/whats-new/functions", priority: 0.5, changeFrequency: "monthly" },
  { path: "/whats-new/lead-router", priority: 0.5, changeFrequency: "monthly" },
  { path: "/whats-new/zyn-mcp", priority: 0.5, changeFrequency: "monthly" },
  { path: "/solutions/ecommerce", priority: 0.6, changeFrequency: "monthly" },
  { path: "/solutions/fintech", priority: 0.6, changeFrequency: "monthly" },
  { path: "/solutions/it-ops", priority: 0.6, changeFrequency: "monthly" },
  { path: "/solutions/marketing", priority: 0.6, changeFrequency: "monthly" },
  { path: "/solutions/saas", priority: 0.6, changeFrequency: "monthly" },
  { path: "/solutions/sales-ops", priority: 0.6, changeFrequency: "monthly" },
  { path: "/solutions/support", priority: 0.6, changeFrequency: "monthly" },
  { path: "/legal/dpa", priority: 0.3, changeFrequency: "yearly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zyncoai.com";
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // Real, per-vertical/use-case/company-size landing pages — generated
  // statically at build time by (marketing)/solutions/[slug|use-case/size]
  // via generateStaticParams reading these same arrays, so this can never
  // drift from what's actually built.
  const industryEntries = INDUSTRIES.map((i) => ({
    url: `${baseUrl}/solutions/${i.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const useCaseEntries = USE_CASES.map((u) => ({
    url: `${baseUrl}/solutions/use-case/${u.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const sizeEntries = COMPANY_SIZES.map((s) => ({
    url: `${baseUrl}/solutions/size/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogEntries = BLOG_POSTS.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...industryEntries, ...useCaseEntries, ...sizeEntries, ...blogEntries];
}
