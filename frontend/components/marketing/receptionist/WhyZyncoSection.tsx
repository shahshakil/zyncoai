"use client";
import { motion } from "framer-motion";
import { Layers, RefreshCw, PhoneCall, Eye } from "lucide-react";

const REASONS = [
  {
    icon: Layers,
    color: "#4f46e5",
    title: "Built for your industry, not a generic bot",
    desc: "Medical, dental, legal, mechanics, restaurants and more each get their own tuned scripts and vocabulary — not one script stretched across every business.",
  },
  {
    icon: RefreshCw,
    color: "#06b6d4",
    title: "Never sounds like a recording",
    desc: "Ella's opening line rotates non-repeating phrasing on every call, so regular callers don't hear the exact same greeting twice in a row.",
  },
  {
    icon: PhoneCall,
    color: "#10b981",
    title: "Actually answers, every time",
    desc: "No voicemail, no hold music, no missed calls — day or night, weekends included.",
  },
  {
    icon: Eye,
    color: "#f59e0b",
    title: "You can see and control everything",
    desc: "Every call is recorded and transcribed, and you decide exactly when it escalates to a human.",
  },
];

export function WhyZyncoSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#475569]">Why ZyncoAI</p>
        <h2 className="mt-2 text-3xl font-bold text-[#0f172a] sm:text-4xl">What actually makes this different</h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {REASONS.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${r.color}1a` }}>
              <r.icon className="h-6 w-6" style={{ color: r.color }} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#0f172a]">{r.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
