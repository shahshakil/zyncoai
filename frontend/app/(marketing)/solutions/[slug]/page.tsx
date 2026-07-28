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
  return { title: `${industry.name} | ZyncoAI`, description: industry.tagline };
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
      }}
    />
  );
}
