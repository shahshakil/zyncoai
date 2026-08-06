"use client";
// Phase 3 — additive vertical-specific dashboard panels, rendered below the
// existing (vertical-agnostic) Overview content. One fetch, one dispatcher:
// the backend already decides which section to fill in based on the
// business's own vertical (see verticalPanels.ts), so this component just
// picks the matching renderer. Medical/Dental gets a compact summary here
// plus a link to the full Clinical tab (Triage Queue, EHR Sync) rather than
// duplicating that page.
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, Gauge, Car, Utensils, Scale, ArrowRight, PhoneCall, Home, Landmark, GraduationCap, ShoppingBag, Scissors, Layers } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { EmptyState } from "@/components/dashboard/ui/table";

interface MedicalPanels {
  triageResolutionRate: { reviewed: number; total: number; pct: number };
  noShowRisk: { appointmentId: string; contactName: string; startAt: string; riskPct: number; priorNoShows: number; priorTotal: number }[];
}
interface MechanicPanels {
  vehicleIntake: { appointmentId: string; contactName: string; vehicle: string | null; registrationNumber: string | null; status: string; startAt: string; serviceType: string | null }[];
  bayUtilization: { activeBays: number; totalBays: number; pct: number };
}
interface RestaurantPanels {
  coversDistribution: { hasData: boolean; buckets: { bucket: string; count: number }[] };
  dietaryAlerts: { appointmentId: string; contactName: string; startAt: string; dietaryNotes: string }[];
  peakRush: { heatmap: number[][] };
}
interface LawPanels {
  billableIntakeMinutes: { thisWeek: number; thisMonth: number };
  caseClassification: { label: string; count: number }[];
  urgencyIndex: { tier1: number; tier2: number; tier3: number; total: number };
}
// Shared shapes — reused across REAL_ESTATE/BANK/UNIVERSITY/RETAIL/OTHER,
// same as the backend's shared helpers (callbackQueue/outcomeBreakdown/
// busiestHours in verticalPanels.ts).
interface CallbackQueueItem { callId: string; contactName: string | null; phone: string; startedAt: string }
interface OutcomeBreakdown { hasData: boolean; total: number; breakdown: { outcome: string; count: number }[] }
interface HeatmapData { heatmap: number[][]; hasData: boolean }

interface RealEstatePanels {
  enquiriesByProperty: { hasData: boolean; items: { property: string; count: number }[] };
  listingTypeBreakdown: { hasData: boolean; items: { listingType: string; count: number }[] };
  upcomingShowings: { appointmentId: string; contactName: string; property: string | null; startAt: string }[];
  callbackQueue: CallbackQueueItem[];
}
interface BankPanels {
  enquiryBreakdown: OutcomeBreakdown;
  urgencyIndex: { tier1: number; tier2: number; tier3: number; total: number };
  afterHours: { captured: number; missed: number };
  kycStatusBreakdown: { hasData: boolean; items: { status: string; count: number }[] };
  callbackQueue: CallbackQueueItem[];
}
interface UniversityPanels {
  enquiryBreakdown: OutcomeBreakdown;
  peakLoad: HeatmapData;
  callbackQueue: CallbackQueueItem[];
  prospectiveStudents: { contactId: string; name: string; enrolmentStatus: string | null; department: string | null; capturedAt: string }[];
}
interface RetailPanels {
  enquiryBreakdown: OutcomeBreakdown;
  busiestHours: HeatmapData;
  callbackQueue: CallbackQueueItem[];
  returnsTracker: { hasData: boolean; byStatus: { status: string; count: number; claimedCents: number; refundedCents: number }[] };
}
interface SalonPanels {
  bookingsByService: { hasData: boolean; items: { service: string; count: number }[] };
  rebookingRate: { hasData: boolean; pct: number; repeatClients: number; totalClients: number };
  voucherSales: { hasData: boolean; byStatus: { status: string; count: number; issuedCents: number; redeemedCents: number }[] };
  attendance: { COMPLETED: number; CANCELLED: number; NO_SHOW: number; other: number };
}
interface OtherPanels {
  outcomeBreakdown: OutcomeBreakdown;
  busiestHours: HeatmapData;
  callbackQueue: CallbackQueueItem[];
  messagesTaken: number;
}

