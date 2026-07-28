import Link from "next/link";

type Stat = {
  label: string;
  value: string | number;
};

type FeaturePageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats?: Stat[];
  children?: React.ReactNode;
};

export default function FeaturePageShell({
  eyebrow,
  title,
  description,
  stats = [],
  children,
}: FeaturePageShellProps) {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            {eyebrow}
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-neutral-600">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/start"
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Start Free
            </Link>
            <Link
              href="/app"
              className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Open App
            </Link>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="text-3xl font-semibold">{stat.value}</div>
                <div className="mt-2 text-sm text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-14">{children}</div>
      </section>
    </main>
  );
}
