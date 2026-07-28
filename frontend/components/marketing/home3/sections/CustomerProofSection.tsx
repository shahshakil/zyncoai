const LOGOS = [
  "Operations teams",
  "Support teams",
  "Sales ops",
  "IT teams",
  "Enterprise buyers",
  "Internal platforms",
  "Process owners",
  "Automation teams",
];

export default function CustomerProofSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            CUSTOMER PROOF
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
            Proof should feel operational, not fake.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
            Until you add real customer names, this section should still communicate the kinds of teams and
            business functions ZyncoAI is built for.
          </p>
        </div>

        <div className="rounded-[34px] border border-zinc-200 bg-white p-6 shadow-[0_25px_80px_rgba(0,0,0,0.05)]">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {LOGOS.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-zinc-200 bg-[#fbfaf8] px-4 py-5 text-center text-sm font-semibold text-zinc-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] border border-zinc-200 bg-[#faf8ff] p-5">
                <div className="text-sm font-semibold text-zinc-500">Success rate story</div>
                <div className="mt-2 text-4xl font-black text-zinc-950">99.99%</div>
                <p className="mt-2 text-sm leading-7 text-zinc-600">
                  Stronger than vanity stats when paired with workflow reliability and recovery framing.
                </p>
              </div>

              <div className="rounded-[24px] border border-zinc-200 bg-[#faf8ff] p-5">
                <div className="text-sm font-semibold text-zinc-500">Time saved story</div>
                <div className="mt-2 text-4xl font-black text-zinc-950">17h</div>
                <p className="mt-2 text-sm leading-7 text-zinc-600">
                  A better homepage shows not only movement, but measurable business value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
