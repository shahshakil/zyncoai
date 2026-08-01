import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDUSTRIES } from "@/components/marketing/receptionist/data";
import { SolutionTemplate } from "@/components/marketing/receptionist/SolutionTemplate";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const industry = INDUSTRIES.find((i) => i.slug === params.slug);
  if (!industry) return {};
  const title = `AI ${industry.name} Receptionist Australia | ZyncoAI`;
  const description = `${industry.tagline}. ${industry.overview.slice(0, 140)}...`;
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
    alternates: { canonical: `/solutions/${industry.slug}` },
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
      }}
    />
  );
}
