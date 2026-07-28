import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About | ZyncoAI",
  description: "ZyncoAI builds Charlotte, an AI receptionist for Australian practices — answering every call, booking every appointment, 24/7.",
};

const STATS = [
  { label: "Answer time", value: "< 1 second" },
  { label: "Availability", value: "24/7/365" },
  { label: "Industry verticals", value: "10+" },
  { label: "Built in", value: "Newcastle, AU" },
];

export default function AboutPage() {
  return (
    <div className="bg-[#030712] pt-8">
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#94a3b8]">
          <Sparkles className="h-3 w-3" /> About ZyncoAI
        </span>
        <h1 className="mt-5 text-3xl font-bold text-[#f8fafc] sm:text-4xl">We built the receptionist Australian practices couldn&apos;t hire</h1>
        <p className="mt-4 text-lg leading-relaxed text-[#e2e8f0]">
          ZyncoAI started with a simple observation: every missed call at a medical clinic, dental practice, or local business is a patient or customer
          who just went to a competitor. Charlotte, our AI receptionist, answers every call instantly, books real appointments, and never takes a sick
          day — so your team can focus on the people already in front of them.
        </p>
      </section>

      <section className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-6 pb-16 sm:grid-cols-4 lg:px-8">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-[#0b0f19] p-5 text-center">
            <p className="text-xl font-bold text-[#f8fafc]">{s.value}</p>
            <p className="mt-1 text-xs text-[#94a3b8]">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0b0f19] p-6">
            <ShieldCheck className="h-6 w-6 text-[#8ab4ff]" />
            <h2 className="mt-4 text-lg font-semibold text-[#f8fafc]">Built for how Australian practices actually run</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#cbd5e1]">
              Charlotte understands Medicare, private health, DVA, and WorkCover questions, connects to the practice software you already use, and knows
              when a symptom needs a human straight away. This isn&apos;t a generic chatbot wearing a phone number — it&apos;s built specifically for
              medical, dental, legal, and trade businesses.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0b0f19] p-6">
            <MapPin className="h-6 w-6 text-[#8ab4ff]" />
            <h2 className="mt-4 text-lg font-semibold text-[#f8fafc]">Australian, end to end</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#cbd5e1]">
              ZyncoAI is built and supported out of Newcastle, NSW. Charlotte speaks with a natural Australian voice, understands local context, and the
              team behind her is a phone call or email away — not an offshore support queue.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-20 text-center lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0f19] to-[#030712] p-8">
          <h2 className="text-2xl font-bold text-[#f8fafc]">Want to see Charlotte in action?</h2>
          <p className="mt-2 text-sm text-[#94a3b8]">Call the real number, or start a 7-day free trial for your own practice.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-xl bg-[#10b981] px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500">
              <Phone className="h-4 w-4" /> Try the live demo
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4f87f0] to-[#7c3aed] px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
