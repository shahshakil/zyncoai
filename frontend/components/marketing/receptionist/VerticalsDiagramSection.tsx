"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  MessageSquare,
  MessageCircle,
  Stethoscope,
  Wrench,
  UtensilsCrossed,
  Scale,
  Landmark,
  Headset,
} from "lucide-react";

const CHANNELS = [
  { label: "Phone Calls", icon: Phone, top: 120 },
  { label: "SMS / Text", icon: MessageSquare, top: 288 },
  { label: "Web Chat", icon: MessageCircle, top: 456 },
];

const VERTICALS = [
  { label: "Medical & Dental", icon: Stethoscope, accent: "#10b981", top: 51, href: "/solutions/healthcare" },
  { label: "Mechanic Shops", icon: Wrench, accent: "#06b6d4", top: 131, href: "/solutions/mechanic" },
  { label: "Restaurants", icon: UtensilsCrossed, accent: "#f59e0b", top: 211, href: "/solutions/restaurant" },
  { label: "Law Firms", icon: Scale, accent: "#7c3aed", top: 291, href: "/solutions/legal" },
  { label: "Financial Services", icon: Landmark, accent: "#6366f1", top: 371, href: "/solutions/bank" },
  { label: "Customer Care", icon: Headset, accent: "#10b981", top: 451, href: "/demo" },
];

const CHANNEL_EDGE_X = 220;
const VERTICAL_EDGE_X = 900;
const HUB_LEFT_X = 440;
const HUB_RIGHT_X = 700;
const HUB_Y = 320;
const CHANNEL_NODE_H = 64;
const VERTICAL_NODE_H = 58;

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M ${x1},${y1} C ${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

export function VerticalsDiagramSection() {
  return (
    <section className="relative bg-[#f8fafc] py-16">
      <style jsx global>{`
        @keyframes zynco-dash { to { stroke-dashoffset: -130; } }
        .animate-zynco-dash { animation: zynco-dash 1.7s linear infinite; }
        @keyframes zynco-spin { to { transform: rotate(360deg); } }
        .animate-zynco-spin { animation: zynco-spin 8s linear infinite; }
        @keyframes zynco-pulse { 0%, 100% { opacity: 0.25; transform: scale(0.94); } 50% { opacity: 0.5; transform: scale(1.08); } }
        .animate-zynco-pulse { animation: zynco-pulse 2.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-zynco-dash, .animate-zynco-spin, .animate-zynco-pulse { animation: none; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="overflow-x-auto px-6 pb-2 lg:px-8"
      >
        <div
          className="relative mx-auto h-[620px] w-[1150px] rounded-3xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
          style={{ backgroundImage: "radial-gradient(rgba(99,102,241,0.10) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        >
          <div className="absolute left-6 top-[70px] text-[11px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Inbound channels</div>
          <div className="absolute left-[900px] top-[22px] text-[11px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Verticals ZyncoAI serves</div>

          {/* connector lines: channels -> hub -> verticals */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {CHANNELS.map((c, i) => {
              const y = c.top + CHANNEL_NODE_H / 2;
              const id = `pl${i}`;
              const d = bezier(CHANNEL_EDGE_X, y, HUB_LEFT_X, HUB_Y);
              return (
                <g key={id}>
                  <path id={id} d={d} fill="none" stroke="url(#flowGrad)" strokeWidth={1.8} strokeDasharray="4 9" className="animate-zynco-dash opacity-50" />
                  <circle r={3.2} fill="#6366f1">
                    <animateMotion dur={`${(1.7 + i * 0.25).toFixed(2)}s`} repeatCount="indefinite" begin={`${(i * 0.3).toFixed(2)}s`}>
                      <mpath href={`#${id}`} />
                    </animateMotion>
                  </circle>
                </g>
              );
            })}
            {VERTICALS.map((v, i) => {
              const y = v.top + VERTICAL_NODE_H / 2;
              const id = `pr${i}`;
              const d = bezier(HUB_RIGHT_X, HUB_Y, VERTICAL_EDGE_X, y);
              return (
                <g key={id}>
                  <path id={id} d={d} fill="none" stroke="url(#flowGrad)" strokeWidth={1.8} strokeDasharray="4 9" className="animate-zynco-dash opacity-50" />
                  <circle r={3.2} fill="#6366f1">
                    <animateMotion dur={`${(1.7 + i * 0.18).toFixed(2)}s`} repeatCount="indefinite" begin={`${(i * 0.22).toFixed(2)}s`}>
                      <mpath href={`#${id}`} />
                    </animateMotion>
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* channel nodes */}
          {CHANNELS.map((c) => (
            <div
              key={c.label}
              className="absolute left-5 flex w-[200px] items-center gap-2.5 rounded-2xl border-l-[3px] border-[#6366f1] bg-white px-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)]"
              style={{ top: c.top, height: CHANNEL_NODE_H }}
            >
              <c.icon className="h-[18px] w-[18px] shrink-0 text-[#6366f1]" />
              <span className="text-[13px] font-semibold text-[#1e293b]">{c.label}</span>
            </div>
          ))}

          {/* hub, with rotating conic-gradient halo */}
          <div className="absolute left-[440px] top-[245px] h-[150px] w-[260px]">
            <div className="animate-zynco-spin pointer-events-none absolute -inset-6 rounded-[999px] opacity-60 blur-2xl" style={{ backgroundImage: "conic-gradient(from 0deg, #6366f1, #7c3aed, #06b6d4, #6366f1)" }} />
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 rounded-[22px] bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] text-center shadow-[0_20px_45px_rgba(99,102,241,0.32)]">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-[11px] bg-white text-lg font-extrabold text-[#6366f1]">
                Z
                <span className="animate-zynco-pulse pointer-events-none absolute -inset-2 rounded-2xl bg-white opacity-40 blur-[11px]" />
              </div>
              <div className="text-[17px] font-extrabold text-white">ZyncoAI</div>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-white/85">Voice Core</div>
              <div className="mt-0.5 flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10.5px] font-bold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.3)]" />
                Live everywhere
              </div>
            </div>
          </div>

          {/* vertical nodes */}
          {VERTICALS.map((v) => (
            <Link
              key={v.label}
              href={v.href}
              className="absolute left-[900px] flex w-[220px] items-center gap-2.5 rounded-2xl bg-white px-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)]"
              style={{ top: v.top, height: VERTICAL_NODE_H, borderLeft: `3px solid ${v.accent}` }}
            >
              <v.icon className="h-[18px] w-[18px] shrink-0" style={{ color: v.accent }} />
              <span className="text-[13px] font-semibold text-[#1e293b]">{v.label}</span>
            </Link>
          ))}
          <Link
            href="/pricing"
            className="absolute left-[900px] flex w-[220px] items-center justify-center rounded-2xl bg-[image:linear-gradient(90deg,#6366f1,#7c3aed)] px-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(99,102,241,0.25)]"
            style={{ top: 531, height: VERTICAL_NODE_H }}
          >
            <span className="text-[13px] font-bold text-white">+ More verticals</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
