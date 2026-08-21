"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiPost, ApiError } from "@/lib/useApi";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label, Select } from "@/components/dashboard/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import type { Appointment, Provider } from "@/components/dashboard/bookings/CreateBookingDialog";

function toDateInputValue(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toTimeInputValue(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function RescheduleDialog({
  appointment,
  providers,
  open,
  onClose,
  onRescheduled,
  nounLower,
}: {
  appointment: Appointment | null;
  providers: Provider[];
  open: boolean;
  onClose: () => void;
  onRescheduled: () => void;
  nounLower: string;
}) {
  const [providerId, setProviderId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);

  // Re-seed from the appointment being rescheduled every time the dialog
  // opens — a plain useState initializer would only run once, then keep
  // showing whichever appointment was first opened.
  useEffect(() => {
    if (!open || !appointment) return;
    setProviderId(appointment.provider.id);
    setDate(toDateInputValue(appointment.startAt));
    setTime(toTimeInputValue(appointment.startAt));
  }, [open, appointment]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!appointment || !date || !time) return;
    setSaving(true);
    try {
      const durationMs = new Date(appointment.endAt).getTime() - new Date(appointment.startAt).getTime();
      const startAt = new Date(`${date}T${time}:00`);
      const endAt = new Date(startAt.getTime() + durationMs);
      await apiPost(`/api/business/appointments/${appointment.id}`, {
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        ...(providerId && providerId !== appointment.provider.id ? { providerId } : {}),
      }, "PATCH");
      onRescheduled();
      toast.success(
        `Rescheduled to ${startAt.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })} at ${startAt.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" })}`
      );
      onClose();
    } catch (err: any) {
      const status = err instanceof ApiError ? err.status : undefined;
      toast.error(status === 409 ? "That time is no longer available" : `Could not reschedule ${nounLower}`);
    } finally {
      setSaving(false);
    }
  }

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Reschedule {nounLower}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label>Staff</Label>
            <Select value={providerId} onChange={(e) => setProviderId(e.target.value)}>
              {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
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
          <Button type="submit" className="w-full" disabled={saving}>{saving ? "Rescheduling…" : "Reschedule"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
