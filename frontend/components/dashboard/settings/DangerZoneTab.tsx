"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { apiPost } from "@/lib/useApi";
import { useDashboard } from "../BusinessContext";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export function DangerZoneTab() {
  const { business } = useDashboard();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const suspended = business.status === "SUSPENDED";

  async function toggle() {
    if (!suspended && !confirm(`Suspend ${business.name}? Your AI receptionist will stop taking new bookings until you reactivate.`)) return;
    setBusy(true);
    try {
      await apiPost(`/api/business/settings/danger/${suspended ? "reactivate" : "suspend"}`);
      toast.success(suspended ? "Business reactivated" : "Business suspended");
      router.refresh();
      window.location.reload();
    } catch {
      toast.error("Only an owner or admin can do this");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-rose-500/20">
      <CardHeader><CardTitle className="text-rose-400">Danger zone</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <div>
              <p className="text-sm font-medium text-slate-900">{suspended ? "Reactivate business" : "Suspend business"}</p>
              <p className="mt-1 text-sm text-slate-400">
                {suspended ? "Resume taking calls and bookings." : "Your voice line stops taking new bookings. Existing data is kept."}
              </p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={toggle} disabled={busy}>
            {suspended ? "Reactivate" : "Suspend"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
