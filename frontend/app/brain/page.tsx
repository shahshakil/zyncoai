"use client";

import Link from "next/link";
import * as React from "react";

type CheckState = "idle" | "loading" | "ok" | "warn" | "fail";

type CheckResult = {
  name: string;
  url: string;
  method?: "GET" | "POST";
  state: CheckState;
  status?: number;
  latencyMs?: number;
  detail?: string;
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function apiBase() {
  // ✅ Set in .env.local:
  // NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5000
  // production: https://api.zyncoai.com
  const env = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return env && env.length > 0 ? env.replace(/\/$/, "") : "http://127.0.0.1:5000";
}

async function runCheck(url: string, timeoutMs = 4500) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  const start = performance.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      // If your API uses cookies/session, keep this:
      credentials: "include",
      headers: {
        "Accept": "application/json,text/plain,*/*",
      },
    });
    const latencyMs = Math.round(performance.now() - start);

    let text = "";
    try {
      text = await res.text();
    } catch {
      // ignore
    }

    clearTimeout(t);

    return {
      ok: res.ok,
      status: res.status,
      latencyMs,
      bodyText: text,
    };
  } catch (e: any) {
    clearTimeout(t);
    return {
      ok: false,
      status: 0,
      latencyMs: Math.round(performance.now() - start),
      bodyText: e?.name === "AbortError" ? "Request timeout" : (e?.message || "Network error"),
    };
  }
}

function Pill({ state }: { state: CheckState }) {
  const map: Record<CheckState, string> = {
    idle: "bg-white border border-[rgb(var(--border))]",
    loading: "bg-white border border-[rgb(var(--border))]",
    ok: "bg-emerald-500/15 text-emerald-200 border-emerald-400/20",
    warn: "bg-amber-500/15 text-amber-200 border-amber-400/20",
    fail: "bg-rose-500/15 text-rose-200 border-rose-400/20",
  };
  const label: Record<CheckState, string> = {
    idle: "Idle",
    loading: "Checking…",
    ok: "Operational",
    warn: "Degraded",
    fail: "Down",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", map[state])}>
      {label[state]}
    </span>
  );
}

function StatusDot({ state }: { state: CheckState }) {
  const cls =
    state === "ok"
      ? "bg-emerald-400"
      : state === "warn"
      ? "bg-amber-400"
      : state === "fail"
      ? "bg-rose-400"
      : "bg-zinc-500";
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", cls)} />;
}

