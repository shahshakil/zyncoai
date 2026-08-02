"use client";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { EmptyState } from "@/components/dashboard/ui/table";
import { ShieldAlert } from "lucide-react";

// AI Risk Monitoring previously fetched a relative URL ("/api/risk/summary")
// from a Server Component — Node's server-side fetch requires an absolute
// URL, so this threw on every visit. No business-scoped risk-monitoring
// endpoint exists in the real API yet (only an unrelated, differently-
// tenanted "/api/enterprise/risk" for the legacy workflow platform), so this
// renders an honest not-yet-available state instead of wiring to the wrong
// backend or fabricating data.
export default function RiskPage() {
  const { canManageBusiness } = useDashboard();

  if (!canManageBusiness) {
    return <EmptyState title="Not available" description="AI risk monitoring is only visible to business owners and admins." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">AI Risk Monitoring</h1>
      <EmptyState
        icon={ShieldAlert}
        title="Not available yet"
        description="AI risk monitoring for this business isn't wired up yet — check back soon."
      />
    </div>
  );
}
