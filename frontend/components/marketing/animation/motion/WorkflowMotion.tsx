"use client";

import { motion } from "framer-motion";

const steps = [
  { title: "Trigger", desc: "Webhook, form, schedule, event bus" },
  { title: "AI Planner", desc: "Understands intent and creates action graph" },
  { title: "Execution", desc: "Runs tools with retries, controls, and guardrails" },
  { title: "Result", desc: "Updates CRM, email, Slack, calendar, logs" },
];

export default function WorkflowMotion() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.12 }}
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-[22px] border border-zinc-200 bg-[#fcfbf8] px-5 py-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-zinc-950">{step.title}</h4>
              <span className="text-xs font-medium text-violet-600">Step {i + 1}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative min-h-[360px] rounded-[26px] border border-zinc-200 bg-[#0b0714] p-5 shadow-[0_30px_80px_rgba(40,10,80,0.18)]">
        <div className="absolute left-5 top-5 text-sm font-medium text-white/80">Run preview</div>
        <div className="absolute right-5 top-5 flex items-center gap-2 text-xs text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Active
        </div>

        <div className="relative mt-12 h-[250px] rounded-[20px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22),rgba(10,7,20,1)_62%)]">
          <motion.div
            className="absolute left-8 top-8 h-12 w-28 rounded-2xl border border-violet-300/40 bg-white/5 backdrop-blur"
            animate={{ x: [0, 10, 0], y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.6 }}
          />
          <motion.div
            className="absolute left-[42%] top-[42%] h-24 w-28 rounded-3xl border border-violet-200/30 bg-white/10 p-3 text-center text-sm font-semibold text-white backdrop-blur"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.8 }}
          >
            AI Planner
          </motion.div>
          <motion.div
            className="absolute right-8 top-12 h-20 w-20 rounded-3xl border border-fuchsia-300/35 bg-white/10 backdrop-blur"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <motion.div
            className="absolute right-10 bottom-10 h-16 w-28 rounded-2xl border border-violet-300/35 bg-white/10 backdrop-blur"
            animate={{ x: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3.4 }}
          />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M20,22 C32,24 42,34 49,46"
              fill="none"
              stroke="#c084fc"
              strokeWidth="0.8"
              initial={{ pathLength: 0.1, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            />
            <motion.path
              d="M58,48 C68,42 76,34 82,28"
              fill="none"
              stroke="#d8b4fe"
              strokeWidth="0.8"
              initial={{ pathLength: 0.1, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            />
            <motion.path
              d="M58,56 C68,64 76,72 84,76"
              fill="none"
              stroke="#a855f7"
              strokeWidth="0.8"
              initial={{ pathLength: 0.1, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {["Calendar booked", "Email sent", "CRM updated", "Audit log written"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
