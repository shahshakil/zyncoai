"use client";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";

export interface RoleUseCase {
  role: string;
  description: string;
}

// Real job titles for this vertical (see Industry.roles in ./data), each
// paired with what Ella/the dashboard actually does for that role.
export function RoleUseCasesSection({ industryName, roles }: { industryName: string; roles: RoleUseCase[] }) {
  if (!roles.length) return null;
  return (
    <section id="use-cases" className="py-14">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-bold text-[#0f172a]">Built for every role on your team</h2>
        <p className="mt-3 text-[#475569]">How Ella changes the day for the people actually running a {industryName.toLowerCase()} business.</p>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 px-6 sm:grid-cols-3">
        {roles.map((r, i) => (
          <motion.div
            key={r.role}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)]">
              <UserRound className="h-5 w-5 text-white" />
            </span>
            <p className="mt-4 text-sm font-semibold text-[#0f172a]">{r.role}</p>
            <p className="mt-1.5 text-sm text-[#475569]">{r.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
