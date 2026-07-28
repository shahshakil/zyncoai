import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
                Ready to run ZyncoAI in production?
              </h2>
              <p className="mt-3 text-base text-zinc-600">
                Start free, or deploy with enterprise controls: VPC patterns, outbound allowlists,
                SIEM export, and data residency policies.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/signup"
                className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Start free
              </Link>
              <Link
                href="/enterprise"
                className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Book a demo
              </Link>
              <Link
                href="/platform"
                className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                View platform
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