function prettyLatency(ms?: number) {
  if (!ms && ms !== 0) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function overallState(checks: CheckResult[]): CheckState {
  if (!checks.length) return "idle";
  if (checks.some((c) => c.state === "fail")) return "fail";
  if (checks.some((c) => c.state === "warn")) return "warn";
  if (checks.every((c) => c.state === "ok")) return "ok";
  if (checks.some((c) => c.state === "loading")) return "loading";
  return "idle";
}

export default function StatusPage() {
  const base = apiBase();

  const [checks, setChecks] = React.useState<CheckResult[]>([
    { name: "API Health", url: `${base}/health`, state: "idle" },
    // Metrics may be protected; we’ll treat 401/403 as "warn" (protected) not fail
    { name: "Metrics (protected)", url: `${base}/metrics`, state: "idle" },
  ]);

  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [auto, setAuto] = React.useState(true);

  const runAll = React.useCallback(async () => {
    setChecks((prev) => prev.map((c) => ({ ...c, state: "loading", detail: undefined })));

    const results = await Promise.all(
      checks.map(async (c) => {
        const r = await runCheck(c.url);

        // Special handling for protected endpoints:
        // 401/403 = service is up but protected → warn
        if (c.name.toLowerCase().includes("metrics") && (r.status === 401 || r.status === 403)) {
          return {
            ...c,
            state: "warn" as const,
            status: r.status,
            latencyMs: r.latencyMs,
            detail: "Protected (auth required) — endpoint reachable.",
          };
        }

        // If ok => ok
        if (r.ok) {
          // Try parse JSON message quickly if it's /health
          let detail = "";
          if (c.name === "API Health") {
            try {
              const j = JSON.parse(r.bodyText || "{}");
              if (j?.service && j?.time) detail = `Service: ${j.service} • Time: ${j.time}`;
            } catch {
              // ignore
            }
          }
          return {
            ...c,
            state: "ok" as const,
            status: r.status,
            latencyMs: r.latencyMs,
            detail: detail || "OK",
          };
        }

        // Non-ok:
        const detail = r.bodyText?.slice(0, 180) || "Request failed";
        return {
          ...c,
          state: r.status ? ("fail" as const) : ("fail" as const),
          status: r.status || undefined,
          latencyMs: r.latencyMs,
          detail,
        };
      })
    );

    setChecks(results);
    setLastUpdated(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checks]);

  React.useEffect(() => {
    runAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => runAll(), 15000); // every 15s
    return () => clearInterval(id);
  }, [auto, runAll]);

  const overall = overallState(checks);

  const components = [
    { name: "Workflow Engine", status: overall === "fail" ? "Degraded" : "Operational", href: "/product" },
    { name: "Agents Runtime", status: overall === "fail" ? "Degraded" : "Operational", href: "/ai" },
    { name: "Integrations & Webhooks", status: overall === "fail" ? "Degraded" : "Operational", href: "/integrations" },
    { name: "Governance & Approvals", status: overall === "fail" ? "Degraded" : "Operational", href: "/governance" },
    { name: "Observability (logs/metrics)", status: overall === "fail" ? "Degraded" : "Operational", href: "/observability" },
    { name: "Security & Compliance", status: overall === "fail" ? "Degraded" : "Operational", href: "/security" },
  ];

  const statusHeadline =
    overall === "ok"
      ? "All systems operational"
      : overall === "warn"
      ? "Some systems are degraded"
      : overall === "fail"
      ? "Service disruption detected"
      : overall === "loading"
      ? "Checking systems…"
      : "Status";

  const statusSub =
    overall === "ok"
      ? "ZyncoAI platform is running normally across services."
      : overall === "warn"
      ? "Some endpoints are reachable but limited (often because they are protected)."
      : overall === "fail"
      ? "We’re seeing failures on one or more core endpoints."
      : "Live service checks and component health.";

  return (
    <div className="py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-white p-6 sm:p-10">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,.22),transparent_60%)] blur-2xl" />
          <div className="absolute bottom-[-180px] right-[-140px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(217,70,239,.18),transparent_60%)] blur-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_10%,rgba(255,255,255,.08),transparent_55%)]" />
        </div>

        <div className="relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white/5 px-3 py-1 text-xs text-zinc-200">
                <StatusDot state={overall} />
                <span>ZyncoAI Status</span>
                <span className="text-white/30">•</span>
                <span className="text-zinc-300">{base}</span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {statusHeadline}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                {statusSub}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                <Pill state={overall} />
                <span className="text-white/20">•</span>
                <span>
                  Last updated:{" "}
                  <span className="text-zinc-200">
                    {lastUpdated ? lastUpdated.toLocaleString() : "—"}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={runAll}
                className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Refresh checks
              </button>

              <button
                onClick={() => setAuto((v) => !v)}
                className={cn(
                  "inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium",
                  auto
                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15"
                    : "border-[rgb(var(--border))] bg-white/5 text-white hover:bg-white/10"
                )}
              >
                Auto refresh: {auto ? "ON" : "OFF"}
              </button>

              <Link
                href="/observability"
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-100"
              >
                Open Observability
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Checks */}
      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {checks.map((c) => (
          <div
            key={c.name}
            className="rounded-2xl border border-[rgb(var(--border))] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <StatusDot state={c.state} />
                  <h3 className="text-base font-semibold">{c.name}</h3>
                </div>
                <p className="mt-1 break-all text-xs text-zinc-400">{c.url}</p>
              </div>
              <Pill state={c.state} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3">
                <div className="text-xs text-zinc-400">HTTP</div>
                <div className="mt-1 font-semibold text-zinc-200">
                  {c.status ?? "—"}
                </div>
              </div>
              <div className="rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3">
                <div className="text-xs text-zinc-400">Latency</div>
                <div className="mt-1 font-semibold text-zinc-200">
                  {prettyLatency(c.latencyMs)}
                </div>
              </div>
              <div className="rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3">
                <div className="text-xs text-zinc-400">State</div>
                <div className="mt-1 font-semibold text-zinc-200">
                  {c.state.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-black/20 p-3 text-sm text-zinc-200">
              <div className="text-xs text-zinc-400">Detail</div>
              <div className="mt-1 whitespace-pre-wrap break-words">
                {c.detail || "—"}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/docs"
                className="rounded-lg border border-[rgb(var(--border))] bg-white/5 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10"
              >
                Docs
              </Link>
              <Link
                href="/security"
                className="rounded-lg border border-[rgb(var(--border))] bg-white/5 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10"
              >
                Security
              </Link>
              <Link
                href="/observability"
                className="rounded-lg border border-[rgb(var(--border))] bg-white/5 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10"
              >
                Observability
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-[rgb(var(--border))] bg-white/5 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10"
              >
                About
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Components */}
      <section className="mt-8 rounded-3xl border border-[rgb(var(--border))] bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Platform components</h2>
            <p className="mt-1 text-sm text-zinc-300">
              High-level service areas (workflows, agents, governance, observability) mapped to real ZyncoAI routes.
            </p>
          </div>
          <Link
            href="/product"
            className="mt-2 inline-flex w-fit items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 sm:mt-0"
          >
            Explore product
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {components.map((s) => (
            <Link
              key={s.name}
              href={s.href}
              className="group flex items-center justify-between rounded-2xl border border-[rgb(var(--border))] bg-black/20 p-4 hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-white/5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <div>
                  <div className="font-medium text-zinc-100">{s.name}</div>
                  <div className="text-xs text-zinc-400">{s.status}</div>
                </div>
              </div>
              <span className="text-sm text-zinc-400 group-hover:text-zinc-200">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-8 rounded-3xl border border-[rgb(var(--border))] bg-gradient-to-br from-white/[0.06] to-transparent p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Need deeper visibility?</h3>
            <p className="mt-1 text-sm text-zinc-300">
              ZyncoAI is built for serious automation: retries, logs, traces, metrics, approvals, and audit trails.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/observability"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-100"
            >
              Observability
            </Link>
            <Link
              href="/security"
              className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Security
            </Link>
          </div>
        </div>
      </section>

      {/* Small bottom nav */}
      <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-400">
        <Link className="hover:text-white" href="/product">Product</Link>
        <Link className="hover:text-white" href="/ai">AI</Link>
        <Link className="hover:text-white" href="/integrations">Integrations</Link>
        <Link className="hover:text-white" href="/templates">Templates</Link>
        <Link className="hover:text-white" href="/docs">Docs</Link>
        <Link className="hover:text-white" href="/resources">Resources</Link>
        <Link className="hover:text-white" href="/pricing">Pricing</Link>
        <Link className="hover:text-white" href="/governance">Governance</Link>
        <Link className="hover:text-white" href="/observability">Observability</Link>
        <Link className="hover:text-white" href="/security">Security</Link>
        <Link className="hover:text-white" href="/about">About</Link>
      </div>

      <div className="mt-3 text-xs text-zinc-500">
        Tip: Set <span className="text-zinc-300">NEXT_PUBLIC_API_BASE_URL</span> for production (e.g.{" "}
        <span className="text-zinc-300">https://api.zyncoai.com</span>) so the status page checks your real API.
      </div>
    </div>
  );
}
