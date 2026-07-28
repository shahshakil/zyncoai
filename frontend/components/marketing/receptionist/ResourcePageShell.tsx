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
    <div className="bg-[#030712] pt-8">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#94a3b8]">{eyebrow}</span>
        <h1 className="mt-4 text-3xl font-bold text-[#f8fafc] sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-[#94a3b8]">{description}</p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
            {RESOURCE_NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium text-[#94a3b8] transition hover:bg-white/5 hover:text-[#f8fafc]">
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
    <section className="rounded-2xl border border-white/10 bg-[#0b0f19] p-6">
      <h2 className="text-lg font-semibold text-[#f8fafc]">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#cbd5e1]">{children}</div>
    </section>
  );
}
