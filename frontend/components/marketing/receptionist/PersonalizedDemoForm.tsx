"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";
import {
  Stethoscope, Smile, Wrench, UtensilsCrossed, Scale, Landmark, GraduationCap,
  Sparkles, ShoppingBag, Home, Phone, Loader2, Mail, CheckCircle2, ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { DemoPlayer, type DemoTranscript } from "./DemoPlayer";
import { API_BASE } from "@/lib/marketing-api";

// Same 11-vertical enum as backend/src/lib/verticalOps.ts's PortalVertical —
// labels match onboardingVerticalConfig.ts exactly so a visitor sees the
// same vertical names used everywhere else on the site (onboarding, pricing).
const VERTICALS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "MEDICAL", label: "Medical Clinic", icon: Stethoscope },
  { key: "DENTAL", label: "Dental Practice", icon: Smile },
  { key: "MECHANIC", label: "Auto Repair Shop", icon: Wrench },
  { key: "RESTAURANT", label: "Restaurant", icon: UtensilsCrossed },
  { key: "LAW", label: "Law Firm", icon: Scale },
  { key: "BANK", label: "Bank / Financial", icon: Landmark },
  { key: "UNIVERSITY", label: "University / Education", icon: GraduationCap },
  { key: "SALON", label: "Salon / Spa", icon: Sparkles },
  { key: "RETAIL", label: "Retail Store", icon: ShoppingBag },
  { key: "REAL_ESTATE", label: "Real Estate", icon: Home },
  { key: "OTHER", label: "Other", icon: Phone },
];

const GENERATING_MESSAGES = [
  "Ella is learning your business…",
  "Writing a booking flow for you…",
  "Recording in her real production voice…",
  "Almost ready…",
];

type GenerateResult = {
  id: string;
  audioUrl: string;
  transcript: DemoTranscript;
  cached: boolean;
};

type Phase = "form" | "generating" | "result" | "busy" | "error";

