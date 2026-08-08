"use client";
import { useEffect, useRef, useState } from "react";
import { Calculator } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Input, Label } from "@/components/dashboard/ui/input";

// Seeded from real platform figures but fully editable — an independent
// "what-if" tool, not strictly bound to the live numbers once the admin
// starts typing. Seeding happens exactly once, the first time real (non-
// loading) data arrives — NOT on every background poll refresh, or an
// admin's deliberate override would get silently wiped out from under them
// every 20s. The "Overridden" badge compares each field against that same
// one-time snapshot (seedRef), not the live-updating prop, so it stays
// accurate for the same reason.
export function BreakEvenCalculator({
  activeBusinessCount, avgRevenuePerClientCents, avgVariableCostPerClientMicros, fixedCostsMonthlyCents, loading,
}: {
  activeBusinessCount: number;
  avgRevenuePerClientCents: number;
  avgVariableCostPerClientMicros: number;
  fixedCostsMonthlyCents: number;
  loading?: boolean;
}) {
  const [clients, setClients] = useState(String(activeBusinessCount));
  const [revenuePerClient, setRevenuePerClient] = useState((avgRevenuePerClientCents / 100).toFixed(2));
  const [variableCostPerClient, setVariableCostPerClient] = useState((avgVariableCostPerClientMicros / 1_000_000).toFixed(2));
  const [fixedCosts, setFixedCosts] = useState((fixedCostsMonthlyCents / 100).toFixed(2));

  const seeded = useRef(false);
  const seedRef = useRef({ clients: "", revenuePerClient: "", variableCostPerClient: "", fixedCosts: "" });

  useEffect(() => {
    if (seeded.current || loading) return;
    seeded.current = true;
    const seed = {
      clients: String(activeBusinessCount),
      revenuePerClient: (avgRevenuePerClientCents / 100).toFixed(2),
      variableCostPerClient: (avgVariableCostPerClientMicros / 1_000_000).toFixed(2),
      fixedCosts: (fixedCostsMonthlyCents / 100).toFixed(2),
    };
    seedRef.current = seed;
    setClients(seed.clients);
    setRevenuePerClient(seed.revenuePerClient);
    setVariableCostPerClient(seed.variableCostPerClient);
    setFixedCosts(seed.fixedCosts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, activeBusinessCount, avgRevenuePerClientCents, avgVariableCostPerClientMicros, fixedCostsMonthlyCents]);

  const n = parseFloat(clients) || 0;
  const rev = parseFloat(revenuePerClient) || 0;
  const varCost = parseFloat(variableCostPerClient) || 0;
  const fixed = parseFloat(fixedCosts) || 0;

  const marginPerClient = rev - varCost;
  const projectedProfit = n * marginPerClient - fixed;
  const breakEvenClients = marginPerClient > 0 ? Math.ceil(fixed / marginPerClient) : null;

  const fields: { label: string; value: string; onChange: (v: string) => void; seedKey: keyof typeof seedRef.current; step?: string }[] = [
    { label: "Active clients", value: clients, onChange: setClients, seedKey: "clients" },
    { label: "Avg revenue / client / mo ($)", value: revenuePerClient, onChange: setRevenuePerClient, seedKey: "revenuePerClient", step: "0.01" },
    { label: "Avg variable cost / client / mo ($)", value: variableCostPerClient, onChange: setVariableCostPerClient, seedKey: "variableCostPerClient", step: "0.01" },
    { label: "Fixed costs / mo ($)", value: fixedCosts, onChange: setFixedCosts, seedKey: "fixedCosts", step: "0.01" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calculator className="h-4 w-4 text-[#F97316]" /> Break-Even Calculator</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        {fields.map((f) => {
          const overridden = seeded.current && f.value !== seedRef.current[f.seedKey];
          return (
            <div key={f.label}>
              <div className="flex items-center gap-1.5">
                <Label>{f.label}</Label>
                {overridden && <Badge tone="warning">Overridden</Badge>}
              </div>
              <Input type="number" min="0" step={f.step} value={f.value} onChange={(e) => f.onChange(e.target.value)} />
            </div>
          );
        })}
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
