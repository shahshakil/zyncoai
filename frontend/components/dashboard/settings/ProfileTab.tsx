"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import posthog from "posthog-js";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input, Label, Select } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

const VERTICALS = ["MEDICAL", "DENTAL", "LAW", "UNIVERSITY", "RESTAURANT", "MECHANIC", "RETAIL", "SALON", "REAL_ESTATE", "BANK", "OTHER"];

export function ProfileTab() {
  const { data, isLoading, mutate } = useApi<{ business: any; mapEmbedUrl: string | null }>("/api/business/settings");
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.business && !form) {
      setForm({ name: data.business.name, vertical: data.business.vertical, address: data.business.address || "", timezone: data.business.timezone, googleReviewUrl: data.business.googleReviewUrl || "" });
    }
  }, [data, form]);

  async function save() {
    setSaving(true);
    try {
      await apiPost("/api/business/settings", form, "PATCH");
      toast.success("Business profile updated");
      posthog.capture("settings_saved", { section: "business" });
      mutate();
    } catch {
      toast.error("Could not save changes");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !form) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <Card>
      <CardHeader><CardTitle>Business profile</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Business name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Industry</Label>
            <Select value={form.vertical} onChange={(e) => setForm({ ...form, vertical: e.target.value })}>
              {VERTICALS.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>AI phone number</Label>
            <Input
              value={
                data?.business.provisioningStatus === "ACTIVE" && data?.business.twilioNumberSid
                  ? data.business.phoneNumber
                  : data?.business.provisioningStatus === "PENDING"
                    ? "Setting up your AI line..."
                    : "Contact support to activate your number"
              }
              disabled
              readOnly
            />
            <p className="mt-1 text-xs text-slate-400">Provisioned automatically — not editable here.</p>
          </div>
          <div>
            <Label>Timezone</Label>
            <Input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Address</Label>
          <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <Label>Google review link</Label>
          <Input
            value={form.googleReviewUrl}
            onChange={(e) => setForm({ ...form, googleReviewUrl: e.target.value })}
            placeholder="https://g.page/r/.../review"
          />
          <p className="mt-1 text-xs text-slate-400">
            Your Google Business Profile review link. Required for the Google Reviews Autopilot add-on to send review requests — leave blank and it simply won&apos;t send.
          </p>
        </div>
        {data?.mapEmbedUrl && (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <iframe src={data.mapEmbedUrl} className="h-48 w-full" loading="lazy" />
          </div>
        )}
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </CardContent>
    </Card>
  );
}
