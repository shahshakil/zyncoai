"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label } from "@/components/dashboard/ui/input";
import { Mail, AlertTriangle } from "lucide-react";
import { PRICING_PLANS } from "@/components/marketing/receptionist/data";
import { PasswordStrengthMeter, scorePassword } from "@/components/auth/PasswordStrengthMeter";
import { checkPwned } from "@/lib/hibp";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan");
  const plan = PRICING_PLANS.find((p) => p.key === planKey);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(() => searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [pwnedWarning, setPwnedWarning] = useState<string | null>(null);
  const strength = scorePassword(password);

  useEffect(() => {
    if (planKey) sessionStorage.setItem("zynco_selected_plan", planKey);
  }, [planKey]);

  async function onPasswordBlur() {
    if (!password) return;
    try {
      const { pwned, count } = await checkPwned(password);
      setPwnedWarning(pwned ? `This password has appeared in ${count.toLocaleString()} data breaches. Please choose a different password.` : null);
    } catch {
      // Fail open — a third-party API outage must never block signup.
      setPwnedWarning(null);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (strength !== "strong") {
      toast.error("Please choose a stronger password before continuing.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        const fieldError = data.details?.fieldErrors?.password?.[0] || data.details?.fieldErrors?.email?.[0];
        toast.error(fieldError || data.message || "Could not create account");
        setLoading(false);
        return;
      }
      setSent(email);
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f8fafc] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-8 text-center">
          <Mail className="mx-auto mb-4 h-10 w-10 text-[#6366f1]" />
          <h1 className="text-lg font-semibold text-[#0f172a]">Check your inbox</h1>
          <p className="mt-2 text-sm text-[#475569]">
            We sent a verification link to <span className="text-[#0f172a]">{sent}</span>. Verify your email, then sign in to set up your business.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm text-[#6366f1] hover:text-[#4f46e5]">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)]" />
          <h1 className="text-xl font-semibold text-[#0f172a]">Create your ZyncoAI account</h1>
          <p className="mt-1 text-sm text-[#94a3b8]">Set up your AI voice receptionist in minutes</p>
          {plan && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#c7d2fe] bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#4f46e5]">
              {plan.name} plan selected — AUD ${plan.priceMonthly}/month
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={onPasswordBlur}
              placeholder="At least 12 characters"
            />
            <PasswordStrengthMeter password={password} />
            {pwnedWarning && (
              <p className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-700">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {pwnedWarning}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading || strength !== "strong"}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#94a3b8]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#6366f1] hover:text-[#4f46e5]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
