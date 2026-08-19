"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, CalendarRange, FileSpreadsheet, Printer, Loader2, CalendarX2 } from "lucide-react";
import { toast } from "sonner";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps } from "@/lib/verticalOps";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { PrintLetterhead, PrintFooter } from "@/components/dashboard/PrintLetterhead";
import {
  slugFilename,
  exportScheduleToExcel,
  triggerPrint,
  logExport,
  hasAckedExportConsent,
  ackExportConsent,
  buildScheduleSlots,
  buildScheduleGrid,
  type ExportSheet,
  type ExportColumn,
  type ScheduleProvider,
} from "@/lib/exportUtils";
import { Card } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Select } from "@/components/dashboard/ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { SkeletonRow } from "@/components/dashboard/ui/skeleton";
import { Badge, StatusBadge } from "@/components/dashboard/ui/badge";
import { VERTICAL_COPY, type Appointment, type Provider, CreateBookingDialog } from "@/components/dashboard/bookings/CreateBookingDialog";

function buildAppointmentColumns(contactLabel: string, providerLabel: string): ExportColumn[] {
  return [
    { key: "date", label: "Date", format: (v) => new Date(v).toLocaleDateString("en-AU") },
    { key: "time", label: "Time", format: (v) => new Date(v).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }) },
    { key: "patientName", label: `${contactLabel} Name` },
    { key: "phone", label: "Phone" },
    { key: "doctor", label: `${providerLabel}` },
    { key: "serviceType", label: "Service Type" },
    { key: "durationMinutes", label: "Duration (min)", align: "right" },
    { key: "status", label: "Status" },
    { key: "notes", label: "Notes" },
  ];
}

interface AppointmentExportRow {
  date: string;
  time: string;
  patientName: string;
  phone: string;
  doctor: string;
  serviceType: string;
  durationMinutes: number;
  status: string;
  notes: string;
}

// Row color-coding, matching the check-in board's scheme: yellow = waiting,
// blue = checked in, green = done, red = no-show, grey = cancelled.
const ROW_STATUS_BORDER: Record<string, string> = {
  REQUESTED: "border-l-amber-400",
  CONFIRMED: "border-l-amber-400",
  RESCHEDULED: "border-l-amber-400",
  ARRIVED: "border-l-blue-500",
  COMPLETED: "border-l-emerald-500",
  NO_SHOW: "border-l-rose-500",
  CANCELLED: "border-l-slate-400",
};

