"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Download, Plus } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label, Textarea, Select } from "@/components/dashboard/ui/input";
import { EmptyState } from "@/components/dashboard/ui/table";
import { Topbar } from "@/components/platform-admin/Topbar";

interface BreachReport {
  id: string;
  discoveredAt: string;
  informationTypes: string;
  affectedIndividuals: number | null;
  howItOccurred: string;
  stepsTaken: string;
  status: "open" | "contained" | "notified_oaic" | "notified_individuals" | "closed";
  affectedBusiness?: { id: string; name: string } | null;
  oaicNotifiedAt: string | null;
  individualsNotifiedAt: string | null;
  reportedByAdmin?: { email: string } | null;
  createdAt: string;
}

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  open: "danger",
  contained: "warning",
  notified_oaic: "info",
  notified_individuals: "info",
  closed: "success",
};

const STATUS_OPTIONS = ["open", "contained", "notified_oaic", "notified_individuals", "closed"];

export default function DataBreachReportPage() {
  const { data, mutate } = useApi<{ reports: BreachReport[] }>("/api/admin/platform/data-breaches", { refreshInterval: 30000 });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [discoveredAt, setDiscoveredAt] = useState("");
  const [informationTypes, setInformationTypes] = useState("");
  const [affectedIndividuals, setAffectedIndividuals] = useState("");
  const [howItOccurred, setHowItOccurred] = useState("");
  const [stepsTaken, setStepsTaken] = useState("");

  function resetForm() {
    setDiscoveredAt("");
    setInformationTypes("");
    setAffectedIndividuals("");
    setHowItOccurred("");
    setStepsTaken("");
  }

  async function submit() {
    if (!discoveredAt || !informationTypes.trim() || !howItOccurred.trim() || !stepsTaken.trim()) {
      toast.error("Date of breach, type of data affected, how it occurred, and steps taken are all required");
      return;
    }
    setSaving(true);
    try {
      await apiPost("/api/admin/platform/data-breaches", {
        discoveredAt: new Date(discoveredAt).toISOString(),
        informationTypes: informationTypes.trim(),
        affectedIndividuals: affectedIndividuals ? Number(affectedIndividuals) : null,
        howItOccurred: howItOccurred.trim(),
        stepsTaken: stepsTaken.trim(),
      });
      toast.success("Breach report logged");
      resetForm();
      setShowForm(false);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed to log breach report");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    await apiPost(`/api/admin/platform/data-breaches/${id}`, { status }, "PATCH");
    toast.success("Status updated");
    mutate();
  }

  return (
    <div className="-m-6">
      <Topbar title="Data Breach Report" refreshIntervalMs={30000} />
      <div className="space-y-6 p-6">
        <Card className="p-4">
          <p className="text-sm text-[#374151]">
            Under the Privacy Act 1988&apos;s Notifiable Data Breaches (NDB) scheme, an eligible data breach likely
            to result in serious harm must be <strong>submitted to the OAIC within 30 days</strong> of becoming
            aware of it. Log every breach here, then download a pre-filled OAIC notification template once ready to
            submit.
          </p>
        </Card>

        <div className="flex justify-end">
          <Button onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Log New Breach"}
          </Button>
        </div>

        {showForm && (
          <Card className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Date of breach</Label>
                <Input type="date" value={discoveredAt} onChange={(e) => setDiscoveredAt(e.target.value)} />
              </div>
              <div>
                <Label>Number of individuals affected</Label>
                <Input type="number" min={0} value={affectedIndividuals} onChange={(e) => setAffectedIndividuals(e.target.value)} placeholder="Optional — leave blank if unknown" />
              </div>
              <div className="sm:col-span-2">
                <Label>Type of data affected</Label>
                <Input value={informationTypes} onChange={(e) => setInformationTypes(e.target.value)} placeholder="e.g. name, phone number, appointment history" />
              </div>
              <div className="sm:col-span-2">
                <Label>How the breach occurred</Label>
                <Textarea value={howItOccurred} onChange={(e) => setHowItOccurred(e.target.value)} rows={3} />
              </div>
              <div className="sm:col-span-2">
                <Label>Steps taken</Label>
                <Textarea value={stepsTaken} onChange={(e) => setStepsTaken(e.target.value)} rows={3} />
              </div>
            </div>
            <Button className="mt-4" onClick={submit} disabled={saving}>
              {saving ? "Saving…" : "Log breach report"}
            </Button>
          </Card>
        )}

        <div className="space-y-3">
          {data?.reports.length ? (
            data.reports.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge tone={STATUS_TONE[r.status]}>{r.status.replace(/_/g, " ")}</Badge>
                      {r.affectedBusiness?.name && <span className="text-xs text-[#6B7280]">{r.affectedBusiness.name}</span>}
                      <span className="text-xs text-[#9CA3AF]">Discovered {new Date(r.discoveredAt).toLocaleDateString("en-AU")}</span>
                    </div>
                    <p className="mt-1.5 font-medium text-[#1F2937]">{r.informationTypes}</p>
                    <p className="mt-0.5 text-sm text-[#6B7280]">{r.howItOccurred}</p>
                    <p className="mt-0.5 text-xs text-[#9CA3AF]">Steps taken: {r.stepsTaken}</p>
                    {r.affectedIndividuals != null && <p className="mt-1 text-xs text-[#6B7280]">{r.affectedIndividuals} individuals affected</p>}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="w-auto py-1 text-xs">
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                      ))}
                    </Select>
                    <a href={`/api/admin/platform/data-breaches/${r.id}/oaic-template`} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline">
                        <Download className="h-3.5 w-3.5" /> OAIC template
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState title="No data breaches logged" description="This register is empty — nothing to report." />
          )}
        </div>
      </div>
    </div>
  );
}
