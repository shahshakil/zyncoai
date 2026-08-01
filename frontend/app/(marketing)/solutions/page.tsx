import Link from "next/link";
import { INDUSTRIES, USE_CASES, COMPANY_SIZES } from "@/components/marketing/receptionist/data";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata = {
  title: "Solutions | ZyncoAI",
  description: "ZyncoAI by industry, by use case, and by business size — find the AI receptionist setup built for how your business actually runs.",
  alternates: { canonical: "/solutions", languages: { "en-AU": "/solutions", en: "/solutions" } },
};

function CardGrid({ items }: { items: { slug: string; name: string; tagline?: string; description?: string }[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/solutions/${item.slug}`}
          className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
        >
          <h3 className="font-semibold text-[#0f172a]">{item.name}</h3>
          <p className="mt-1.5 text-sm text-[#475569]">{item.tagline || item.description}</p>
        </Link>
      ))}
    </div>
  );
}

export default function SolutionsPage() {
  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Solutions", href: "/solutions" }]} />
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
        <h1 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">Solutions</h1>
        <p className="mt-4 text-lg leading-relaxed text-[#475569]">
          ZyncoAI is built for how your specific business actually runs — find your industry, your use case, or your team size below.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-14 lg:px-8">
        <h2 className="text-xl font-bold text-[#0f172a]">By industry</h2>
        <CardGrid items={INDUSTRIES.map((i) => ({ slug: i.slug, name: i.name, tagline: i.tagline }))} />
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-14 lg:px-8">
        <h2 className="text-xl font-bold text-[#0f172a]">By use case</h2>
        <CardGrid items={USE_CASES.map((u) => ({ slug: `use-case/${u.slug}`, name: u.name, description: u.description }))} />
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20 lg:px-8">
        <h2 className="text-xl font-bold text-[#0f172a]">By business size</h2>
        <CardGrid items={COMPANY_SIZES.map((s) => ({ slug: `size/${s.slug}`, name: s.name, tagline: s.tagline }))} />
      </section>
    </div>
  );
}
