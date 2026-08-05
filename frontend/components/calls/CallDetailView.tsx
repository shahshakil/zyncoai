"use client";
// Shared call-detail view — used by both the tenant dashboard
// (app/dashboard/calls/[id]/page.tsx) and platform-admin
// (app/platform-admin/calls/[id]/page.tsx). One component, two API base
// paths, so the two surfaces can never silently drift apart on what a
// call-detail page actually shows. See docs/CALL_MONITORING.md-equivalent
// comment trail in the backend routes (business/calls.ts, admin/platform.ts)
// for the data model this renders.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wrench, AlertTriangle, Clock } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { StatusBadge, OutcomeBadge, Badge } from "@/components/dashboard/ui/badge";
import { toast } from "sonner";

// Turn latency over this is highlighted red on its bar — matches the
// <1.5s no-tool-call / ~3.3-3.7s add-item-turn budget the RESTAURANT
// latency fixes were measured against (docs/HUMAN_FEEL_PLAN.md).
const LATENCY_WARN_MS = 3000;
const LOW_STT_CONFIDENCE = 0.85;
const LIVE_POLL_MS = 2000;

export interface CallTurn {
  id: string;
  seq: number;
  role: "CALLER" | "ASSISTANT" | "SYSTEM" | "TOOL";
  text: string;
  toolName: string | null;
  toolArgs: any;
  toolResult: any;
  latencyMs: number | null;
  sttConfidence: number | null;
  durationMs: number | null;
  guardrailTriggered: boolean;
  createdAt: string;
}

export interface CallDetail {
  id: string;
  status: string;
  outcome: string | null;
  direction: string;
  fromNumber: string;
  startedAt: string;
  endedAt: string | null;
  recordingKey?: string | null;
  contact: { name: string | null; phone: string } | null;
  provider: { name: string } | null;
  business?: { id: string; name: string; vertical: string } | null;
}

