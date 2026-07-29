"use client";
// Settings > AI Prompt > Call Recording. Mirrors CheckInAutomationSection's
// pattern: GET/PATCH /api/business/settings, one field per toggle.
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Mic } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { ToggleRow } from "../ui/toggle";

interface RecordingSettingsResponse {
  business: {
    callRecordingEnabled: boolean;
    recordingDisclosure: boolean;
  };
}

// Verticals where a spoken recording disclosure is worth flagging as
// recommended (health records, legal privilege, financial/banking
// regulation, and student records — not a literal "healthcare" list).
// This is advisory only, matching the pattern used elsewhere in this app
// (e.g. the HaveIBeenPwned breach check on signup): it warns, it never
// blocks the toggle.
const DISCLOSURE_RECOMMENDED_VERTICALS = ["MEDICAL", "DENTAL", "LAW", "BANK", "UNIVERSITY"];

export function CallRecordingSection() {
  const { business } = useDashboard();
  const { data, isLoading, mutate } = useApi<RecordingSettingsResponse>("/api/business/settings");
  const [saving, setSaving] = useState<string | null>(null);

  const isDisclosureRecommendedVertical = DISCLOSURE_RECOMMENDED_VERTICALS.includes(business.vertical);

  async function save(field: "callRecordingEnabled" | "recordingDisclosure", value: boolean) {
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
          <Mic className="h-4 w-4 text-[var(--accent,#4f46e5)]" />
          <CardTitle>Call Recording</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="divide-y divide-slate-100">
            <ToggleRow
              label="Enable call recording"
              description="Record calls for quality and training purposes."
              checked={data.business.callRecordingEnabled}
              disabled={saving === "callRecordingEnabled"}
              onChange={(v) => save("callRecordingEnabled", v)}
            />
            {data.business.callRecordingEnabled && (
              <div className="py-3">
                <ToggleRow
                  label="Recording disclosure to callers"
                  description={`Ella will say "this call may be recorded" at the start of each call.`}
                  checked={data.business.recordingDisclosure}
                  disabled={saving === "recordingDisclosure"}
                  onChange={(v) => save("recordingDisclosure", v)}
                />
                {isDisclosureRecommendedVertical && !data.business.recordingDisclosure && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-600">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Recommended for your industry under the Australian Privacy Act 1988 and state surveillance-device consent laws.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
