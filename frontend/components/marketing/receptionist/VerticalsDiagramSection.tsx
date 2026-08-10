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
  Scissors,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

// 2026-08-10 — full rebuild. Two real problems fixed at once:
//   1. The old diagram was an absolute-positioned 1150x620px canvas —
//      unusable at 375px (just a horizontal-scroll box, not a responsive
//      layout). Replaced with a flex/grid layout that reflows naturally:
//      a vertical stack on mobile, a three-column flow on desktop. No
//      pixel-coordinate positioning anywhere.
//   2. It claimed three live inbound channels (Phone Calls, SMS/Text, Web
//      Chat). Only Phone Calls is real today — there is no web-chat widget
//      product and SMS is currently blocked (Twilio's SMS capability is
//      disabled on our account, see backend src/lib/sms.ts). The other two
//      are now labeled "Coming soon" instead of implied live, same pattern
//      as PlatformControlsSection.tsx.
const CHANNELS = [
  { label: "Phone Calls", icon: Phone, live: true },
  { label: "SMS / Text", icon: MessageSquare, live: false },
  { label: "Web Chat", icon: MessageCircle, live: false },
];

const VERTICALS = [
  { label: "Medical & Dental", icon: Stethoscope, accent: "#10b981", href: "/solutions/healthcare" },
  { label: "Mechanic Shops", icon: Wrench, accent: "#06b6d4", href: "/solutions/mechanic" },
  { label: "Restaurants", icon: UtensilsCrossed, accent: "#f59e0b", href: "/solutions/restaurant" },
  { label: "Law Firms", icon: Scale, accent: "#7c3aed", href: "/solutions/legal" },
  { label: "Financial Services", icon: Landmark, accent: "#4f46e5", href: "/solutions/bank" },
  { label: "Salon & Retail", icon: Scissors, accent: "#10b981", href: "/solutions/salon" },
];

function Connector({ direction }: { direction: "down" | "across" }) {
  const Icon = direction === "down" ? ArrowDown : ArrowRight;
  return (
    <div className={`relative flex items-center justify-center ${direction === "down" ? "h-8" : "w-8 shrink-0"}`}>
      <div
        className={`relative overflow-hidden rounded-full bg-[#e2e8f0] ${direction === "down" ? "h-full w-[3px]" : "h-[3px] w-full"}`}
      >
        <div
          className={`absolute inset-0 bg-[image:linear-gradient(${direction === "down" ? "180deg" : "90deg"},#4f46e5,#06b6d4)] animate-zynco-flow-${direction}`}
        />
      </div>
      <Icon className="absolute h-3.5 w-3.5 text-[#6366f1]" />
    </div>
  );
}

export function VerticalsDiagramSection() {
  return (
    <section className="relative bg-[#f8fafc] py-16">
      <style jsx global>{`
        @keyframes zynco-flow-down { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        @keyframes zynco-flow-across { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-zynco-flow-down { animation: zynco-flow-down 1.6s linear infinite; }
        .animate-zynco-flow-across { animation: zynco-flow-across 1.6s linear infinite; }
        @keyframes zynco-spin { to { transform: rotate(360deg); } }
        .animate-zynco-spin { animation: zynco-spin 8s linear infinite; }
        @keyframes zynco-pulse { 0%, 100% { opacity: 0.25; transform: scale(0.94); } 50% { opacity: 0.5; transform: scale(1.08); } }
        .animate-zynco-pulse { animation: zynco-pulse 2.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-zynco-flow-down, .animate-zynco-flow-across, .animate-zynco-spin, .animate-zynco-pulse { animation: none; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="flex flex-col items-stretch gap-0 lg:flex-row lg:items-center lg:gap-0">
            {/* channels */}
            <div className="flex flex-1 flex-col gap-2.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Inbound channels</p>
              {CHANNELS.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-2.5 rounded-2xl border-l-[3px] bg-white px-3.5 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.05)]"
                  style={{ borderColor: c.live ? "#4f46e5" : "#e2e8f0" }}
                >
                  <c.icon className="h-[18px] w-[18px] shrink-0" style={{ color: c.live ? "#4f46e5" : "#cbd5e1" }} />
                  <span className={`text-[13px] font-semibold ${c.live ? "text-[#1e293b]" : "text-[#94a3b8]"}`}>{c.label}</span>
                  {!c.live && (
                    <span className="ml-auto shrink-0 text-[9.5px] font-semibold uppercase tracking-wide text-[#94a3b8]">Coming soon</span>
                  )}
                </div>
              ))}
            </div>

            <Connector direction="down" />
            <div className="hidden lg:block">
              <Connector direction="across" />
            </div>

            {/* hub */}
            <div className="relative mx-auto flex h-[150px] w-[220px] shrink-0 flex-col items-center justify-center gap-2 rounded-[22px] bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] text-center shadow-[0_20px_45px_rgba(79,70,229,0.32)]">
              <div className="animate-zynco-spin pointer-events-none absolute -inset-6 -z-10 rounded-[999px] opacity-60 blur-2xl" style={{ backgroundImage: "conic-gradient(from 0deg, #4f46e5, #7c3aed, #06b6d4, #4f46e5)" }} />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-[11px] bg-white text-lg font-extrabold text-[#4f46e5]">
                Z
                <span className="animate-zynco-pulse pointer-events-none absolute -inset-2 rounded-2xl bg-white opacity-40 blur-[11px]" />
              </div>
              <div className="text-[17px] font-extrabold text-white">ZyncoAI</div>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-white/85">Voice Core</div>
              <div className="mt-0.5 flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10.5px] font-bold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.3)]" />
                Live now
              </div>
            </div>

            <div className="hidden lg:block">
              <Connector direction="across" />
            </div>
            <Connector direction="down" />

            {/* verticals */}
            <div className="flex flex-1 flex-col gap-2.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#94a3b8] lg:text-right">Verticals ZyncoAI serves</p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {VERTICALS.map((v) => (
                  <Link
                    key={v.label}
                    href={v.href}
                    className="flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.1)]"
                    style={{ borderLeft: `3px solid ${v.accent}` }}
                  >
                    <v.icon className="h-[18px] w-[18px] shrink-0" style={{ color: v.accent }} />
                    <span className="text-[13px] font-semibold text-[#1e293b]">{v.label}</span>
                  </Link>
                ))}
                <Link
                  href="/solutions"
                  className="flex items-center justify-center rounded-2xl bg-[image:linear-gradient(90deg,#4f46e5,#7c3aed)] px-3.5 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)]"
                >
                  <span className="text-[13px] font-bold text-white">+ More verticals</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
