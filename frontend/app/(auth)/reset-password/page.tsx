"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_BASE as apiUrl } from "@/lib/api";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label } from "@/components/dashboard/ui/input";
import { PasswordHints, allPasswordRulesPass } from "@/components/auth/PasswordHints";
import { CheckCircle2, KeyRound } from "lucide-react";

type Stage = "idle" | "submitting" | "done" | "invalid_token";

function ResetPasswordForm() {
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
      const r = await fetch(`${apiUrl}/api/auth/reset-password`, {
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

  if (stage === "invalid_token") {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-8 text-center">
        <h1 className="text-lg font-semibold text-[#0f172a]">This link is invalid or has expired</h1>
        <p className="mt-2 text-sm text-[#475569]">
          Reset links expire after 1 hour and can only be used once. Request a new one to keep going.
        </p>
        <Link
          href="/forgot"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-600" />
        <h1 className="text-lg font-semibold text-[#0f172a]">Password updated</h1>
        <p className="mt-2 text-sm text-[#475569]">
          You&apos;ve been logged out of all devices as a precaution. Log back in with your new password.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)]">
          <KeyRound className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-[#0f172a]">Set a new password</h1>
        <p className="mt-1 text-sm text-[#94a3b8]">Choose a strong password for your ZyncoAI account</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={12}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 12 characters"
          />
          <PasswordHints password={password} />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={stage === "submitting" || !rulesPass}>
          {stage === "submitting" ? "Updating…" : "Update password"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#94a3b8]">
        <Link href="/login" className="text-[#4f46e5] hover:text-[#4338ca]">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f8fafc] px-4">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
