"use client";
// Phase 10 — Ghost Call Auto-Rescue + Recall toggles. Both opt-in, default
// off: enabling either means a cron sweep (scripts/auto-rescue-sweep, run
// every 15 min) will place real outbound calls with no human clicking
// first, only during business hours, capped at 2 attempts per target.
import { useState } from "react";
import { toast } from "sonner";
import { PhoneOutgoing } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface BusinessSettingsResponse {
  business: { ghostCallAutoRescueEnabled: boolean; patientRecallAutoCallEnabled: boolean };
}

function ToggleRow({ label, description, checked, disabled, onChange }: { label: string; description: string; checked: boolean; disabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[var(--accent,#4f46e5)]" : "bg-slate-200"} ${disabled ? "opacity-50" : ""}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export function AutomationSection() {
  const { data, isLoading, mutate } = useApi<BusinessSettingsResponse>("/api/business/settings");
  const [saving, setSaving] = useState<string | null>(null);

  async function toggle(field: "ghostCallAutoRescueEnabled" | "patientRecallAutoCallEnabled", value: boolean) {
    setSaving(field);
    try {
      await apiPost("/api/business/settings", { [field]: value }, "PATCH");
      toast.success(value ? "Enabled" : "Disabled");
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
          <PhoneOutgoing className="h-4 w-4 text-[var(--accent,#4f46e5)]" />
          <CardTitle>Automation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="divide-y divide-slate-100">
            <ToggleRow
              label="Ghost Call Auto-Rescue"
              description="Automatically call back missed or hung-up callers, during business hours, up to 2 attempts."
              checked={data.business.ghostCallAutoRescueEnabled}
              disabled={saving === "ghostCallAutoRescueEnabled"}
              onChange={(v) => toggle("ghostCallAutoRescueEnabled", v)}
            />
            <ToggleRow
              label="Patient Recall Auto-Call"
              description="Automatically call patients overdue for a checkup (6+ months), during business hours, up to 2 attempts."
              checked={data.business.patientRecallAutoCallEnabled}
              disabled={saving === "patientRecallAutoCallEnabled"}
              onChange={(v) => toggle("patientRecallAutoCallEnabled", v)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
