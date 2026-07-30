import dynamic from "next/dynamic";
import { DashboardTabNav } from "@/components/dashboard/DashboardTabNav";

const AIOperationsDashboard = dynamic(() => import("@/components/dashboard/ai-operations/AIOperationsDashboard"), {
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-slate-100" />,
  ssr: false,
});

export default function AIOperationsPage() {
  return (
    <div className="space-y-6">
      <DashboardTabNav />
      <AIOperationsDashboard />
    </div>
  );
}
