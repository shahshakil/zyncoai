"use client";
// Phase 10 — Ghost Call Auto-Rescue + Recall toggles. Both opt-in, default
// off: enabling either means a cron sweep (scripts/auto-rescue-sweep, run
// every 15 min) will place real outbound calls with no human clicking
// first, only during business hours, capped at 2 attempts per target.
import { useState } from "react";
import { toast } from "sonner";
import { PhoneOutgoing } from "lucide-react";
import Link from "next/link";
import { useApi, apiPost, ApiError } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { ToggleRow } from "../ui/toggle";

interface BusinessSettingsResponse {
  business: { ghostCallAutoRescueEnabled: boolean; patientRecallAutoCallEnabled: boolean };
  // Real outbound-call logic backs this toggle, but it's billed as the
  // "Automated Patient Recalls" add-on — settings.ts's PATCH route rejects
  // enabling patientRecallAutoCallEnabled unless this is true, so the UI
  // disables/hides the control instead of letting a click fail silently.
  patientRecallsAddOnActive: boolean;
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
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) {
        toast.error("Purchase the Automated Patient Recalls add-on in Billing to enable this");
      } else {
        toast.error("Could not update this setting");
      }
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
              description={
                data.patientRecallsAddOnActive
                  ? "Automatically call patients overdue for a checkup (6+ months), during business hours, up to 2 attempts."
                  : "Purchase the Automated Patient Recalls add-on in Billing to enable this."
              }
              checked={data.business.patientRecallAutoCallEnabled}
              disabled={!data.patientRecallsAddOnActive || saving === "patientRecallAutoCallEnabled"}
              onChange={(v) => toggle("patientRecallAutoCallEnabled", v)}
            />
            {!data.patientRecallsAddOnActive && (
              <p className="pb-3 text-xs">
                <Link href="/dashboard/settings?tab=billing" className="text-[var(--accent,#4f46e5)] underline-offset-2 hover:underline">
                  Go to Billing to purchase this add-on
                </Link>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
