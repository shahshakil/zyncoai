"use client";
// Settings > Notifications — email confirmations (always free, always on)
// vs. SMS confirmations (paid add-on). smsConfirmationsEnabled is the
// owner's own opt-in, toggled here; smsConfirmationsPaid is an admin-only
// billing-confirmation flag (platform-admin only) — clicking "Enable"
// here only flips the enabled half, actual sending waits on both.
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageSquare, Lock, CheckCircle2, Clock } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

interface BusinessSettingsResponse {
  business: {
    name: string;
    smsConfirmationsEnabled: boolean;
    smsConfirmationsPaid: boolean;
  };
}

export function NotificationsTab() {
  const { data, isLoading, mutate } = useApi<BusinessSettingsResponse>("/api/business/settings");
  const [saving, setSaving] = useState(false);

  async function setSmsEnabled(value: boolean) {
    setSaving(true);
    try {
      await apiPost("/api/business/settings", { smsConfirmationsEnabled: value }, "PATCH");
      toast.success(value ? "SMS add-on enabled — awaiting billing confirmation" : "SMS add-on disabled");
      mutate();
    } catch {
      toast.error("Could not update this setting");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const { business } = data;
  const smsActive = business.smsConfirmationsEnabled && business.smsConfirmationsPaid;
  const smsPending = business.smsConfirmationsEnabled && !business.smsConfirmationsPaid;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-[var(--accent,#4f46e5)]" />
            <CardTitle>Email Confirmations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Active (always included — free)
          </div>
          <p className="text-sm text-slate-500">
            Sent from: <span className="font-medium text-slate-700">{business.name} &lt;noreply@zyncoai.com&gt;</span>
          </p>
          <p className="text-xs text-slate-400">Booking confirmations and 24-hour reminders are always emailed to patients who have an email on file, on every plan.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-[var(--accent,#4f46e5)]" />
            <CardTitle>SMS Confirmations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {smsActive ? (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> Active
            </div>
          ) : smsPending ? (
            <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
              <Clock className="h-4 w-4" /> Pending — awaiting billing confirmation
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Lock className="h-4 w-4" /> Add-on required
            </div>
          )}

          <p className="text-sm text-slate-600">Send SMS booking confirmations and reminders to patients.</p>
          <p className="text-sm text-slate-600">Appears from your clinic&apos;s dedicated phone number.</p>
          <p className="text-sm font-semibold text-slate-900">$20/month</p>

          {smsActive || smsPending ? (
            <Button variant="outline" size="sm" disabled={saving} onClick={() => setSmsEnabled(false)}>
              {saving ? "Saving…" : "Disable SMS Add-on"}
            </Button>
          ) : (
            <Button size="sm" disabled={saving} onClick={() => setSmsEnabled(true)}>
              {saving ? "Saving…" : "Enable SMS Add-on"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
