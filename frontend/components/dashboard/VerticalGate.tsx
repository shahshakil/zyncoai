"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Every vertical-exclusive dashboard page (Clinical & Billing, Kitchen, ...)
// must wrap its content in this instead of rolling its own ad hoc vertical
// check. /dashboard/clinical shipped with NO check at all — it relied
// solely on DashboardTabNav hiding its own nav link, which a direct URL
// visit (bookmark, browser history, a stale shared link) bypasses entirely.
// The backend's requireClinicVertical/requireVerticalPortal correctly 403
// the API calls underneath regardless, but that alone still leaves the
// page's medical-specific chrome (titles, section headers, empty states)
// fully visible to a business of the wrong vertical. This component is the
// frontend's matching route-level guard, driven by the single feature-flag
// source of truth in lib/verticalOps.ts (clinicalEnabled/kitchenEnabled)
// rather than a page-local literal comparison.
export function VerticalGate({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) router.replace("/dashboard");
  }, [enabled, router]);

  if (!enabled) return null;
  return <>{children}</>;
}
