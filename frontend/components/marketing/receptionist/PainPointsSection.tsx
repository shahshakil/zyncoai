"use client";
import { motion } from "framer-motion";
import { XCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export interface PainPointSolution {
  problem: string;
  solution: string;
}

// Bento-grid pain-point -> solution cards. Each card's "solution" is a real
// feature/behaviour already listed on the page (see Industry.painPoints in
// ./data) — this component only lays them out, it never invents copy.
export function PainPointsSection({ industryName, painPoints }: { industryName: string; painPoints: PainPointSolution[] }) {
  if (!painPoints.length) return null;
  return (
    <section id="pain-points" className="py-14">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-bold text-[#0f172a]">
          Where {industryName.toLowerCase()} phone lines actually break down
        </h2>
        <p className="mt-3 text-[#475569]">Three real problems, and what Ella actually does about each one.</p>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 px-6 md:grid-cols-3">
        {painPoints.map((p, i) => (
          <motion.div
            key={p.problem}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="group flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:border-[#c7d2fe] hover:shadow-[0_12px_32px_-12px_rgba(99,102,241,0.25)]"
          >
            <div className="flex items-start gap-2.5">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#dc2626]" />
              <p className="text-sm text-[#475569]">{p.problem}</p>
            </div>
            <div className="my-4 flex justify-center opacity-40 transition-transform group-hover:translate-y-0.5">
              <ArrowRight className="h-4 w-4 rotate-90 text-[#94a3b8]" />
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#10b981]" />
              <p className="text-sm font-medium text-[#0f172a]">{p.solution}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
