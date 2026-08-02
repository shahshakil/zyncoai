"use client";
// My Calendar (Part 4, doctor portal) — interactive weekly view with a
// timesheet-style grid, built on the existing GET /export/staff-schedule
// data route (already scopes to the caller's own Provider when role is
// DOCTOR). DOCTOR sees the single-provider days-as-columns view below;
// OWNER/ADMIN/STAFF get a Cliniko-style staff-as-columns day view instead
// (StaffCalendarView), reusing the exact same schedule endpoint — for those
// roles it already returns every active provider's appointments for the
// week, day-filtered client-side so switching days doesn't need a new
// request unless it crosses into a different week.
import { useState } from "react";
import Link from "next/link";
import { Plus, Printer, Download, ChevronLeft, ChevronRight, CalendarX2 } from "lucide-react";
import { toast } from "sonner";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps } from "@/lib/verticalOps";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { EmptyState } from "@/components/dashboard/ui/table";
import { StatusBadge } from "@/components/dashboard/ui/badge";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { triggerPrint } from "@/lib/exportUtils";
import { CHART_COLORS } from "@/components/dashboard/ui/chartTheme";
import { CreateBookingDialog, VERTICAL_COPY } from "@/app/dashboard/bookings/page";

const SLOT_START_HOUR = 7;
const SLOT_END_HOUR = 19;
const SLOT_MIN = 30;
const RECORD_TYPE_COLORS: Record<string, string> = {
  Consultation: CHART_COLORS.primary, Checkup: CHART_COLORS.success, Procedure: CHART_COLORS.warning, Appointment: "#64748b",
};
const ROW_STATUS_BORDER: Record<string, string> = {
  REQUESTED: "#fbbf24", CONFIRMED: "#fbbf24", RESCHEDULED: "#fbbf24",
  ARRIVED: "#3b82f6", COMPLETED: "#10b981", NO_SHOW: "#f43f5e", CANCELLED: "#94a3b8",
};

interface ScheduleAppt { id: string; startAt: string; endAt: string; recordType: string | null; status: string; contactId?: string; contactName?: string }
interface ScheduleProviderRow { id: string; name: string; title: string | null; appointments: ScheduleAppt[] }
interface ScheduleResponse { ok: boolean; weekStart: string; weekEnd: string; providers: ScheduleProviderRow[] }

function buildSlots(startHour: number, endHour: number): string[] {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += SLOT_MIN) slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
}

