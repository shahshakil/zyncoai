"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { DashboardContext, DashboardBusiness, DashboardUser, BusinessRole, ImpersonationState } from "./BusinessContext";
import { Skeleton } from "./ui/skeleton";
import { SuspendedAccountGate } from "./SuspendedAccountGate";
import { ImpersonationBanner } from "./ImpersonationBanner";

type GateState = {
  user: DashboardUser;
  business: DashboardBusiness;
  role: BusinessRole;
  providerId: string | null;
  providerName: string | null;
  canSeeFinancials: boolean;
  canManageBusiness: boolean;
  impersonation: ImpersonationState | null;
};

export function DashboardGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<GateState | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // These three calls are independent of each other's response data,
        // so they're fired concurrently instead of chained — the sequential
        // await-chain here used to make every dashboard load pay full JWT
        // verification (blacklist + session checks, several Redis round
        // trips each) three times over, serially.
        const [meRes, statusRes, businessMeRes] = await Promise.all([
          fetch("/api/auth/me", { credentials: "include" }),
          fetch("/api/business/onboarding/business/status", { credentials: "include" }),
          fetch("/api/business/me", { credentials: "include" }),
        ]);

        if (!meRes.ok) {
          router.replace("/login?next=/dashboard");
          return;
        }
        const me = await meRes.json();

        const businessMe = await businessMeRes.json().catch(() => null);

        // Admin "view as business" sessions have no real User/Membership/
        // onboarding-status row behind them (see requireJwt's impersonation
        // branch) — /api/auth/me already flags this via `me.impersonation`,
        // set only for impersonation tokens. Skip the onboarding-status gate
        // entirely for these; /api/business/me alone (already resolved via
        // tenantMiddleware's impersonation short-circuit) has everything
        // needed to render the real owner's dashboard.
        const impersonating = Boolean(me.impersonation);

        let business: DashboardBusiness;
        let role: BusinessRole;

        if (impersonating) {
          if (!businessMe?.ok) {
            setError(true);
            return;
          }
          business = businessMe.business;
          role = businessMe.role || "OWNER";
        } else {
          const status = await statusRes.json().catch(() => ({ hasBusiness: false, businesses: [] }));

          if (!status.hasBusiness || !status.businesses?.length) {
            router.replace("/onboarding");
            return;
          }

          role = businessMe?.role || "OWNER";
          business = {
            ...status.businesses[0],
            capacityCount: businessMe?.business?.capacityCount,
            address: businessMe?.business?.address ?? null,
            phoneNumber: businessMe?.business?.phoneNumber ?? null,
            provisioningStatus: businessMe?.business?.provisioningStatus ?? null,
            twilioNumberSid: businessMe?.business?.twilioNumberSid ?? null,
            billingPastDue: businessMe?.business?.billingPastDue ?? false,
            squareCardId: businessMe?.business?.squareCardId ?? null,
          };
        }

        if (!cancelled) {
          setState({
            user: me.user,
            business,
            role,
            providerId: businessMe?.providerId ?? null,
            providerName: businessMe?.provider?.name ?? null,
            canSeeFinancials: role === "OWNER" || role === "ADMIN",
            canManageBusiness: role === "OWNER" || role === "ADMIN",
            impersonation: impersonating ? { sessionId: me.impersonation.sessionId, mode: me.impersonation.mode } : null,
          });

          // Impersonated sessions never identify/group in PostHog — an
          // admin's clicks would otherwise be attributed as real product
          // usage for the business being viewed, polluting that company's
          // analytics with activity its own users never generated.
          if (process.env.NEXT_PUBLIC_POSTHOG_KEY && !impersonating) {
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

  // The banner is rendered ahead of EVERY branch below, including the
  // suspended/closed messages — "persistent, unmissable" per spec means an
  // admin never sees any part of this business's dashboard state without it,
  // not just the normal happy-path render.
  const banner = state.impersonation ? (
    <ImpersonationBanner sessionId={state.impersonation.sessionId} initialMode={state.impersonation.mode} businessName={state.business.name} />
  ) : null;

  // HOLD is deliberately NOT gated here — unlike SUSPENDED/CLOSED below, a
  // business on HOLD (Square auto-charge retries exhausted) keeps full
  // dashboard access; only calling is blocked (twilioInbound.ts). It falls
  // through to the normal dashboard render, with HoldBanner (rendered in
  // app/dashboard/layout.tsx alongside TrialBanner) as the visible signal.
  if (state.business.status === "CLOSED") {
    return (
      <>
        {banner}
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <p className="max-w-sm text-center text-sm text-slate-500">
            This account has been closed. Please contact support to discuss reactivating it.
          </p>
        </div>
      </>
    );
  }

  if (state.business.status === "SUSPENDED") {
    // Billing routes are OWNER/ADMIN-only server-side (requireBusinessRole in
    // billing.ts), so STAFF/DOCTOR can't drive the card-entry gate — they'd
    // just get 403s from it. Give them a plain message instead and let an
    // owner/admin reactivate.
    if (!state.canManageBusiness) {
      return (
        <>
          {banner}
          <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
            <p className="max-w-sm text-center text-sm text-slate-500">
              This account is currently suspended. Please contact your business owner or admin to reactivate it.
            </p>
          </div>
        </>
      );
    }
    return (
      <>
        {banner}
        <SuspendedAccountGate />
      </>
    );
  }

  return (
    <DashboardContext.Provider value={state}>
      {banner}
      {children}
    </DashboardContext.Provider>
  );
}
