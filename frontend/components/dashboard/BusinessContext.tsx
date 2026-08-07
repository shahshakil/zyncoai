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
