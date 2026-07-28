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
  const [email, setEmail] = useState("");
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
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <Mail className="mx-auto mb-4 h-10 w-10 text-indigo-400" />
          <h1 className="text-lg font-semibold text-white">Check your inbox</h1>
          <p className="mt-2 text-sm text-white/50">
            We sent a verification link to <span className="text-white/80">{sent}</span>. Verify your email, then sign in to set up your business.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm text-indigo-400 hover:text-indigo-300">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-xl bg-indigo-500" />
          <h1 className="text-xl font-semibold text-white">Create your ZyncoAI account</h1>
          <p className="mt-1 text-sm text-white/40">Set up your AI voice receptionist in minutes</p>
          {plan && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#4f87f0]/30 bg-[#4f87f0]/10 px-3 py-1 text-xs font-medium text-[#8ab4ff]">
              {plan.name} plan selected — AUD ${plan.priceMonthly}/month
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
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
              <p className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-400">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {pwnedWarning}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading || strength !== "strong"}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
