"use client";
import { Sparkles } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function BillingTab() {
  const { data, isLoading } = useApi<{ message: string }>("/api/business/settings/billing");

  return (
    <Card>
      <CardHeader><CardTitle>Billing</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="flex items-start gap-4 rounded-lg border border-indigo-500/20 bg-[var(--accent,#4f46e5)]/5 p-5">
            <Sparkles className="h-5 w-5 shrink-0 text-[var(--accent,#4f46e5)]" />
            <div>
              <p className="text-sm font-medium text-slate-900">Billing coming soon</p>
              <p className="mt-1 text-sm text-slate-500">{data?.message}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
