"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Bell, CheckCircle2 } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { EmptyState } from "@/components/dashboard/ui/table";
import { Topbar } from "@/components/platform-admin/Topbar";

interface Alert {
  id: string;
  alertType: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  description: string;
  business?: { name: string } | null;
  autoActionTaken: string | null;
  resolvedAt: string | null;
  resolvedByAdmin?: { email: string } | null;
  createdAt: string;
}

const SEVERITY_TONE: Record<string, "success" | "warning" | "danger" | "info"> = { INFO: "info", WARNING: "warning", CRITICAL: "danger" };

export default function AlertInboxPage() {
  const [severity, setSeverity] = useState<string>("");
  const [resolved, setResolved] = useState<string>("false");
  const qs = new URLSearchParams({ ...(severity ? { severity } : {}), ...(resolved ? { resolved } : {}) }).toString();
  const { data, mutate } = useApi<{ alerts: Alert[] }>(`/api/admin/platform/alerts?${qs}`, { refreshInterval: 15000 });

  async function resolveOne(id: string) {
    await apiPost(`/api/admin/platform/alerts/${id}/resolve`);
    toast.success("Alert marked resolved");
    mutate();
  }

  return (
    <div className="-m-6">
      <Topbar title="Alert Inbox" refreshIntervalMs={15000} />
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap gap-2">
          {["", "CRITICAL", "WARNING", "INFO"].map((s) => (
            <button key={s} onClick={() => setSeverity(s)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${severity === s ? "bg-[#1F2937] text-white" : "bg-[#F1F5F9] text-[#6B7280]"}`}>
              {s || "All severities"}
            </button>
          ))}
          <span className="mx-2 h-6 w-px bg-[#E5E7EB]" />
          {[{ v: "false", l: "Unresolved" }, { v: "true", l: "Resolved" }, { v: "", l: "All" }].map((o) => (
            <button key={o.v} onClick={() => setResolved(o.v)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${resolved === o.v ? "bg-[#1F2937] text-white" : "bg-[#F1F5F9] text-[#6B7280]"}`}>
              {o.l}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {data?.alerts.length ? (
            data.alerts.map((a) => (
              <Card key={a.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge tone={SEVERITY_TONE[a.severity]}>{a.severity}</Badge>
                      {a.business?.name && <span className="text-xs text-[#6B7280]">{a.business.name}</span>}
                      <span className="text-xs text-[#9CA3AF]">{new Date(a.createdAt).toLocaleString("en-AU")}</span>
                    </div>
                    <p className="mt-1.5 font-medium text-[#1F2937]">{a.title}</p>
                    <p className="mt-0.5 text-sm text-[#6B7280]">{a.description}</p>
                    {a.autoActionTaken && <p className="mt-1 text-xs italic text-[#8B5CF6]">Auto-action: {a.autoActionTaken}</p>}
                    {a.resolvedAt && <p className="mt-1 flex items-center gap-1 text-xs text-[#10B981]"><CheckCircle2 className="h-3 w-3" /> Resolved {new Date(a.resolvedAt).toLocaleString("en-AU")} by {a.resolvedByAdmin?.email || "admin"}</p>}
                  </div>
                  {!a.resolvedAt && <Button size="sm" variant="outline" onClick={() => resolveOne(a.id)}>Mark resolved</Button>}
                </div>
              </Card>
            ))
          ) : (
            <EmptyState title="No alerts match this filter" description="30-day history — critical and warning alerts are also emailed." />
          )}
        </div>
      </div>
    </div>
  );
}
