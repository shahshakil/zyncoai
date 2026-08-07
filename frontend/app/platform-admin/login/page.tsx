"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label } from "@/components/dashboard/ui/input";

export default function PlatformAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mfaPendingToken, setMfaPendingToken] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        toast.error(data.error === "account_locked" ? "Account locked — try again later" : "Invalid credentials");
        setLoading(false);
        return;
      }
      if (data.mfaRequired) {
        setMfaPendingToken(data.mfa_pending_token);
        setLoading(false);
        return;
      }
      router.push("/platform-admin");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  async function onSubmitMfa(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch("/api/admin-auth/mfa/challenge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: mfaCode, mfa_pending_token: mfaPendingToken }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        toast.error("Invalid or expired code");
        setLoading(false);
        return;
      }
      router.push("/platform-admin");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-indigo-400" />
          <h1 className="text-xl font-semibold text-white">ZyncoAI Platform Admin</h1>
          <p className="mt-1 text-sm text-white/40">Internal staff access only</p>
        </div>
        {mfaPendingToken ? (
          <form onSubmit={onSubmitMfa} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <div>
              <Label htmlFor="mfaCode">Verification code</Label>
              <p className="mb-2 text-xs text-white/40">Enter the 6-digit code from your authenticator app, or one of your backup codes.</p>
              <Input
                id="mfaCode"
                type="text"
                inputMode="text"
                autoFocus
                required
                autoComplete="one-time-code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.trim())}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !mfaCode}>{loading ? "Verifying…" : "Verify"}</Button>
            <button
              type="button"
              className="w-full text-center text-xs font-medium text-white/40 hover:text-white/70"
              onClick={() => { setMfaPendingToken(null); setMfaCode(""); }}
            >
              Back to sign in
            </button>
          </form>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/platform-admin/forgot" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
          </form>
        )}
      </div>
    </div>
  );
}