interface VerticalPanelsPayload {
  ok: boolean;
  vertical: string;
  medical?: MedicalPanels;
  mechanic?: MechanicPanels;
  restaurant?: RestaurantPanels;
  law?: LawPanels;
  realEstate?: RealEstatePanels;
  bank?: BankPanels;
  university?: UniversityPanels;
  retail?: RetailPanels;
  salon?: SalonPanels;
  other?: OtherPanels;
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleString("en-AU", { weekday: "short", hour: "numeric", minute: "2-digit" });
}

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// --- Shared sub-components -------------------------------------------------

function CallbackQueueCard({ items }: { items: CallbackQueueItem[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-1.5">
          <PhoneCall className="h-4 w-4 text-amber-500" />
          <CardTitle>Callback Queue</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState title="No callbacks requested" description="Calls where a caller asked to be called back show up here." />
        ) : (
          <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
            {items.map((c) => (
              <div key={c.callId} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#0f172a]">{c.contactName || c.phone}</p>
                  <p className="text-xs text-[#94a3b8]">{c.phone}</p>
                </div>
                <span className="shrink-0 text-[11px] text-[#64748b]">{timeLabel(c.startedAt)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OutcomeBreakdownCard({ data, title = "Enquiry Breakdown" }: { data: OutcomeBreakdown; title?: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {!data.hasData ? (
          <EmptyState title="No calls in the last 30 days" />
        ) : (
          <div className="space-y-1.5">
            {data.breakdown.map((o) => (
              <div key={o.outcome} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-1.5">
                <span className="truncate text-sm capitalize text-[#0f172a]">{o.outcome.replace(/_/g, " ")}</span>
                <span className="text-xs font-semibold text-[#64748b]">{o.count}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HeatRow({ day, row, maxHeat, color }: { day: string; row: number[]; maxHeat: number; color: string }) {
  return (
    <>
      <div className="pr-1 text-[10px] text-slate-400">{day}</div>
      {row.map((count, h) => (
        <div
          key={h}
          title={`${day} ${h}:00 — ${count} calls`}
          className="aspect-square rounded-[2px]"
          style={{ background: count === 0 ? "#f1f5f9" : `rgba(${color}, ${0.15 + (count / maxHeat) * 0.75})` }}
        />
      ))}
    </>
  );
}

function HeatmapCard({ data, title = "Busiest Hours", color = "37, 99, 235" }: { data: HeatmapData; title?: string; color?: string }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxHeat = Math.max(1, ...data.heatmap.flat());
  return (
    <Card className="lg:col-span-2">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {!data.hasData ? (
          <EmptyState title="No calls in the last 90 days" />
        ) : (
          <div className="grid grid-cols-[auto_repeat(24,1fr)] gap-[3px]">
            <div />
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="text-center text-[9px] text-slate-400">{h % 3 === 0 ? h : ""}</div>
            ))}
            {days.map((day, di) => (
              <HeatRow key={day} day={day} row={data.heatmap[di]} maxHeat={maxHeat} color={color} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerticalPanelsSection() {
  const { data: resp, isLoading } = useApi<VerticalPanelsPayload>("/api/business/vertical-panels", { refreshInterval: 60000 });

  if (isLoading || !resp) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (resp.medical) return <MedicalSection data={resp.medical} />;
  if (resp.mechanic) return <MechanicSection data={resp.mechanic} />;
  if (resp.restaurant) return <RestaurantSection data={resp.restaurant} />;
  if (resp.law) return <LawSection data={resp.law} />;
  if (resp.realEstate) return <RealEstateSection data={resp.realEstate} />;
  if (resp.bank) return <BankSection data={resp.bank} />;
  if (resp.university) return <UniversitySection data={resp.university} />;
  if (resp.retail) return <RetailSection data={resp.retail} />;
  if (resp.salon) return <SalonSection data={resp.salon} />;
  if (resp.other) return <OtherSection data={resp.other} />;
  return null;
}

function MedicalSection({ data }: { data: MedicalPanels }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <CardTitle>Triage Resolution Rate</CardTitle>
          </div>
          <Link href="/dashboard/clinical" className="flex items-center gap-1 text-xs font-medium text-[#2563eb] hover:underline">
            Full triage queue <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {data.triageResolutionRate.total === 0 ? (
            <EmptyState title="No emergency flags in the last 90 days" />
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full" style={{ background: `conic-gradient(#16a34a ${data.triageResolutionRate.pct * 3.6}deg, #e2e8f0 0deg)` }}>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#0f172a]">{data.triageResolutionRate.pct}%</div>
              </div>
              <p className="text-sm text-[#64748b]">{data.triageResolutionRate.reviewed} of {data.triageResolutionRate.total} emergency flags reviewed (last 90 days)</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>No-Show Risk Predictor</CardTitle></CardHeader>
        <CardContent>
          {data.noShowRisk.length === 0 ? (
            <EmptyState title="No risk signal yet" description="Shows once a patient has at least one past appointment on record." />
          ) : (
            <div className="space-y-2">
              {data.noShowRisk.map((r) => (
                <div key={r.appointmentId} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] p-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#0f172a]">{r.contactName}</p>
                    <p className="text-xs text-[#94a3b8]">{timeLabel(r.startAt)} · {r.priorNoShows}/{r.priorTotal} past no-shows</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.riskPct >= 50 ? "bg-[#fef2f2] text-[#dc2626]" : r.riskPct >= 25 ? "bg-[#fffbeb] text-[#d97706]" : "bg-[#f0fdf4] text-[#16a34a]"}`}>
                    {r.riskPct}% risk
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MechanicSection({ data }: { data: MechanicPanels }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Car className="h-4 w-4 text-orange-500" />
            <CardTitle>Vehicle Intake Log</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {data.vehicleIntake.length === 0 ? (
            <EmptyState title="No vehicles logged yet" />
          ) : (
            <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
              {data.vehicleIntake.map((v) => (
                <div key={v.appointmentId} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] p-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#0f172a]">{v.contactName}</p>
                    <p className="truncate text-xs text-[#94a3b8]">{v.vehicle || "No vehicle on file"}{v.registrationNumber ? ` · ${v.registrationNumber}` : ""}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-[#64748b]">{v.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Gauge className="h-4 w-4 text-orange-500" />
            <CardTitle>Bay Utilization</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {data.bayUtilization.totalBays === 0 ? (
            <EmptyState title="No bay capacity configured" description="Set your total bays in Settings to see utilization." />
          ) : (
            <>
              <div className="mb-2 flex items-end justify-between">
                <span className="text-2xl font-semibold text-[#0f172a]">{data.bayUtilization.activeBays}/{data.bayUtilization.totalBays}</span>
                <span className="text-sm text-[#94a3b8]">{data.bayUtilization.pct}% in use</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-orange-500" style={{ width: `${data.bayUtilization.pct}%` }} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RestaurantSection({ data }: { data: RestaurantPanels }) {
  const maxHeat = Math.max(1, ...data.peakRush.heatmap.flat());
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Covers Distribution</CardTitle></CardHeader>
        <CardContent>
          {!data.coversDistribution.hasData ? (
            <EmptyState title="No party-size data yet" description="Add 'Usual party size' on a customer profile to start building this chart." />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.coversDistribution.buckets}>
                <XAxis dataKey="bucket" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="#9f1239" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Utensils className="h-4 w-4 text-rose-600" />
            <CardTitle>Dietary Alert Ticker</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {data.dietaryAlerts.length === 0 ? (
            <EmptyState title="No dietary alerts in the next 48 hours" />
          ) : (
            <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
              {data.dietaryAlerts.map((d) => (
                <div key={d.appointmentId} className="rounded-xl border border-[#fecdd3] bg-[#fff1f2] p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#0f172a]">{d.contactName}</p>
                    <span className="text-[11px] text-[#9f1239]">{timeLabel(d.startAt)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#881337]">{d.dietaryNotes}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Peak Rush Heatmap</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-[auto_repeat(24,1fr)] gap-[3px]">
            <div />
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="text-center text-[9px] text-slate-400">{h % 3 === 0 ? h : ""}</div>
            ))}
            {days.map((day, di) => (
              <RestaurantHeatRow key={day} day={day} row={data.peakRush.heatmap[di]} maxHeat={maxHeat} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RestaurantHeatRow({ day, row, maxHeat }: { day: string; row: number[]; maxHeat: number }) {
  return (
    <>
      <div className="pr-1 text-[10px] text-slate-400">{day}</div>
      {row.map((count, h) => (
        <div
          key={h}
          title={`${day} ${h}:00 — ${count} reservations`}
          className="aspect-square rounded-[2px]"
          style={{ background: count === 0 ? "#f1f5f9" : `rgba(159, 18, 57, ${0.15 + (count / maxHeat) * 0.75})` }}
        />
      ))}
    </>
  );
}

function RealEstateSection({ data }: { data: RealEstatePanels }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Home className="h-4 w-4 text-indigo-600" />
            <CardTitle>Enquiries by Property</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {!data.enquiriesByProperty.hasData ? (
            <EmptyState title="No property enquiries yet" description="Set a caller's property address on their contact profile to start building this." />
          ) : (
            <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
              {data.enquiriesByProperty.items.map((p) => (
                <div key={p.property} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-1.5">
                  <span className="truncate text-sm text-[#0f172a]">{p.property}</span>
                  <span className="text-xs font-semibold text-[#64748b]">{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Buyer vs Tenant</CardTitle></CardHeader>
        <CardContent>
          {!data.listingTypeBreakdown.hasData ? (
            <EmptyState title="No listing-type data yet" description="Set 'Listing type' on a client profile to populate this." />
          ) : (
            <div className="space-y-2.5">
              {data.listingTypeBreakdown.items.map((l) => {
                const total = data.listingTypeBreakdown.items.reduce((s, i) => s + i.count, 0);
                return (
                  <div key={l.listingType}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-[#374151]">{l.listingType}</span>
                      <span className="font-medium text-[#0f172a]">{l.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(l.count / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Upcoming Inspections & Showings</CardTitle></CardHeader>
        <CardContent>
          {data.upcomingShowings.length === 0 ? (
            <EmptyState title="No inspections booked in the next 7 days" />
          ) : (
            <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
              {data.upcomingShowings.map((s) => (
                <div key={s.appointmentId} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] p-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#0f172a]">{s.contactName}</p>
                    <p className="truncate text-xs text-[#94a3b8]">{s.property || "No property on file"}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-[#64748b]">{timeLabel(s.startAt)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CallbackQueueCard items={data.callbackQueue} />
    </div>
  );
}

function BankSection({ data }: { data: BankPanels }) {
  const tiers = [
    { label: "Tier 1 — Urgent", count: data.urgencyIndex.tier1, color: "#dc2626" },
    { label: "Tier 2 — Callback", count: data.urgencyIndex.tier2, color: "#d97706" },
    { label: "Tier 3 — Standard", count: data.urgencyIndex.tier3, color: "#16a34a" },
  ];
  const afterHoursTotal = data.afterHours.captured + data.afterHours.missed;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <OutcomeBreakdownCard data={data.enquiryBreakdown} />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Landmark className="h-4 w-4 text-slate-600" />
            <CardTitle>Urgency Tier Index</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {data.urgencyIndex.total === 0 ? (
            <EmptyState title="No calls in the last 30 days" />
          ) : (
            <div className="space-y-2.5">
              {tiers.map((t) => (
                <div key={t.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-[#374151]">{t.label}</span>
                    <span className="font-medium text-[#0f172a]">{t.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${(t.count / data.urgencyIndex.total) * 100}%`, background: t.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>After-Hours Calls</CardTitle></CardHeader>
        <CardContent>
          {afterHoursTotal === 0 ? (
            <EmptyState title="No after-hours calls in the last 30 days" />
          ) : (
            <>
              <div className="mb-2 flex items-end justify-between">
                <span className="text-2xl font-semibold text-[#0f172a]">{data.afterHours.captured}/{afterHoursTotal}</span>
                <span className="text-sm text-[#94a3b8]">captured after hours</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(data.afterHours.captured / afterHoursTotal) * 100}%` }} />
              </div>
              <p className="mt-1 text-xs text-[#94a3b8]">{data.afterHours.missed} missed</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>KYC Status</CardTitle></CardHeader>
        <CardContent>
          {!data.kycStatusBreakdown.hasData ? (
            <EmptyState title="No KYC status recorded" description="Set 'KYC status' on a customer profile to populate this." />
          ) : (
            <div className="space-y-1.5">
              {data.kycStatusBreakdown.items.map((k) => (
                <div key={k.status} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-1.5">
                  <span className="truncate text-sm text-[#0f172a]">{k.status}</span>
                  <span className="text-xs font-semibold text-[#64748b]">{k.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CallbackQueueCard items={data.callbackQueue} />
    </div>
  );
}

function UniversitySection({ data }: { data: UniversityPanels }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <OutcomeBreakdownCard data={data.enquiryBreakdown} title="Enquiry Breakdown (Admissions/Fees/Courses require call-topic classification — a future capture-layer feature, not built here; this uses the real call-outcome signal instead)" />
      <CallbackQueueCard items={data.callbackQueue} />

      <HeatmapCard data={data.peakLoad} title="Peak Enquiry Load" color="79, 70, 229" />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-indigo-600" />
            <CardTitle>Prospective Student Capture</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {data.prospectiveStudents.length === 0 ? (
            <EmptyState title="No new enquiries in the last 30 days" />
          ) : (
            <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
              {data.prospectiveStudents.map((s) => (
                <div key={s.contactId} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] p-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#0f172a]">{s.name}</p>
                    <p className="truncate text-xs text-[#94a3b8]">{[s.department, s.enrolmentStatus].filter(Boolean).join(" · ") || "No details on file"}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-[#64748b]">{timeLabel(s.capturedAt)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RetailSection({ data }: { data: RetailPanels }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <OutcomeBreakdownCard data={data.enquiryBreakdown} title="Enquiry Breakdown (product/stock-question detail requires call-topic classification — not built here; this uses the real call-outcome signal instead)" />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="h-4 w-4 text-emerald-600" />
            <CardTitle>Returns & Warranty Tracker</CardTitle>
          </div>
          <Link href="/dashboard/claims" className="flex items-center gap-1 text-xs font-medium text-[#2563eb] hover:underline">
            All returns <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {!data.returnsTracker.hasData ? (
            <EmptyState title="No returns in the last 90 days" />
          ) : (
            <div className="space-y-1.5">
              {data.returnsTracker.byStatus.map((r) => (
                <div key={r.status} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-1.5">
                  <span className="text-sm text-[#0f172a]">{r.status}</span>
                  <span className="text-xs font-semibold text-[#64748b]">{r.count} · {money(r.claimedCents)} claimed</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <HeatmapCard data={data.busiestHours} title="Busiest Call Hours" color="16, 185, 129" />
      <CallbackQueueCard items={data.callbackQueue} />
    </div>
  );
}

function SalonSection({ data }: { data: SalonPanels }) {
  const attendanceTotal = data.attendance.COMPLETED + data.attendance.CANCELLED + data.attendance.NO_SHOW + data.attendance.other;
  const attendanceRows = [
    { label: "Completed", count: data.attendance.COMPLETED, color: "#16a34a" },
    { label: "Cancelled", count: data.attendance.CANCELLED, color: "#d97706" },
    { label: "No-show", count: data.attendance.NO_SHOW, color: "#dc2626" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Scissors className="h-4 w-4 text-fuchsia-600" />
            <CardTitle>Bookings by Service</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {!data.bookingsByService.hasData ? (
            <EmptyState title="No service data yet" description="Builds up as new bookings capture what the caller asked for — won't include appointments booked before this was added." />
          ) : (
            <div className="space-y-1.5">
              {data.bookingsByService.items.map((s) => (
                <div key={s.service} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-1.5">
                  <span className="truncate text-sm text-[#0f172a]">{s.service}</span>
                  <span className="text-xs font-semibold text-[#64748b]">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Rebooking Rate</CardTitle></CardHeader>
        <CardContent>
          {!data.rebookingRate.hasData ? (
            <EmptyState title="No bookings yet" />
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full" style={{ background: `conic-gradient(#c026d3 ${data.rebookingRate.pct * 3.6}deg, #e2e8f0 0deg)` }}>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#0f172a]">{data.rebookingRate.pct}%</div>
              </div>
              <p className="text-sm text-[#64748b]">{data.rebookingRate.repeatClients} of {data.rebookingRate.totalClients} clients have booked more than once</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Voucher Sales</CardTitle></CardHeader>
        <CardContent>
          {!data.voucherSales.hasData ? (
            <EmptyState title="No gift vouchers in the last 90 days" description="Vouchers are tracked under Claims → Gift Vouchers." />
          ) : (
            <div className="space-y-1.5">
              {data.voucherSales.byStatus.map((v) => (
                <div key={v.status} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-1.5">
                  <span className="text-sm text-[#0f172a]">{v.status}</span>
                  <span className="text-xs font-semibold text-[#64748b]">{v.count} · {money(v.issuedCents)} issued</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>No-show / Cancellation View</CardTitle></CardHeader>
        <CardContent>
          {attendanceTotal === 0 ? (
            <EmptyState title="No appointments in the last 90 days" />
          ) : (
            <div className="space-y-2.5">
              {attendanceRows.map((a) => (
                <div key={a.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-[#374151]">{a.label}</span>
                    <span className="font-medium text-[#0f172a]">{a.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${(a.count / attendanceTotal) * 100}%`, background: a.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OtherSection({ data }: { data: OtherPanels }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-slate-600" />
            <CardTitle>Messages Taken</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-[#0f172a]">{data.messagesTaken}</p>
          <p className="text-xs text-[#94a3b8]">calls where caller details were captured (last 30 days)</p>
        </CardContent>
      </Card>

      <OutcomeBreakdownCard data={data.outcomeBreakdown} title="Call Outcomes" />
      <HeatmapCard data={data.busiestHours} color="71, 85, 105" />
      <CallbackQueueCard items={data.callbackQueue} />
    </div>
  );
}

function LawSection({ data }: { data: LawPanels }) {
  const tiers = [
    { label: "Tier 1 — Urgent", count: data.urgencyIndex.tier1, color: "#dc2626" },
    { label: "Tier 2 — Callback", count: data.urgencyIndex.tier2, color: "#d97706" },
    { label: "Tier 3 — Standard", count: data.urgencyIndex.tier3, color: "#16a34a" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>Billable Intake Minutes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-2xl font-semibold text-[#0f172a]">{data.billableIntakeMinutes.thisWeek}m</p>
            <p className="text-xs text-[#94a3b8]">AI intake minutes this week</p>
          </div>
          <div className="border-t border-[#e2e8f0] pt-3">
            <p className="text-lg font-semibold text-[#0f172a]">{data.billableIntakeMinutes.thisMonth}m</p>
            <p className="text-xs text-[#94a3b8]">This month</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Case Classification</CardTitle></CardHeader>
        <CardContent>
          {data.caseClassification.length === 0 ? (
            <EmptyState title="No matter types recorded" description="Set 'Matter type' on a client profile to populate this." />
          ) : (
            <div className="space-y-1.5">
              {data.caseClassification.map((m) => (
                <div key={m.label} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-1.5">
                  <span className="truncate text-sm text-[#0f172a]">{m.label}</span>
                  <span className="text-xs font-semibold text-[#64748b]">{m.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-slate-600" />
            <CardTitle>Urgency Tier Index</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {data.urgencyIndex.total === 0 ? (
            <EmptyState title="No calls in the last 30 days" />
          ) : (
            <div className="space-y-2.5">
              {tiers.map((t) => (
                <div key={t.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-[#374151]">{t.label}</span>
                    <span className="font-medium text-[#0f172a]">{t.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${(t.count / data.urgencyIndex.total) * 100}%`, background: t.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
