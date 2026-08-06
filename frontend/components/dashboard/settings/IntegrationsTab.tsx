"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Plug, Trash2, RefreshCw } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input, Label } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { IntegrationsCatalogSection } from "./IntegrationsCatalogSection";

// hasDirectSync = this provider has a working practitioner-fetch adapter
// (backend/src/lib/staffSync/providers/*) wired into the connect-time
// auto-sync, the 24h sweep, and the manual "Sync now" button below.
// Best Practice and Medical Director have no public practitioner API — this
// codebase has always been upfront about that (see StaffSyncPanel.tsx's
// "export a staff CSV from your software and upload it above") rather than
// faking a sync that can't work; they stay credential-storage/webhook-only.
// Pabau joins that same honest-partial category as of 2026-08-03: Pabau's
// API is confirmed real and self-service (Bearer-token auth verified live),
// but its exact staff/employee-listing endpoint path couldn't be confirmed
// against live docs (the docs site blocks automated verification and
// returns an identical 401 for every path, so a wrong guess can't even be
// caught by probing) — credentials can be stored now, direct sync is
// pending a live Pabau account to confirm the real endpoint.
//
// Halaxy (added 2026-08-03) is confirmed self-service and live-verified —
// but its auth is OAuth2 client_credentials (Client ID + Client Secret, not
// a single API key), so it uses the two credentialFields below instead of
// the generic "API key" input; the two values are combined client-side into
// one JSON string before being sent as apiKey (see connect()) so no backend
// schema change was needed.
const PROVIDERS = [
  { key: "cliniko", label: "Cliniko", needsSubdomain: true, hasDirectSync: true },
  { key: "nookal", label: "Nookal", needsSubdomain: true, hasDirectSync: true },
  { key: "halaxy", label: "Halaxy", needsSubdomain: false, hasDirectSync: true, credentialFields: ["Client ID", "Client Secret"] as [string, string] },
  { key: "zanda", label: "Zanda (Power Diary)", needsSubdomain: false, hasDirectSync: true },
  { key: "power_diary", label: "Power Diary", needsSubdomain: false, hasDirectSync: true },
  { key: "janeapp", label: "Jane App", needsSubdomain: false, hasDirectSync: true },
  { key: "coreplus", label: "Core Plus", needsSubdomain: false, hasDirectSync: true },
  { key: "pabau", label: "Pabau", needsSubdomain: false, hasDirectSync: false },
  { key: "best_practice", label: "Best Practice", needsSubdomain: false, hasDirectSync: false },
  { key: "medical_director", label: "Medical Director", needsSubdomain: false, hasDirectSync: false },
  { key: "generic_webhook", label: "Generic Webhook", needsSubdomain: false, isWebhook: true, hasDirectSync: false },
];

interface IntegrationState {
  connected: boolean;
  enabled?: boolean;
  apiKeyPreview?: string | null;
  subdomain?: string | null;
  webhookUrl?: string | null;
}

