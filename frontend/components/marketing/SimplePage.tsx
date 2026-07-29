import Link from "next/link";
import { MK } from "@/styles/marketingTokens";

export function SimplePage({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <main className="min-h-[70vh] bg-[#f8fafc] text-[#0f172a]">
      <section className="pt-20 pb-16">
        <div className={MK.container}>
          <div className="max-w-5xl">
            <p className="text-sm text-[#94a3b8]">ZyncoAI</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#0f172a] md:text-5xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-4 text-base text-[#475569] md:text-lg">{subtitle}</p>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-2xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Create account
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-2xl border border-[#e2e8f0] bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] hover:bg-slate-50"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
