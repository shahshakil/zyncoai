"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { motion } from "framer-motion";
import { ArrowRight, Play, Phone, CheckCircle2 } from "lucide-react";
import { CountUp } from "./CountUp";

const LINE1 = "Never miss another call.".split(" ");
const LINE2 = "Never lose another patient.".split(" ");

const PHONE_STEPS = [
  { label: "Incoming call…", delay: 0 },
  { label: "“Good morning, this is Charlotte!”", delay: 1600 },
  { label: "Booking confirmed — Thursday 10am", delay: 3200 },
];

function PhoneMockup() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % (PHONE_STEPS.length + 2)); // +2 holds on the final state before looping
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[280px] rounded-[2.5rem] border border-white/10 bg-[#0b0f19] p-3 shadow-[0_0_80px_rgba(79,135,240,0.15)]">
      <div className="rounded-[2rem] bg-[#030712] p-4">
        <div className="mb-4 flex items-center justify-between text-[10px] text-[#94a3b8]">
          <span>9:41</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" /> ZyncoAI</span>
        </div>
        <div className="min-h-[220px] space-y-3">
          {step >= 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-[#1e293b] p-3">
              <p className="text-[10px] text-[#94a3b8]">Incoming call</p>
              <p className="text-sm font-medium text-[#f8fafc]">+61 4•• ••• 812</p>
            </motion.div>
          )}
          {step >= 2 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-gradient-to-br from-[#4f87f0]/20 to-[#7c3aed]/20 p-3">
              <p className="text-[10px] text-[#94a3b8]">Charlotte</p>
              <p className="text-xs leading-5 text-[#f8fafc]">Good morning! This is Charlotte, how can I help?</p>
            </motion.div>
          )}
          {step >= 3 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 rounded-xl bg-[#0f2e22] p-3">
              <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10b981]" />
              </motion.span>
              <div>
                <p className="text-xs font-medium text-[#10b981]">Booking confirmed</p>
                <p className="text-[11px] text-[#6ee7b7]">Thursday 10:00am — Dr Johnson</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative mx-[calc(50%-50vw)] w-screen overflow-hidden bg-[#030712] pb-20 pt-32">
      {/* animated grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(79,135,240,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,135,240,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          animation: "zynco-grid-move 18s linear infinite",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#4f87f0]/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#94a3b8]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
            Australia&apos;s #1 AI Receptionist Platform
          </motion.div>

          <h1 className="mt-6 text-[42px] font-bold leading-[1.1] tracking-tight text-[#f8fafc] sm:text-5xl lg:text-[64px]">
            <span className="block">
              {LINE1.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="mr-3 inline-block"
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="block bg-gradient-to-r from-[#4f87f0] to-[#7c3aed] bg-clip-text text-transparent">
              {LINE2.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
                  className="mr-3 inline-block"
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-[#94a3b8]"
          >
            Charlotte, your AI receptionist, answers every call in under 1 second — books appointments, handles insurance questions, and speaks like a real Australian — 24 hours a day, 7 days a week.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.6 }} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              onClick={() => posthog.capture("hero_cta_clicked", { button: "start_free_trial" })}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4f87f0] to-[#7c3aed] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(79,135,240,0.4)] transition hover:opacity-90"
            >
              Start 7-day free trial <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/demo"
              onClick={() => posthog.capture("hero_cta_clicked", { button: "watch_charlotte_live" })}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              <Play className="h-4 w-4" /> Watch Charlotte live
            </Link>
            <Link
              href="/demo"
              onClick={() => posthog.capture("hero_cta_clicked", { button: "try_the_demo_now" })}
              className="inline-flex items-center gap-2 rounded-xl bg-[#10b981] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] transition hover:bg-emerald-500"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <Phone className="h-4 w-4" /> Try the demo now
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="mt-14 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4"
          >
            <div>
              <div className="text-2xl font-bold text-[#f8fafc]">&lt; 1s</div>
              <p className="mt-1 text-xs text-[#94a3b8]">Answer time</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f8fafc]"><CountUp target={24} suffix="/7" /></div>
              <p className="mt-1 text-xs text-[#94a3b8]">Availability</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f8fafc]"><CountUp target={10} suffix="+" /></div>
              <p className="mt-1 text-xs text-[#94a3b8]">Industry verticals</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f8fafc]"><CountUp target={100} suffix="%" /></div>
              <p className="mt-1 text-xs text-[#94a3b8]">Australian built</p>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.7 }}>
          <PhoneMockup />
        </motion.div>
      </div>

      <style>{`
        @keyframes zynco-grid-move {
          from { background-position: 0 0, 0 0; }
          to { background-position: 48px 48px, 48px 48px; }
        }
      `}</style>
    </section>
  );
}
