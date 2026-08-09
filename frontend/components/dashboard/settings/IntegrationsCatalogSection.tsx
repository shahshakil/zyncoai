"use client";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Plug, RefreshCw, Trash2, Globe, CalendarDays, Bell, CheckCircle2 } from "lucide-react";
import { useApi, apiPost, ApiError } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getIntegrationsCatalog, CatalogIntegration } from "@/lib/integrationsCatalog";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

interface CatalogStatus {
  vertical: string | null;
  square: { configured: boolean; connected: boolean; merchantId: string | null; lastSyncedAt: string | null; lastSyncError: string | null };
  websiteMenu: { connected: boolean; url: string | null; lastScrapedAt: string | null; itemCount: number };
  microsoftCalendar: { configured: boolean; connected: boolean; connectedAt: string | null };
  notifiedKeys: string[];
}

function IconFor({ kind }: { kind: CatalogIntegration["kind"] }) {
  if (kind === "google_calendar" || kind === "microsoft_calendar") return <CalendarDays className="h-4 w-4 text-slate-400" />;
  if (kind === "website_scrape") return <Globe className="h-4 w-4 text-slate-400" />;
  return <Plug className="h-4 w-4 text-slate-400" />;
}

function NotifyMeButton({ integrationKey, alreadyNotified, onNotified }: { integrationKey: string; alreadyNotified: boolean; onNotified: () => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  if (alreadyNotified) {
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-600">
        <CheckCircle2 className="h-3.5 w-3.5" /> We&apos;ll email you
      </span>
    );
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Bell className="mr-1 h-3.5 w-3.5" /> Notify me
      </Button>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPost("/api/business/integrations-catalog/notify-me", { integrationKey, email });
      toast.success("We'll email you when this is ready");
      setOpen(false);
      onNotified();
    } catch {
      toast.error("Could not save — check the email address");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-1">
      <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@business.com" required className="h-8 w-40 text-xs" />
      <Button type="submit" size="sm" disabled={saving}>{saving ? "…" : "Send"}</Button>
    </form>
  );
}

function WebsiteScrapeCard({ item, status, mutate }: { item: CatalogIntegration; status: CatalogStatus; mutate: () => void }) {
  const [url, setUrl] = useState(status.websiteMenu.url || "");
  const [scraping, setScraping] = useState(false);

  async function scrape(e: React.FormEvent) {
    e.preventDefault();
    setScraping(true);
    try {
      const res = await apiPost<{ items: unknown[] }>("/api/business/integrations-catalog/website-scrape", { url });
      toast.success(`Menu synced — found ${res.items.length} items`);
      mutate();
    } catch (e) {
      toast.error(e instanceof ApiError && e.message === "invalid_url" ? "That doesn't look like a valid URL" : "Could not read a menu from that page — try a different page or check the URL");
    } finally {
      setScraping(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconFor kind={item.kind} />
          <div>
            <p className="text-sm font-medium text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-400">{item.description}</p>
          </div>
        </div>
        {status.websiteMenu.connected && <Badge tone="success">connected</Badge>}
      </div>
      <form onSubmit={scrape} className="mt-3 flex items-center gap-2">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} type="url" placeholder="https://yourrestaurant.com.au/menu" required className="h-8 flex-1 text-xs" />
        <Button type="submit" size="sm" disabled={scraping}>{scraping ? "Scanning…" : status.websiteMenu.connected ? "Re-scan" : "Scan menu"}</Button>
      </form>
      {status.websiteMenu.connected && (
        <p className="mt-2 text-xs text-slate-400">
          {status.websiteMenu.itemCount} items · last synced {status.websiteMenu.lastScrapedAt ? new Date(status.websiteMenu.lastScrapedAt).toLocaleString() : "just now"} · re-syncs weekly
        </p>
      )}
    </div>
  );
}

function GoogleCalendarCard({ item }: { item: CatalogIntegration }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
      <div className="flex items-center gap-3">
        <IconFor kind={item.kind} />
        <div>
          <p className="text-sm font-medium text-slate-900">{item.name}</p>
          <p className="text-xs text-slate-400">{item.description}</p>
        </div>
      </div>
      <Link href="/dashboard/settings?tab=staff">
        <Button variant="outline" size="sm">Connect in Staff tab</Button>
      </Link>
    </div>
  );
}

