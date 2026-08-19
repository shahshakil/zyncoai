"use client";
// 2026-08-19 — extracted out of app/dashboard/bookings/page.tsx. It was
// defined and exported there, then cross-imported into
// app/dashboard/calendar/page.tsx — a page.tsx importing a real (non-type)
// value export from another page.tsx. Next's App Router restricts what a
// page.tsx may export at the top level; a fresh (uncached) typecheck
// surfaced this as a hard build failure ("CreateBookingDialog is not a
// valid Page export field"), previously masked by incremental TS build
// cache reuse across long-lived .next builds. Same content, just moved to
// a real shared component module.
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiPost } from "@/lib/useApi";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label, Select } from "@/components/dashboard/ui/input";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";

export const VERTICAL_COPY: Record<string, { noun: string; recordType: string; metaLabel: string; metaPlaceholder: string }> = {
  MEDICAL: { noun: "Appointment", recordType: "appointment", metaLabel: "Reason for visit", metaPlaceholder: "Annual checkup" },
  DENTAL: { noun: "Appointment", recordType: "appointment", metaLabel: "Reason for visit", metaPlaceholder: "Cleaning, filling…" },
  LAW: { noun: "Consultation", recordType: "consultation", metaLabel: "Matter type", metaPlaceholder: "Family law, contracts…" },
  UNIVERSITY: { noun: "Appointment", recordType: "appointment", metaLabel: "Purpose", metaPlaceholder: "Advising session" },
  RESTAURANT: { noun: "Reservation", recordType: "order", metaLabel: "Party size / table notes", metaPlaceholder: "4 guests, window seat" },
  MECHANIC: { noun: "Job Ticket", recordType: "job_ticket", metaLabel: "Vehicle / issue", metaPlaceholder: "2019 Civic, brake noise" },
  RETAIL: { noun: "Appointment", recordType: "appointment", metaLabel: "Notes", metaPlaceholder: "Product pickup" },
  SALON: { noun: "Appointment", recordType: "appointment", metaLabel: "Service", metaPlaceholder: "Haircut & color" },
  REAL_ESTATE: { noun: "Showing", recordType: "appointment", metaLabel: "Property", metaPlaceholder: "123 Main St listing" },
  BANK: { noun: "Appointment", recordType: "appointment", metaLabel: "Purpose", metaPlaceholder: "Loan consultation" },
  OTHER: { noun: "Booking", recordType: "appointment", metaLabel: "Notes", metaPlaceholder: "" },
};

export interface Appointment {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  recordType: string | null;
  notes: string | null;
  googleEventId: string | null;
  provider: { id: string; name: string };
  contact: { id: string; name: string | null; phone: string } | null;
}

export interface Provider {
  id: string;
  name: string;
  googleCalendarConnected?: boolean;
}

interface BookingSuccess {
  patientName: string;
  staffName: string;
  startAt: string;
  calendarSynced: boolean;
  confirmationEmail: string | null;
}

export function CreateBookingDialog({
  open,
  onClose,
  providers,
  providersLoading,
  copy,
  onCreated,
  initialProviderId,
  initialDate,
  initialTime,
}: {
  open: boolean;
  onClose: () => void;
  providers: Provider[];
  providersLoading: boolean;
  copy: (typeof VERTICAL_COPY)[string];
  onCreated: () => void;
  initialProviderId?: string;
  initialDate?: string;
  initialTime?: string;
}) {
  const [providerId, setProviderId] = useState(initialProviderId || "");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState(initialTime || "");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<BookingSuccess | null>(null);

  useEffect(() => {
    if (providers.length && !providerId) setProviderId(initialProviderId || providers[0].id);
  }, [providers, providerId, initialProviderId]);

  // Re-sync prefill values whenever the dialog is (re)opened from a
  // different quick-book context (e.g. clicking a different slot on the
  // weekly calendar) rather than only on first mount.
  useEffect(() => {
    if (!open) return;
    if (initialProviderId) setProviderId(initialProviderId);
    if (initialDate) setDate(initialDate);
    if (initialTime) setTime(initialTime);
  }, [open, initialProviderId, initialDate, initialTime]);

  function resetForm() {
    setContactName(""); setContactPhone(""); setContactEmail(""); setDate(""); setTime(""); setNotes("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!providerId || !contactPhone || !date || !time) return toast.error("Fill in all required fields");
    setSaving(true);
    try {
      const startAt = new Date(`${date}T${time}:00`);
      const endAt = new Date(startAt.getTime() + 30 * 60000);
      const res = await apiPost<{ ok: boolean; appointment: Appointment; calendarSynced: boolean }>("/api/business/appointments", {
        providerId,
        contact: { name: contactName || undefined, phone: contactPhone, email: contactEmail || undefined },
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        notes: notes || undefined,
        recordType: copy.recordType,
      });
      onCreated();
      resetForm();
      setSuccess({
        patientName: res.appointment.contact?.name || res.appointment.contact?.phone || contactPhone,
        staffName: res.appointment.provider.name,
        startAt: res.appointment.startAt,
        calendarSynced: res.calendarSynced,
        confirmationEmail: contactEmail.trim() || null,
      });
    } catch (err: any) {
      toast.error(err.status === 409 ? "That slot is no longer available" : `Could not create ${copy.noun.toLowerCase()}`);
    } finally {
      setSaving(false);
    }
  }

  function close() {
    setSuccess(null);
    onClose();
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && close()}>
        <DialogContent>
          <DialogHeader><DialogTitle>✅ {copy.noun} booked successfully!</DialogTitle></DialogHeader>
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p><span className="text-slate-500">Patient:</span> <span className="font-medium text-slate-900">{success.patientName}</span></p>
            <p><span className="text-slate-500">Staff:</span> <span className="font-medium text-slate-900">{success.staffName}</span></p>
            <p><span className="text-slate-500">Date:</span> <span className="font-medium text-slate-900">{new Date(success.startAt).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span></p>
            <p><span className="text-slate-500">Time:</span> <span className="font-medium text-slate-900">{new Date(success.startAt).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" })}</span></p>
            <p className="pt-1 text-xs">
              {success.calendarSynced
                ? `Event added to ${success.staffName}'s Google Calendar ✅`
                : `Not synced to Google Calendar — ${success.staffName} hasn't connected one, or the sync failed.`}
            </p>
            <p className="text-xs">
              {success.confirmationEmail
                ? `Confirmation email will be sent to ${success.confirmationEmail} ✅`
                : "No email on file — confirmation sent by SMS/call only."}
            </p>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setSuccess(null)}>Book another</Button>
            <Link href="/dashboard/bookings" className="flex-1" onClick={close}>
              <Button className="w-full">View appointments</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent>
        <DialogHeader><DialogTitle>New {copy.noun.toLowerCase()}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label>Staff</Label>
            {providersLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : providers.length ? (
              <Select value={providerId} onChange={(e) => setProviderId(e.target.value)} required>
                <option value="">Select staff member</option>
                {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                No staff added yet.{" "}
                <Link href="/dashboard/settings?tab=staff" onClick={close} className="font-medium underline hover:text-amber-900">
                  Add staff in Settings → Staff
                </Link>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Customer name</Label>
              <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label>Patient email (for confirmation)</Label>
            <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="patient@email.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label>{copy.metaLabel}</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={copy.metaPlaceholder} />
          </div>
          <Button type="submit" className="w-full" disabled={saving || !providers.length}>{saving ? "Creating…" : `Create ${copy.noun.toLowerCase()}`}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
