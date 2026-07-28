"use client";
import { motion } from "framer-motion";
import { PhoneIncoming, Zap, Brain, CalendarSearch, CalendarCheck, MailCheck, RefreshCw } from "lucide-react";
import { INTEGRATIONS } from "./data";

const NODES = [
  { icon: PhoneIncoming, label: "Patient calls" },
  { icon: Zap, label: "ZyncoAI answers < 1s" },
  { icon: Brain, label: "AI understands intent" },
  { icon: CalendarSearch, label: "Checks availability" },
  { icon: CalendarCheck, label: "Books appointment" },
  { icon: MailCheck, label: "Sends confirmation" },
  { icon: RefreshCw, label: "Syncs to your software" },
];

function Connector({ index }: { index: number }) {
  return (
    <div className="relative mx-2 hidden h-0.5 w-10 shrink-0 border-t-2 border-dashed border-white/15 sm:block lg:w-16">
      <motion.span
        className="absolute -top-[3px] h-1.5 w-1.5 rounded-full bg-[#4f87f0] shadow-[0_0_8px_#4f87f0]"
        animate={{ left: ["0%", "100%"] }}
        transition={{ repeat: Infinity, duration: 1.6, delay: index * 0.2, ease: "linear" }}
      />
    </div>
  );
}

export function WorkflowSection() {
  return (
    <section className="relative mx-[calc(50%-50vw)] w-screen bg-[#0b0f19] py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[#f8fafc] sm:text-4xl">Watch how a booking flows through ZyncoAI</h2>
        </div>

        <div className="mt-14 flex snap-x items-center overflow-x-auto pb-4">
          {NODES.map((n, i) => (
            <div key={n.label} className="flex shrink-0 items-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex w-28 flex-col items-center gap-2 text-center sm:w-32"
              >
                <motion.div
                  animate={{ boxShadow: ["0 0 0px rgba(79,135,240,0.3)", "0 0 24px rgba(79,135,240,0.55)", "0 0 0px rgba(79,135,240,0.3)"] }}
                  transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.25 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#4f87f0]/40 bg-gradient-to-br from-[#4f87f0]/15 to-[#7c3aed]/15"
                >
                  <n.icon className="h-6 w-6 text-[#8ab4ff]" />
                </motion.div>
                <p className="text-xs font-medium leading-tight text-[#cbd5e1]">{n.label}</p>
              </motion.div>
              {i < NODES.length - 1 && <Connector index={i} />}
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-[#94a3b8]">Works with your existing software</p>
          <div className="relative mt-6 overflow-hidden">
            <div className="flex w-max animate-[zynco-marquee_22s_linear_infinite] gap-10">
              {[...INTEGRATIONS, ...INTEGRATIONS].map((name, i) => (
                <span key={i} className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#cbd5e1]">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes zynco-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
