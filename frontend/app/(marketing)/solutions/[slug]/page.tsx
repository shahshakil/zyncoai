import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDUSTRIES } from "@/components/marketing/receptionist/data";
import { SolutionTemplate } from "@/components/marketing/receptionist/SolutionTemplate";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

// The old `${tagline}. ${overview.slice(0, 140)}...` fixed the overview
// slice to 140 chars regardless of the tagline's own length, so the real
// total ranged from ~170 to ~210+ depending on which industry — several
// pages ended up well past the ~150-160 char meta description range Bing
// flags as too long. This budgets the overview slice against a single
// target total instead, and cuts at a word boundary so it never chops a
// word in half.
const META_DESCRIPTION_TARGET = 158;
function buildSolutionDescription(tagline: string, overview: string): string {
  const prefix = `${tagline}. `;
  const budget = META_DESCRIPTION_TARGET - prefix.length - 3; // reserve for "..."
  if (overview.length <= budget) return `${prefix}${overview}`;
  const cut = overview.slice(0, budget);
  const lastSpace = cut.lastIndexOf(" ");
  return `${prefix}${cut.slice(0, lastSpace > 0 ? lastSpace : budget)}...`;
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const industry = INDUSTRIES.find((i) => i.slug === params.slug);
  if (!industry) return {};
  const title = `AI ${industry.name} Receptionist Australia`;
  const description = buildSolutionDescription(industry.tagline, industry.overview);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://zyncoai.com/solutions/${industry.slug}`,
      siteName: "ZyncoAI",
      locale: "en_AU",
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    alternates: { canonical: `/solutions/${industry.slug}`, languages: { "en-AU": `/solutions/${industry.slug}`, en: `/solutions/${industry.slug}` } },
  };
}

export default function IndustrySolutionPage({ params }: { params: { slug: string } }) {
  const industry = INDUSTRIES.find((i) => i.slug === params.slug);
  if (!industry) return notFound();

  return (
    <SolutionTemplate
      content={{
        eyebrow: "Solutions · " + industry.name,
        name: industry.name,
        tagline: industry.tagline,
        greeting: industry.greeting,
        callerLine: industry.callerLine,
        features: industry.features,
        overview: industry.overview,
        faqs: industry.faqs,
        currentIndustrySlug: industry.slug,
        crumbs: [
          { name: "Home", href: "/" },
          { name: "Solutions", href: "/solutions" },
          { name: industry.name, href: `/solutions/${industry.slug}` },
        ],
      }}
    />
  );
}
