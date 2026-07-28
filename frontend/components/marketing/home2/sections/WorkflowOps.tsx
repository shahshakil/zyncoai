"use client";

import { motion } from "framer-motion";
import { FadeIn } from "../ui/Motion";

export default function WorkflowOps({ copy }: { copy: any }) {
  return (
    <div className="grid gap-6 md:grid-cols-[1.05fr_1.95fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <FadeIn>
          <div className="text-xs font-semibold tracking-wider text-slate-500">WORKFLOWOPS</div>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">{copy.heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            {copy.sub}
          </p>

          <a
            href="/app"
            className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-[1px]"
          >
            Explore WorkflowOps
            <span className="ml-2">→</span>
          </a>
        </FadeIn>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-[0_30px_120px_-75px_rgba(2,6,23,.35)] backdrop-blur">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {copy.items.map((item: any, idx: number) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="text-sm font-bold text-slate-900">{item.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Ship safely with staging, monitoring, rollback, and self-healing execution paths.
        </div>
      </div>
    </div>
  );
}
