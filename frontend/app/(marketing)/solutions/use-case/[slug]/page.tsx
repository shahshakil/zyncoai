import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { USE_CASES } from "@/components/marketing/receptionist/data";
import { SolutionTemplate } from "@/components/marketing/receptionist/SolutionTemplate";

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const useCase = USE_CASES.find((u) => u.slug === params.slug);
  if (!useCase) return {};
  return { title: `${useCase.name} | ZyncoAI`, description: useCase.tagline };
}

export default function UseCasePage({ params }: { params: { slug: string } }) {
  const useCase = USE_CASES.find((u) => u.slug === params.slug);
  if (!useCase) return notFound();

  return (
    <SolutionTemplate
      content={{
        eyebrow: "Use case · " + useCase.name,
        name: useCase.name,
        tagline: useCase.tagline,
        greeting: "Hi, this is Charlotte — how can I help you today?",
        callerLine: useCase.description,
        features: [
          `Purpose-built for ${useCase.name.toLowerCase()}`,
          "Answers in under 1 second, every time",
          "Books directly into your real calendar",
          "Escalates anything it can't handle straight to your team",
        ],
      }}
    />
  );
}
