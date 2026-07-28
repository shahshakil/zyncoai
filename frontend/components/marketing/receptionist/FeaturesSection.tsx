"use client";
import { motion } from "framer-motion";
import { Clock, CalendarCheck, Globe2, ShieldCheck, Siren, Plug } from "lucide-react";

function RevealWords({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.04 }}
          className="mr-1.5 inline-block"
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

const FEATURES = [
  { icon: Clock, color: "#4f87f0", title: "Answers in under 1 second", desc: "No hold music, no voicemail — Charlotte picks up before the second ring." },
  { icon: CalendarCheck, color: "#10b981", title: "Books appointments automatically", desc: "Checks real availability and confirms the booking on the call." },
  { icon: Globe2, color: "#7c3aed", title: "Speaks 15+ languages", desc: "Detects the caller's language automatically and responds fluently." },
  { icon: ShieldCheck, color: "#f59e0b", title: "Australian healthcare compliant", desc: "Built around AU privacy and record-keeping expectations from day one." },
  { icon: Siren, color: "#dc2626", title: "Emergency detection", desc: "Flags urgent symptoms instantly and escalates to a human straight away." },
  { icon: Plug, color: "#0d9488", title: "Connects to your existing software", desc: "Cliniko, Best Practice, Medical Director, and more — synced automatically." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-[#f8fafc] sm:text-4xl">
          <RevealWords text="Everything built for Australian healthcare" />
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            className="group rounded-2xl border border-white/10 bg-[#0b0f19] p-6 transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-shadow group-hover:shadow-[0_0_24px_var(--glow)]"
              style={{ background: `${f.color}1a`, ["--glow" as any]: `${f.color}66` }}
            >
              <f.icon className="h-6 w-6" style={{ color: f.color }} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#f8fafc]">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#94a3b8]">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
