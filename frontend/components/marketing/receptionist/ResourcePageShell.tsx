import Link from "next/link";

const RESOURCE_NAV = [
  { href: "/resources/docs", label: "Documentation" },
  { href: "/resources/api", label: "API Reference" },
  { href: "/resources/trust", label: "Trust & Security" },
  { href: "/resources/help", label: "Help Centre" },
  { href: "/resources/changelog", label: "Changelog" },
  { href: "/resources/status", label: "System Status" },
];

export function ResourcePageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f8fafc] pt-8">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <span className="inline-flex items-center rounded-full border border-[#e2e8f0] bg-slate-100 px-3 py-1 text-xs font-medium text-[#475569]">{eyebrow}</span>
        <h1 className="mt-4 text-3xl font-bold text-[#0f172a] sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-[#475569]">{description}</p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
            {RESOURCE_NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium text-[#475569] transition hover:bg-slate-100 hover:text-[#0f172a]">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="min-w-0 space-y-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ResourceSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
      <h2 className="text-lg font-semibold text-[#0f172a]">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#475569]">{children}</div>
    </section>
  );
}
