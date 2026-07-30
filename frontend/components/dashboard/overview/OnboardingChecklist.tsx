"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardContent } from "@/components/dashboard/ui/card";

interface ChecklistItem {
  key: string;
  label: string;
  done: boolean;
}

interface ChecklistResponse {
  ok: boolean;
  items: ChecklistItem[];
  percent: number;
  complete: boolean;
}

const ITEM_LINKS: Record<string, string> = {
  forwarding: "/dashboard/settings?tab=integrations",
  hours: "/dashboard/settings?tab=profile",
  booking_system: "/dashboard/settings?tab=integrations",
  invite_staff: "/dashboard/settings?tab=staff",
  transfer_number: "/dashboard/settings?tab=integrations",
  test_call: "/dashboard/calls",
};

// Disappears entirely once every item is done — no dismiss button needed,
// there's nothing left to show once percent hits 100.
export function OnboardingChecklist() {
  const { data } = useApi<ChecklistResponse>("/api/business/dashboard/onboarding-checklist", { refreshInterval: 30000 });

  if (!data?.ok || data.complete) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Finish setting up ZyncoAI</h3>
          <span className="text-xs font-medium text-slate-500">{data.percent}% complete</span>
        </div>
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[image:var(--gradient,linear-gradient(135deg,#6366f1,#06b6d4))] transition-all duration-300"
            style={{ width: `${data.percent}%` }}
          />
        </div>
        <ul className="space-y-2">
          {data.items.map((item) => (
            <li key={item.key}>
              <Link
                href={ITEM_LINKS[item.key] || "/dashboard/settings"}
                className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-slate-900"
              >
                <span
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
                    item.done ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white"
                  }`}
                >
                  {item.done && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </span>
                <span className={item.done ? "text-slate-400 line-through" : undefined}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