// 2026-08-06 — real, was coming-soon with no code behind it. Business-wide
// (not per-staff like Google) OAuth against Microsoft Graph, real
// Calendars.ReadWrite scope, real event create/delete on booking/
// reschedule/cancel — see lib/microsoftGraph.ts.
function MicrosoftCalendarCard({ item, status, mutate }: { item: CatalogIntegration; status: CatalogStatus; mutate: () => void }) {
  const [connecting, setConnecting] = useState(false);

  async function connect() {
    setConnecting(true);
    try {
      // 2026-08-09 — split from the old shared /connect (which also asked
      // for staff-directory scopes this card never needed): this card
      // requests ONLY Calendars.ReadWrite, never Directory.Read.All.
      const r = await fetch("/api/business/staff-sync/microsoft/connect-calendar", { credentials: "include" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new ApiError(data?.error || "request_failed", r.status);
      window.location.href = data.authUrl;
    } catch (e) {
      toast.error(e instanceof ApiError && e.status === 503 ? "Microsoft 365 isn't set up on this account yet" : "Could not start the Outlook connection");
      setConnecting(false);
    }
  }

  async function disconnect() {
    try {
      await apiPost("/api/business/staff-sync/microsoft", undefined, "DELETE");
      toast.success("Outlook Calendar disconnected");
      mutate();
    } catch {
      toast.error("Could not disconnect");
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconFor kind={item.kind} />
          <div>
            <p className="text-sm font-medium text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-400">{item.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status.microsoftCalendar.connected ? (
            <>
              <Badge tone="success">connected</Badge>
              <Button variant="ghost" size="sm" onClick={disconnect}><Trash2 className="h-4 w-4" /></Button>
            </>
          ) : (
            <Button variant="outline" size="sm" disabled={connecting} onClick={connect}>{connecting ? "Connecting…" : "Connect"}</Button>
          )}
        </div>
      </div>
      {status.microsoftCalendar.connected && status.microsoftCalendar.connectedAt && (
        <p className="mt-2 text-xs text-slate-400">Connected {new Date(status.microsoftCalendar.connectedAt).toLocaleString()} — new bookings sync automatically.</p>
      )}
      {!status.microsoftCalendar.configured && !status.microsoftCalendar.connected && <p className="mt-2 text-xs text-amber-600">Not yet set up on this account — contact support.</p>}
    </div>
  );
}

function SquareCard({ item, status, mutate }: { item: CatalogIntegration; status: CatalogStatus; mutate: () => void }) {
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  async function connect() {
    setConnecting(true);
    try {
      const r = await fetch("/api/business/integrations-catalog/square/connect", { credentials: "include" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new ApiError(data?.error || "request_failed", r.status);
      window.location.href = data.authUrl;
    } catch (e) {
      toast.error(e instanceof ApiError && e.status === 503 ? "Square isn't set up on this account yet" : "Could not start the Square connection");
      setConnecting(false);
    }
  }

  async function disconnect() {
    try {
      await apiPost("/api/business/integrations-catalog/square", undefined, "DELETE");
      toast.success("Square disconnected");
      mutate();
    } catch {
      toast.error("Could not disconnect");
    }
  }

  async function syncNow() {
    setSyncing(true);
    try {
      const res = await apiPost<{ itemCount: number }>("/api/business/integrations-catalog/square/sync-now");
      toast.success(`Synced ${res.itemCount} items from Square`);
      mutate();
    } catch {
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconFor kind={item.kind} />
          <div>
            <p className="text-sm font-medium text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-400">{item.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status.square.connected ? (
            <>
              <Badge tone={status.square.lastSyncError ? "warning" : "success"}>{status.square.lastSyncError ? "needs attention" : "connected"}</Badge>
              <Button variant="ghost" size="sm" disabled={syncing} onClick={syncNow} title="Sync now">
                <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={disconnect}><Trash2 className="h-4 w-4" /></Button>
            </>
          ) : (
            <Button variant="outline" size="sm" disabled={connecting} onClick={connect}>{connecting ? "Connecting…" : "Connect"}</Button>
          )}
        </div>
      </div>
      {status.square.connected && (
        <p className="mt-2 text-xs text-slate-400">
          {status.square.lastSyncError ? `Last sync failed: ${status.square.lastSyncError}` : `Syncs every 15 minutes${status.square.lastSyncedAt ? ` · last synced ${new Date(status.square.lastSyncedAt).toLocaleString()}` : ""}`}
        </p>
      )}
      {!status.square.configured && !status.square.connected && <p className="mt-2 text-xs text-amber-600">Not yet set up on this account — contact support.</p>}
    </div>
  );
}

function ComingSoonCard({ item, status, mutate }: { item: CatalogIntegration; status: CatalogStatus; mutate: () => void }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconFor kind={item.kind} />
          <div>
            <p className="text-sm font-medium text-slate-700">{item.name}</p>
            <p className="text-xs text-slate-400">{item.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="default">coming soon</Badge>
          <NotifyMeButton integrationKey={item.key} alreadyNotified={status.notifiedKeys.includes(item.key)} onNotified={mutate} />
        </div>
      </div>
      {/* 2026-08-06 — the real, verified reason this isn't built yet, not a
          generic placeholder — see lib/integrationsCatalog.ts's vendor audit. */}
      {item.comingSoonReason && <p className="mt-1.5 text-[11px] text-slate-400">{item.comingSoonReason}</p>}
    </div>
  );
}

export function IntegrationsCatalogSection() {
  const { business } = useDashboard();
  const { data, isLoading, mutate } = useApi<CatalogStatus>("/api/business/integrations-catalog");
  const items = getIntegrationsCatalog(business.vertical);

  if (isLoading || !data) return <Skeleton className="h-64 w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business integrations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="mb-2 text-sm text-slate-400">Connect the ordering, booking, and calendar tools you already use.</p>
        {items.map((item) => {
          if (item.kind === "square") return <SquareCard key={item.key} item={item} status={data} mutate={mutate} />;
          if (item.kind === "google_calendar") return <GoogleCalendarCard key={item.key} item={item} />;
          if (item.kind === "microsoft_calendar") return <MicrosoftCalendarCard key={item.key} item={item} status={data} mutate={mutate} />;
          if (item.kind === "website_scrape") return <WebsiteScrapeCard key={item.key} item={item} status={data} mutate={mutate} />;
          return <ComingSoonCard key={item.key} item={item} status={data} mutate={mutate} />;
        })}
      </CardContent>
    </Card>
  );
}
