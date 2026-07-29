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
    <main className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] text-[#0f172a]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden opacity-40"
        style={{ backgroundImage: "radial-gradient(#6366f108 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      <section className="relative mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          {stage === "verifying" && (
            <>
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-[#6366f1]" />
              <h1 className="text-xl font-semibold">Verifying your email…</h1>
              <p className="mt-2 text-sm text-[#475569]">This will only take a moment.</p>
            </>
          )}

          {stage === "success" && (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl">✅</div>
              <h1 className="text-xl font-semibold">Email verified!</h1>
              <p className="mt-2 text-sm text-[#475569]">You can now log in. Redirecting you to sign in…</p>
              <Link
                href="/login?verified=1"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:opacity-90"
              >
                Go to login
              </Link>
            </>
          )}

          {stage === "error" && (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-2xl">⚠️</div>
              <h1 className="text-xl font-semibold">Verification failed</h1>
              <p className="mt-2 text-sm text-rose-600">{errorMessage}</p>

              <button
                onClick={resend}
                disabled={resendStage !== "idle"}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:opacity-90 disabled:opacity-60"
              >
                {resendStage === "sending" ? "Sending…" : resendStage === "sent" ? "New link sent — check your email" : "Resend verification email"}
              </button>

              <div className="mt-4 text-sm">
                <Link href="/login" className="text-[#475569] underline underline-offset-4 hover:text-[#0f172a]">
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
