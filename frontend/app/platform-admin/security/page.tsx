"use client";
import { useState } from "react";
import { toast } from "sonner";
import { LockKeyhole, Activity, ShieldOff, AlertTriangle, ShieldCheck, Copy } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Input } from "@/components/dashboard/ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Topbar } from "@/components/platform-admin/Topbar";

interface Overview {
  blockedIps: { ip: string; reason: string }[];
  cloudflareConfigured: boolean;
  rps: { current: number; level: "ok" | "warning" | "critical" };
  emergencyModeActive: boolean;
  injectionEventsToday: number;
}

interface AdminMe {
  id: string;
  email: string;
  name: string | null;
  mfaEnabled: boolean;
}

type EnrollStep = "idle" | "scanning" | "backupCodes";

function MfaEnrollmentCard() {
  const { data: me, mutate: mutateMe } = useApi<{ admin: AdminMe }>("/api/admin-auth/me");
  const [step, setStep] = useState<EnrollStep>("idle");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [confirmCode, setConfirmCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [disabling, setDisabling] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function startEnrollment() {
    setBusy(true);
    try {
      const res = await apiPost<{ qrDataUrl: string; secret: string }>("/api/admin-auth/mfa/setup");
      setQrDataUrl(res.qrDataUrl);
      setSecret(res.secret);
      setStep("scanning");
    } catch {
      toast.error("Could not start 2FA setup");
    } finally {
      setBusy(false);
    }
  }

  async function confirmEnrollment(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await apiPost<{ backupCodes: string[] }>("/api/admin-auth/mfa/verify", { code: confirmCode });
      setBackupCodes(res.backupCodes);
      setStep("backupCodes");
    } catch {
      toast.error("Invalid code — check your authenticator app and try again");
    } finally {
      setBusy(false);
    }
  }

  function finishEnrollment() {
    setStep("idle");
    setQrDataUrl(null);
    setSecret(null);
    setConfirmCode("");
    setBackupCodes([]);
    mutateMe();
  }

  async function disable(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await apiPost("/api/admin-auth/mfa/disable", { code: disableCode });
      toast.success("Two-factor authentication disabled");
      setDisabling(false);
      setDisableCode("");
      mutateMe();
    } catch {
      toast.error("Invalid code");
    } finally {
      setBusy(false);
    }
  }

  function copyBackupCodes() {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    toast.success("Backup codes copied");
  }

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Your account — Two-factor authentication</CardTitle></CardHeader>
      <div className="space-y-4 p-4">
        {step === "idle" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <Badge tone={me?.admin.mfaEnabled ? "success" : "default"}>{me?.admin.mfaEnabled ? "Enabled" : "Not enabled"}</Badge>
                <p className="mt-1 text-xs text-[#6B7280]">{me?.admin.email}</p>
              </div>
              {me?.admin.mfaEnabled ? (
                <Button size="sm" variant="outline" onClick={() => setDisabling((v) => !v)}>Disable</Button>
              ) : (
                <Button size="sm" onClick={startEnrollment} disabled={busy}>{busy ? "Starting…" : "Enable 2FA"}</Button>
              )}
            </div>
            {disabling && (
              <form onSubmit={disable} className="flex items-end gap-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-[#6B7280]">Enter your current code to confirm</label>
                  <Input value={disableCode} onChange={(e) => setDisableCode(e.target.value.trim())} autoFocus required />
                </div>
                <Button type="submit" size="sm" variant="outline" disabled={busy || !disableCode}>{busy ? "…" : "Confirm disable"}</Button>
              </form>
            )}
          </>
        )}

        {step === "scanning" && qrDataUrl && (
          <div className="space-y-4">
            <p className="text-sm text-[#4B5563]">Scan this with an authenticator app (Google Authenticator, 1Password, Authy…), then enter the 6-digit code it shows to confirm.</p>
            <img src={qrDataUrl} alt="TOTP QR code" className="h-48 w-48 rounded-lg border border-[#E5E7EB]" />
            <div>
              <label className="text-xs font-medium text-[#6B7280]">Can&apos;t scan? Enter this key manually:</label>
              <div className="mt-1 flex items-center gap-2">
                <code className="rounded bg-[#F3F4F6] px-2 py-1 font-mono text-xs">{secret}</code>
                <button type="button" onClick={() => { navigator.clipboard.writeText(secret || ""); toast.success("Secret copied"); }}>
                  <Copy className="h-3.5 w-3.5 text-[#9CA3AF]" />
                </button>
              </div>
            </div>
            <form onSubmit={confirmEnrollment} className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-xs font-medium text-[#6B7280]">6-digit code</label>
                <Input value={confirmCode} onChange={(e) => setConfirmCode(e.target.value.trim())} autoFocus required autoComplete="one-time-code" />
              </div>
              <Button type="submit" size="sm" disabled={busy || !confirmCode}>{busy ? "Verifying…" : "Confirm"}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setStep("idle")}>Cancel</Button>
            </form>
          </div>
        )}

        {step === "backupCodes" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-sm font-medium text-[#92400E]">
              <AlertTriangle className="h-4 w-4 shrink-0" /> Save these now — they&apos;re shown only once and each works one time if you lose access to your authenticator app.
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3 font-mono text-sm">
              {backupCodes.map((c) => <div key={c}>{c}</div>)}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyBackupCodes}><Copy className="mr-1.5 h-3.5 w-3.5" /> Copy all</Button>
              <Button size="sm" onClick={finishEnrollment}>I&apos;ve saved these — done</Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function SecurityPage() {
  const { data, mutate } = useApi<Overview>("/api/admin/platform/security/overview", { refreshInterval: 10000 });
  const { data: events } = useApi<{ events: any[] }>("/api/admin/platform/security/events", { refreshInterval: 15000 });

  async function unblock(ip: string) {
    await apiPost(`/api/admin/platform/security/blocked-ips/${encodeURIComponent(ip)}/unblock`);
    toast.success(`Unblocked ${ip}`);
    mutate();
  }

  async function disableEmergency() {
    await apiPost("/api/admin/platform/security/emergency-mode/disable");
    toast.success("Emergency mode disabled");
    mutate();
  }

  return (
    <div className="-m-6">
      <Topbar title="Security" refreshIntervalMs={10000} />
      <div className="space-y-6 p-6">
        {data?.emergencyModeActive && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#991B1B]">
            <span className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Emergency mode is ACTIVE — non-essential endpoints are returning 503. Auto-expires in up to 5 minutes.</span>
            <Button size="sm" variant="outline" onClick={disableEmergency}>Disable now</Button>
          </div>
        )}

        <MfaEnrollmentCard />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Blocked IPs</span><LockKeyhole className="h-4 w-4 text-[#EF4444]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{data?.blockedIps.length ?? "…"}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Injection Attempts Today</span><ShieldOff className="h-4 w-4 text-[#F59E0B]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{data?.injectionEventsToday ?? "…"}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Requests/sec</span><Activity className="h-4 w-4 text-[#3B82F6]" /></div>
            <div className="mt-2 text-2xl font-semibold text-[#1F2937]">{data?.rps.current ?? "…"}</div>
            {data && data.rps.level !== "ok" && <Badge tone={data.rps.level === "critical" ? "danger" : "warning"} className="mt-2">{data.rps.level}</Badge>}
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">Cloudflare Auto-Block</span></div>
            <div className="mt-2"><Badge tone={data?.cloudflareConfigured ? "success" : "default"}>{data?.cloudflareConfigured ? "Configured" : "Not configured"}</Badge></div>
            {!data?.cloudflareConfigured && <p className="mt-1 text-[11px] text-[#9CA3AF]">Set CLOUDFLARE_ACCOUNT_ID/API_KEY/EMAIL to enable — IPs are still blocked in-app either way.</p>}
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Blocked IPs</CardTitle></CardHeader>
          <div className="p-2">
            {data?.blockedIps.length ? (
              <Table>
                <Thead><tr><Th>IP</Th><Th>Reason</Th><Th /></tr></Thead>
                <Tbody>
                  {data.blockedIps.map((b) => (
                    <Tr key={b.ip}><Td className="font-mono">{b.ip}</Td><Td>{b.reason}</Td><Td><Button size="sm" variant="outline" onClick={() => unblock(b.ip)}>Unblock</Button></Td></Tr>
                  ))}
                </Tbody>
              </Table>
            ) : <EmptyState title="No IPs currently blocked" />}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent security events</CardTitle></CardHeader>
          <div className="p-2">
            {events?.events.length ? (
              <Table>
                <Thead><tr><Th>Type</Th><Th>IP</Th><Th>Endpoint</Th><Th>Business</Th><Th>When</Th></tr></Thead>
                <Tbody>
                  {events.events.map((e) => (
                    <Tr key={e.id}>
                      <Td><Badge tone="danger">{e.type}</Badge></Td>
                      <Td className="font-mono">{e.ip}</Td>
                      <Td>{e.endpoint}</Td>
                      <Td>{e.business?.name || "—"}</Td>
                      <Td>{new Date(e.createdAt).toLocaleString("en-AU")}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : <EmptyState title="No security events recorded" />}
          </div>
        </Card>
      </div>
    </div>
  );
}
