import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { REAL_DIFFERENTIATORS } from "@/components/marketing/receptionist/data";

export const metadata: Metadata = {
  title: "About | ZyncoAI",
  description: "ZyncoAI builds Ella, an AI receptionist for Australian practices — answering every call, booking every appointment, 24/7.",
  alternates: { canonical: "/about", languages: { "en-AU": "/about", en: "/about" } },
};

// "Answer time: < 1 second" removed 2026-08-13 — no real measured data
// exists to back it (see SolutionTemplate.tsx's audit comment).
const STATS = [
  { label: "Hold music", value: "None" },
  { label: "Availability", value: "24/7/365" },
  { label: "Industry verticals", value: "10+" },
  { label: "Built in", value: "Newcastle, AU" },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f8fafc] pt-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-xs font-medium text-[#475569] shadow-sm">
          <Sparkles className="h-3 w-3" /> About ZyncoAI
        </span>
        <h1 className="mt-5 text-3xl font-bold text-[#0f172a] sm:text-4xl">We built the receptionist Australian practices couldn&apos;t hire</h1>
        <p className="mt-4 text-lg leading-relaxed text-[#475569]">
          ZyncoAI started with a simple observation: every missed call at a medical clinic, dental practice, or local business is a patient or customer
          who just went to a competitor. Ella, our AI receptionist, answers every call instantly, books real appointments, and never takes a sick
          day — so your team can focus on the people already in front of them.
        </p>
      </section>

      <section className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-6 pb-16 sm:grid-cols-4 lg:px-8">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#e2e8f0] bg-white p-5 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <p className="text-xl font-bold text-[#0f172a]">{s.value}</p>
            <p className="mt-1 text-xs text-[#94a3b8]">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <ShieldCheck className="h-6 w-6 text-[#6366f1]" />
            <h2 className="mt-4 text-lg font-semibold text-[#0f172a]">Built for how Australian practices actually run</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
              Ella understands Medicare, private health, DVA, and WorkCover questions, connects to the practice software you already use, and knows
              when a symptom needs a human straight away. This isn&apos;t a generic chatbot wearing a phone number — it&apos;s built specifically for
              medical, dental, legal, and trade businesses.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <MapPin className="h-6 w-6 text-[#6366f1]" />
            <h2 className="mt-4 text-lg font-semibold text-[#0f172a]">Australian, end to end</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
              ZyncoAI is built and supported out of Newcastle, NSW. Ella speaks with a natural Australian voice, understands local context, and the
              team behind her is a phone call or email away — not an offshore support queue.
            </p>
          </div>
        </div>
      </section>

      {/* Founder's note — real story, first person, as given by the
          founder. Initials avatar, not a fabricated photo (no real
          headshot asset exists). */}
      <section className="mx-auto max-w-2xl px-6 pb-16 lg:px-8">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] text-lg font-bold text-white">
              SS
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0f172a]">Shah Md Ahsan Habib Shakil</h2>
              <p className="text-sm text-[#94a3b8]">Founder &amp; CEO, ZyncoAI</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#475569]">
            <p>I built ZyncoAI because I saw a problem nobody was solving.</p>
            <p>
              Every day, thousands of Australian small businesses — fish and chip shops, dental clinics, mechanics, salons — were losing customers
              simply because nobody picked up the phone.
            </p>
            <p>
              A missed call is a missed customer. A missed customer is lost revenue. And for a small business owner already working 12-hour days,
              hiring a full-time receptionist is simply not an option.
            </p>
            <p>So I built Ella.</p>
            <p>
              While completing my Master of Information Technology and Systems at Victoria Institute of Technology in Sydney, I became obsessed with
              one question: what if every small business in Australia could have a world-class receptionist — without the world-class cost?
            </p>
            <p>That obsession became ZyncoAI.</p>
            <p>
              Built from Newcastle, NSW, ZyncoAI is purpose-built for Australian businesses. Ella speaks with a natural Australian accent, understands
              Australian culture, and is fully compliant with Australian privacy laws.
            </p>
            <p>
              I believe every Australian business — no matter how small — deserves to sound professional, never miss a customer, and compete with
              the big players.
            </p>
            <p>From a single student with a vision to a platform I&apos;m building one Australian business at a time — we are just getting started.</p>
          </div>

          <div className="mt-6 border-t border-[#e2e8f0] pt-5 text-xs leading-relaxed text-[#94a3b8]">
            <p className="font-semibold text-[#475569]">Shah Md Ahsan Habib Shakil</p>
            <p>Founder &amp; CEO, ZyncoAI</p>
            <p>Master of Information Technology and Systems — Victoria Institute of Technology, Sydney</p>
            <p>Newcastle, NSW, Australia · 2026</p>
          </div>
        </div>
      </section>

      {/* 2026-08-10 — replaced a fabricated "What clients say" testimonial
          block (invented names, ratings, and quotes — ZyncoAI has no live
          customers to quote yet) with real, verifiable differentiators.
          Same REAL_DIFFERENTIATORS source used on every solution page. */}
      <section className="mx-auto max-w-4xl px-6 pb-16 lg:px-8">
        <h2 className="text-center text-xl font-bold text-[#0f172a]">Built early, built honestly</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {REAL_DIFFERENTIATORS.map((d) => (
            <div key={d.title} className="flex items-start gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#10b981]" />
              <div>
                <p className="text-sm font-semibold text-[#0f172a]">{d.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#475569]">{d.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-16 text-center lg:px-8">
        <p className="text-xs text-[#94a3b8]">ZyncoAI · ABN 38 138 129 187 · Newcastle, NSW, Australia</p>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-20 text-center lg:px-8">
        <div className="rounded-3xl border border-[#e2e8f0] bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-bold text-[#0f172a]">Want to see Ella in action?</h2>
          <p className="mt-2 text-sm text-[#475569]">Call the real number, or start a 7-day free trial for your own practice.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-xl bg-[#10b981] px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600">
              <Phone className="h-4 w-4" /> Try the live demo
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