function weekStartOf(d: Date): Date {
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function ScheduleExportButton({ businessName, reportTitle, onPrintReady }: { businessName: string; reportTitle: string; onPrintReady: (providers: ScheduleProvider[], weekStart: Date) => void }) {
  const [loading, setLoading] = useState<"excel" | "print" | null>(null);

  async function loadSchedule(): Promise<{ providers: ScheduleProvider[]; weekStart: Date } | null> {
    const r = await fetch("/api/business/export/staff-schedule", { credentials: "include" });
    const json = await r.json();
    if (!json.ok) return null;
    return { providers: json.providers, weekStart: new Date(json.weekStart) };
  }

  async function run(kind: "excel" | "print") {
    if (!hasAckedExportConsent()) {
      ackExportConsent();
      toast.info("Exported data is subject to the Australian Privacy Act 1988 — handle it securely.");
    }
    setLoading(kind);
    try {
      const result = await loadSchedule();
      if (!result || !result.providers.some((p) => p.appointments.length)) {
        toast.info("No appointments this week to export");
        return;
      }
      if (kind === "excel") {
        await exportScheduleToExcel(result.providers, result.weekStart, { businessName, reportTitle }, slugFilename(businessName, "WeeklySchedule"));
        logExport("staff-schedule", "excel", result.providers.reduce((s, p) => s + p.appointments.length, 0));
        toast.success("Weekly schedule downloaded");
      } else {
        onPrintReady(result.providers, result.weekStart);
        logExport("staff-schedule", "print", result.providers.reduce((s, p) => s + p.appointments.length, 0));
        requestAnimationFrame(() => requestAnimationFrame(() => triggerPrint("print")));
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          disabled={loading !== null}
          title="Export weekly schedule"
          className="no-print inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-[var(--accent,#4f46e5)]/40 hover:text-[var(--accent,#4f46e5)] disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CalendarRange className="h-3.5 w-3.5" />}
          Weekly Schedule
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={6} className="no-print z-50 min-w-[190px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <DropdownMenu.Item onSelect={() => run("excel")} className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 outline-none transition hover:bg-slate-50">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> 📊 Excel grid (this week)
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => run("print")} className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 outline-none transition hover:bg-slate-50">
            <Printer className="h-4 w-4 text-slate-500" /> 🖨️ Print calendar view
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default function BookingsPage() {
  const { business, role } = useDashboard();
  const copy = VERTICAL_COPY[business.vertical] || VERTICAL_COPY.OTHER;
  const ops = getVerticalOps(business.vertical);
  const APPOINTMENT_COLUMNS = buildAppointmentColumns(ops?.contactLabel || "Patient", ops?.providerLabel || "Doctor/Provider");
  const [status, setStatus] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [printMode, setPrintMode] = useState<"list" | "schedule" | null>(null);
  const [printRows, setPrintRows] = useState<AppointmentExportRow[]>([]);
  const [scheduleData, setScheduleData] = useState<{ providers: ScheduleProvider[]; weekStart: Date } | null>(null);

  const query = new URLSearchParams(status ? { status } : {}).toString();
  const { data, isLoading, mutate } = useApi<{ data: Appointment[] }>(`/api/business/appointments?${query}`, { refreshInterval: 8000 });
  const { data: providersData, isLoading: providersLoading, mutate: mutateProviders } = useApi<{ providers: Provider[] }>("/api/business/providers");

  // ARRIVED is the canonical "checked in" status (also used by the
  // Clinical & Billing pipeline and the hybrid check-in system's SMS/QR/IVR
  // flows) — one signal, never double-tracked against a separate
  // metadata.checkedInAt flag.
  async function updateStatus(id: string, newStatus: string) {
    const labels: Record<string, string> = { ARRIVED: "checked in", COMPLETED: "completed", NO_SHOW: "no-show", CANCELLED: "cancelled" };
    try {
      await apiPost(`/api/business/appointments/${id}`, { status: newStatus }, "PATCH");
      toast.success(`Marked as ${labels[newStatus] || newStatus.toLowerCase()}`);
      mutate();
    } catch {
      toast.error("Could not update booking");
    }
  }

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function loadAppointmentSheets(): Promise<ExportSheet[]> {
    const q = new URLSearchParams(status ? { status } : {}).toString();
    const r = await fetch(`/api/business/export/appointments?${q}`, { credentials: "include" });
    const json = await r.json();
    if (!json.ok) throw new Error("export_failed");
    let rows: any[] = json.rows;
    if (selected.size > 0) {
      // export endpoint doesn't carry appointment id in the shaped row (by
      // design — it's a report row, not a raw record) so selection filters
      // on the same visible-list identity instead: date+patient+time match.
      const selectedRows = data?.data.filter((a) => selected.has(a.id)) || [];
      const keys = new Set(selectedRows.map((a) => `${a.startAt}|${a.contact?.name || a.contact?.phone}`));
      rows = rows.filter((r) => keys.has(`${r.date}|${r.patientName}`));
    }
    return [{ name: `${copy.noun}s`, columns: APPOINTMENT_COLUMNS, rows, showTotals: true }];
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#0f172a]">{copy.noun}s</h1>
        <div className="flex flex-wrap items-center gap-2">
          {selected.size > 0 && <span className="text-xs text-slate-400">{selected.size} selected</span>}
          <ExportMenu
            section="appointments"
            filename={slugFilename(business.name, copy.noun.replace(/\s/g, ""))}
            meta={{ businessName: business.name, reportTitle: `${copy.noun} List`, filtersLabel: [status && `status: ${status}`, selected.size > 0 && `${selected.size} selected`].filter(Boolean).join(", ") || undefined }}
            loadSheets={loadAppointmentSheets}
            onRowsReady={(sheets) => { setPrintRows(sheets[0].rows as AppointmentExportRow[]); setPrintMode("list"); }}
          />
          {role !== "STAFF" && (
            <ScheduleExportButton
              businessName={business.name}
              reportTitle={role === "DOCTOR" ? "My Weekly Schedule" : "Weekly Staff Schedule"}
              onPrintReady={(providers, weekStart) => { setScheduleData({ providers, weekStart }); setPrintMode("schedule"); }}
            />
          )}
          <Button size="sm" onClick={() => { mutateProviders(); setCreateOpen(true); }}><Plus className="h-4 w-4" /> New {copy.noun.toLowerCase()}</Button>
        </div>
      </div>

      <Card className="no-print">
        <div className="flex items-center gap-3 border-b border-slate-200 p-4">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-48">
            <option value="">All statuses</option>
            {["REQUESTED", "CONFIRMED", "RESCHEDULED", "ARRIVED", "COMPLETED", "CANCELLED", "NO_SHOW"].map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <Table>
          <Thead>
            <tr>
              <Th className="w-8">
                <input
                  type="checkbox"
                  checked={!!data?.data.length && data.data.every((a) => selected.has(a.id))}
                  onChange={(e) => {
                    setSelected((prev) => {
                      const next = new Set(prev);
                      data?.data.forEach((a) => (e.target.checked ? next.add(a.id) : next.delete(a.id)));
                      return next;
                    });
                  }}
                />
              </Th>
              <Th>Customer</Th>
              <Th>Staff</Th>
              <Th>When</Th>
              <Th>Status</Th>
              <Th>Calendar</Th>
              <Th>Notes</Th>
              <Th></Th>
            </tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={8} />)
            ) : data?.data.length ? (
              data.data.map((a) => {
                const providerConnected = providersData?.providers.find((p) => p.id === a.provider.id)?.googleCalendarConnected;
                return (
                <Tr key={a.id} className={`border-l-4 ${ROW_STATUS_BORDER[a.status] || "border-l-transparent"}`}>
                  <Td><input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleSelected(a.id)} /></Td>
                  <Td className="font-medium text-slate-900">
                    {a.contact ? (
                      <Link href={`/dashboard/contacts/${a.contact.id}`} className="hover:text-[var(--accent,#2563eb)] hover:underline">
                        {a.contact.name || a.contact.phone}
                      </Link>
                    ) : "—"}
                  </Td>
                  <Td>{a.provider.name}</Td>
                  <Td className="text-slate-500">{new Date(a.startAt).toLocaleString()}</Td>
                  <Td><StatusBadge status={a.status} /></Td>
                  <Td>
                    {a.googleEventId ? (
                      <Badge tone="success" title="Synced to Google Calendar">Synced</Badge>
                    ) : providerConnected ? (
                      <Badge tone="warning" title="This staff member's Google Calendar is connected, but this booking wasn't synced">Not synced</Badge>
                    ) : (
                      <Badge tone="default" title="This staff member hasn't connected Google Calendar">Not connected</Badge>
                    )}
                  </Td>
                  <Td className="max-w-[200px] truncate text-slate-500">{a.notes || "—"}</Td>
                  <Td className="text-right">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {["REQUESTED", "CONFIRMED", "RESCHEDULED"].includes(a.status) && (
                        <button onClick={() => updateStatus(a.id, "ARRIVED")} className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500">
                          Check In
                        </button>
                      )}
                      {["CONFIRMED", "RESCHEDULED", "ARRIVED"].includes(a.status) && (
                        <button onClick={() => updateStatus(a.id, "COMPLETED")} className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500">
                          Complete
                        </button>
                      )}
                      {["REQUESTED", "CONFIRMED", "RESCHEDULED"].includes(a.status) && (
                        <button onClick={() => updateStatus(a.id, "NO_SHOW")} className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-rose-500">
                          No Show
                        </button>
                      )}
                      {!["COMPLETED", "CANCELLED", "NO_SHOW"].includes(a.status) && (
                        <button onClick={() => updateStatus(a.id, "CANCELLED")} className="rounded-lg bg-slate-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-400">
                          Cancel
                        </button>
                      )}
                    </div>
                  </Td>
                </Tr>
              );
              })
            ) : null}
          </Tbody>
        </Table>
        {!isLoading && !data?.data.length && (
          <EmptyState
            icon={CalendarX2}
            title={`No ${copy.noun.toLowerCase()}s yet`}
            description={`${copy.noun}s booked by Ella or created here will appear.`}
            action={<Button size="sm" onClick={() => { mutateProviders(); setCreateOpen(true); }}><Plus className="h-4 w-4" /> Book first {copy.noun.toLowerCase()}</Button>}
          />
        )}
      </Card>

      <CreateBookingDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        providers={providersData?.providers || []}
        providersLoading={providersLoading}
        copy={copy}
        onCreated={() => mutate()}
      />

      {printMode === "list" && (
        <div className="print-only">
          <PrintLetterhead reportTitle={`${copy.noun} List`} filtersLabel={status || undefined} />
          <table className="print-table">
            <thead><tr>{APPOINTMENT_COLUMNS.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead>
            <tbody>
              {printRows.map((row, i) => (
                <tr key={i}>{APPOINTMENT_COLUMNS.map((c) => <td key={c.key}>{c.format ? c.format((row as any)[c.key], row) : String((row as any)[c.key] ?? "")}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <PrintFooter />
        </div>
      )}

      {printMode === "schedule" && scheduleData && (
        <div className="print-only print-landscape">
          {scheduleData.providers.map((provider, idx) => {
            const weekDays = Array.from({ length: 7 }).map((_, i) => new Date(scheduleData.weekStart.getTime() + i * 86400000));
            const slots = buildScheduleSlots();
            const grid = buildScheduleGrid(provider, weekDays);
            return (
              <div key={provider.id} style={idx > 0 ? { pageBreakBefore: "always" } : undefined}>
                <PrintLetterhead reportTitle={`${provider.name}${provider.title ? ` — ${provider.title}` : ""} — Weekly Schedule`} dateRangeLabel={`Week of ${weekDays[0].toLocaleDateString("en-AU")}`} />
                <table className="print-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      {weekDays.map((d) => <th key={d.toISOString()}>{d.toLocaleDateString("en-AU", { weekday: "short", day: "2-digit", month: "short" })}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot, i) => (
                      <tr key={slot}>
                        <td style={{ fontWeight: 600 }}>{slot}</td>
                        {grid[i].map((cell, di) => <td key={di}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PrintFooter />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

