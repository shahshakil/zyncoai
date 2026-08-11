"use client";
import { Phone, PlayCircle } from "lucide-react";
import { trackConversion } from "@/components/seo/GoogleAnalytics";
import { DEMO_NUMBER } from "./LiveDemoSection";

// 2026-08-11 — health-gated. Callers pass `healthy` from a server-side
// getVoiceHealth() check (real Twilio account status, not just "is the env
// var set") so this component itself stays a plain prop-driven client
// component with no fetch of its own — every parent that renders it
// fetches once and passes the result down, same pattern as
// getLegalEntity()/formatLegalParty() elsewhere on this site. When voice is
// down, this never renders a tel: link at all — no dead number, ever.
export function CallEllaButton({ healthy }: { healthy: boolean }) {
  if (!healthy) {
    return (
      <a
        href="#live-demo-audio"
        className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-8 py-5 text-xl font-bold text-[#0f172a] shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:border-[#6366f1]/40 hover:shadow-[0_4px_16px_rgba(99,102,241,0.15)]"
      >
        <PlayCircle className="h-6 w-6 text-[#6366f1]" /> Hear a real call below — live demo line returning shortly
      </a>
    );
  }

  return (
    <a
      href={`tel:${DEMO_NUMBER.replace(/\s/g, "")}`}
      onClick={() => trackConversion("demo_request", { channel: "phone_call" })}
      className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#10b981] to-emerald-600 px-8 py-5 text-xl font-bold text-white shadow-[0_0_40px_rgba(16,185,129,0.25)] transition hover:opacity-90"
    >
      <Phone className="h-6 w-6" /> Call Ella now: {DEMO_NUMBER}
    </a>
  );
}