function formatDuration(sec: number | null): string {
  if (sec === null) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function RecordingPlayer({ apiBase, canDelete }: { apiBase: string; canDelete: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { data, error, mutate } = useApi<{ ok: boolean; url: string; durationSec: number | null }>(expanded ? `${apiBase}/recording` : null);

  async function handleDelete() {
    if (!confirm("Delete this call recording? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await apiPost(`${apiBase}/recording`, undefined, "DELETE");
      toast.success("Recording deleted");
      setExpanded(false);
      mutate(undefined, { revalidate: false });
    } catch {
      toast.error("Could not delete recording");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call recording</CardTitle>
        {!expanded && (
          <Button variant="outline" size="sm" onClick={() => setExpanded(true)}>
            Load recording
          </Button>
        )}
      </CardHeader>
      {expanded && (
        <CardContent>
          {!data && !error ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : error ? (
            <p className="text-sm text-slate-400">No recording available for this call.</p>
          ) : (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio controls src={data!.url} className="h-9 flex-1" />
              {canDelete && (
                <Button variant="danger" size="sm" disabled={deleting} onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function TurnLatencyBar({ ms }: { ms: number }) {
  const pct = Math.min(100, (ms / 5000) * 100);
  const warn = ms > LATENCY_WARN_MS;
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${warn ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] font-medium ${warn ? "text-rose-600" : "text-slate-400"}`}>{Math.round(ms)}ms</span>
    </div>
  );
}

function TurnBubble({ t }: { t: CallTurn }) {
  if (t.role === "SYSTEM") {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] text-slate-400">
          <Clock className="h-3 w-3" />
          {t.toolName === "filler_played" && <span>filler played: “{t.text}”</span>}
          {t.toolName === "nudge_fired" && <span>silence nudge: “{t.text}”</span>}
          {t.toolName === "llm_timeout" && <span className="text-amber-600">LLM timeout — fallback line spoken</span>}
          {!["filler_played", "nudge_fired", "llm_timeout"].includes(t.toolName || "") && <span>{t.text}</span>}
        </div>
      </div>
    );
  }

  if (t.role === "TOOL") {
    const failed = t.toolResult && typeof t.toolResult === "object" && t.toolResult.ok === false;
    return (
      <div className="flex justify-center">
        <div className={`w-full max-w-md rounded-lg border px-3 py-2 text-xs ${failed ? "border-rose-200 bg-rose-50" : "border-indigo-100 bg-indigo-50/60"}`}>
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Wrench className="h-3 w-3" />
            {t.toolName}
            {t.durationMs !== null && <span className="text-[10px] font-normal text-slate-400">{t.durationMs}ms</span>}
            {failed && <AlertTriangle className="h-3 w-3 text-rose-500" />}
          </div>
          {t.toolArgs && <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words text-[10px] text-slate-500">{JSON.stringify(t.toolArgs)}</pre>}
          {t.toolResult && <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words text-[10px] text-slate-500">→ {JSON.stringify(t.toolResult)}</pre>}
        </div>
      </div>
    );
  }

  const isCaller = t.role === "CALLER";
  const lowConfidence = isCaller && t.sttConfidence !== null && t.sttConfidence < LOW_STT_CONFIDENCE;
  return (
    <div className={`flex ${isCaller ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${isCaller ? "bg-slate-50 text-slate-700" : "bg-[var(--accent-soft,#eef2ff)] text-slate-800"} ${lowConfidence ? "ring-1 ring-amber-300" : ""}`}>
        <div className="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-wide opacity-50">
          <span>{isCaller ? "Caller" : "Assistant"}</span>
          {lowConfidence && <span className="text-amber-600 opacity-100">low confidence ({(t.sttConfidence! * 100).toFixed(0)}%)</span>}
        </div>
        {t.text}
        {t.guardrailTriggered && <div className="mt-1 text-xs text-rose-500">⚠ guardrail triggered</div>}
        {!isCaller && t.latencyMs !== null && <TurnLatencyBar ms={t.latencyMs} />}
      </div>
    </div>
  );
}

export function CallDetailView({
  apiBase,
  backHref,
  backLabel,
  canDeleteRecording,
  showBusinessName,
}: {
  apiBase: string; // e.g. /api/business/calls/:id or /api/admin/platform/calls/:id
  backHref: string;
  backLabel: string;
  canDeleteRecording: boolean;
  showBusinessName?: boolean;
}) {
  const { data: detail } = useApi<{ ok: boolean; call: CallDetail; order: any; appointment: any }>(apiBase);
  const [turns, setTurns] = useState<CallTurn[]>([]);
  const lastSeqRef = useRef<number>(-1);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const isLive = detail ? !detail.call.endedAt : false;

  // Initial full load, then live-mode incremental polling via ?since=.
  // Deliberately not useApi's refreshInterval (which would re-fetch the
  // WHOLE transcript every tick) — a real call can accumulate 50+ turns,
  // and re-rendering/re-fetching all of them every 2s is exactly the kind
  // of thing that makes a "live" page feel janky instead of live.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function poll() {
      try {
        const since = lastSeqRef.current;
        const url = since >= 0 ? `${apiBase}/transcript?since=${since}` : `${apiBase}/transcript`;
        const r = await fetch(url, { credentials: "include" });
        const json = await r.json();
        if (cancelled || !json.ok) return;
        if (json.turns.length) {
          setTurns((prev) => (since >= 0 ? [...prev, ...json.turns] : json.turns));
          lastSeqRef.current = Math.max(lastSeqRef.current, ...json.turns.map((t: CallTurn) => t.seq));
        }
        setInitialLoaded(true);
        if (json.isLive && !cancelled) timer = setTimeout(poll, LIVE_POLL_MS);
      } catch {
        if (!cancelled) timer = setTimeout(poll, LIVE_POLL_MS);
      }
    }
    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // apiBase is effectively static per mount (route param), intentionally
    // not re-running this on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  const durationSec = detail?.call.endedAt
    ? Math.round((new Date(detail.call.endedAt).getTime() - new Date(detail.call.startedAt).getTime()) / 1000)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={backHref} className="text-slate-400 hover:text-slate-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-[#0f172a]">
          {backLabel === "" ? "Call detail" : "Call detail"}
        </h1>
        {isLive && (
          <span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" /> LIVE
          </span>
        )}
      </div>

      {!detail ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : (
        <>
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-slate-400">Caller</p>
                <p className="font-medium text-slate-900">{detail.call.contact?.name || detail.call.fromNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <StatusBadge status={detail.call.status} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Outcome</p>
                <OutcomeBadge outcome={detail.call.outcome} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Duration</p>
                <p className="font-medium text-slate-900">{isLive ? "in progress" : formatDuration(durationSec)}</p>
              </div>
              {showBusinessName && detail.call.business && (
                <div>
                  <p className="text-xs text-slate-400">Business</p>
                  <p className="font-medium text-slate-900">{detail.call.business.name}</p>
                  <Badge tone="default">{detail.call.business.vertical}</Badge>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400">Started</p>
                <p className="text-slate-600">{new Date(detail.call.startedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {(detail.order || detail.appointment) && (
            <Card>
              <CardHeader>
                <CardTitle>{detail.order ? "Linked order" : "Linked booking"}</CardTitle>
              </CardHeader>
              <CardContent>
                {detail.order && (
                  <p className="text-sm text-slate-700">
                    Order #{detail.order.orderNumber} — AUD ${(detail.order.totalCents / 100).toFixed(2)} — <StatusBadge status={detail.order.status} />
                  </p>
                )}
                {detail.appointment && (
                  <p className="text-sm text-slate-700">
                    {new Date(detail.appointment.startAt).toLocaleString()} with {detail.appointment.provider?.name || "—"} — <StatusBadge status={detail.appointment.status} />
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <RecordingPlayer apiBase={apiBase} canDelete={canDeleteRecording} />

          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!initialLoaded ? (
                <p className="text-sm text-slate-400">Loading…</p>
              ) : turns.length === 0 ? (
                <p className="text-sm text-slate-400">{isLive ? "Call in progress — waiting for the first turn…" : "No transcript captured for this call."}</p>
              ) : (
                turns.map((t) => <TurnBubble key={t.id} t={t} />)
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
