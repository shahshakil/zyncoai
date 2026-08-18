"use client";
import { useRef, useState } from "react";
import { Loader2, CheckCircle2, Send, Paperclip, X } from "lucide-react";
import { API_BASE } from "@/lib/marketing-api";

const TOPICS = ["Sales", "Support", "Billing", "Other"] as const;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

type Status = "idle" | "sending" | "sent" | "error" | "rate_limited" | "attachment_error";

export function ContactForm({ source = "contact_form", onSent }: { source?: "contact_form" | "widget" | "support_hub"; onSent?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("Support");
  const [message, setMessage] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — real visitors never see this
  const [attachment, setAttachment] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
      setStatus("attachment_error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setStatus("attachment_error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setAttachment(file);
    setStatus("idle");
  }

  function removeAttachment() {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setStatus("sending");
    try {
      const form = new FormData();
      form.set("name", name.trim());
      form.set("email", email.trim());
      form.set("topic", topic);
      form.set("message", message.trim());
      form.set("source", source);
      if (referenceLink.trim()) form.set("referenceLink", referenceLink.trim());
      if (website) form.set("website", website);
      if (attachment) form.set("attachment", attachment);

      const res = await fetch(`${API_BASE}/support/messages`, { method: "POST", body: form });
      if (res.status === 429) {
        setStatus("rate_limited");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setReference(data?.reference || null);
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
          {reference && <p className="mt-1 text-sm text-emerald-700">Your reference: <span className="font-semibold">{reference}</span> — keep it for your records.</p>}
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

      <div>
        <label className="block text-sm font-semibold text-[#0f172a]">Link or reference (e.g. a call ID or booking) — optional</label>
        <input
          value={referenceLink}
          onChange={(e) => setReferenceLink(e.target.value)}
          maxLength={300}
          placeholder="Helps us investigate faster"
          className="mt-1.5 w-full min-h-[44px] rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0f172a]">Attach a screenshot (optional)</label>
        {attachment ? (
          <div className="mt-1.5 flex items-center justify-between gap-2 rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a]">
            <span className="flex min-w-0 items-center gap-2">
              <Paperclip className="h-4 w-4 shrink-0 text-[#94a3b8]" />
              <span className="truncate">{attachment.name}</span>
            </span>
            <button type="button" onClick={removeAttachment} aria-label="Remove attachment" className="shrink-0 rounded-lg p-1 text-[#94a3b8] hover:bg-[#f8fafc] hover:text-[#0f172a]">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="mt-1.5 flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#e2e8f0] px-4 py-2.5 text-sm text-[#475569] transition hover:border-[#c7d2fe] hover:bg-[#f8fafc]">
            <Paperclip className="h-4 w-4 text-[#94a3b8]" />
            Choose an image (PNG, JPEG, or WebP, up to 5MB)
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onFileChange} className="sr-only" />
          </label>
        )}
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
      {status === "attachment_error" && <p className="text-sm font-medium text-red-600">That file isn&apos;t a supported image (PNG/JPEG/WebP) or is over 5MB — try a different screenshot, or send the message without one.</p>}

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
