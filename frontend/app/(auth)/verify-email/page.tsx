"use client";

import { API_BASE as apiUrl } from "@/lib/api";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Stage = "verifying" | "success" | "error";

function VerifyEmailInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [stage, setStage] = React.useState<Stage>("verifying");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [resendStage, setResendStage] = React.useState<"idle" | "sending" | "sent">("idle");

  React.useEffect(() => {
    if (!token) {
      setStage("error");
      setErrorMessage("This verification link is missing its token. Please use the link from your email exactly as sent.");
      return;
    }

    (async () => {
      try {
        // /api/auth/... not /auth/... — api.zyncoai.com has a legacy
        // `location ^~ /auth/` nginx block (dead: nothing listens on its
        // upstream port 7600 anymore) that intercepts bare /auth/* paths
        // before they reach the real backend, causing a 502. /api/auth/*
        // isn't caught by that block and reaches the actual auth router.
        const res = await fetch(`${apiUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data?.ok) {
          setStage("error");
          setErrorMessage(
            data?.error === "invalid_or_expired_token"
              ? "This verification link is invalid or has expired. Links are valid for 24 hours — request a new one below."
              : "We couldn't verify your email. Please try again or request a new link below."
          );
          return;
        }

        setStage("success");
        const t = setTimeout(() => router.push("/login?verified=1"), 2500);
        return () => clearTimeout(t);
      } catch {
        setStage("error");
        setErrorMessage("We couldn't reach the server. Check your connection and try again.");
      }
    })();
  }, [token, router]);

  async function resend() {
    const email = window.prompt("Enter the email you signed up with to resend the verification link:");
    if (!email) return;
    setResendStage("sending");
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      setResendStage("sent");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0%,rgba(0,0,0,.55)_65%,rgba(0,0,0,.92)_100%)]" />
      </div>

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500/60 via-indigo-500/60 to-cyan-400/50 ring-1 ring-white/15 shadow-[0_0_0_1px_rgba(255,255,255,.06)]" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">ZyncoAI</div>
            <div className="text-xs text-zinc-400 group-hover:text-zinc-300">Email verification</div>
          </div>
        </Link>
      </header>

      <section className="relative mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-[0_20px_120px_rgba(0,0,0,.55)] backdrop-blur-xl">
          {stage === "verifying" && (
            <>
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" />
              <h1 className="text-xl font-semibold">Verifying your email…</h1>
              <p className="mt-2 text-sm text-zinc-400">This will only take a moment.</p>
            </>
          )}

          {stage === "success" && (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-2xl">✅</div>
              <h1 className="text-xl font-semibold">Email verified!</h1>
              <p className="mt-2 text-sm text-zinc-300">You can now log in. Redirecting you to sign in…</p>
              <Link
                href="/login?verified=1"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(99,102,241,.22)]"
              >
                Go to login
              </Link>
            </>
          )}

          {stage === "error" && (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/15 text-2xl">⚠️</div>
              <h1 className="text-xl font-semibold">Verification failed</h1>
              <p className="mt-2 text-sm text-rose-200">{errorMessage}</p>

              <button
                onClick={resend}
                disabled={resendStage !== "idle"}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(99,102,241,.22)] disabled:opacity-60"
              >
                {resendStage === "sending" ? "Sending…" : resendStage === "sent" ? "New link sent — check your email" : "Resend verification email"}
              </button>

              <div className="mt-4 text-sm">
                <Link href="/login" className="text-zinc-300 underline underline-offset-4 hover:text-white">
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={null}>
      <VerifyEmailInner />
    </React.Suspense>
  );
}
