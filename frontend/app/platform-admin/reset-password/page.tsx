"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, KeyRound } from "lucide-react";
import { API_BASE as apiUrl } from "@/lib/api";
import { PasswordHints, allPasswordRulesPass } from "@/components/auth/PasswordHints";

type Stage = "idle" | "submitting" | "done" | "invalid_token";

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<Stage>(token ? "idle" : "invalid_token");
  const [error, setError] = useState<string | null>(null);
  const rulesPass = allPasswordRulesPass(password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rulesPass) return;
    setStage("submitting");
    setError(null);
    try {
      const r = await fetch(`${apiUrl}/api/admin-auth/reset-password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        if (data.error === "invalid_or_expired_token") {
          setStage("invalid_token");
        } else {
          setStage("idle");
          setError(data.details?.fieldErrors?.password?.[0] || data.message || "Could not reset password. Please try again.");
        }
        return;
      }
      setStage("done");
    } catch {
      setStage("idle");
      setError("Something went wrong. Please try again.");
    }
  }

  const shell = (children: React.ReactNode) => (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-indigo-400" />
          <h1 className="text-xl font-semibold text-white">ZyncoAI Platform Admin</h1>
          <p className="mt-1 text-sm text-white/40">Reset your admin password</p>
        </div>
        {children}
      </div>
    </div>
  );

  if (stage === "invalid_token") {
    return shell(
      <div className="rounded-2xl border border-white/10 bg-white p-8 text-center shadow-xl">
        <h2 className="text-lg font-semibold text-[#0f172a]">This link is invalid or has expired</h2>
        <p className="mt-2 text-sm text-[#475569]">Reset links expire after 1 hour and can only be used once. Request a new one to keep going.</p>
        <Link
          href="/platform-admin/forgot"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (stage === "done") {
    return shell(
      <div className="rounded-2xl border border-white/10 bg-white p-8 text-center shadow-xl">
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-600" />
        <h2 className="text-lg font-semibold text-[#0f172a]">Password updated</h2>
        <p className="mt-2 text-sm text-[#475569]">
          You&apos;ve been logged out of every admin session as a precaution — including this one, if it was active. Any TOTP set up on
          this account is unchanged. Log back in with your new password.
        </p>
        <Link
          href="/platform-admin/login"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return shell(
    <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white p-8 shadow-xl">
      <div className="mb-4 flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-indigo-500" />
        <h2 className="text-base font-semibold text-[#0f172a]">Choose a new password</h2>
      </div>
      <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#0f172a]">
        New password
      </label>
      <input
        id="password"
        type="password"
        required
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm text-[#0f172a] focus:border-indigo-500 focus:outline-none"
        placeholder="••••••••••••"
      />
      <PasswordHints password={password} />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!rulesPass || stage === "submitting"}
        className="mt-5 w-full rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {stage === "submitting" ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}

export default function PlatformAdminResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}
