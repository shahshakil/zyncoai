"use client";
import { useEffect, useState } from "react";
import { Calculator } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Input, Label } from "@/components/dashboard/ui/input";

// Seeded from real platform figures but fully editable — an independent
// "what-if" tool, not strictly bound to the live numbers once the admin
// starts typing.
export function BreakEvenCalculator({
  activeBusinessCount, avgRevenuePerClientCents, avgVariableCostPerClientMicros, fixedCostsMonthlyCents,
}: {
  activeBusinessCount: number;
  avgRevenuePerClientCents: number;
  avgVariableCostPerClientMicros: number;
  fixedCostsMonthlyCents: number;
}) {
  const [clients, setClients] = useState(String(activeBusinessCount));
  const [revenuePerClient, setRevenuePerClient] = useState((avgRevenuePerClientCents / 100).toFixed(2));
  const [variableCostPerClient, setVariableCostPerClient] = useState((avgVariableCostPerClientMicros / 1_000_000).toFixed(2));
  const [fixedCosts, setFixedCosts] = useState((fixedCostsMonthlyCents / 100).toFixed(2));

  useEffect(() => {
    setClients(String(activeBusinessCount));
    setRevenuePerClient((avgRevenuePerClientCents / 100).toFixed(2));
    setVariableCostPerClient((avgVariableCostPerClientMicros / 1_000_000).toFixed(2));
    setFixedCosts((fixedCostsMonthlyCents / 100).toFixed(2));
  }, [activeBusinessCount, avgRevenuePerClientCents, avgVariableCostPerClientMicros, fixedCostsMonthlyCents]);

  const n = parseFloat(clients) || 0;
  const rev = parseFloat(revenuePerClient) || 0;
  const varCost = parseFloat(variableCostPerClient) || 0;
  const fixed = parseFloat(fixedCosts) || 0;

  const marginPerClient = rev - varCost;
  const projectedProfit = n * marginPerClient - fixed;
  const breakEvenClients = marginPerClient > 0 ? Math.ceil(fixed / marginPerClient) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calculator className="h-4 w-4 text-[#F97316]" /> Break-Even Calculator</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <div>
          <Label>Active clients</Label>
          <Input type="number" min="0" value={clients} onChange={(e) => setClients(e.target.value)} />
        </div>
        <div>
          <Label>Avg revenue / client / mo ($)</Label>
          <Input type="number" min="0" step="0.01" value={revenuePerClient} onChange={(e) => setRevenuePerClient(e.target.value)} />
        </div>
        <div>
          <Label>Avg variable cost / client / mo ($)</Label>
          <Input type="number" min="0" step="0.01" value={variableCostPerClient} onChange={(e) => setVariableCostPerClient(e.target.value)} />
        </div>
        <div>
          <Label>Fixed costs / mo ($)</Label>
          <Input type="number" min="0" step="0.01" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 border-t border-slate-100 p-5 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E5E7EB] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Margin / client</p>
          <p className={`mt-1 text-xl font-bold ${marginPerClient >= 0 ? "text-[#1F2937]" : "text-[#EF4444]"}`}>${marginPerClient.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Projected profit / mo</p>
          <p className={`mt-1 text-xl font-bold ${projectedProfit >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>${projectedProfit.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Clients needed to break even</p>
          <p className="mt-1 text-xl font-bold text-[#1F2937]">{breakEvenClients === null ? "Not possible at this margin" : breakEvenClients}</p>
        </div>
      </div>
    </Card>
  );
}
