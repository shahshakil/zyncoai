"use client";
import { useEffect } from "react";
import { BillingPageContent, trackBillingPageViewed } from "@/components/dashboard/billing/BillingPageContent";

export default function BillingPage() {
  useEffect(() => {
    trackBillingPageViewed();
  }, []);

  // OWNER/ADMIN-only redirect for STAFF/DOCTOR is centralized in
  // app/dashboard/layout.tsx (same guard settings/analytics already use)
  // so it fires from one place regardless of which billing route was
  // hit directly (e.g. a stale bookmark), instead of duplicating the
  // check here.
  return <BillingPageContent />;
}
