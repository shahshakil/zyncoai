"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  PieChart, Pie, Cell as PieCell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
} from "recharts";
import { Phone, Radio, Activity, Moon, PhoneForwarded, Headphones, Play, Download, AlertTriangle } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { EmptyState } from "@/components/dashboard/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";

const SENTIMENT_EMOJI: Record<string, string> = { positive: "😊", neutral: "😐", negative: "😟" };

function elapsedLabel(startedAt: string, tick: number): string {
  const secs = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)) + tick * 0;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface LiveCall {
  id: string; contactName: string | null; fromNumber: string; startedAt: string; status: string;
  sentiment: "positive" | "neutral" | "negative"; canTransfer: boolean;
  transcript: { seq: number; role: string; text: string; at: string }[];
}

function LiveCallCentre() {
  const { data, mutate } = useApi<{ ok: boolean; calls: LiveCall[] }>("/api/business/ai-operations/live", { refreshInterval: 3000 });
  const [tick, setTick] = useState(0);
  const [transcriptCall, setTranscriptCall] = useState<LiveCall | null>(null);
  const [transferringIds, setTransferringIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  async function transfer(id: string) {
    setTransferringIds((s) => new Set(s).add(id));
    try {
      await apiPost(`/api/business/ai-operations/calls/${id}/transfer`);
      toast.success("Call transferred to a human");
      mutate();
    } catch (e: any) {
      toast.error(e?.message === "transfer_number_not_configured" ? "No transfer number configured in Settings" : "Could not transfer this call");
    } finally {
      setTransferringIds((s) => { const n = new Set(s); n.delete(id); return n; });
    }
  }

  const calls = data?.calls || [];
  return (
    <Card className="overflow-hidden border-0">
      <div className="rounded-2xl bg-[#0f172a] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white"><Radio className="h-4 w-4 text-emerald-400" /> Live Call Centre</h3>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> {calls.length} active
          </span>
        </div>
        {!data ? (
          <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-[#1e293b]" />)}</div>
        ) : calls.length === 0 ? (
          <div className="rounded-xl border border-[#1e293b] bg-[#1e293b] p-8 text-center text-sm text-[#94a3b8]">No active calls right now</div>
        ) : (
          <div className="space-y-2">
            {calls.map((c) => (
              <div key={c.id} className="rounded-xl bg-[#1e293b] p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" /></span>
                    <span className="text-sm font-medium text-[#e2e8f0]">{c.contactName || c.fromNumber}</span>
                    <span title={`Sentiment: ${c.sentiment}`}>{SENTIMENT_EMOJI[c.sentiment]}</span>
                  </div>
                  <span className="font-mono text-sm text-emerald-400">{elapsedLabel(c.startedAt, tick)}</span>
                </div>
                <p className="mt-1.5 truncate text-xs text-[#94a3b8]">{c.transcript[c.transcript.length - 1]?.text || "Listening…"}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" className="border-[#334155] text-[#e2e8f0] hover:bg-[#334155]" onClick={() => setTranscriptCall(c)}>View Live Transcript</Button>
                  <Button size="sm" disabled={!c.canTransfer || transferringIds.has(c.id)} onClick={() => transfer(c.id)} className="bg-amber-600 text-white hover:bg-amber-700">
                    <PhoneForwarded className="h-3.5 w-3.5" /> {transferringIds.has(c.id) ? "Transferring…" : "Transfer to human"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!transcriptCall} onOpenChange={(o) => !o && setTranscriptCall(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Live transcript — {transcriptCall?.contactName || transcriptCall?.fromNumber}</DialogTitle></DialogHeader>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {transcriptCall?.transcript.length ? transcriptCall.transcript.map((t) => (
              <div key={t.seq} className={`rounded-lg p-2 text-sm ${t.role === "CALLER" ? "bg-slate-100 text-slate-800" : "bg-blue-50 text-blue-900"}`}>
                <span className="mb-0.5 block text-[10px] font-semibold uppercase text-slate-400">{t.role === "CALLER" ? "Caller" : t.role === "ASSISTANT" ? "AI" : "System"}</span>
                {t.text}
              </div>
            )) : <p className="text-sm text-slate-500">No transcript yet.</p>}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function EscalationTriggerRow({ label, count, highlight }: { label: string; count: number; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${highlight && count > 0 ? "bg-[#fef2f2]" : "bg-slate-50"}`}>
      <span className={`flex items-center gap-1.5 text-sm ${highlight && count > 0 ? "font-medium text-[#dc2626]" : "text-slate-700"}`}>
        {highlight && count > 0 && <AlertTriangle className="h-3.5 w-3.5" />} {label}
      </span>
      <span className={`text-sm font-semibold ${highlight && count > 0 ? "text-[#dc2626]" : "text-slate-900"}`}>{count}</span>
    </div>
  );
}

function AIPerformanceMetrics() {
  const { data } = useApi<any>("/api/business/ai-operations/metrics", { refreshInterval: 30000 });
  const donutData = data ? [
    { name: "Resolved by AI", value: data.resolutionRatePct, color: "#16a34a" },
    { name: "Escalated", value: data.escalationRatePct, color: "#7c3aed" },
  ] : [];
  const maxHeat = data ? Math.max(1, ...data.heatmap.flat()) : 1;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Card className="border-t-4 border-t-[#7c3aed]">
      <CardHeader><CardTitle className="flex items-center gap-1.5"><Activity className="h-4 w-4 text-[#7c3aed]" /> AI Performance Metrics</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        {!data ? <Skeleton className="h-64 w-full" /> : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                      {donutData.map((d) => <PieCell key={d.name} fill={d.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-1 flex justify-center gap-4 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[#16a34a]" /> Resolved {data.resolutionRatePct}%</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[#7c3aed]" /> Escalated {data.escalationRatePct}%</span>
                </div>
                <p className="mt-2 text-center text-[11px] text-slate-400">{data.escalationRateChangeVsYesterday >= 0 ? "+" : ""}{data.escalationRateChangeVsYesterday}pt vs yesterday</p>
              </div>
              <div className="space-y-1.5">
                {data.escalationTriggers.map((t: any) => <EscalationTriggerRow key={t.key} label={t.label} count={t.count} highlight={t.highlight} />)}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Average call duration by hour (today)</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={data.avgDurationByHour}>
                  <XAxis dataKey="hour" tickFormatter={(h) => `${h}h`} fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} interval={2} />
                  <Tooltip formatter={(v: number) => `${v}m avg`} labelFormatter={(h) => `${h}:00`} />
                  <Bar dataKey="avgMinutes" fill="#7c3aed" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Peak call hours (last 30 days)</p>
              <div className="overflow-x-auto">
                <div className="inline-grid gap-[2px]" style={{ gridTemplateColumns: "32px repeat(24, minmax(10px,1fr))" }}>
                  <div />
                  {Array.from({ length: 24 }).map((_, h) => <div key={h} className="text-center text-[8px] text-slate-400">{h % 3 === 0 ? h : ""}</div>)}
                  {days.map((day, di) => (
                    <FragmentRow key={day} day={day} row={data.heatmap[di]} maxHeat={maxHeat} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function FragmentRow({ day, row, maxHeat }: { day: string; row: number[]; maxHeat: number }) {
  return (
    <>
      <div className="pr-1 text-[10px] text-slate-400">{day}</div>
      {row.map((count, h) => {
        const intensity = count / maxHeat;
        return (
          <div
            key={h}
            title={`${day} ${h}:00 — ${count} calls`}
            className="aspect-square rounded-[2px]"
            style={{ background: count === 0 ? "#f1f5f9" : `rgba(124, 58, 237, ${0.15 + intensity * 0.75})` }}
          />
        );
      })}
    </>
  );
}

function AfterHoursAnalytics() {
  const { data } = useApi<any>("/api/business/ai-operations/after-hours", { refreshInterval: 30000 });
  return (
    <Card className="border-t-4 border-t-[#0d9488]">
      <CardHeader><CardTitle className="flex items-center gap-1.5"><Moon className="h-4 w-4 text-[#0d9488]" /> After Hours Analytics</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {!data ? <Skeleton className="h-48 w-full" /> : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f0fdfa] p-3 text-center">
                <p className="text-2xl font-semibold text-[#0d9488]">{data.callsSavedFromVoicemail}</p>
                <p className="text-[11px] text-slate-500">Calls saved from voicemail</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-2xl font-semibold text-slate-900">{data.afterHoursCallVolume30d}</p>
                <p className="text-[11px] text-slate-500">After-hours calls (30d)</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Time distribution</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={data.timeDistribution}>
                  <XAxis dataKey="hour" tickFormatter={(h) => `${h}h`} fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} interval={2} />
                  <Tooltip labelFormatter={(h) => `${h}:00`} />
                  <Bar dataKey="count" fill="#0d9488" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Most common after-hours requests</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={data.requestCategories} dataKey="count" nameKey="label" outerRadius={65} label={(e: any) => (e.count > 0 ? e.label : "")}>
                    {data.requestCategories.map((_: any, i: number) => (
                      <PieCell key={i} fill={["#0d9488", "#2dd4bf", "#5eead4", "#99f6e4", "#134e4a"][i % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function TransferAnalytics() {
  const { data } = useApi<any>("/api/business/ai-operations/transfers", { refreshInterval: 30000 });
  return (
    <Card className="border-t-4 border-t-[#d97706]">
      <CardHeader><CardTitle className="flex items-center gap-1.5"><PhoneForwarded className="h-4 w-4 text-[#d97706]" /> Transfer Analytics</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {!data ? <Skeleton className="h-40 w-full" /> : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#fffbeb] p-3 text-center">
                <p className="text-2xl font-semibold text-[#d97706]">{data.totalTransfersToday}</p>
                <p className="text-[11px] text-slate-500">Transfers today</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-2xl font-semibold text-slate-900">{data.avgTimeBeforeTransferMinutes != null ? `${data.avgTimeBeforeTransferMinutes}m` : "—"}</p>
                <p className="text-[11px] text-slate-500">Avg time before transfer</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {data.reasons.map((r: any) => (
                <div key={r.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">{r.label}</span>
                  <span className="font-semibold text-slate-900">{r.count}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              {data.transfersRouteTo
                ? `All transfers route to your configured number (${data.transfersRouteTo}) — per-staff attribution isn't tracked since this account uses a single shared transfer number.`
                : "No transfer number configured yet — set one in Settings > Integrations > Call routing."}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function AudioPlayback() {
  const { data } = useApi<any>("/api/business/ai-operations/recordings");
  return (
    <Card className="border-t-4 border-t-[#2563eb]">
      <CardHeader><CardTitle className="flex items-center gap-1.5"><Headphones className="h-4 w-4 text-[#2563eb]" /> Audio Playback</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {!data ? <Skeleton className="h-48 w-full" /> : (
          <>
            {!data.recordingEnabled && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                Recording not enabled for this account. Enable Twilio call recording to unlock playback, download, and speed-controlled review here.
              </div>
            )}
            {data.calls.length === 0 ? <EmptyState title="No completed calls yet" /> : (
              <div className="max-h-80 space-y-1.5 overflow-y-auto">
                {data.calls.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 p-2.5 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{c.contactName || c.fromNumber}</p>
                      <p className="text-[11px] text-slate-400">{c.durationLabel}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button size="sm" variant="outline" disabled title="Recording not enabled"><Play className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="outline" disabled title="Recording not enabled"><Download className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function AIOperationsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-lg font-semibold text-[#0f172a]"><Phone className="h-5 w-5" /> AI Voice Operations</h1>
        <p className="text-sm text-[#94a3b8]">Real-time call centre, AI performance, and telephony analytics</p>
      </div>
      <LiveCallCentre />
      <AIPerformanceMetrics />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AfterHoursAnalytics />
        <TransferAnalytics />
      </div>
      <AudioPlayback />
    </div>
  );
}
