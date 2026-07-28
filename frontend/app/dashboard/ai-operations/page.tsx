import AIOperationsDashboard from "@/components/dashboard/ai-operations/AIOperationsDashboard";
import { DashboardTabNav } from "@/components/dashboard/DashboardTabNav";

export default function AIOperationsPage() {
  return (
    <div className="space-y-6">
      <DashboardTabNav />
      <AIOperationsDashboard />
    </div>
  );
}
