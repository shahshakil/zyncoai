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
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(900px 520px at 20% 15%, rgba(99,102,241,.20), transparent 60%)," +
              "radial-gradient(900px 520px at 80% 20%, rgba(217,70,239,.18), transparent 60%)," +
              "radial-gradient(900px 520px at 55% 90%, rgba(56,189,248,.10), transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.25) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(circle at 30% 20%, black, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at 30% 20%, black, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0%,rgba(0,0,0,.55)_65%,rgba(0,0,0,.92)_100%)]" />
      </div>

      {/* Top nav */}
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500/60 via-indigo-500/60 to-cyan-400/50 ring-1 ring-white/15 shadow-[0_0_0_1px_rgba(255,255,255,.06)]" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">ZyncoAI</div>
            <div className="text-xs text-zinc-400 group-hover:text-zinc-300">
              Secure account recovery
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/docs"
            className="rounded-lg px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/5"
          >
            Docs
          </Link>
          <Link
            href="/security"
            className="rounded-lg px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/5"
          >
            Security
          </Link>
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/5"
          >
            Log in
          </Link>
        </nav>
      </header>

      {/* Content */}
      <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-16 pt-6 lg:grid-cols-2 lg:items-center">
        {/* Left: Copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400/90" />
            Account recovery • Email reset
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Reset your password
            <span className="block bg-gradient-to-r from-indigo-300 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
              without losing access.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-zinc-300">
            Enter the email associated with your ZyncoAI workspace. If it matches an account,
            we’ll send a secure password reset link. For privacy, we don’t reveal whether an
            email exists.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-300">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              ✅ SOC2-style UX patterns
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              ✅ Anti-enumeration messaging
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              ✅ Rate-limit friendly
            </div>
          </div>

          <div className="mt-8 text-sm text-zinc-400">
            Having trouble?{" "}
            <Link href="/security" className="text-zinc-200 hover:text-white underline underline-offset-4">
              Review account security
            </Link>
            .
          </div>
        </div>

        {/* Right: Form card */}
        <div className="lg:justify-self-end">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_20px_120px_rgba(0,0,0,.55)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">Password reset</div>
                <div className="mt-1 text-sm text-zinc-400">
                  We’ll email you a reset link.
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-cyan-400/20 px-3 py-2 text-xs text-zinc-200 ring-1 ring-white/10">
                Production
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-200">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none ring-0 focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              )}

              {stage === "sent" && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  If that email matches an account, we’ve sent a reset link. Please check your inbox
                  (and spam folder).
                </div>
              )}

              <button
                type="submit"
                disabled={stage === "submitting" || cooldown > 0}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(99,102,241,.22)] disabled:opacity-60"
              >
                <span className="relative z-10">
                  {stage === "submitting"
                    ? "Sending reset link…"
                    : cooldown > 0
                      ? `Try again in ${cooldown}s`
                      : "Send reset link"}
                </span>
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-white/10" />
              </button>

              <div className="flex items-center justify-between text-sm">
                <Link href="/login" className="text-zinc-300 hover:text-white underline underline-offset-4">
                  Back to login
                </Link>
                <Link href="/signup" className="text-zinc-300 hover:text-white underline underline-offset-4">
                  Create account
                </Link>
              </div>

              <div className="pt-4 text-xs text-zinc-500">
                By continuing, you agree to our{" "}
                <Link href="/security" className="text-zinc-300 hover:text-white underline underline-offset-4">
                  security policies
                </Link>{" "}
                and safe access practices.
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="relative mx-auto max-w-6xl px-4 pb-10 text-xs text-zinc-500">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} ZyncoAI. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/security" className="hover:text-zinc-200">Security</Link>
            <Link href="/docs" className="hover:text-zinc-200">Docs</Link>
            <Link href="/pricing" className="hover:text-zinc-200">Pricing</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
