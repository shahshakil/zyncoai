"use client";

import React from "react";

type Tile = {
  label: string;
  tag?: string;
};

const lanes: Tile[][] = [
  [
    { label: "Autonomous lead follow-ups", tag: "Revenue" },
    { label: "Customer refund negotiation", tag: "Support" },
    { label: "AI sales proposals + pricing", tag: "Revenue" },
    { label: "Invoice + payment chasing", tag: "Finance" },
    { label: "Supplier onboarding flows", tag: "Ops" },
    { label: "Contract review summaries", tag: "Legal" },
  ],
  [
    { label: "Workflow drafts from goal", tag: "AI" },
    { label: "Policy-based approvals", tag: "Governance" },
    { label: "Self-healing when API breaks", tag: "Reliability" },
    { label: "Run replay with idempotency", tag: "Reliability" },
    { label: "Audit trails per action", tag: "Compliance" },
    { label: "Secrets vault + rotation", tag: "Security" },
  ],
  [
    { label: "CRM cleanup + enrichment", tag: "Data" },
    { label: "Meeting notes → tasks", tag: "Ops" },
    { label: "Slack + email triage agent", tag: "Ops" },
    { label: "Churn risk alerts", tag: "Analytics" },
    { label: "KPI reports to stakeholders", tag: "Analytics" },
    { label: "Incident escalation playbooks", tag: "Ops" },
  ],
];

function tagTone(tag?: string) {
  // subtle “different” tones without copying Zapier style
  if (!tag) return "bg-white/5 border-white/10 text-white/80";
  const map: Record<string, string> = {
    Revenue: "bg-white/10 border-white/15 text-white",
    AI: "bg-white/10 border-white/15 text-white",
    Reliability: "bg-white/5 border-white/10 text-white/90",
    Governance: "bg-white/5 border-white/10 text-white/90",
    Security: "bg-white/5 border-white/10 text-white/90",
    Compliance: "bg-white/5 border-white/10 text-white/90",
    Ops: "bg-white/5 border-white/10 text-white/85",
    Data: "bg-white/5 border-white/10 text-white/85",
    Analytics: "bg-white/5 border-white/10 text-white/85",
    Finance: "bg-white/5 border-white/10 text-white/85",
    Legal: "bg-white/5 border-white/10 text-white/85",
    Support: "bg-white/5 border-white/10 text-white/85",
  };
  return map[tag] ?? "bg-white/5 border-white/10 text-white/85";
}

function Lane({
  items,
  direction,
  duration,
}: {
  items: Tile[];
  direction: "left" | "right";
  duration: number;
}) {
  // triple list so loop looks seamless
  const data = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/80 to-transparent" />

      <div
        className={`flex w-max gap-3 py-2 ${
          direction === "left" ? "zynLaneLeft" : "zynLaneRight"
        }`}
        style={
          {
            ["--zynLaneDuration" as any]: `${duration}s`,
          } as React.CSSProperties
        }
      >
        {data.map((t, idx) => (
          <div
            key={`${t.label}-${idx}`}
            className={[
              "group rounded-2xl border px-4 py-3",
              "backdrop-blur-md",
              "transition-transform duration-200 hover:-translate-y-0.5",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_40px_rgba(120,80,255,0.12)]",
              "min-w-[220px] sm:min-w-[260px]",
              "relative",
              tagTone(t.tag),
            ].join(" ")}
          >
            <div className="text-sm font-semibold">{t.label}</div>
            {t.tag ? (
              <div className="mt-1 text-[11px] text-white/60">{t.tag}</div>
            ) : null}

            {/* tiny glow pin (different from Zapier) */}
            <div className="pointer-events-none absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white/20 blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .zynLaneLeft {
          animation: zynLaneLeft var(--zynLaneDuration) linear infinite;
          will-change: transform;
        }
        .zynLaneRight {
          animation: zynLaneRight var(--zynLaneDuration) linear infinite;
          will-change: transform;
        }
        @keyframes zynLaneLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @keyframes zynLaneRight {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .zynLaneLeft,
          .zynLaneRight {
            animation: none !important;
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function PricingPossibilities() {
  return (
    <section className="mt-12">
      <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 relative overflow-hidden">
        {/* background: scanlines + soft glow (NOT dotted grid) */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_30%_20%,rgba(120,80,255,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_70%,rgba(60,180,255,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:100%_18px] opacity-25" />
        </div>

        <div className="relative">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                Infinite outcomes, not just automations
              </div>
              <h3 className="mt-3 text-2xl sm:text-3xl font-semibold text-white">
                What teams build with ZyncoAI
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-white/65">
                Turn goals into autonomous systems: plan → execute → observe → repair — with approvals,
                audit logs, and safe replay built in.
              </p>
            </div>

            <a
              href="/templates"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
            >
              Explore templates →
            </a>
          </div>

          {/* “lanes” (moving boxes) */}
          <div className="mt-6 space-y-2">
            <Lane items={lanes[0]} direction="left" duration={26} />
            <Lane items={lanes[1]} direction="right" duration={30} />
            <Lane items={lanes[2]} direction="left" duration={34} />
          </div>

          {/* Center “core” label (different from Zapier bracket lines) */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/70">
              Orchestrated by your agents • governed by policy
            </div>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
