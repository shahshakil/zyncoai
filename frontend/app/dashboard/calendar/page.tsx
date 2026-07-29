"use client";
// My Calendar (Part 4, doctor portal) — interactive weekly view with a
// timesheet-style grid, built on the existing GET /export/staff-schedule
// data route (already scopes to the caller's own Provider when role is
// DOCTOR). DOCTOR-only page; OWNER/ADMIN/STAFF use the existing Bookings
// list instead.
import { useState } from "react";
import Link from "next/link";
import { Printer, Download, ChevronLeft, ChevronRight, CalendarX2 } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps } from "@/lib/verticalOps";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { EmptyState } from "@/components/dashboard/ui/table";
import { triggerPrint } from "@/lib/exportUtils";
import { CHART_COLORS } from "@/components/dashboard/ui/chartTheme";

const SLOT_START_HOUR = 7;
const SLOT_END_HOUR = 19;
const SLOT_MIN = 30;
const RECORD_TYPE_COLORS: Record<string, string> = {
  Consultation: CHART_COLORS.primary, Checkup: CHART_COLORS.success, Procedure: CHART_COLORS.warning, Appointment: "#64748b",
};

interface ScheduleAppt { id: string; startAt: string; endAt: string; recordType: string | null; status: string; contactId?: string; contactName?: string }
interface ScheduleResponse { ok: boolean; weekStart: string; weekEnd: string; providers: { id: string; name: string; title: string | null; appointments: ScheduleAppt[] }[] }

function buildSlots(): string[] {
  const slots: string[] = [];
  for (let h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
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
  const { data } = useApi<ScheduleResponse>(`/api/business/export/staff-schedule?week=${weekParam}`);

  if (role !== "DOCTOR") {
    return <EmptyState title="Not available" description="My Calendar is the doctor-specific weekly view — use Bookings for the full clinic schedule." />;
  }

  const slots = buildSlots();
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
          <h1 className="text-xl font-semibold text-slate-900">My Calendar</h1>
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
