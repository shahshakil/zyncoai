"use client";
import dynamic from "next/dynamic";
import { DashboardTabNav } from "@/components/dashboard/DashboardTabNav";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps } from "@/lib/verticalOps";
import { VerticalGate } from "@/components/dashboard/VerticalGate";

const WaitlistDashboard = dynamic(() => import("@/components/dashboard/clinical/WaitlistDashboard"), {
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-slate-100" />,
  ssr: false,
});

export default function WaitlistPage() {
  const { business } = useDashboard();
  const enabled = !!getVerticalOps(business.vertical)?.clinicalEnabled;

  return (
    <VerticalGate enabled={enabled}>
      <div className="space-y-6">
        <DashboardTabNav />
        <WaitlistDashboard />
      </div>
    </VerticalGate>
  );
}
