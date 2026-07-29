"use client";
import { motion } from "framer-motion";
import { KeyRound, Users, ShieldCheck } from "lucide-react";

// Only claims for measures that are genuinely built and verified today.
// Do not add certification badges (SOC 2, ISO 27001, PCI-DSS, HIPAA, etc.)
// unless they are actually, verifiably held.
const MEASURES = [
  {
    icon: KeyRound,
    title: "Strong passwords, checked against real breaches",
    desc: "New passwords are scored for strength in real time and checked against the Have I Been Pwned breach database before an account can be created.",
  },
  {
    icon: ShieldCheck,
    title: "Two-factor authentication on every new account",
    desc: "New accounts require authenticator-app verification, with one-time backup codes, before first login — not an opt-in add-on.",
  },
  {
    icon: Users,
    title: "Role-based staff access",
    desc: "Owners and admins see revenue, billing, and AI settings. Staff and doctor accounts don't — enforced on every request, not just hidden in the interface.",
  },
];

export function SecuritySection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Security</p>
        <h2 className="mt-2 text-3xl font-bold text-[#0f172a] sm:text-4xl">What&apos;s actually built, not what sounds good</h2>
        <p className="mt-3 text-sm text-[#475569]">No badges we haven&apos;t earned — this list only grows as new measures genuinely ship.</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
        {MEASURES.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366f1]/10">
              <m.icon className="h-6 w-6 text-[#6366f1]" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#0f172a]">{m.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">{m.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
