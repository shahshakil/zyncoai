"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label } from "@/components/dashboard/ui/input";
import { ShieldCheck, Copy, Check } from "lucide-react";
import { redirectAfterAuth } from "@/lib/postAuthRedirect";

export default function SetupMfaPage() {
  return (
    <Suspense fallback={null}>
      <SetupMfaForm />
    </Suspense>
  );
}

function SetupMfaForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("zyn_mfa_pending_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setPendingToken(token);

    (async () => {
      const r = await fetch("/api/auth/mfa/setup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mfaPendingToken: token }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        toast.error("Could not start MFA setup. Please sign in again.");
        router.replace("/login");
        return;
      }
      setQrDataUrl(data.qrDataUrl);
      setSecret(data.secret);
    })();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingToken) return;
    setLoading(true);
    try {
      const r = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mfaPendingToken: pendingToken, code }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        toast.error("Incorrect code — check your authenticator app and try again.");
        setLoading(false);
        return;
      }
      sessionStorage.removeItem("zyn_mfa_pending_token");
      setBackupCodes(data.backupCodes || []);
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyBackupCodes() {
    if (!backupCodes) return;
    navigator.clipboard.writeText(backupCodes.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function onContinue() {
    await redirectAfterAuth(router, params.get("next"));
  }

  if (backupCodes) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
          <h1 className="text-center text-lg font-semibold text-white">Save your backup codes</h1>
          <p className="mt-2 text-center text-sm text-white/50">
            Each code works once, if you lose access to your authenticator app. Store them somewhere safe — they won&apos;t be shown again.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-xs text-white/80">
            {backupCodes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <Button type="button" variant="secondary" className="mt-3 w-full" onClick={copyBackupCodes}>
            {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy codes"}
          </Button>
          <Button type="button" className="mt-2 w-full" onClick={onContinue}>
            I&apos;ve saved these — continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-xl bg-indigo-500" />
          <h1 className="text-xl font-semibold text-white">Set up two-factor authentication</h1>
          <p className="mt-1 text-sm text-white/40">Required for new ZyncoAI accounts — scan with Google Authenticator or a similar app</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {qrDataUrl ? (
            <div className="flex justify-center rounded-lg bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="MFA QR code" width={180} height={180} />
            </div>
          ) : (
            <div className="flex h-[196px] items-center justify-center text-sm text-white/40">Loading QR code…</div>
          )}

          {secret && (
            <p className="mt-3 break-all text-center text-xs text-white/40">
              Can&apos;t scan? Enter manually: <span className="text-white/70">{secret}</span>
            </p>
          )}

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div>
              <Label htmlFor="code">6-digit code</Label>
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
              {loading ? "Verifying…" : "Verify and continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
