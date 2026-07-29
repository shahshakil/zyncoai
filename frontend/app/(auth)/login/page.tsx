"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label } from "@/components/dashboard/ui/input";
import { redirectAfterAuth } from "@/lib/postAuthRedirect";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (params.get("verified") === "1") toast.success("Email verified — you can now sign in.");
    if (params.get("reason") === "inactivity") toast.error("You were logged out for security. Please log in again.");
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        if (data.error === "email_not_verified") {
          setNeedsVerification(true);
          toast.error("Please verify your email before logging in — check your inbox for the link, or resend it below.");
        } else if (data.error === "account_locked") {
          setNeedsVerification(false);
          toast.error("Account temporarily locked. Try again in 15 minutes.");
        } else {
          setNeedsVerification(false);
          toast.error(data.message || "Invalid email or password");
        }
        setLoading(false);
        return;
      }
      setNeedsVerification(false);

      const next = params.get("next");

      if (data.mfaRequired || data.mfaSetupRequired) {
        // Tab-scoped, short-lived — cleared by the MFA page once used. Never
        // put a bearer token in a URL (referrer/history/log exposure).
        sessionStorage.setItem("zyn_mfa_pending_token", data.mfa_pending_token);
        const dest = data.mfaSetupRequired ? "/setup-mfa" : "/verify-mfa";
        router.push(next ? `${dest}?next=${encodeURIComponent(next)}` : dest);
        return;
      }

      await redirectAfterAuth(router, next);
    } catch {
      toast.error("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  async function resendVerification() {
    if (!email) {
      toast.error("Enter your email above first");
      return;
    }
    setResending(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      toast.success("If that account exists and is unverified, a new link was sent.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)]" />
          <h1 className="text-xl font-semibold text-[#0f172a]">Sign in to ZyncoAI</h1>
          <p className="mt-1 text-sm text-[#94a3b8]">Your AI voice receptionist dashboard</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          {needsVerification && (
            <Button type="button" variant="secondary" className="w-full" onClick={resendVerification} disabled={resending}>
              {resending ? "Sending…" : "Resend verification email"}
            </Button>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-[#94a3b8]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#6366f1] hover:text-[#4f46e5]">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
