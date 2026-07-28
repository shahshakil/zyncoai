"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { DashboardContext, DashboardBusiness, DashboardUser, BusinessRole } from "./BusinessContext";
import { Skeleton } from "./ui/skeleton";

type GateState = {
  user: DashboardUser;
  business: DashboardBusiness;
  role: BusinessRole;
  providerId: string | null;
  providerName: string | null;
  canSeeFinancials: boolean;
  canManageBusiness: boolean;
};

export function DashboardGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<GateState | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meRes = await fetch("/api/auth/me", { credentials: "include" });
        if (!meRes.ok) {
          router.replace("/login?next=/dashboard");
          return;
        }
        const me = await meRes.json();

        const statusRes = await fetch("/api/business/onboarding/business/status", { credentials: "include" });
        const status = await statusRes.json().catch(() => ({ hasBusiness: false, businesses: [] }));

        if (!status.hasBusiness || !status.businesses?.length) {
          router.replace("/onboarding");
          return;
        }

        const businessMeRes = await fetch("/api/business/me", { credentials: "include" });
        const businessMe = await businessMeRes.json().catch(() => null);
        const role: BusinessRole = businessMe?.role || "OWNER";

        if (!cancelled) {
          const business = {
            ...status.businesses[0],
            capacityCount: businessMe?.business?.capacityCount,
            address: businessMe?.business?.address ?? null,
            phoneNumber: businessMe?.business?.phoneNumber ?? null,
          };
          setState({
            user: me.user,
            business,
            role,
            providerId: businessMe?.providerId ?? null,
            providerName: businessMe?.provider?.name ?? null,
            canSeeFinancials: role === "OWNER" || role === "ADMIN",
            canManageBusiness: role === "OWNER" || role === "ADMIN",
          });

          if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            posthog.identify(me.user.id, { email: me.user.email, name: me.user.name, role });
            posthog.group("company", business.id, {
              name: business.name,
              vertical: business.vertical,
            });
          }
        }
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Couldn&apos;t reach ZyncoAI. Refresh to try again.</p>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex min-h-screen flex-col gap-4 bg-slate-50 p-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return <DashboardContext.Provider value={state}>{children}</DashboardContext.Provider>;
}