function PracticeManagementIntegrations() {
  const { data, isLoading, mutate } = useApi<{ integrations: Record<string, IntegrationState> }>("/api/business/integrations");
  const [active, setActive] = useState<(typeof PROVIDERS)[number] | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [secondCredential, setSecondCredential] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncingKey, setSyncingKey] = useState<string | null>(null);

  async function connect(e: React.FormEvent) {
    e.preventDefault();
    if (!active) return;
    if (!consentAccepted) {
      toast.error("Please accept the data import notice to continue");
      return;
    }
    setSaving(true);
    try {
      const credential = active.credentialFields
        ? JSON.stringify({ clientId: apiKey, clientSecret: secondCredential })
        : apiKey;
      const res = await apiPost<{ staffSync?: { imported: number; updated: number } | { error: string } | null }>(
        `/api/business/integrations/${active.key}`,
        active.isWebhook
          ? { webhookUrl, enabled: true, consentAccepted: true }
          : { apiKey: credential, subdomain: subdomain || undefined, enabled: true, consentAccepted: true }
      );
      const sync = res.staffSync;
      if (sync && "imported" in sync) {
        toast.success(`${active.label} connected — imported ${sync.imported} staff, updated ${sync.updated}`);
      } else if (sync && "error" in sync) {
        toast.warning(`${active.label} connected, but the first staff sync failed: ${sync.error}`);
      } else {
        toast.success(`${active.label} connected`);
      }
      setActive(null);
      setApiKey("");
      setSecondCredential("");
      setSubdomain("");
      setWebhookUrl("");
      setConsentAccepted(false);
      mutate();
    } catch {
      toast.error("Could not save integration — check the credentials");
    } finally {
      setSaving(false);
    }
  }

  async function disconnect(key: string) {
    try {
      await apiPost(`/api/business/integrations/${key}`, undefined, "DELETE");
      toast.success("Disconnected");
      mutate();
    } catch {
      toast.error("Could not disconnect");
    }
  }

  async function syncNow(key: string, label: string) {
    setSyncingKey(key);
    try {
      const res = await apiPost<{ imported: number; updated: number; flagged: number }>(`/api/business/integrations/${key}/sync-now`);
      toast.success(`${label} synced — ${res.imported} imported, ${res.updated} updated${res.flagged ? `, ${res.flagged} flagged for review` : ""}`);
      mutate();
    } catch (e: any) {
      toast.error(e?.message === "provider_has_no_direct_sync" ? `${label} doesn't support direct sync` : `Could not sync ${label}`);
    } finally {
      setSyncingKey(null);
    }
  }

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice management integrations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 2026-08-06 fix — this said "Sync bookings"; every adapter here (Cliniko/
            Nookal/Halaxy/Zanda/Power Diary/Jane App/Core Plus) syncs staff/
            practitioners only, never appointments/bookings — see backend/src/lib/
            staffSync/providers/*, none of which call a booking endpoint. */}
        <p className="mb-2 text-sm text-slate-400">Sync staff/practitioners with your existing practice management software.</p>
        {PROVIDERS.map((p) => {
          const state = data?.integrations[p.key];
          return (
            <div key={p.key} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-3">
                <Plug className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{p.label}</p>
                  {state?.connected && <p className="text-xs text-slate-400">{state.apiKeyPreview || state.webhookUrl}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {state?.connected ? (
                  <>
                    {/* 2026-08-06 fix — "connected" used to always render a green
                        badge purely because a credential row existed, with no
                        re-checkable validity signal. Now reflects the real,
                        most-recent StaffSyncLog result for providers that have a
                        live fetch adapter at all; providers that don't
                        (Pabau/Best Practice/Medical Director/Generic Webhook)
                        never show a false "connected" checkmark. */}
                    {!p.hasDirectSync ? (
                      <Badge tone="default" title="No live sync exists for this provider — use CSV import below">Saved, no live sync</Badge>
                    ) : state.lastSyncStatus === "success" ? (
                      <Badge tone="success" title={state.lastSyncedAt ? `Last synced ${new Date(state.lastSyncedAt).toLocaleString("en-AU")}` : undefined}>connected</Badge>
                    ) : state.lastSyncStatus === "error" ? (
                      <Badge tone="warning" title={state.lastSyncError || "Last sync failed"}>sync failing</Badge>
                    ) : (
                      <Badge tone="warning" title="Saved but not synced yet">pending first sync</Badge>
                    )}
                    {p.hasDirectSync && (
                      <Button variant="ghost" size="sm" disabled={syncingKey === p.key} onClick={() => syncNow(p.key, p.label)} title="Sync now">
                        <RefreshCw className={`h-4 w-4 ${syncingKey === p.key ? "animate-spin" : ""}`} />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => disconnect(p.key)}><Trash2 className="h-4 w-4" /></Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => { setConsentAccepted(false); setActive(p); }}>Connect</Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Connect {active?.label}</DialogTitle></DialogHeader>
          <form onSubmit={connect} className="space-y-3">
            {active?.isWebhook ? (
              <div>
                <Label>Webhook URL</Label>
                <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://your-system.com/hook" required />
              </div>
            ) : active?.credentialFields ? (
              <>
                <div>
                  <Label>{active.credentialFields[0]}</Label>
                  <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
                </div>
                <div>
                  <Label>{active.credentialFields[1]}</Label>
                  <Input value={secondCredential} onChange={(e) => setSecondCredential(e.target.value)} required />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>API key</Label>
                  <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
                </div>
                {active?.needsSubdomain && (
                  <div>
                    <Label>Subdomain</Label>
                    <Input value={subdomain} onChange={(e) => setSubdomain(e.target.value)} placeholder="yourclinic" />
                  </div>
                )}
              </>
            )}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
              <p><span className="text-emerald-400">We will import:</span> staff names, titles, email addresses.</p>
              <p className="mt-1"><span className="text-rose-400">We will NOT import:</span> patient records, clinical data, Medicare numbers, health identifiers.</p>
              <label className="mt-2 flex items-start gap-2">
                <input type="checkbox" className="mt-0.5" checked={consentAccepted} onChange={(e) => setConsentAccepted(e.target.checked)} />
                <span>
                  By connecting your account you agree to our{" "}
                  <a href="/privacy" target="_blank" rel="noreferrer" className="text-[var(--accent,#4f46e5)] underline">Privacy Policy</a> and consent to this
                  import.
                </span>
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={saving || !consentAccepted}>{saving ? "Connecting…" : "Connect"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export function IntegrationsTab() {
  const { business } = useDashboard();
  const isMedical = business.vertical === "MEDICAL" || business.vertical === "DENTAL";

  return (
    <div className="space-y-6">
      <IntegrationsCatalogSection />
      {isMedical && <PracticeManagementIntegrations />}
    </div>
  );
}
