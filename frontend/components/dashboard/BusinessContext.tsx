"use client";
import { createContext, useContext } from "react";

export type BusinessRole = "OWNER" | "ADMIN" | "STAFF" | "DOCTOR";

export interface DashboardUser {
  id: string;
  email: string | null;
  name: string | null;
}

export interface DashboardBusiness {
  id: string;
  name: string;
  vertical: string;
  status: string;
  capacityCount?: number;
  address?: string | null;
  phoneNumber?: string | null;
  provisioningStatus?: string | null;
  twilioNumberSid?: string | null;
  trialEndsAt?: string | null;
  manualPlan?: string | null;
  billingPastDue?: boolean;
  // Card-vs-transfer copy branch for PastDueBanner/HoldBanner — null/absent
  // means no card on file, so those banners point at bank transfer instead
  // of "update your card".
  squareCardId?: string | null;
  // True for the one-time pre-existing-business grace cohort — TrialBanner
  // uses this to avoid calling a real, already-live business's runway a
  // "free trial". See Business.legacyBillingGraceGranted's schema comment.
  legacyBillingGraceGranted?: boolean;
  // Payment-first activation (PATCH /plan's bank-transfer path) — set
  // together when a plan choice is awaiting a bank transfer, cleared
  // together once admin marks the linked invoice paid.
  pendingPlanKey?: string | null;
  pendingActivationInvoiceId?: string | null;
  pendingActivation?: { invoiceNumber: string; totalCents: number; planName: string } | null;
}

export interface ImpersonationState {
  sessionId: string;
  mode: "read" | "edit";
}

interface DashboardCtx {
  user: DashboardUser;
  business: DashboardBusiness;
  role: BusinessRole;
  providerId: string | null;
  providerName: string | null;
  canSeeFinancials: boolean;
  canManageBusiness: boolean;
  impersonation: ImpersonationState | null;
}

export const DashboardContext = createContext<DashboardCtx | null>(null);

export function useDashboard(): DashboardCtx {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within the dashboard layout");
  return ctx;
}
