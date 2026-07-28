"use client";

import { motion } from "framer-motion";
import { FadeIn } from "../ui/Motion";

export default function CoreFeatures({ copy }: { copy: any }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-[0_30px_120px_-75px_rgba(2,6,23,.35)] backdrop-blur">
      <FadeIn>
        <div className="text-xs font-semibold tracking-wider text-slate-500">
          CORE FEATURES
        </div>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">{copy.heading}</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">{copy.sub}</p>
      </FadeIn>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {copy.items.map((item: any, idx: number) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: idx * 0.08, ease: "easeOut" }}
            whileHover={{ y: -4, rotateX: -2 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="inline-flex rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-[11px] font-semibold text-white">
              ZyncoAI
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
