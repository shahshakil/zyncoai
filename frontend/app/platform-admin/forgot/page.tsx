"use client";

import { API_BASE as apiUrl } from "@/lib/api";
import * as React from "react";
import Link from "next/link";
import { ShieldCheck, MailCheck } from "lucide-react";

type Stage = "idle" | "submitting" | "sent" | "error";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function PlatformAdminForgotPage() {
  const [email, setEmail] = React.useState("");
  const [stage, setStage] = React.useState<Stage>("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const value = email.trim();
    if (!value) return setError("Please enter your email.");
    if (!isValidEmail(value)) return setError("Please enter a valid email address.");

    setStage("submitting");
    try {
      // Same neutral-response contract as /api/admin-auth/forgot — no
      // enumeration signal in the response either way, mirrors the
      // consumer (auth)/forgot page's own approach.
      const res = await fetch(`${apiUrl}/api/admin-auth/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      // 2026-08-05 bug fix — this used to not check the response at all,
      // so a rate-limit hit (or any other failure) silently rendered the
      // same "sent" success screen with nothing actually sent. Rate-limit
      // messaging doesn't leak account existence — fine to be specific.
      const data = await res.json().catch(() => null);
      if (res.status === 429) {
        const seconds = Number(data?.retryAfterSeconds) || 3600;
        const minutes = Math.max(1, Math.ceil(seconds / 60));
        throw new Error(`Too many requests — try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`);
      }
      if (!res.ok) {
        throw new Error(data?.message || "We couldn't process that request. Please try again.");
      }

      setStage("sent");
    } catch (err: any) {
      setStage("error");
      setError(err?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-indigo-400" />
          <h1 className="text-xl font-semibold text-white">ZyncoAI Platform Admin</h1>
          <p className="mt-1 text-sm text-white/40">Reset your admin password</p>
        </div>

        {stage === "sent" ? (
          <div className="rounded-2xl border border-white/10 bg-white p-8 text-center shadow-xl">
            <MailCheck className="mx-auto mb-4 h-10 w-10 text-emerald-600" />
            <h2 className="text-lg font-semibold text-[#0f172a]">Check your email</h2>
            <p className="mt-2 text-sm text-[#475569]">
              If an account exists for that email, we&apos;ve sent a reset link. It expires in 1 hour and can only be used once.
            </p>
            <Link
              href="/platform-admin/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/70">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-indigo-400 focus:outline-none"
                placeholder="you@zyncoai.com"
              />
              {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={stage === "submitting"}
              className="w-full rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
            >
              {stage === "submitting" ? "Sending…" : "Send reset link"}
            </button>
            <Link href="/platform-admin/login" className="block text-center text-xs text-white/40 hover:text-white/60">
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
