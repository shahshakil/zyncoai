"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, ShieldCheck, Users, ScrollText, ShieldAlert } from "lucide-react";

const ACCORDION = [
  {
    title: "Escalation Rules",
    body: "Define exactly when a call gets handed to a human — a specific question, a frustrated caller, or anything outside what Ella's configured to handle.",
  },
  {
    title: "Call Transcripts & Recording",
    body: "Every call is recorded and transcribed automatically, so you can see exactly what was said — never a black box.",
  },
  {
    title: "Custom Scripts",
    body: "Adjust how Ella greets callers and handles specific situations for your business, without touching code.",
  },
  {
    title: "Human Handoff Triggers",
    body: "Set the exact moments — a billing dispute, a request for a manager, a complaint — where Ella hands off immediately instead of trying to resolve it herself.",
  },
];

// Headline picks from the retired 16-tile SecuritySection grid — the full,
// audited list still lives at /resources/trust rather than being repeated
// here twice on the homepage.
const SECURITY_HIGHLIGHTS = [
  { icon: ShieldCheck, color: "#4f46e5", label: "AES-256 field encryption" },
  { icon: Users, color: "#10b981", label: "Role-based staff access" },
  { icon: ScrollText, color: "#f59e0b", label: "Full audit trail" },
  { icon: ShieldAlert, color: "#06b6d4", label: "Brute-force & lockout protection" },
];

export function TrustControlSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="trust-control" className="relative mx-[calc(50%-50vw)] w-screen bg-white py-20">
      <div className="mx-auto grid max-w-[1100px] gap-12 px-6 lg:grid-cols-2 lg:items-start lg:px-8">
        {/* left: accordion */}
        <div>
          <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">
            See every call. <span className="block">Control every response.</span>
          </h2>
          <p className="mt-3 text-[#475569]">Ella runs inside guardrails you set — nothing happens on a call that you haven&apos;t configured for.</p>

          <div className="mt-8 divide-y divide-[#e2e8f0] rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            {ACCORDION.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.title}>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-[#0f172a]">{item.title}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-[#475569] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed text-[#475569]">{item.body}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* right: security-at-a-glance panel */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-8 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)]">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#0f172a]">Security, built in</h3>
            <p className="mt-1.5 text-sm text-[#475569]">No badges we haven&apos;t earned — this is what&apos;s actually shipped today.</p>

            <div className="mt-6 space-y-3">
              {SECURITY_HIGHLIGHTS.map((s) => (
                <div key={s.label} className="flex items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-3.5 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${s.color}1a` }}>
                    <s.icon className="h-4 w-4" style={{ color: s.color }} />
                  </div>
                  <span className="text-[13px] font-medium leading-tight text-[#1e293b]">{s.label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/resources/trust"
              className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4f46e5] hover:text-[#4338ca]"
            >
              Full details <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