function mondayOf(d: Date): Date {
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default function CalendarPage() {
  const { role, providerName, business } = useDashboard();
  const ops = getVerticalOps(business.vertical);
  const [weekAnchor, setWeekAnchor] = useState(() => mondayOf(new Date()));
  const weekParam = weekAnchor.toISOString().slice(0, 10);
  const { data } = useApi<ScheduleResponse>(role === "DOCTOR" ? `/api/business/export/staff-schedule?week=${weekParam}` : null);

  if (role !== "DOCTOR") {
    return <StaffCalendarView copy={VERTICAL_COPY[business.vertical] || VERTICAL_COPY.OTHER} />;
  }

  const slots = buildSlots(SLOT_START_HOUR, SLOT_END_HOUR);
  const weekDays = Array.from({ length: 7 }).map((_, i) => new Date(weekAnchor.getTime() + i * 86400000));
  const appointments = data?.providers[0]?.appointments || [];

  function apptAt(day: Date, slot: string): ScheduleAppt | undefined {
    const [h, m] = slot.split(":").map(Number);
    return appointments.find((a) => {
      const start = new Date(a.startAt);
      return start.toDateString() === day.toDateString() && start.getHours() === h && Math.floor(start.getMinutes() / SLOT_MIN) * SLOT_MIN === m;
    });
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">My Calendar</h1>
          <p className="text-sm text-slate-400">{providerName || "You"} · Week of {weekAnchor.toLocaleDateString("en-AU")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setWeekAnchor(new Date(weekAnchor.getTime() - 7 * 86400000))}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setWeekAnchor(mondayOf(new Date()))}>This week</Button>
          <Button variant="outline" size="sm" onClick={() => setWeekAnchor(new Date(weekAnchor.getTime() + 7 * 86400000))}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => triggerPrint("print")}><Printer className="h-4 w-4" /> Print</Button>
          <Button variant="outline" size="sm" onClick={() => triggerPrint("pdf")}><Download className="h-4 w-4" /> Download PDF</Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto p-2">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="w-16 border-b border-slate-200 p-2 text-left text-slate-400">Time</th>
                {weekDays.map((d) => (
                  <th key={d.toISOString()} className="border-b border-slate-200 p-2 text-center font-medium text-slate-700">
                    {d.toLocaleDateString("en-AU", { weekday: "short" })}<br />
                    <span className="font-normal text-slate-400">{d.toLocaleDateString("en-AU", { day: "2-digit", month: "short" })}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot} className="border-b border-slate-100">
                  <td className="p-1.5 align-top text-slate-400">{slot}</td>
                  {weekDays.map((day) => {
                    const appt = apptAt(day, slot);
                    return (
                      <td key={day.toISOString() + slot} className="p-1 align-top">
                        {appt ? (
                          <Link
                            href={appt.contactId ? `/dashboard/contacts/${appt.contactId}` : "#"}
                            className="block rounded-md border-l-4 bg-slate-50 px-2 py-1 text-slate-700 hover:bg-slate-100"
                            style={{ borderLeftColor: RECORD_TYPE_COLORS[appt.recordType || "Appointment"] || "#64748b" }}
                          >
                            <p className="truncate font-medium">{appt.contactName || ops?.contactLabel || "Patient"}</p>
                            <p className="truncate text-[10px] text-slate-400">{appt.recordType || "Appointment"}</p>
                          </Link>
                        ) : (
                          <div className="h-8 rounded-md border border-dashed border-slate-100" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data && !appointments.length && <div className="p-4"><EmptyState icon={CalendarX2} title="No appointments this week" description="Free slots are shown as empty cells above." /></div>}
      </Card>
    </div>
  );
}

// Cliniko-style day view for OWNER/ADMIN/STAFF: staff across the top, time
// slots down the side, click an empty cell to quick-book that staff member
// at that exact time, click an existing appointment to view/change it.
function StaffCalendarView({ copy }: { copy: (typeof VERTICAL_COPY)[string] }) {
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const weekAnchor = mondayOf(selectedDay);
  const weekParam = weekAnchor.toISOString().slice(0, 10);
  const { data, isLoading, mutate } = useApi<ScheduleResponse>(`/api/business/export/staff-schedule?week=${weekParam}`);
  const { data: providersData, isLoading: providersLoading, mutate: mutateProviders } = useApi<{ providers: { id: string; name: string; googleCalendarConnected?: boolean }[] }>("/api/business/providers");

  const [quickBook, setQuickBook] = useState<{ providerId: string; time: string } | null>(null);
  const [detail, setDetail] = useState<{ providerName: string; appt: ScheduleAppt } | null>(null);

  const slots = buildSlots(8, 18);
  const providers = data?.providers || [];

  function apptAt(providerId: string, slot: string): ScheduleAppt | undefined {
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return undefined;
    const [h, m] = slot.split(":").map(Number);
    return provider.appointments.find((a) => {
      const start = new Date(a.startAt);
      return start.toDateString() === selectedDay.toDateString() && start.getHours() === h && Math.floor(start.getMinutes() / SLOT_MIN) * SLOT_MIN === m;
    });
  }

  function shiftDay(deltaDays: number) {
    setSelectedDay((d) => new Date(d.getTime() + deltaDays * 86400000));
  }

  async function updateApptStatus(id: string, status: string) {
    try {
      await apiPost(`/api/business/appointments/${id}`, { status }, "PATCH");
      toast.success("Updated");
      mutate();
      setDetail(null);
    } catch {
      toast.error("Could not update booking");
    }
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Calendar</h1>
          <p className="text-sm text-slate-400">{selectedDay.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => shiftDay(-1)}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedDay(new Date())}>Today</Button>
          <Button variant="outline" size="sm" onClick={() => shiftDay(1)}><ChevronRight className="h-4 w-4" /></Button>
          <Button size="sm" onClick={() => { mutateProviders(); setQuickBook({ providerId: providers[0]?.id || "", time: "" }); }}>
            <Plus className="h-4 w-4" /> New {copy.noun.toLowerCase()}
          </Button>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
        ) : !providers.length ? (
          <EmptyState
            icon={CalendarX2}
            title="No staff added yet"
            description="Add staff in Settings to start scheduling appointments."
            action={<Link href="/dashboard/settings?tab=staff"><Button size="sm">Add staff in Settings → Staff</Button></Link>}
          />
        ) : (
          <div className="overflow-x-auto p-2">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="w-16 border-b border-slate-200 p-2 text-left text-slate-400">Time</th>
                  {providers.map((p) => (
                    <th key={p.id} className="min-w-[140px] border-b border-slate-200 p-2 text-center font-medium text-slate-700">
                      {p.name}{p.title ? <span className="block font-normal text-slate-400">{p.title}</span> : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot} className="border-b border-slate-100">
                    <td className="p-1.5 align-top text-slate-400">{slot}</td>
                    {providers.map((p) => {
                      const appt = apptAt(p.id, slot);
                      return (
                        <td key={p.id + slot} className="p-1 align-top">
                          {appt ? (
                            <button
                              onClick={() => setDetail({ providerName: p.name, appt })}
                              className="block w-full rounded-md border-l-4 bg-slate-50 px-2 py-1 text-left text-slate-700 hover:bg-slate-100"
                              style={{ borderLeftColor: ROW_STATUS_BORDER[appt.status] || "#64748b" }}
                            >
                              <p className="truncate font-medium">{appt.contactName || "Customer"}</p>
                              <p className="truncate text-[10px] text-slate-400">{appt.recordType || "Appointment"}</p>
                            </button>
                          ) : (
                            <button
                              onClick={() => { mutateProviders(); setQuickBook({ providerId: p.id, time: slot }); }}
                              className="block h-8 w-full rounded-md border border-dashed border-slate-200 hover:border-[var(--accent,#4f46e5)]/40 hover:bg-[var(--accent-light,#eef2ff)]"
                              title={`Book ${p.name} at ${slot}`}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <CreateBookingDialog
        open={!!quickBook}
        onClose={() => setQuickBook(null)}
        providers={providersData?.providers || []}
        providersLoading={providersLoading}
        copy={copy}
        onCreated={() => mutate()}
        initialProviderId={quickBook?.providerId}
        initialDate={selectedDay.toISOString().slice(0, 10)}
        initialTime={quickBook?.time}
      />

      {detail && (
        <Dialog open onOpenChange={(v) => !v && setDetail(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{detail.appt.contactName || "Customer"}</DialogTitle></DialogHeader>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">Staff:</span> <span className="font-medium text-slate-900">{detail.providerName}</span></p>
              <p><span className="text-slate-500">Time:</span> <span className="font-medium text-slate-900">{new Date(detail.appt.startAt).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" })} – {new Date(detail.appt.endAt).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" })}</span></p>
              <p><span className="text-slate-500">Type:</span> <span className="font-medium text-slate-900">{detail.appt.recordType || "Appointment"}</span></p>
              <p><span className="text-slate-500">Status:</span> <StatusBadge status={detail.appt.status} /></p>
              {detail.appt.contactId && (
                <Link href={`/dashboard/contacts/${detail.appt.contactId}`} className="inline-block text-[var(--accent,#2563eb)] hover:underline">View patient record</Link>
              )}
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-1.5">
              {["REQUESTED", "CONFIRMED", "RESCHEDULED"].includes(detail.appt.status) && (
                <button onClick={() => updateApptStatus(detail.appt.id, "ARRIVED")} className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500">Check In</button>
              )}
              {["CONFIRMED", "RESCHEDULED", "ARRIVED"].includes(detail.appt.status) && (
                <button onClick={() => updateApptStatus(detail.appt.id, "COMPLETED")} className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500">Complete</button>
              )}
              {["REQUESTED", "CONFIRMED", "RESCHEDULED"].includes(detail.appt.status) && (
                <button onClick={() => updateApptStatus(detail.appt.id, "NO_SHOW")} className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-rose-500">No Show</button>
              )}
              {!["COMPLETED", "CANCELLED", "NO_SHOW"].includes(detail.appt.status) && (
                <button onClick={() => updateApptStatus(detail.appt.id, "CANCELLED")} className="rounded-lg bg-slate-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-400">Cancel</button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
