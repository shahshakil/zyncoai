"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label } from "@/components/dashboard/ui/input";
import { redirectAfterAuth } from "@/lib/postAuthRedirect";

export default function VerifyMfaPage() {
  return (
    <Suspense fallback={null}>
      <VerifyMfaForm />
    </Suspense>
  );
}

function VerifyMfaForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("zyn_mfa_pending_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setPendingToken(token);
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingToken) return;
    setLoading(true);
    try {
      const r = await fetch("/api/auth/mfa/challenge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mfaPendingToken: pendingToken, code }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        toast.error(useBackupCode ? "That backup code isn't valid or has already been used." : "Incorrect code — check your authenticator app and try again.");
        setLoading(false);
        return;
      }
      sessionStorage.removeItem("zyn_mfa_pending_token");
      await redirectAfterAuth(router, params.get("next"));
    } catch {
      toast.error("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-xl bg-indigo-500" />
          <h1 className="text-xl font-semibold text-white">Two-factor verification</h1>
          <p className="mt-1 text-sm text-white/40">Enter the code from your authenticator app</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
          <div>
            <Label htmlFor="code">{useBackupCode ? "Backup code" : "6-digit code"}</Label>
            <Input
              id="code"
              inputMode={useBackupCode ? "text" : "numeric"}
              autoComplete="one-time-code"
              required
              maxLength={useBackupCode ? 14 : 6}
              value={code}
              onChange={(e) => setCode(useBackupCode ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, ""))}
              placeholder={useBackupCode ? "XXXX-XXXX-XX" : "123456"}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !code}>
            {loading ? "Verifying…" : "Verify"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setUseBackupCode((v) => !v);
              setCode("");
            }}
            className="w-full text-center text-xs text-white/40 hover:text-white/60"
          >
            {useBackupCode ? "Use my authenticator app instead" : "Use a backup code instead"}
          </button>
        </form>
      </div>
    </div>
  );
}
