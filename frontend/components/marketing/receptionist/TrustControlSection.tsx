"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, ShieldCheck } from "lucide-react";

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

export function TrustControlSection() {
  const [open, setOpen] = useState(0);
  const [email, setEmail] = useState("");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/signup${email ? `?email=${encodeURIComponent(email)}` : ""}`);
  }

  return (
    <section className="relative mx-[calc(50%-50vw)] w-screen bg-white py-20">
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
                    <ChevronDown className={`h-4 w-4 shrink-0 text-[#94a3b8] transition-transform ${isOpen ? "rotate-180" : ""}`} />
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

        {/* right: compact signup card */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-8 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)]">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#0f172a]">Start your 7-day free trial</h3>
            <p className="mt-1.5 text-sm text-[#475569]">No credit card required. Set up in about 15 minutes.</p>

            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#4f46e5]/50 focus:ring-4 focus:ring-[#4f46e5]/10"
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(79,70,229,0.25)] transition hover:opacity-90"
              >
                Start Free Trial <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
