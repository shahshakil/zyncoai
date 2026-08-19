"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Cloud, FileUp, Plus, Trash2, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input, Label } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

type SyncedStaffRecord = { externalId: string; name: string; title?: string; email?: string; phone?: string };
type ManualStaff = { name: string; title: string; email: string; role: "STAFF" | "DOCTOR"; payType: "" | "HOURLY" | "SALARY" | "PERCENTAGE_OF_BILLINGS"; rate: string };

const BIG_PROVIDERS = [
  { key: "google", label: "Google", desc: "Workspace directory + calendars" },
  { key: "microsoft", label: "Microsoft", desc: "365 / Azure AD directory" },
  { key: "apple", label: "Apple", desc: "iCloud calendar (per staff member)" },
  { key: "cliniko", label: "Cliniko", desc: "Practitioners API" },
] as const;

const MORE_PROVIDERS: Array<{ key: string; label: string; fields: Array<"apiKey" | "subdomain" | "apiUrl">; apiKeyLabel?: string; subdomainLabel?: string; apiUrlLabel?: string }> = [
  { key: "nookal", label: "Nookal", fields: ["apiKey"] },
  { key: "zanda", label: "Zanda", fields: ["apiKey"] },
  { key: "power_diary", label: "Power Diary", fields: ["apiKey"] },
  { key: "mindbody", label: "Mindbody", fields: ["apiKey", "subdomain"], subdomainLabel: "Site ID" },
  { key: "janeapp", label: "Jane App", fields: ["apiKey"] },
  { key: "coreplus", label: "Core Plus", fields: ["apiKey", "apiUrl"] },
  { key: "fhir", label: "HL7 FHIR / Epic / MEDITECH", fields: ["apiUrl", "apiKey"], apiUrlLabel: "FHIR server base URL", apiKeyLabel: "Access token (optional)" },
];

const DEFAULT_HOURS_LABEL = "Mon–Fri 9am–5pm";

async function apiPostJson(path: string, body: any) {
  const r = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), credentials: "include" });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.ok === false) throw new Error(data.error || "request_failed");
  return data;
}

