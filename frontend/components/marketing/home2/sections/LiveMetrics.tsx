"use client";

import { useEffect, useState } from "react";

function Counter({
  from,
  to,
  suffix = "",
  duration = 1600,
}: {
  from: number;
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    let start = 0;
    const step = 16;
    const steps = Math.max(1, Math.floor(duration / step));
    const inc = (to - from) / steps;

    const timer = setInterval(() => {
      start += 1;
      const next = from + inc * start;
      if (start >= steps) {
        setValue(to);
        clearInterval(timer);
      } else {
        setValue(next);
      }
    }, step);

    return () => clearInterval(timer);
  }, [from, to, duration]);

  const formatted =
    to >= 1000
      ? Math.round(value).toLocaleString()
      : value.toFixed(to % 1 !== 0 ? 2 : 0);

  return <span>{formatted}{suffix}</span>;
}

function MetricCard({
  label,
  from,
  to,
  suffix,
}: {
  label: string;
  from: number;
  to: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
      <div className="text-sm font-medium text-zinc-500">{label}</div>
      <div className="mt-3 text-5xl font-black tracking-tight text-zinc-950">
        <Counter from={from} to={to} suffix={suffix} />
      </div>
      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-zinc-200">
        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" />
      </div>
    </div>
  );
}

export default function LiveMetrics() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[36px] border border-zinc-200 bg-[#fbfaf8] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.04)] md:p-8">
          <div className="max-w-3xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              LIVE METRICS
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-5xl">
              Live signal, not vanity.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
              Operational metrics that enterprise buyers care about — reliability, throughput,
              recovery, and measurable workflow impact.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Runs today" from={0} to={1542} />
            <MetricCard label="Avg time saved / week" from={0} to={17} suffix="h" />
            <MetricCard label="Success rate" from={0} to={99.99} suffix="%" />
            <MetricCard label="Retries auto-recovered" from={0} to={86} suffix="%" />
          </div>

          <p className="mt-5 text-sm text-zinc-500">
            Numbers are demo values until connected to your backend analytics endpoint.
          </p>
        </div>
      </div>
    </section>
  );
}
