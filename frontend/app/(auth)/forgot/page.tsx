"use client";

import { API_BASE as apiUrl } from "@/lib/api";
import * as React from "react";
import Link from "next/link";

type Stage = "idle" | "submitting" | "sent" | "error";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ForgotPage() {
  const [email, setEmail] = React.useState("");
  const [stage, setStage] = React.useState<Stage>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState<number>(0);

  // simple client cooldown to avoid spam clicks
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const value = email.trim();
    if (!value) return setError("Please enter your email.");
    if (!isValidEmail(value)) return setError("Please enter a valid email address.");
    if (cooldown > 0) return;

    setStage("submitting");

    try {
      // ✅ Production: always respond with success UI to avoid account enumeration
      // /api/auth/... not /auth/... — api.zyncoai.com has a dead legacy
      // nginx block (`location ^~ /auth/`, upstream port 7600, nothing
      // listens there anymore) that 502s bare /auth/* paths before they
      // reach the real backend. See verify-email/page.tsx for the same fix.
      const res = await fetch(`${apiUrl}/api/auth/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // include if you use cookies/session
        credentials: "include",
        body: JSON.stringify({ email: value }),
      });

      // If server returns an error, show generic message (still safe)
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        // keep it generic for security, but still helpful
        throw new Error(msg || "We couldn't process that request. Please try again.");
      }

      setStage("sent");
      setCooldown(20); // 20s cooldown for repeated requests
    } catch (err: any) {
      setStage("error");
      setError(err?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] text-[#0f172a]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden opacity-40"
        style={{ backgroundImage: "radial-gradient(#6366f108 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      {/* Content */}
      <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-16 pt-14 lg:grid-cols-2 lg:items-center">
        {/* Left: Copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-3 py-1 text-xs text-[#475569] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Account recovery • Email reset
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl text-[#0f172a]">
            Reset your password
            <span className="block bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] bg-clip-text text-transparent">
              without losing access.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-[#475569]">
            Enter the email associated with your ZyncoAI workspace. If it matches an account,
            we’ll send a secure password reset link. For privacy, we don’t reveal whether an
            email exists.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#475569]">
            <div className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 shadow-sm">
              ✅ SOC2-style UX patterns
            </div>
            <div className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 shadow-sm">
              ✅ Anti-enumeration messaging
            </div>
            <div className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 shadow-sm">
              ✅ Rate-limit friendly
            </div>
          </div>

          <div className="mt-8 text-sm text-[#94a3b8]">
            Having trouble?{" "}
            <Link href="/security" className="text-[#6366f1] hover:text-[#4f46e5] underline underline-offset-4">
              Review account security
            </Link>
            .
          </div>
        </div>

        {/* Right: Form card */}
        <div className="lg:justify-self-end">
          <div className="w-full max-w-md rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-[#0f172a]">Password reset</div>
                <div className="mt-1 text-sm text-[#475569]">
                  We’ll email you a reset link.
                </div>
              </div>
              <div className="rounded-xl bg-[#eef2ff] px-3 py-2 text-xs text-[#4f46e5] ring-1 ring-[#c7d2fe]">
                Production
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-[#475569]">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none ring-0 focus:border-[#6366f1]/50 focus:ring-4 focus:ring-[#6366f1]/10"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {stage === "sent" && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  If that email matches an account, we’ve sent a reset link. Please check your inbox
                  (and spam folder).
                </div>
              )}

              <button
                type="submit"
                disabled={stage === "submitting" || cooldown > 0}
                className="group relative w-full overflow-hidden rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:opacity-90 disabled:opacity-60"
              >
                <span className="relative z-10">
                  {stage === "submitting"
                    ? "Sending reset link…"
                    : cooldown > 0
                      ? `Try again in ${cooldown}s`
                      : "Send reset link"}
                </span>
              </button>

              <div className="flex items-center justify-between text-sm">
                <Link href="/login" className="text-[#475569] hover:text-[#0f172a] underline underline-offset-4">
                  Back to login
                </Link>
                <Link href="/signup" className="text-[#475569] hover:text-[#0f172a] underline underline-offset-4">
                  Create account
                </Link>
              </div>

              <div className="pt-4 text-xs text-[#94a3b8]">
                By continuing, you agree to our{" "}
                <Link href="/security" className="text-[#6366f1] hover:text-[#4f46e5] underline underline-offset-4">
                  security policies
                </Link>{" "}
                and safe access practices.
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
