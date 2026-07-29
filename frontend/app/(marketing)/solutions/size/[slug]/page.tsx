import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANY_SIZES } from "@/components/marketing/receptionist/data";
import { SolutionTemplate } from "@/components/marketing/receptionist/SolutionTemplate";

export function generateStaticParams() {
  return COMPANY_SIZES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const size = COMPANY_SIZES.find((s) => s.slug === params.slug);
  if (!size) return {};
  return { title: `${size.name} | ZyncoAI`, description: size.tagline };
}

export default function CompanySizePage({ params }: { params: { slug: string } }) {
  const size = COMPANY_SIZES.find((s) => s.slug === params.slug);
  if (!size) return notFound();

  return (
    <SolutionTemplate
      content={{
        eyebrow: "For · " + size.name,
        name: size.name,
        tagline: size.tagline,
        greeting: "Hi, this is Ella — how can I help you today?",
        callerLine: size.description,
        features: [
          `Scaled to fit a ${size.name.toLowerCase()}`,
          "Set up in minutes, no IT team required",
          "Grows with you — no re-platforming later",
          "One flat monthly fee, no per-seat pricing",
        ],
      }}
    />
  );
}
