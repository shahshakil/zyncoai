"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Phone, X } from "lucide-react";

const DEMO_NUMBER = "+61 2 5747 4612";

function WatchEllaModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0f172a]/50 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Watch Ella in action"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl border border-[#e2e8f0] bg-white p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.25)]"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#94a3b8] hover:bg-slate-100 hover:text-[#0f172a]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)]">
          <Phone className="h-5 w-5 text-white" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-[#0f172a]">There&apos;s no canned demo video — yet</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
          The fastest way to actually hear Ella is to call her, right now. It&apos;s a real line, and she answers in real time — no recording, no
          script read by us.
        </p>

        <a
          href={`tel:${DEMO_NUMBER.replace(/\s/g, "")}`}
          onClick={() => posthog.capture("hero_modal_call_clicked")}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#10b981] px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-600"
        >
          <Phone className="h-4 w-4" /> Call Ella now: {DEMO_NUMBER}
        </a>
        <Link
          href="/demo"
          onClick={onClose}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#e2e8f0] px-6 py-3 text-sm font-semibold text-[#0f172a] hover:bg-slate-50"
        >
          See a sample conversation <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="relative mx-[calc(50%-50vw)] w-screen overflow-hidden bg-[#f8fafc] pb-16 pt-32">
      {/* dot-pattern background, same motif as the dashboard */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: "radial-gradient(#6366f108 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#6366f1]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[900px] px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#6366f1] shadow-sm"
        >
          One platform, every industry
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-6 text-[42px] font-bold leading-[1.1] tracking-tight text-[#0f172a] [text-wrap:balance] sm:text-5xl lg:text-[64px]"
        >
          One AI Receptionist.{" "}
          <span className="bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] bg-clip-text text-transparent">Every vertical.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#475569]"
        >
          Ella answers every call in under a second, books the appointment, and never takes a day off — tuned for how your industry actually runs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/signup"
            onClick={() => posthog.capture("hero_cta_clicked", { button: "start_free_trial" })}
            className="group inline-flex items-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] transition hover:opacity-90"
          >
            Start Free Trial <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <button
            onClick={() => {
              posthog.capture("hero_cta_clicked", { button: "watch_ella_in_action" });
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-6 py-3.5 text-sm font-semibold text-[#0f172a] transition hover:bg-slate-50"
          >
            <Play className="h-4 w-4" /> Watch Ella in Action
          </button>
        </motion.div>
      </div>

      <AnimatePresence>{showModal && <WatchEllaModal onClose={() => setShowModal(false)} />}</AnimatePresence>
    </section>
  );
}
