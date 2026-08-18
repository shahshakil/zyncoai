"use client";
import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { API_BASE } from "@/lib/marketing-api";

const TOPICS = ["Sales", "Support", "Billing", "Other"] as const;

type Status = "idle" | "sending" | "sent" | "error" | "rate_limited";

export function ContactForm({ source = "contact_form", onSent }: { source?: "contact_form" | "widget"; onSent?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("Support");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — real visitors never see this
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch(`${API_BASE}/support/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), topic, message: message.trim(), source, website: website || undefined }),
      });
      if (res.status === 429) {
        setStatus("rate_limited");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("sent");
      onSent?.();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Message sent</p>
          <p className="mt-1 text-sm text-emerald-700">We&apos;ve got it — a real person will reply to {email} by email.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-[#0f172a]">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
            className="mt-1.5 w-full min-h-[44px] rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0f172a]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={200}
            required
            className="mt-1.5 w-full min-h-[44px] rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0f172a]">Topic</label>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value as (typeof TOPICS)[number])}
          className="mt-1.5 w-full min-h-[44px] rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0f172a]">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={4000}
          required
          rows={5}
          className="mt-1.5 w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
        />
      </div>

      {/* Honeypot — hidden via CSS (not type="hidden"), so a bot that only
          skips hidden inputs still fills it. Real visitors never see or
          reach this field via keyboard or screen reader. */}
      <div className="h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {status === "error" && <p className="text-sm font-medium text-red-600">Something went wrong sending that — try again, or email support@zyncoai.com directly.</p>}
      {status === "rate_limited" && <p className="text-sm font-medium text-red-600">Too many messages sent recently — try again in a bit, or email support@zyncoai.com directly.</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send message
      </button>
    </form>
  );
}
