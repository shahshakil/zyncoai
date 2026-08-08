"use client";
// Dashboard > Waitlist (clinic vertical). Cancellation-backfill waitlist —
// three cards: Settings (enable/disable + calling guardrails), Queue (the
// live WAITING/OFFERED list, add/remove), and Activity (backfill slots +
// their call-attempt trail, "slot cancelled -> called A, B -> B booked").
// Same "Automated Patient Recalls" add-on gates real calling here as
// AutomationSection.tsx's patientRecallAutoCallEnabled toggle — see
// settings.ts's PATCH guard and business/waitlist.ts's own header comment.
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ListPlus, Trash2, ListChecks, History, Settings2 } from "lucide-react";
import { useApi, apiPost, ApiError } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input, Label, Select } from "../ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "../ui/table";
import { Skeleton, SkeletonRow } from "../ui/skeleton";
import { Badge, StatusBadge } from "../ui/badge";
import { ToggleRow } from "../ui/toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface Contact {
  id: string;
  name: string | null;
  phone: string;
}
interface Provider {
  id: string;
  name: string;
}
interface TimeWindow {
  partOfDay?: "morning" | "afternoon" | "evening";
  daysOfWeek?: number[];
}
interface WaitlistEntry {
  id: string;
  serviceType: string | null;
  status: "WAITING" | "OFFERED" | "BOOKED" | "EXPIRED" | "OPTED_OUT";
  position: number;
  consentGivenAt: string;
  consentSource: string;
  contact: Contact;
  preferredProvider: Provider | null;
  timeWindows: TimeWindow[];
}
interface CallAttempt {
  id: string;
  attemptNumber: number;
  outcome: string;
  smsFallbackSentAt: string | null;
  attemptedAt: string;
  resolvedAt: string | null;
  dryRun: boolean;
  entry: { contact: Contact };
}
interface BackfillSlot {
  id: string;
  serviceType: string | null;
  slotStart: string;
  slotEnd: string;
  status: "OPEN" | "CALLING" | "FILLED" | "EXHAUSTED" | "EXPIRED";
  createdAt: string;
  filledAt: string | null;
  provider: Provider;
  callAttempts: CallAttempt[];
}
interface BusinessSettingsResponse {
  business: {
    waitlistBackfillEnabled: boolean;
    backfillMinNoticeMinutes: number;
    backfillMaxAttemptsPerSlot: number;
    backfillCallWindowStart: string;
    backfillCallWindowEnd: string;
    avgAppointmentValueCents: number | null;
  };
  patientRecallsAddOnActive: boolean;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTimeWindows(windows: TimeWindow[]): string {
  if (!windows?.length) return "Any time";
  return windows
    .map((w) => {
      const days = w.daysOfWeek?.length ? w.daysOfWeek.map((d) => DAY_LABELS[d]).join("/") : "Any day";
      return w.partOfDay ? `${days} ${w.partOfDay}` : days;
    })
    .join(", ");
}

const ATTEMPT_OUTCOME_LABEL: Record<string, string> = {
  in_progress: "Calling…",
  accepted: "Accepted — booked",
  declined: "Declined",
  no_answer: "No answer",
  voicemail: "Voicemail",
  opted_out: "Opted out",
  skipped_quiet_hours: "Skipped (quiet hours)",
};

export default function WaitlistDashboard() {
  const { data: entriesData, isLoading: entriesLoading, mutate: mutateEntries } = useApi<{ entries: WaitlistEntry[] }>("/api/business/waitlist");
  const { data: activityData, isLoading: activityLoading } = useApi<{ slots: BackfillSlot[] }>("/api/business/waitlist/activity", { refreshInterval: 15000 });
  const { data: settingsData, isLoading: settingsLoading, mutate: mutateSettings } = useApi<BusinessSettingsResponse>("/api/business/settings");
  const { data: providersData } = useApi<{ providers: Provider[] }>("/api/business/providers");

  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const entries = entriesData?.entries || [];
  const activeEntries = entries.filter((e) => e.status === "WAITING" || e.status === "OFFERED");
  const historyEntries = entries.filter((e) => e.status === "BOOKED" || e.status === "EXPIRED" || e.status === "OPTED_OUT");
  const providers = providersData?.providers || [];

  async function removeEntry(id: string) {
    try {
      await apiPost(`/api/business/waitlist/${id}`, undefined, "DELETE");
      toast.success("Removed from waitlist");
      mutateEntries();
    } catch {
      toast.error("Could not remove this entry");
    }
  }

  async function updateSetting(field: string, value: unknown) {
    setSaving(field);
    try {
      await apiPost("/api/business/settings", { [field]: value }, "PATCH");
      mutateSettings();
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#0f172a]">Waitlist</h1>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <ListPlus className="h-4 w-4" /> Add to waitlist
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Settings2 className="h-4 w-4 text-[var(--accent,#4f46e5)]" />
            <CardTitle>Cancellation Backfill</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {settingsLoading || !settingsData ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="divide-y divide-slate-100">
              <ToggleRow
                label="Call the waitlist when a slot opens"
                description={
                  settingsData.patientRecallsAddOnActive
                    ? "When an appointment is cancelled, Ella calls waiting patients in order until one accepts the freed slot."
                    : "Purchase the Automated Patient Recalls add-on in Billing to enable this."
                }
                checked={settingsData.business.waitlistBackfillEnabled}
                disabled={!settingsData.patientRecallsAddOnActive || saving === "waitlistBackfillEnabled"}
                onChange={(v) => updateSetting("waitlistBackfillEnabled", v)}
              />
              {!settingsData.patientRecallsAddOnActive && (
                <p className="pb-3 text-xs">
                  <Link href="/dashboard/settings?tab=billing" className="text-[var(--accent,#4f46e5)] underline-offset-2 hover:underline">
                    Go to Billing to purchase this add-on
                  </Link>
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 py-3 sm:grid-cols-4">
                <div>
                  <Label>Min. notice (minutes)</Label>
                  <Input
                    type="number"
                    min={0}
                    defaultValue={settingsData.business.backfillMinNoticeMinutes}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v !== settingsData.business.backfillMinNoticeMinutes) updateSetting("backfillMinNoticeMinutes", v);
                    }}
                  />
                </div>
                <div>
                  <Label>Max patients called / slot</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    defaultValue={settingsData.business.backfillMaxAttemptsPerSlot}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v !== settingsData.business.backfillMaxAttemptsPerSlot) updateSetting("backfillMaxAttemptsPerSlot", v);
                    }}
                  />
                </div>
                <div>
                  <Label>Calling window start</Label>
                  <Input
                    type="time"
                    defaultValue={settingsData.business.backfillCallWindowStart}
                    onBlur={(e) => {
                      if (e.target.value !== settingsData.business.backfillCallWindowStart) updateSetting("backfillCallWindowStart", e.target.value);
                    }}
                  />
                </div>
                <div>
                  <Label>Calling window end</Label>
                  <Input
                    type="time"
                    defaultValue={settingsData.business.backfillCallWindowEnd}
                    onBlur={(e) => {
                      if (e.target.value !== settingsData.business.backfillCallWindowEnd) updateSetting("backfillCallWindowEnd", e.target.value);
                    }}
                  />
                </div>
              </div>
              <p className="pt-3 text-xs text-slate-400">
                Calls never happen before 8am or after 8pm regardless of this window. This drives the &ldquo;revenue recovered&rdquo; estimate on
                the platform dashboard — set it to your average appointment value for the most accurate figure.
              </p>
              <div className="max-w-xs pt-3">
                <Label>Average appointment value ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={settingsData.business.avgAppointmentValueCents != null ? (settingsData.business.avgAppointmentValueCents / 100).toFixed(2) : ""}
                  placeholder="e.g. 120.00"
                  onBlur={(e) => {
                    const raw = e.target.value.trim();
                    const cents = raw ? Math.round(Number(raw) * 100) : null;
                    if (cents !== settingsData.business.avgAppointmentValueCents) updateSetting("avgAppointmentValueCents", cents);
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <ListChecks className="h-4 w-4 text-[var(--accent,#4f46e5)]" />
            <CardTitle>Queue</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {entriesLoading ? (
            <Table>
              <Tbody>
                <SkeletonRow cols={6} />
                <SkeletonRow cols={6} />
              </Tbody>
            </Table>
          ) : !activeEntries.length ? (
            <EmptyState icon={ListChecks} title="No one on the waitlist right now" description="Patients are added here after they consent during a call, or manually below." />
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Patient</Th>
                  <Th>Service</Th>
                  <Th>Preferred time</Th>
                  <Th>Preferred provider</Th>
                  <Th>Status</Th>
                  <Th>Consent</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {activeEntries.map((e) => (
                  <Tr key={e.id}>
                    <Td>{e.status === "WAITING" ? e.position : "—"}</Td>
                    <Td className="font-medium text-slate-900">{e.contact.name || e.contact.phone}</Td>
                    <Td>{e.serviceType || <span className="text-slate-400">Any</span>}</Td>
                    <Td>{formatTimeWindows(e.timeWindows)}</Td>
                    <Td>{e.preferredProvider?.name || <span className="text-slate-400">Any</span>}</Td>
                    <Td><StatusBadge status={e.status} /></Td>
                    <Td className="text-xs text-slate-500">
                      {e.consentSource === "voice_call" ? "Voice call" : "Staff added"} · {new Date(e.consentGivenAt).toLocaleDateString("en-AU")}
                    </Td>
                    <Td>
                      <Button variant="ghost" size="sm" onClick={() => removeEntry(e.id)}>
                        <Trash2 className="h-4 w-4 text-slate-400" />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      {historyEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Waitlist history</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <Thead>
                <Tr>
                  <Th>Patient</Th>
                  <Th>Service</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {historyEntries.map((e) => (
                  <Tr key={e.id}>
                    <Td>{e.contact.name || e.contact.phone}</Td>
                    <Td>{e.serviceType || <span className="text-slate-400">Any</span>}</Td>
                    <Td><StatusBadge status={e.status} /></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <History className="h-4 w-4 text-[var(--accent,#4f46e5)]" />
            <CardTitle>Backfill activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {activityLoading ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : !activityData?.slots?.length ? (
            <EmptyState icon={History} title="No cancellations backfilled yet" description="When an appointment is cancelled, what happens next shows up here." />
          ) : (
            <div className="divide-y divide-slate-100">
              {activityData.slots.map((slot) => (
                <div key={slot.id} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(slot.slotStart).toLocaleString("en-AU")} with {slot.provider.name}
                      {slot.serviceType ? ` — ${slot.serviceType}` : ""}
                    </p>
                    <StatusBadge status={slot.status} />
                  </div>
                  {!slot.callAttempts.length ? (
                    <p className="mt-2 text-xs text-slate-400">No matching waitlist entries at cancellation time.</p>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {slot.callAttempts.map((a) => (
                        <li key={a.id} className="flex items-center gap-2 text-xs text-slate-600">
                          <Badge tone={a.outcome === "accepted" ? "success" : a.outcome === "opted_out" ? "danger" : "default"}>
                            #{a.attemptNumber}
                          </Badge>
                          <span>{a.entry.contact.name || a.entry.contact.phone}</span>
                          <span className="text-slate-400">— {ATTEMPT_OUTCOME_LABEL[a.outcome] || a.outcome}</span>
                          {a.smsFallbackSentAt && <span className="text-slate-400">(SMS sent)</span>}
                          {a.dryRun && <Badge tone="purple">dry run</Badge>}
                        </li>
                      ))}
                    </ul>
                  )}
                  {slot.status === "FILLED" && slot.filledAt && (
                    <p className="mt-2 text-xs font-medium text-emerald-600">Recovered {new Date(slot.filledAt).toLocaleString("en-AU")}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddEntryDialog open={addOpen} onOpenChange={setAddOpen} providers={providers} onAdded={() => mutateEntries()} />
    </div>
  );
}

function AddEntryDialog({
  open,
  onOpenChange,
  providers,
  onAdded,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  providers: Provider[];
  onAdded: () => void;
}) {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [providerId, setProviderId] = useState("");
  const [partOfDay, setPartOfDay] = useState("");
  const [saving, setSaving] = useState(false);

  function close() {
    onOpenChange(false);
    setContactName("");
    setContactPhone("");
    setServiceType("");
    setProviderId("");
    setPartOfDay("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPost("/api/business/waitlist", {
        contact: { name: contactName || undefined, phone: contactPhone },
        serviceType: serviceType || undefined,
        preferredProviderId: providerId || undefined,
        timeWindows: partOfDay ? [{ partOfDay }] : [],
      });
      toast.success("Added to waitlist");
      onAdded();
      close();
    } catch {
      toast.error("Could not add to waitlist");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to waitlist</DialogTitle>
        </DialogHeader>
        <p className="-mt-2 mb-3 text-xs text-slate-500">
          Adding a patient here confirms they&apos;ve consented to be called if an earlier appointment opens up.
        </p>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Patient name</Label>
              <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label>Service</Label>
            <Input value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="e.g. General check-up" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Preferred provider</Label>
              <Select value={providerId} onChange={(e) => setProviderId(e.target.value)}>
                <option value="">Any</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Preferred time</Label>
              <Select value={partOfDay} onChange={(e) => setPartOfDay(e.target.value)}>
                <option value="">Any time</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Adding…" : "Add to waitlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
