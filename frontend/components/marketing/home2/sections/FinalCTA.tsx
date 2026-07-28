"use client";

import { motion } from "framer-motion";
import { FadeIn } from "../ui/Motion";

export default function FinalCTA({ copy }: { copy: any }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_40px_120px_-65px_rgba(2,6,23,.35)] md:p-10">
      <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute left-1/3 bottom-0 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative grid gap-8 md:grid-cols-[1.5fr_.8fr] md:items-center">
        <FadeIn>
          <div className="text-xs font-semibold tracking-wider text-slate-500">FINAL CTA</div>

          <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            <span className="text-slate-900">Start free.</span>{" "}
            <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
              Ship automation that holds up in production.
            </span>
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
            {copy.sub}
          </p>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 18, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
        >
          <div className="text-sm font-bold text-slate-900">Ready when you are</div>
          <div className="mt-2 text-sm text-slate-600">
            Connect your tools, launch your first workflow, and let ZyncoAI turn intent into outcomes.
          </div>

          <div className="mt-5 space-y-3">
            <a
              href="/app"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-[1px]"
            >
              {copy.primary}
            </a>

            <a
              href="#workflow"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-[1px]"
            >
              {copy.secondary}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
