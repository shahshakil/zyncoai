"use client";
import { useState } from "react";
import { toast } from "sonner";
import { PieChart, Pie, Cell as PieCell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis } from "recharts";
import {
  AlertTriangle, PhoneCall, CheckCircle2, Kanban, Link2, Pill, Users, DollarSign, RefreshCw, Mail,
} from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { EmptyState } from "@/components/dashboard/ui/table";

// ---------------- Section 1: Triage Queue ----------------
function TriageQueue() {
  const { data, mutate } = useApi<any>("/api/business/clinical/triage", { refreshInterval: 20000 });
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  async function callBack(callId: string) {
    setBusyIds((s) => new Set(s).add(callId));
    try {
      await apiPost(`/api/business/clinical/triage/${callId}/call-back`);
      toast.success("Calling the patient back now");
    } catch {
      toast.error("Could not place the call");
    } finally {
      setBusyIds((s) => { const n = new Set(s); n.delete(callId); return n; });
    }
  }
  async function markReviewed(callId: string) {
    setBusyIds((s) => new Set(s).add(callId));
    try {
      await apiPost(`/api/business/clinical/triage/${callId}/review`);
      mutate();
    } catch {
      toast.error("Could not mark as reviewed");
    } finally {
      setBusyIds((s) => { const n = new Set(s); n.delete(callId); return n; });
    }
  }

  const flags = data?.flags || [];
  return (
    <Card className="border-t-4 border-t-[#dc2626]">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-[#dc2626]" /> Triage Queue</CardTitle>
        {!!data?.unreviewedCount && <span className="rounded-full bg-[#dc2626] px-2 py-0.5 text-xs font-semibold text-white">{data.unreviewedCount} unreviewed</span>}
      </CardHeader>
      <CardContent className="space-y-2">
        {!data ? <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          : flags.length === 0 ? <EmptyState title="No emergency flags — all clear" />
          : flags.map((f: any) => (
            <div key={f.callId} className={`rounded-xl border p-3 ${f.reviewed ? "border-slate-100 bg-slate-50" : "border-[#fecaca] bg-[#fef2f2]"}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{f.contactName || f.phone}</p>
                  <p className="text-xs text-[#dc2626]">{(f.concernKeyword || f.category || "Emergency detected")}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{new Date(f.timeFlagged).toLocaleString("en-AU")}</p>
                </div>
                {f.reviewed && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
              </div>
              {!f.reviewed && (
                <div className="mt-2 flex gap-2">
                  <Button size="sm" disabled={busyIds.has(f.callId)} onClick={() => callBack(f.callId)} className="bg-[#dc2626] text-white hover:bg-red-700">
                    <PhoneCall className="h-3.5 w-3.5" /> Call back now
                  </Button>
                  <Button size="sm" variant="outline" disabled={busyIds.has(f.callId)} onClick={() => markReviewed(f.callId)}>Mark reviewed</Button>
                </div>
              )}
            </div>
          ))}
      </CardContent>
    </Card>
  );
}

// ---------------- Section 2: Patient Status Pipeline (Kanban) ----------------
const APPT_TYPE_COLOR: Record<string, string> = {};
function typeColor(recordType: string): string {
  if (!APPT_TYPE_COLOR[recordType]) {
    const palette = ["#2563eb", "#7c3aed", "#0d9488", "#d97706", "#dc2626", "#16a34a"];
    APPT_TYPE_COLOR[recordType] = palette[Object.keys(APPT_TYPE_COLOR).length % palette.length];
  }
  return APPT_TYPE_COLOR[recordType];
}
const NEXT_STATUS: Record<string, string> = { Booked: "ARRIVED", Arrived: "IN_CONSULTATION", "In Consultation": "COMPLETED", "Checked Out": "FOLLOW_UP_NEEDED" };

function PatientPipeline() {
  const { data, mutate } = useApi<any>("/api/business/clinical/pipeline", { refreshInterval: 30000 });
  const [movingIds, setMovingIds] = useState<Set<string>>(new Set());

  async function moveNext(appointmentId: string, column: string) {
    const next = NEXT_STATUS[column];
    if (!next) return;
    setMovingIds((s) => new Set(s).add(appointmentId));
    try {
      await apiPost(`/api/business/appointments/${appointmentId}`, { status: next }, "PATCH");
      mutate();
    } catch {
      toast.error("Could not move patient");
    } finally {
      setMovingIds((s) => { const n = new Set(s); n.delete(appointmentId); return n; });
    }
  }

  return (
    <Card className="border-t-4 border-t-[#2563eb]">
      <CardHeader><CardTitle className="flex items-center gap-1.5"><Kanban className="h-4 w-4 text-[#2563eb]" /> Patient Status Pipeline</CardTitle></CardHeader>
      <CardContent>
        {!data ? <Skeleton className="h-64 w-full" /> : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {data.columns.map((col: any) => (
              <div key={col.name} className="rounded-xl bg-slate-50 p-2.5">
                <p className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">{col.name} <span className="rounded-full bg-white px-1.5 text-[10px]">{col.cards.length}</span></p>
                <div className="space-y-1.5">
                  {col.cards.map((c: any) => (
                    <div key={c.id} className="rounded-lg border-l-4 bg-white p-2 shadow-sm" style={{ borderLeftColor: typeColor(c.recordType) }}>
                      <p className="truncate text-xs font-medium text-slate-900">{c.contactName}</p>
                      <p className="truncate text-[10px] text-slate-400">{c.recordType} · {c.providerName || "Unassigned"}</p>
                      {NEXT_STATUS[col.name] && (
                        <button
                          disabled={movingIds.has(c.id)}
                          onClick={() => moveNext(c.id, col.name)}
                          className="mt-1 text-[10px] font-medium text-[#2563eb] hover:underline disabled:opacity-50"
                        >
                          Move to {col.name === "Booked" ? "Arrived" : col.name === "Arrived" ? "In Consultation" : col.name === "In Consultation" ? "Checked Out" : "Follow-up Needed"} →
                        </button>
                      )}
                    </div>
                  ))}
                  {col.cards.length === 0 && <p className="py-3 text-center text-[10px] text-slate-300">Empty</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------- Section 3: EHR Sync Status ----------------
const EHR_LABELS: Record<string, string> = { cliniko: "Cliniko", best_practice: "Best Practice", medical_director: "Medical Director", generic_webhook: "Generic Webhook" };

function EHRSyncStatus() {
  const { data: integrations } = useApi<any>("/api/business/integrations");
  const { data: syncStatus, mutate } = useApi<any>("/api/business/staff-sync/status");
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);

  async function syncNow(provider: string) {
    setSyncingProvider(provider);
    try {
      const res = await apiPost<any>(`/api/business/staff-sync/${provider}/preview`);
      toast.success(res?.records ? `Live check succeeded — ${res.records.length} records found. Review in Settings > Staff to import.` : "Live check succeeded");
      mutate();
    } catch {
      toast.error("Sync check failed — verify credentials in Settings > Integrations");
    } finally {
      setSyncingProvider(null);
    }
  }

  const providers = Object.keys(EHR_LABELS);
  const recentLogs = Object.entries(syncStatus?.lastSyncByProvider || {})
    .map(([provider, log]: [string, any]) => ({ provider, ...log }))
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 5);

  return (
    <Card className="border-t-4 border-t-[#16a34a]">
      <CardHeader><CardTitle className="flex items-center gap-1.5"><Link2 className="h-4 w-4 text-[#16a34a]" /> EHR Sync Status</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {!integrations ? <Skeleton className="h-40 w-full" /> : (
          <>
            <div className="space-y-1.5">
              {providers.map((p) => {
                const info = integrations.integrations?.[p];
                return (
                  <div key={p} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{EHR_LABELS[p]}</p>
                      <p className="text-[11px] text-slate-400">
                        {info?.connected ? `Connected${info.connectedAt ? ` · ${new Date(info.connectedAt).toLocaleDateString("en-AU")}` : ""}` : "Disconnected"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${info?.connected ? "bg-[#f0fdf4] text-[#16a34a]" : "bg-slate-100 text-slate-500"}`}>
                        {info?.connected ? (info.enabled ? "Active" : "Paused") : "Disconnected"}
                      </span>
                      {info?.connected && (
                        <Button size="sm" variant="outline" disabled={syncingProvider === p} onClick={() => syncNow(p)}>
                          <RefreshCw className="h-3 w-3" /> {syncingProvider === p ? "Checking…" : "Sync now"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Last 5 sync events</p>
              {recentLogs.length === 0 ? <p className="text-xs text-slate-400">No sync history yet.</p> : (
                <div className="space-y-1">
                  {recentLogs.map((l: any) => (
                    <div key={l.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{l.provider} — {new Date(l.startedAt).toLocaleString("en-AU")}</span>
                      <span className={l.status === "success" ? "text-[#16a34a]" : "text-[#dc2626]"}>{l.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------- Section 4: Prescription & Referral Requests ----------------
function PrescriptionRequests() {
  const { data, mutate } = useApi<any>("/api/business/clinical/prescriptions", { refreshInterval: 30000 });
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  async function notify(callId: string) {
    setBusyIds((s) => new Set(s).add(callId));
    try {
      await apiPost(`/api/business/clinical/prescriptions/${callId}/notify`);
      toast.success("Doctor notified by email");
      mutate();
    } catch (e: any) {
      toast.error(e?.message === "no_doctor_assigned_to_this_call" ? "No doctor with an email is linked to this call" : "Could not notify doctor");
    } finally {
      setBusyIds((s) => { const n = new Set(s); n.delete(callId); return n; });
    }
  }
  async function complete(callId: string) {
    setBusyIds((s) => new Set(s).add(callId));
    try {
      await apiPost(`/api/business/clinical/prescriptions/${callId}/complete`);
      mutate();
    } catch {
      toast.error("Could not update status");
    } finally {
      setBusyIds((s) => { const n = new Set(s); n.delete(callId); return n; });
    }
  }

  const requests = data?.requests || [];
  return (
    <Card className="border-t-4 border-t-[#7c3aed]">
      <CardHeader><CardTitle className="flex items-center gap-1.5"><Pill className="h-4 w-4 text-[#7c3aed]" /> Prescription & Referral Requests</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {!data ? <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          : requests.length === 0 ? <EmptyState title="No requests in the last 7 days" />
          : requests.map((r: any) => (
            <div key={r.callId} className="rounded-xl border border-slate-100 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{r.contactName} <span className="ml-1 rounded-full bg-[#f5f3ff] px-2 py-0.5 text-[10px] font-medium capitalize text-[#7c3aed]">{r.type}</span></p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">&ldquo;{r.excerpt}&rdquo;</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{new Date(r.date).toLocaleDateString("en-AU")}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${r.status === "Completed" ? "bg-[#f0fdf4] text-[#16a34a]" : r.status === "Notified" ? "bg-[#eff6ff] text-[#2563eb]" : "bg-[#fffbeb] text-[#d97706]"}`}>{r.status}</span>
              </div>
              {r.status !== "Completed" && (
                <div className="mt-2 flex gap-2">
                  {r.status === "Pending" && (
                    <Button size="sm" variant="outline" disabled={!r.doctorHasEmail || busyIds.has(r.callId)} onClick={() => notify(r.callId)}>
                      <Mail className="h-3 w-3" /> Notify doctor
                    </Button>
                  )}
                  <Button size="sm" variant="outline" disabled={busyIds.has(r.callId)} onClick={() => complete(r.callId)}>Mark completed</Button>
                </div>
              )}
            </div>
          ))}
      </CardContent>
    </Card>
  );
}

// ---------------- Section 5: Demographics ----------------
function Demographics() {
  const { data } = useApi<any>("/api/business/clinical/demographics", { refreshInterval: 60000 });
  return (
    <Card className="border-t-4 border-t-[#0d9488]">
      <CardHeader><CardTitle className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#0d9488]" /> Demographics</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {!data ? <Skeleton className="h-56 w-full" /> : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f0fdfa] p-3 text-center">
                <p className="text-2xl font-semibold text-[#0d9488]">{data.newVsReturning.new}</p>
                <p className="text-[11px] text-slate-500">New patients today</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-2xl font-semibold text-slate-900">{data.newVsReturning.returning}</p>
                <p className="text-[11px] text-slate-500">Returning today</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Age groups (today&apos;s patients)</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={data.ageGroups}>
                  <XAxis dataKey="label" fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0d9488" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Insurance type (last 30 days)</p>
              <div className="space-y-1">
                {data.insuranceTypes.length === 0 ? <p className="text-xs text-slate-400">No payer data recorded yet.</p> : data.insuranceTypes.map((t: any) => (
                  <div key={t.label} className="flex items-center justify-between text-xs"><span className="text-slate-600">{t.label}</span><span className="font-medium text-slate-900">{t.count}</span></div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Top services today</p>
              <div className="space-y-1">
                {data.topServicesToday.map((s: any) => (
                  <div key={s.label} className="flex items-center justify-between text-xs"><span className="text-slate-600">{s.label}</span><span className="font-medium text-slate-900">{s.count}</span></div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------- Section 6: Revenue Analytics ----------------
function RevenueAnalytics() {
  const { data } = useApi<any>("/api/business/clinical/revenue", { refreshInterval: 60000 });
  return (
    <Card className="border-t-4 border-t-[#d97706]">
      <CardHeader><CardTitle className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-[#d97706]" /> Revenue Analytics</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {!data ? <Skeleton className="h-56 w-full" /> : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#fffbeb] p-3 text-center">
                <p className="text-2xl font-semibold text-[#d97706]">AUD ${(data.revenueSavedTodayCents / 100).toLocaleString()}</p>
                <p className="text-[11px] text-slate-500">Revenue saved today</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-2xl font-semibold text-slate-900">{data.missedCallsPrevented}</p>
                <p className="text-[11px] text-slate-500">Simultaneous calls handled today</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Monthly revenue trend</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={data.monthlyTrend}>
                  <XAxis dataKey="month" fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v: number) => `$${(v / 100).toLocaleString()}`} />
                  <Bar dataKey="amountCents" fill="#d97706" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">ROI calculator</p>
              <p className="mt-2 text-sm text-slate-700">
                ZyncoAI costs <span className="font-semibold">${(data.roi.zyncoAiMonthlyCostCents / 100).toLocaleString()}/month</span> vs{" "}
                <span className="font-semibold">${(data.roi.humanReceptionistSalaryCentsMonthly / 100).toLocaleString()}/month</span> for a human receptionist.
              </p>
              <p className="mt-1 text-2xl font-bold text-[#16a34a]">${(data.roi.monthlySavingsCents / 100).toLocaleString()} saved/month</p>
              {(!data.roi.zyncoAiCostIsConfigured || data.roi.salaryFigureIsEstimate) && (
                <p className="mt-2 text-[10px] text-amber-600">
                  {!data.roi.zyncoAiCostIsConfigured && "No plan price is set on this account yet — showing $0 for ZyncoAI's cost. "}
                  Receptionist salary is an industry estimate, not a figure specific to this clinic.
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function ClinicalBillingDashboard() {
  const { role } = useDashboard();
  const isDoctor = role === "DOCTOR";
  const isOwnerAdmin = role === "OWNER" || role === "ADMIN";
  const showOperational = !isDoctor; // Pipeline / Prescriptions / Demographics — STAFF+OWNER/ADMIN
  // EHR Sync reuses Settings > Integrations / Staff Sync's existing
  // OWNER/ADMIN-only routes (they touch stored API credentials) — STAFF
  // gets everything else in this tab but not this section, same boundary
  // Settings already draws.
  const showEhrSync = isOwnerAdmin;
  const showBilling = isOwnerAdmin; // the "billing" STAFF/DOCTOR is explicitly excluded from

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-[#0f172a]">Clinical & Billing</h1>
        <p className="text-sm text-[#94a3b8]">{isDoctor ? "Your triage queue" : "Triage, patient flow, and clinic operations"}</p>
      </div>
      <TriageQueue />
      {showOperational && (
        <>
          <PatientPipeline />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {showEhrSync && <EHRSyncStatus />}
            <PrescriptionRequests />
          </div>
          <Demographics />
        </>
      )}
      {showBilling && <RevenueAnalytics />}
    </div>
  );
}
