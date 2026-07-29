"use client";
// Settings > Integrations > Check-in — hybrid check-in system toggles.
// Unlike AutomationSection's ghost-call/recall toggles, these default true
// (see prisma/schema.prisma's Business model comment) — texting "here",
// scanning a QR code, or a courtesy reminder call for an already-booked
// appointment is standard front-desk practice, not an unprompted dial.
import { useState } from "react";
import { toast } from "sonner";
import { CalendarCheck2 } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { ToggleRow } from "../ui/toggle";
import { Select } from "../ui/input";

interface BusinessSettingsResponse {
  business: {
    qrCheckInEnabled: boolean;
    smsCheckInEnabled: boolean;
    preAppointmentCallEnabled: boolean;
    autoNoShowEnabled: boolean;
    autoNoShowMinutes: number;
    autoCompleteEnabled: boolean;
  };
}

type BoolField = "qrCheckInEnabled" | "smsCheckInEnabled" | "preAppointmentCallEnabled" | "autoNoShowEnabled" | "autoCompleteEnabled";

export function CheckInAutomationSection() {
  const { data, isLoading, mutate } = useApi<BusinessSettingsResponse>("/api/business/settings");
  const [saving, setSaving] = useState<string | null>(null);

  async function save(field: BoolField | "autoNoShowMinutes", value: boolean | number) {
    setSaving(field);
    try {
      await apiPost("/api/business/settings", { [field]: value }, "PATCH");
      toast.success("Saved");
      mutate();
    } catch {
      toast.error("Could not update this setting");
    } finally {
      setSaving(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-1.5">
          <CalendarCheck2 className="h-4 w-4 text-[var(--accent,#4f46e5)]" />
          <CardTitle>Check-in</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="divide-y divide-slate-100">
            <ToggleRow
              label="QR code self check-in"
              description="Confirmation texts include a link patients tap to check themselves in."
              checked={data.business.qrCheckInEnabled}
              disabled={saving === "qrCheckInEnabled"}
              onChange={(v) => save("qrCheckInEnabled", v)}
            />
            <ToggleRow
              label="SMS check-in"
              description={'Patients can text "here" or "arrived" to check in automatically.'}
              checked={data.business.smsCheckInEnabled}
              disabled={saving === "smsCheckInEnabled"}
              onChange={(v) => save("smsCheckInEnabled", v)}
            />
            <ToggleRow
              label="Pre-appointment reminder call"
              description="A call ~2 hours before, letting patients press 1 to confirm, 2 to cancel, or 3 to request a reschedule."
              checked={data.business.preAppointmentCallEnabled}
              disabled={saving === "preAppointmentCallEnabled"}
              onChange={(v) => save("preAppointmentCallEnabled", v)}
            />
            <div className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Auto no-show</p>
                <p className="mt-0.5 text-xs text-slate-500">Mark a confirmed appointment as no-show if nobody checks in.</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Select
                  className="w-28"
                  value={data.business.autoNoShowMinutes}
                  disabled={!data.business.autoNoShowEnabled || saving === "autoNoShowMinutes"}
                  onChange={(e) => save("autoNoShowMinutes", Number(e.target.value))}
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                </Select>
                <button
                  type="button"
                  role="switch"
                  aria-checked={data.business.autoNoShowEnabled}
                  disabled={saving === "autoNoShowEnabled"}
                  onClick={() => save("autoNoShowEnabled", !data.business.autoNoShowEnabled)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${data.business.autoNoShowEnabled ? "bg-[var(--accent,#4f46e5)]" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${data.business.autoNoShowEnabled ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
            <ToggleRow
              label="Auto complete"
              description="Mark a checked-in appointment as completed once its end time passes."
              checked={data.business.autoCompleteEnabled}
              disabled={saving === "autoCompleteEnabled"}
              onChange={(v) => save("autoCompleteEnabled", v)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