export function StaffSyncPanel({ onConfirmed }: { onConfirmed: (staff: { id: string; name: string }[]) => void }) {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const vcardInputRef = useRef<HTMLInputElement>(null);

  const [moreOpen, setMoreOpen] = useState(false);
  const [credentialProvider, setCredentialProvider] = useState<(typeof MORE_PROVIDERS)[number] | { key: "cliniko"; label: "Cliniko"; fields: Array<"apiKey" | "subdomain" | "apiUrl"> } | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [connecting, setConnecting] = useState(false);

  const [previewing, setPreviewing] = useState(false);
  const [previewProvider, setPreviewProvider] = useState<string | null>(null);
  const [previewRecords, setPreviewRecords] = useState<SyncedStaffRecord[] | null>(null);
  const [confirming, setConfirming] = useState(false);

  const [manualMode, setManualMode] = useState(false);
  const [manualStaff, setManualStaff] = useState<ManualStaff[]>([{ name: "", title: "", email: "", role: "STAFF", payType: "", rate: "" }]);
  const [savingManual, setSavingManual] = useState(false);

  // Round-trips back here after a Google/Microsoft OAuth redirect.
  useEffect(() => {
    const connected = searchParams.get("staff_sync_connected");
    const error = searchParams.get("staff_sync_error");
    if (error) toast.error("Could not connect — please try again");
    if (connected) runPreview(connected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function startOAuth(provider: "google" | "microsoft") {
    try {
      // 2026-08-09 — Microsoft's staff-directory connect is now a
      // dedicated route requesting only Directory.Read.All/People.Read
      // (never the Outlook-calendar scope IntegrationsCatalogSection.tsx's
      // card requests) — see staffSync.ts's connect-calendar/
      // connect-directory split. Google's directory connect is unaffected
      // (its own /connect was never bundled with calendar scopes).
      const connectPath = provider === "microsoft" ? "connect-directory" : "connect";
      const r = await fetch(`/api/business/staff-sync/${provider}/${connectPath}?returnTo=/onboarding`, { credentials: "include" });
      const data = await r.json();
      if (!data.ok || !data.authUrl) {
        toast.error(`${provider === "google" ? "Google" : "Microsoft"} sign-in isn't set up yet — contact support to enable it`);
        return;
      }
      window.location.href = data.authUrl;
    } catch {
      toast.error("Could not start sign-in");
    }
  }

  async function runPreview(provider: string) {
    setPreviewing(true);
    setPreviewProvider(provider);
    setPreviewRecords(null);
    try {
      const r = await fetch(`/api/business/staff-sync/${provider}/preview`, { method: "POST", credentials: "include" });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error);
      setPreviewRecords(data.records || []);
      if (data.rejected > 0) {
        toast.warning(`${data.rejected} record(s) were rejected — they contained fields we never import (clinical/identifier data)`);
      }
      if (!data.records?.length) toast.error("No staff found — check your credentials or try another method");
    } catch (err: any) {
      toast.error(
        err.message === "janeapp_partner_api_access_required" || err.message === "power_diary_zanda_partner_access_required" || err.message === "coreplus_partner_api_access_required"
          ? "This integration needs partner API access from the vendor first — contact their support"
          : "Could not import staff — check your credentials"
      );
    } finally {
      setPreviewing(false);
    }
  }

  async function submitCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!credentialProvider) return;
    setConnecting(true);
    try {
      await apiPostJson(`/api/business/integrations/${credentialProvider.key}`, {
        apiKey: form.apiKey || undefined,
        subdomain: form.subdomain || undefined,
        apiUrl: form.apiUrl || undefined,
        enabled: true,
        consentAccepted: true,
      });
      const provider = credentialProvider.key;
      setCredentialProvider(null);
      setForm({});
      await runPreview(provider);
    } catch {
      toast.error("Could not save credentials");
    } finally {
      setConnecting(false);
    }
  }

  async function uploadFile(kind: "csv" | "vcard", file: File) {
    setPreviewing(true);
    setPreviewProvider(kind);
    setPreviewRecords(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch(`/api/business/staff-sync/${kind}/preview`, { method: "POST", body: fd, credentials: "include" });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error);
      setPreviewRecords(data.records || []);
      if (!data.records?.length) toast.error("No staff found in that file");
    } catch {
      toast.error(`Could not read that ${kind === "csv" ? "CSV" : "vCard"} file`);
    } finally {
      setPreviewing(false);
    }
  }

  async function confirmAll() {
    if (!previewProvider || !previewRecords?.length) return;
    setConfirming(true);
    try {
      await apiPostJson("/api/business/staff-sync/confirm", { provider: previewProvider, records: previewRecords });
      const r = await fetch("/api/business/providers", { credentials: "include" });
      const data = await r.json();
      const created = (data.providers || []).map((p: any) => ({ id: p.id, name: p.name }));
      toast.success(`Imported ${previewRecords.length} staff member(s)`);
      onConfirmed(created);
    } catch {
      toast.error("Could not save imported staff");
    } finally {
      setConfirming(false);
    }
  }

  async function submitManual() {
    const valid = manualStaff.filter((s) => s.name.trim());
    if (!valid.length) {
      toast.error("Add at least one staff member");
      return;
    }
    setSavingManual(true);
    try {
      const created: { id: string; name: string }[] = [];
      let invitesSent = 0;
      for (const s of valid) {
        const res = await apiPostJson("/api/business/providers", { name: s.name, title: s.title || undefined, email: s.email || undefined });
        created.push({ id: res.provider.id, name: res.provider.name });

        // Portal login access + role-based invite email — only when an
        // email was given. A blank email means "scheduling only, no
        // portal login," which is a real, supported choice, not an
        // oversight — the Provider row above still exists either way.
        if (s.email.trim()) {
          try {
            await apiPostJson("/api/business/staff/invitations", {
              email: s.email.trim(), role: s.role, providerId: res.provider.id,
              ...(s.payType && s.rate ? { payType: s.payType, rateCents: Math.round(parseFloat(s.rate) * 100) } : {}),
            });
            invitesSent++;
          } catch (e: any) {
            // Provider is already created — don't fail the whole step over
            // an invite hiccup (e.g. that email is already a member).
            toast.error(`Could not send invite to ${s.email.trim()}: ${e?.message || "unknown error"}`);
          }
        }
      }
      if (invitesSent) toast.success(`${invitesSent} portal invitation${invitesSent > 1 ? "s" : ""} sent`);
      onConfirmed(created);
    } catch {
      toast.error("Could not save staff members");
    } finally {
      setSavingManual(false);
    }
  }

  function openCredentialForm(p: (typeof MORE_PROVIDERS)[number]) {
    setForm({});
    setCredentialProvider(p);
  }

  // ---------- Preview results (shared by every provider) ----------
  if (previewing || previewRecords) {
    return (
      <div>
        {previewing && (
          <div className="space-y-3">
            <p className="text-sm text-white/60">Importing your staff…</p>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}
        {!previewing && previewRecords && (
          <div className="space-y-3">
            {previewRecords.length === 0 && (
              <p className="text-sm text-white/40">No staff found. Try a different method below.</p>
            )}
            {previewRecords.map((s) => (
              <div key={s.externalId} className="rounded-lg border border-white/10 p-3">
                <p className="text-sm font-medium text-white">{s.name}</p>
                <p className="text-xs text-white/40">{s.title || "Staff"}{s.email ? ` · ${s.email}` : ""}</p>
                <div className="mt-1.5 flex gap-2 text-[11px] text-white/30">
                  <span className="rounded-full border border-white/10 px-2 py-0.5">{DEFAULT_HOURS_LABEL}</span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5">30 min slots</span>
                </div>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => { setPreviewRecords(null); setPreviewProvider(null); }}>
                Back
              </Button>
              {previewRecords.length > 0 && (
                <Button className="flex-1" onClick={confirmAll} disabled={confirming}>
                  {confirming ? "Confirming…" : "Confirm all"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- Manual entry ----------
  if (manualMode) {
    return (
      <div>
        <div className="space-y-3">
          {manualStaff.map((s, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-white/10 p-3">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label>Name</Label>
                  <Input value={s.name} onChange={(e) => setManualStaff((arr) => arr.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))} placeholder="Dr. Jane Smith" />
                </div>
                <div className="flex-1">
                  <Label>Title</Label>
                  <Input value={s.title} onChange={(e) => setManualStaff((arr) => arr.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))} placeholder="Dentist" />
                </div>
                <Button variant="ghost" size="sm" onClick={() => setManualStaff((arr) => arr.filter((_, idx) => idx !== i))} disabled={manualStaff.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label>Email (leave blank for schedule-only, no portal login)</Label>
                  <Input value={s.email} onChange={(e) => setManualStaff((arr) => arr.map((x, idx) => (idx === i ? { ...x, email: e.target.value } : x)))} placeholder="jane@business.com" />
                </div>
                {s.email.trim() && (
                  <div className="w-32">
                    <Label>Portal role</Label>
                    <select
                      value={s.role}
                      onChange={(e) => setManualStaff((arr) => arr.map((x, idx) => (idx === i ? { ...x, role: e.target.value as ManualStaff["role"] } : x)))}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-2 py-2 text-sm text-white"
                    >
                      <option value="STAFF">Staff</option>
                      <option value="DOCTOR">Doctor</option>
                    </select>
                  </div>
                )}
              </div>
              {s.email.trim() && (
                <div className="flex items-end gap-2">
                  <div className="w-40">
                    <Label>Pay type (optional)</Label>
                    <select
                      value={s.payType}
                      onChange={(e) => setManualStaff((arr) => arr.map((x, idx) => (idx === i ? { ...x, payType: e.target.value as ManualStaff["payType"] } : x)))}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-2 py-2 text-sm text-white"
                    >
                      <option value="">Not set yet</option>
                      <option value="HOURLY">Hourly rate</option>
                      <option value="SALARY">Annual salary</option>
                      <option value="PERCENTAGE_OF_BILLINGS">% of billings</option>
                    </select>
                  </div>
                  {s.payType && (
                    <div className="flex-1">
                      <Label>{s.payType === "PERCENTAGE_OF_BILLINGS" ? "Percentage (%)" : s.payType === "SALARY" ? "Annual salary ($)" : "Hourly rate ($)"}</Label>
                      <Input type="number" min="0" step="0.01" value={s.rate} onChange={(e) => setManualStaff((arr) => arr.map((x, idx) => (idx === i ? { ...x, rate: e.target.value } : x)))} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => setManualStaff((arr) => [...arr, { name: "", title: "", email: "", role: "STAFF", payType: "", rate: "" }])}>
          <Plus className="h-4 w-4" /> Add another
        </Button>
        <div className="mt-4 flex gap-3">
          <Button variant="outline" onClick={() => setManualMode(false)}>Back</Button>
          <Button className="flex-1" onClick={submitManual} disabled={savingManual}>
            {savingManual ? "Saving…" : "Continue"}
          </Button>
        </div>
      </div>
    );
  }

  // ---------- Credential form modal (inline, not a dialog, to keep onboarding single-column) ----------
  if (credentialProvider) {
    return (
      <form onSubmit={submitCredentials} className="space-y-3">
        <p className="text-sm text-white/60">Connect {credentialProvider.label}</p>
        {credentialProvider.fields.includes("apiUrl") && (
          <div>
            <Label>{(credentialProvider as any).apiUrlLabel || "API base URL"}</Label>
            <Input value={form.apiUrl || ""} onChange={(e) => setForm((f) => ({ ...f, apiUrl: e.target.value }))} placeholder="https://" required={credentialProvider.key === "fhir"} />
          </div>
        )}
        {credentialProvider.fields.includes("apiKey") && (
          <div>
            <Label>{(credentialProvider as any).apiKeyLabel || "API key"}</Label>
            <Input value={form.apiKey || ""} onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))} required={credentialProvider.key !== "fhir"} />
          </div>
        )}
        {credentialProvider.fields.includes("subdomain") && (
          <div>
            <Label>{(credentialProvider as any).subdomainLabel || "Subdomain"}</Label>
            <Input value={form.subdomain || ""} onChange={(e) => setForm((f) => ({ ...f, subdomain: e.target.value }))} />
          </div>
        )}
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-white/60">
          <p><span className="text-emerald-400">We will import:</span> staff names, titles, email addresses.</p>
          <p className="mt-1"><span className="text-rose-400">We will NOT import:</span> patient records, clinical data, Medicare numbers, health identifiers.</p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => setCredentialProvider(null)}>Back</Button>
          <Button type="submit" className="flex-1" disabled={connecting}>{connecting ? "Connecting…" : "Connect & import"}</Button>
        </div>
      </form>
    );
  }

  // ---------- Main picker ----------
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BIG_PROVIDERS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => {
              if (p.key === "google" || p.key === "microsoft") startOAuth(p.key);
              else if (p.key === "apple") {
                toast.info("Add staff first, then connect each person's iCloud calendar from Settings → Staff.");
                setManualMode(true);
              } else openCredentialForm({ key: "cliniko", label: "Cliniko", fields: ["apiKey"] });
            }}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center hover:bg-white/[0.06] hover:border-white/20 transition"
          >
            <Cloud className="h-5 w-5 text-indigo-300" />
            <span className="text-sm font-medium text-white">{p.label}</span>
            <span className="text-[11px] text-white/30">{p.desc}</span>
          </button>
        ))}
      </div>

      <button type="button" onClick={() => setMoreOpen((v) => !v)} className="mt-4 flex items-center gap-1 text-sm text-white/50 hover:text-white/80">
        More options {moreOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {moreOpen && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MORE_PROVIDERS.map((p) => (
            <button key={p.key} type="button" onClick={() => openCredentialForm(p)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-sm text-white/70 hover:bg-white/[0.06]">
              {p.label}
            </button>
          ))}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-sm text-white/70 hover:bg-white/[0.06]">
            <FileUp className="h-4 w-4" /> CSV upload
          </button>
          <button type="button" onClick={() => vcardInputRef.current?.click()} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-sm text-white/70 hover:bg-white/[0.06]">
            <FileUp className="h-4 w-4" /> vCard (.vcf) import
          </button>
          <button type="button" onClick={() => setManualMode(true)} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-sm text-white/70 hover:bg-white/[0.06]">
            <Users className="h-4 w-4" /> Manual entry
          </button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile("csv", f); }} />
      <input ref={vcardInputRef} type="file" accept=".vcf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile("vcard", f); }} />

      <p className="mt-4 text-[11px] text-white/25">
        Best Practice, Medical Director, Dental4Windows, Exact and Romexis have no live API — export a staff CSV from your software and upload it above.
      </p>
    </div>
  );
}