export function PersonalizedDemoForm() {
  const [phase, setPhase] = useState<Phase>("form");
  const [businessName, setBusinessName] = useState("");
  const [vertical, setVertical] = useState<string | null>(null);
  const [service, setService] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [busyMessage, setBusyMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [leadEmail, setLeadEmail] = useState("");
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadState, setLeadState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);
    if (!businessName.trim()) return setFieldError("Enter your business name.");
    if (!vertical) return setFieldError("Choose your industry.");

    setPhase("generating");
    const messageTimer = setInterval(() => setMessageIndex((i) => Math.min(i + 1, GENERATING_MESSAGES.length - 1)), 4000);
    posthog.capture("personalized_demo_requested", { vertical });

    try {
      const res = await fetch(`${API_BASE}/demo/personalized/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: businessName.trim(), vertical, service: service.trim() || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data?.error === "rate_limited_ip" || data?.error === "rate_limited_global") {
          setBusyMessage(data.message || "Our demo studio is busy right now — hear the standard demo below instead.");
          setPhase("busy");
        } else {
          setErrorMessage(data?.error || "Enter a valid business name.");
          setPhase("error");
        }
        return;
      }

      setResult({ id: data.id, audioUrl: `${API_BASE}${data.audioUrl}`, transcript: data.transcript, cached: data.cached });
      posthog.capture("personalized_demo_generated", { vertical, cached: data.cached });
      setPhase("result");
    } catch {
      setErrorMessage("We couldn't reach the demo studio — hear the standard demo below instead.");
      setPhase("error");
    } finally {
      clearInterval(messageTimer);
    }
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!result || !leadEmail.trim() || !leadConsent) return;
    setLeadState("sending");
    try {
      const res = await fetch(`${API_BASE}/demo/personalized/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoId: result.id, email: leadEmail.trim() }),
      });
      setLeadState(res.ok ? "sent" : "error");
      if (res.ok) posthog.capture("personalized_demo_lead", { vertical });
    } catch {
      setLeadState("error");
    }
  }

  function reset() {
    setPhase("form");
    setResult(null);
    setLeadState("idle");
    setLeadEmail("");
    setLeadConsent(false);
    setMessageIndex(0);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AnimatePresence mode="wait">
        {phase === "form" && (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:p-8"
          >
            <label className="block text-sm font-semibold text-[#0f172a]">Your business name</label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              maxLength={40}
              placeholder="e.g. Riverside Dental"
              className="mt-2 w-full min-h-[44px] rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
            />

            <label className="mt-6 block text-sm font-semibold text-[#0f172a]">Your industry</label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {VERTICALS.map(({ key, label, icon: Icon }) => {
                const active = vertical === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setVertical(key)}
                    className={`flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                      active ? "border-[#6366f1] bg-[#eef2ff] text-[#4338ca]" : "border-[#e2e8f0] text-[#475569] hover:border-[#c7d2fe]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#6366f1]" : "text-[#94a3b8]"}`} />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>

            <label className="mt-6 block text-sm font-semibold text-[#0f172a]">
              A service you offer <span className="font-normal text-[#475569]">(optional)</span>
            </label>
            <input
              value={service}
              onChange={(e) => setService(e.target.value)}
              maxLength={40}
              placeholder="e.g. teeth whitening"
              className="mt-2 w-full min-h-[44px] rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
            />

            {fieldError && <p className="mt-3 text-sm font-medium text-red-600">{fieldError}</p>}

            <button
              type="submit"
              className="mt-6 flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Hear Ella answer for {businessName.trim() || "my business"} <ArrowRight className="h-4 w-4" />
            </button>
          </motion.form>
        )}

        {phase === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center rounded-3xl border border-[#e2e8f0] bg-white p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          >
            <Loader2 className="h-8 w-8 animate-spin text-[#6366f1]" />
            <p className="mt-4 text-sm font-medium text-[#475569]">{GENERATING_MESSAGES[messageIndex]}</p>
          </motion.div>
        )}

        {phase === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DemoPlayer
              audioSrc={result.audioUrl}
              transcript={result.transcript}
              idleTeaseText={`${Math.round(result.transcript.totalDuration)} seconds. Hear Ella answer for ${businessName.trim()}.`}
              bookingLineMatch={(text) => text.startsWith("Perfect, you're all set")}
              bookingLabel={`Tomorrow — New booking for ${businessName.trim()}`}
              onPlayError={(reason) => posthog.capture("personalized_demo_play_error", { vertical, reason })}
            />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button type="button" onClick={reset} className="text-sm font-semibold text-[#4f46e5] hover:text-[#4338ca]">
                Try a different business
              </button>
              <a href="#live-demo-audio" className="text-sm font-semibold text-[#475569] hover:text-[#0f172a]">
                Hear the standard demo instead
              </a>
            </div>

            <div className="mx-auto mt-6 max-w-md rounded-2xl border border-[#e2e8f0] bg-white p-5">
              {leadState === "sent" ? (
                <p className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Sent — check your inbox.
                </p>
              ) : (
                <form onSubmit={handleLeadSubmit}>
                  <p className="text-sm font-semibold text-[#0f172a]">Email me this recording</p>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="you@business.com"
                      className="min-h-[44px] flex-1 rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                    />
                    <button
                      type="submit"
                      disabled={!leadConsent || leadState === "sending"}
                      className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#0f172a] px-4 text-sm font-semibold text-white transition disabled:opacity-40"
                    >
                      {leadState === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />} Send
                    </button>
                  </div>
                  <label className="mt-3 flex items-start gap-2 text-xs text-[#64748b]">
                    <input type="checkbox" checked={leadConsent} onChange={(e) => setLeadConsent(e.target.checked)} className="mt-0.5" />
                    You can email me this one recording. We don&apos;t send marketing email without consent (Spam Act 2003 (Cth)) — this is a one-off transactional send, not a subscription.
                  </label>
                  {leadState === "error" && <p className="mt-2 text-xs font-medium text-red-600">Couldn&apos;t send that — try again.</p>}
                </form>
              )}
            </div>
          </motion.div>
        )}

        {(phase === "busy" || phase === "error") && (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-[#e2e8f0] bg-white p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          >
            <p className="text-sm font-medium text-[#475569]">{phase === "busy" ? busyMessage : errorMessage}</p>
            <div className="mt-4 flex justify-center gap-4">
              <button type="button" onClick={reset} className="text-sm font-semibold text-[#4f46e5] hover:text-[#4338ca]">
                Try again
              </button>
              <a href="#live-demo-audio" className="text-sm font-semibold text-[#475569] hover:text-[#0f172a]">
                Hear the standard demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
