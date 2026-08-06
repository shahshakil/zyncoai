"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { X, Ban, PlayCircle, Mail, ExternalLink, Phone, PhoneOff, RefreshCw, Plug, CreditCard, KeyRound, RotateCw, Gift, HandCoins, XCircle } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Button } from "@/components/dashboard/ui/button";
import { Badge, StatusBadge } from "@/components/dashboard/ui/badge";
import { Input, Label, Select } from "@/components/dashboard/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/dashboard/ui/tabs";
import { VerticalBadge } from "./VerticalBadge";
import { formatCents, timeAgo } from "./format";
import { DiscountsPanel } from "./DiscountsPanel";
import { SquareBillingPanel } from "./SquareBillingPanel";

interface PricingPlan { key: string; name: string; priceCents: number; callAllowance: number | null }

interface BusinessDetail {
  id: string; name: string; phoneNumber: string; vertical: string; status: string; createdAt: string;
  manualPlan: string | null; abn: string | null; trialEndsAt: string | null;
  planOverridePriceCents: number | null; planOverrideCallAllowance: number | null;
  preferredPaymentMethod: "SQUARE" | "BANK_TRANSFER" | "PAYPAL" | "BPAY" | null;
  smsConfirmationsEnabled: boolean; smsConfirmationsPaid: boolean;
  twilioNumberSid: string | null; provisioningStatus: "PENDING" | "ACTIVE" | "FAILED"; provisioningError: string | null;
  squareCardId: string | null; squareCardBrand: string | null; squareCardLast4: string | null; squareCardExpMonth: number | null; squareCardExpYear: number | null;
  team: { name: string };
  members: { role: string; user: { email: string; name: string | null } }[];
  providers: { id: string; name: string; title: string | null; active: boolean }[];
  thirdPartyApiKeys: { provider: string; enabled: boolean; connectedAt: string }[];
  _count: { calls: number; appointments: number; contacts: number };
}
interface RecentInvoice {
  id: string; invoiceNumber: string; totalCents: number; status: "ISSUED" | "PAID" | "VOID";
  paidVia: "BANK_TRANSFER" | "SQUARE" | null; autoChargeFailedAt: string | null; autoChargeError: string | null; issuedAt: string;
}
interface OrderStats {
  ordersToday: number; ordersWeek: number; ordersMonth: number;
  revenueTodayCents: number; revenueWeekCents: number; revenueMonthCents: number;
  avgOrderValueCents: number;
}
interface PaymentRetryStatus { failedInvoiceId: string; failedCount: number; nextActionAt: string | null; nextAction: string }
// 2026-08-06 — Round 2 mission-control additions: usage-vs-plan-cap, real
// cost-vs-price margin (from CallCost/UsageCostEvent, the platform's own
// real cost tracking — not a heuristic), integration health, last
// activity, flagged issues. Previously an admin had to cross-reference the
// separate Costs dashboard and Phone Numbers page by hand for any of this.
interface UsageAndMargin {
  minutesUsedThisMonth: number; minuteAllowance: number | null; minutesOverCap: number;
  planPriceCents: number | null; estimatedCostCentsThisMonth: number; marginCents: number | null;
}
interface IntegrationHealth {
  square: { connected: boolean; healthy?: boolean; connectedAt?: string };
  microsoftCalendar: { connected: boolean; connectedAt?: string };
  practiceManagement: { provider: string; enabled: boolean; connectedAt: string }[];
}
interface FlaggedIssues { issueCallsThisMonth: number; paymentRetryActive: boolean }
interface DrawerData {
  business: BusinessDetail;
  recentCalls: { id: string; startedAt: string; outcome: string | null; status: string; contact: { name: string | null; phone: string } | null }[];
  upcomingAppointments: { id: string; startAt: string; status: string; contact: { name: string | null; phone: string } | null; provider: { name: string } | null }[];
  recentInvoices: RecentInvoice[];
  orderStats: OrderStats | null;
  paymentRetryStatus: PaymentRetryStatus | null;
  usageAndMargin: UsageAndMargin;
  integrationHealth: IntegrationHealth;
  lastActivityAt: string | null;
  flaggedIssues: FlaggedIssues;
}

export function BusinessDrawer({ businessId, onClose, onChanged }: { businessId: string | null; onClose: () => void; onChanged: () => void }) {
  const { data, mutate } = useApi<DrawerData>(businessId ? `/api/admin/platform/businesses/${businessId}` : null);
  const { data: settingsData } = useApi<{ settings: { pricingPlans: PricingPlan[] } }>("/api/admin/platform/settings/");
  const [emailOpen, setEmailOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [planKey, setPlanKey] = useState("");
  const [abn, setAbn] = useState("");
  const [overridePrice, setOverridePrice] = useState("");
  const [overrideAllowance, setOverrideAllowance] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [savingPaymentMethod, setSavingPaymentMethod] = useState(false);

  useEffect(() => {
    if (!data) return;
    setPlanKey(data.business.manualPlan || "");
    setAbn(data.business.abn || "");
    setOverridePrice(data.business.planOverridePriceCents !== null ? (data.business.planOverridePriceCents / 100).toString() : "");
    setOverrideAllowance(data.business.planOverrideCallAllowance !== null ? data.business.planOverrideCallAllowance.toString() : "");
    setPaymentMethod(data.business.preferredPaymentMethod || "");
  }, [data]);

  async function savePaymentMethod() {
    setSavingPaymentMethod(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/payment-method`, { method: paymentMethod || null });
      toast.success("Payment method saved");
      mutate();
      onChanged();
    } catch {
      toast.error("Failed to save payment method");
    } finally {
      setSavingPaymentMethod(false);
    }
  }

  async function savePlan() {
    setSavingPlan(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/plan`, {
        planKey: planKey || null,
        abn: abn.trim() || null,
        planOverridePriceCents: overridePrice.trim() === "" ? null : Math.round(Number(overridePrice) * 100),
        planOverrideCallAllowance: overrideAllowance.trim() === "" ? null : Math.round(Number(overrideAllowance)),
      });
      toast.success("Billing details saved");
      mutate();
      onChanged();
    } catch {
      toast.error("Failed to save billing details");
    } finally {
      setSavingPlan(false);
    }
  }

  const [savingSms, setSavingSms] = useState(false);

  async function toggleSmsConfirmations(field: "enabled" | "paid", value: boolean) {
    setSavingSms(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/sms-confirmations`, { [field]: value });
      toast.success("SMS confirmations updated");
      mutate();
      onChanged();
    } catch {
      toast.error("Failed to update SMS confirmations");
    } finally {
      setSavingSms(false);
    }
  }

  const [extendingTrial, setExtendingTrial] = useState(false);

  async function extendTrial(days: number) {
    setExtendingTrial(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/extend-trial`, { days });
      toast.success(`Trial extended ${days} days`);
      mutate();
      onChanged();
    } catch {
      toast.error("Failed to extend trial");
    } finally {
      setExtendingTrial(false);
    }
  }

  const [payBusy, setPayBusy] = useState(false);

  async function forceRetryPayment() {
    setPayBusy(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/force-retry`);
      toast.success("Payment retried successfully");
      mutate();
      onChanged();
    } catch (err: any) {
      toast.error(err?.message || "Retry failed — card still declined");
    } finally {
      setPayBusy(false);
    }
  }

  async function waivePayment() {
    if (!confirm("Waive this failed invoice? It will be marked paid ($0) and the business reactivated.")) return;
    setPayBusy(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/waive-payment`);
      toast.success("Invoice waived");
      mutate();
      onChanged();
    } catch {
      toast.error("Failed to waive payment");
    } finally {
      setPayBusy(false);
    }
  }

  async function giveFreeMonth() {
    if (!confirm(`Give ${data?.business.name} a free month (100% off their next invoice)?`)) return;
    setPayBusy(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/free-month`);
      toast.success("Free month granted");
      mutate();
      onChanged();
    } catch {
      toast.error("Failed to grant free month");
    } finally {
      setPayBusy(false);
    }
  }

  async function closeAccount() {
    if (!confirm(`Close ${data?.business.name}'s account? Calling stops immediately and the dashboard becomes fully inaccessible. This does not release their phone number or delete data yet.`)) return;
    setPayBusy(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/close-account`);
      toast.success("Account closed");
      mutate();
      onChanged();
    } catch {
      toast.error("Failed to close account");
    } finally {
      setPayBusy(false);
    }
  }

  async function toggleStatus() {
    if (!data) return;
    const action = data.business.status === "SUSPENDED" || data.business.status === "HOLD" ? "activate" : "suspend";
    if (action === "suspend" && !confirm(`Suspend ${data.business.name}? Their AI receptionist will stop taking calls.`)) return;
    setBusy(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/${action}`);
      toast.success(`${data.business.name} ${action}d`);
      mutate();
      onChanged();
    } catch {
      toast.error("Action failed");
    } finally {
      setBusy(false);
    }
  }

  async function resetOwnerPassword() {
    if (!confirm(`Send a password reset email to ${data?.business.name}'s owner?`)) return;
    setBusy(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/reset-owner-password`);
      toast.success("Password reset email sent");
    } catch {
      toast.error("Failed to send password reset email");
    } finally {
      setBusy(false);
    }
  }

  async function retryNumberProvisioning() {
    setBusy(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/provision-number`);
      toast.success("Number provisioning re-queued");
      mutate();
      onChanged();
    } catch (err: any) {
      toast.error(err?.message || "Failed to re-queue number provisioning");
    } finally {
      setBusy(false);
    }
  }

  async function releaseNumber() {
    if (!data) return;
    if (!confirm(`Release ${data.business.phoneNumber} back to Twilio and stop paying for it? The business will have no working phone line until a new number is provisioned.`)) return;
    setBusy(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/release-number`);
      toast.success("Number released");
      mutate();
      onChanged();
    } catch (err: any) {
      toast.error(err?.message || "Failed to release number");
    } finally {
      setBusy(false);
    }
  }

  async function sendEmail() {
    if (!subject.trim() || !message.trim()) return;
    setBusy(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/email`, { subject, message });
      toast.success("Email sent to business owner");
      setEmailOpen(false);
      setSubject("");
      setMessage("");
    } catch {
      toast.error("Failed to send email");
    } finally {
      setBusy(false);
    }
  }

  async function viewAsOwner() {
    setBusy(true);
    try {
      const res = await apiPost<{ token: string; owner: { email: string } }>(`/api/admin/platform/businesses/${businessId}/impersonate`);
      // Sets the tenant access-token cookie same-origin (never puts the
      // token in a URL/new-tab query string, which would leak into browser
      // history and any third-party referrer headers on the dashboard).
      await apiPost("/api/admin-auth/impersonate", { token: res.token });
      window.open("/dashboard", "_blank");
      toast.success(`Opening dashboard as ${res.owner.email}`);
    } catch {
      toast.error("Could not start impersonation session");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {businessId && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-[#E5E7EB] bg-white shadow-2xl"
          >
            {!data ? (
              <div className="p-6 text-sm text-[#9CA3AF]">Loading…</div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between border-b border-[#E5E7EB] p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-[#1F2937]">{data.business.name}</h2>
                      <StatusBadge status={data.business.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-[#6B7280]">
                      <VerticalBadge vertical={data.business.vertical} />
                      <a href={`tel:${data.business.phoneNumber}`} className="inline-flex items-center gap-1 text-[#6366F1] hover:underline">
                        <Phone className="h-3 w-3" /> {data.business.phoneNumber}
                      </a>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">Joined {new Date(data.business.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#1F2937]"><X className="h-5 w-5" /></button>
                </div>

                <div className="flex-1 p-5">
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="calls">Calls</TabsTrigger>
                      <TabsTrigger value="bookings">Bookings</TabsTrigger>
                      <TabsTrigger value="staff">Staff</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <div className="grid grid-cols-4 gap-3">
                        <StatBox label="Calls" value={data.business._count.calls} />
                        <StatBox label="Bookings" value={data.business._count.appointments} />
                        <StatBox label="Patients" value={data.business._count.contacts} />
                        <StatBox label="Staff" value={data.business.providers.length} />
                      </div>

                      <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                        Usage vs Plan <span className="font-normal normal-case text-[#9CA3AF]">— real cost from CallCost/UsageCostEvent, not an estimate</span>
                      </h3>
                      <div className="grid grid-cols-4 gap-3">
                        <StatBox
                          label="Minutes used / cap"
                          value={`${data.usageAndMargin.minutesUsedThisMonth}${data.usageAndMargin.minuteAllowance != null ? ` / ${data.usageAndMargin.minuteAllowance}` : " / ∞"}`}
                        />
                        <StatBox label="Minutes over cap" value={data.usageAndMargin.minutesOverCap} />
                        <StatBox label="Real cost (month)" value={formatCents(data.usageAndMargin.estimatedCostCentsThisMonth)} />
                        <StatBox
                          label="Margin (month)"
                          value={data.usageAndMargin.marginCents != null ? formatCents(data.usageAndMargin.marginCents) : "No plan set"}
                        />
                      </div>

                      <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Activity & Flags</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <StatBox label="Last activity" value={data.lastActivityAt ? new Date(data.lastActivityAt).toLocaleDateString() : "Never"} />
                        <StatBox label="Issue calls (month)" value={data.flaggedIssues.issueCallsThisMonth} />
                        <StatBox label="Payment retry" value={data.flaggedIssues.paymentRetryActive ? "Active" : "None"} />
                      </div>

                      <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Integration Health</h3>
                      <ul className="space-y-1.5 text-xs">
                        <li className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-1.5">
                          <span className="text-[#1F2937]">Square</span>
                          <span className={data.integrationHealth.square.connected ? (data.integrationHealth.square.healthy === false ? "text-[#D97706]" : "text-[#059669]") : "text-[#9CA3AF]"}>
                            {data.integrationHealth.square.connected ? (data.integrationHealth.square.healthy === false ? "connected, sync failing" : "connected") : "not connected"}
                          </span>
                        </li>
                        <li className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-1.5">
                          <span className="text-[#1F2937]">Microsoft Outlook Calendar</span>
                          <span className={data.integrationHealth.microsoftCalendar.connected ? "text-[#059669]" : "text-[#9CA3AF]"}>
                            {data.integrationHealth.microsoftCalendar.connected ? "connected" : "not connected"}
                          </span>
                        </li>
                      </ul>

                      {data.orderStats && (
                        <>
                          <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                            Phone Orders <span className="font-normal normal-case text-[#9CA3AF]">— diner-paid, not ZyncoAI revenue</span>
                          </h3>
                          <div className="grid grid-cols-4 gap-3">
                            <StatBox label="Orders today" value={data.orderStats.ordersToday} />
                            <StatBox label="Orders this week" value={data.orderStats.ordersWeek} />
                            <StatBox label="Revenue this month" value={formatCents(data.orderStats.revenueMonthCents)} />
                            <StatBox label="Avg order value" value={formatCents(data.orderStats.avgOrderValueCents)} />
                          </div>
                        </>
                      )}
                      {data.business.thirdPartyApiKeys.length > 0 && (
                        <>
                          <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Integrations</h3>
                          <ul className="space-y-2">
                            {data.business.thirdPartyApiKeys.map((k) => (
                              <li key={k.provider} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm">
                                <span className="flex items-center gap-2 text-[#1F2937]"><Plug className="h-3.5 w-3.5 text-[#9CA3AF]" /> {k.provider}</span>
                                <Badge tone={k.enabled ? "success" : "default"}>{k.enabled ? "Connected" : "Disabled"}</Badge>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Recent calls</h3>
                      <ul className="space-y-2">
                        {data.recentCalls.slice(0, 5).map((c) => (
                          <li key={c.id} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm">
                            <span className="text-[#1F2937]">{c.contact?.name || c.contact?.phone || "Unknown caller"}</span>
                            <span className="text-xs text-[#9CA3AF]">{timeAgo(c.startedAt)}</span>
                          </li>
                        ))}
                        {!data.recentCalls.length && <p className="text-sm text-[#9CA3AF]">No calls yet.</p>}
                      </ul>
                    </TabsContent>

                    <TabsContent value="calls">
                      <ul className="space-y-2">
                        {data.recentCalls.map((c) => (
                          <li key={c.id} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm">
                            <div>
                              <p className="text-[#1F2937]">{c.contact?.name || c.contact?.phone || "Unknown caller"}</p>
                              {c.outcome && <Badge tone="default" className="mt-1">{c.outcome.replace(/_/g, " ")}</Badge>}
                            </div>
                            <span className="text-xs text-[#9CA3AF]">{timeAgo(c.startedAt)}</span>
                          </li>
                        ))}
                        {!data.recentCalls.length && <p className="text-sm text-[#9CA3AF]">No calls yet.</p>}
                      </ul>
                    </TabsContent>

                    <TabsContent value="bookings">
                      <ul className="space-y-2">
                        {data.upcomingAppointments.map((a) => (
                          <li key={a.id} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm">
                            <div>
                              <p className="text-[#1F2937]">{a.contact?.name || a.contact?.phone || "Unknown"}</p>
                              <p className="text-xs text-[#9CA3AF]">{a.provider?.name || "Unassigned"}</p>
                            </div>
                            <span className="text-xs text-[#9CA3AF]">{new Date(a.startAt).toLocaleString()}</span>
                          </li>
                        ))}
                        {!data.upcomingAppointments.length && <p className="text-sm text-[#9CA3AF]">No upcoming bookings.</p>}
                      </ul>
                    </TabsContent>

                    <TabsContent value="staff">
                      <ul className="space-y-2">
                        {data.business.providers.map((p) => (
                          <li key={p.id} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm">
                            <span className="text-[#1F2937]">{p.name}</span>
                            <span className="text-xs text-[#9CA3AF]">{p.title || "—"}</span>
                          </li>
                        ))}
                        {!data.business.providers.length && <p className="text-sm text-[#9CA3AF]">No staff added yet.</p>}
                      </ul>
                      <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Dashboard users</h3>
                      <ul className="space-y-2">
                        {data.business.members.map((m, i) => (
                          <li key={i} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm">
                            <span className="text-[#1F2937]">{m.user.name || m.user.email}</span>
                            <Badge tone="purple">{m.role}</Badge>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="settings">
                      <div className="space-y-3">
                        <div className="rounded-xl border border-[#E5E7EB] p-3">
                          <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                            <CreditCard className="h-3.5 w-3.5" /> Billing
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg bg-[#F8F9FA] px-3 py-2">
                              <div>
                                <p className="text-xs font-medium text-[#6B7280]">Trial status</p>
                                <p className="text-sm text-[#1F2937]">
                                  {!data.business.trialEndsAt
                                    ? "No trial (existing business)"
                                    : new Date(data.business.trialEndsAt) > new Date()
                                    ? `Ends ${new Date(data.business.trialEndsAt).toLocaleDateString()}`
                                    : "Trial expired"}
                                </p>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => extendTrial(7)} disabled={extendingTrial}>
                                {extendingTrial ? "Extending…" : "+7 days"}
                              </Button>
                            </div>
                            {data.paymentRetryStatus && (
                              <div className="rounded-lg bg-[#FEF2F2] px-3 py-2">
                                <p className="text-xs font-medium text-[#B91C1C]">
                                  Payment failed ({data.paymentRetryStatus.failedCount}/3 attempts) — {data.paymentRetryStatus.nextAction}
                                  {data.paymentRetryStatus.nextActionAt && ` ${new Date(data.paymentRetryStatus.nextActionAt).toLocaleDateString()}`}
                                </p>
                                <div className="mt-2 flex gap-2">
                                  <Button size="sm" variant="outline" onClick={forceRetryPayment} disabled={payBusy}>
                                    <RotateCw className="h-3.5 w-3.5" /> Force retry now
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={waivePayment} disabled={payBusy}>
                                    <HandCoins className="h-3.5 w-3.5" /> Waive failed payment
                                  </Button>
                                </div>
                              </div>
                            )}
                            <div>
                              <Label>Plan</Label>
                              <Select value={planKey} onChange={(e) => setPlanKey(e.target.value)}>
                                <option value="">No plan</option>
                                {settingsData?.settings.pricingPlans.map((p) => <option key={p.key} value={p.key}>{p.name} ({formatCents(p.priceCents)}/mo)</option>)}
                              </Select>
                            </div>
                            <div className="flex items-end gap-2">
                              <div className="flex-1">
                                <Label>Payment method</Label>
                                <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                  <option value="">Not set</option>
                                  <option value="SQUARE">Card</option>
                                  <option value="BANK_TRANSFER">Bank Transfer</option>
                                  <option value="PAYPAL">PayPal</option>
                                  <option value="BPAY">BPAY</option>
                                </Select>
                              </div>
                              <Button size="sm" variant="outline" onClick={savePaymentMethod} disabled={savingPaymentMethod}>{savingPaymentMethod ? "Saving…" : "Save"}</Button>
                            </div>
                            <div>
                              <Label>ABN</Label>
                              <Input value={abn} onChange={(e) => setAbn(e.target.value)} placeholder="11 digit ABN" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>Price override ($/mo)</Label>
                                <Input type="number" step="0.01" value={overridePrice} onChange={(e) => setOverridePrice(e.target.value)} placeholder="Inherit plan" />
                              </div>
                              <div>
                                <Label>Call allowance override</Label>
                                <Input type="number" value={overrideAllowance} onChange={(e) => setOverrideAllowance(e.target.value)} placeholder="Inherit plan" />
                              </div>
                            </div>
                            <p className="text-[11px] text-[#9CA3AF]">Overrides are for Enterprise/custom deals — leave blank to inherit the selected plan&apos;s price and allowance.</p>
                            <Button size="sm" onClick={savePlan} disabled={savingPlan}>{savingPlan ? "Saving…" : "Save billing details"}</Button>
                          </div>
                        </div>
                        <DiscountsPanel businessId={businessId!} />
                        <SquareBillingPanel
                          businessId={businessId!}
                          card={data.business.squareCardId ? { brand: data.business.squareCardBrand, last4: data.business.squareCardLast4, expMonth: data.business.squareCardExpMonth, expYear: data.business.squareCardExpYear } : null}
                          recentInvoices={data.recentInvoices}
                          onChanged={mutate}
                        />
                        <div className="rounded-xl border border-[#E5E7EB] p-3">
                          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">SMS Confirmations</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between rounded-lg bg-[#F8F9FA] px-3 py-2">
                              <div>
                                <p className="text-xs font-medium text-[#6B7280]">Enabled (owner opt-in)</p>
                                <p className="text-sm text-[#1F2937]">{data.business.smsConfirmationsEnabled ? "Yes" : "No"}</p>
                              </div>
                              <Button size="sm" variant="outline" disabled={savingSms} onClick={() => toggleSmsConfirmations("enabled", !data.business.smsConfirmationsEnabled)}>
                                {data.business.smsConfirmationsEnabled ? "Disable" : "Enable"}
                              </Button>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-[#F8F9FA] px-3 py-2">
                              <div>
                                <p className="text-xs font-medium text-[#6B7280]">Paid ($25/mo add-on)</p>
                                <p className="text-sm text-[#1F2937]">{data.business.smsConfirmationsPaid ? "Confirmed" : "Not confirmed"}</p>
                              </div>
                              <Button size="sm" variant="outline" disabled={savingSms} onClick={() => toggleSmsConfirmations("paid", !data.business.smsConfirmationsPaid)}>
                                {data.business.smsConfirmationsPaid ? "Mark unpaid" : "Mark paid"}
                              </Button>
                            </div>
                            {data.business.smsConfirmationsEnabled && !data.business.smsConfirmationsPaid && (
                              <p className="text-[11px] text-[#9CA3AF]">Owner has enabled SMS but billing hasn&apos;t been confirmed — SMS won&apos;t send until both are on.</p>
                            )}
                          </div>
                        </div>
                        {data.business.provisioningStatus === "PENDING" && (
                          <div className="rounded-lg bg-[#FFFBEB] px-3 py-2 text-xs font-medium text-[#B45309]">Setting up AI phone line…</div>
                        )}
                        {data.business.provisioningStatus === "FAILED" && (
                          <div className="rounded-lg bg-[#FEF2F2] px-3 py-2">
                            <p className="text-xs font-medium text-[#B91C1C]">Number provisioning failed{data.business.provisioningError ? `: ${data.business.provisioningError}` : ""}</p>
                          </div>
                        )}
                        {data.business.provisioningStatus !== "ACTIVE" && (
                          <Button variant="outline" className="w-full justify-start" onClick={retryNumberProvisioning} disabled={busy}>
                            <RefreshCw className="h-4 w-4" /> Provision number now
                          </Button>
                        )}
                        {data.business.provisioningStatus === "ACTIVE" && (
                          <a href={`tel:${data.business.phoneNumber}`} className="flex w-full items-center gap-2 justify-start rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#1F2937] hover:bg-[#F8F9FA]">
                            <Phone className="h-4 w-4" /> Call this business ({data.business.phoneNumber})
                          </a>
                        )}
                        {data.business.twilioNumberSid && (
                          <Button variant="outline" className="w-full justify-start text-[#B91C1C]" onClick={releaseNumber} disabled={busy}>
                            <PhoneOff className="h-4 w-4" /> Release number ($1.50/mo)
                          </Button>
                        )}
                        <Button variant="outline" className="w-full justify-start" onClick={viewAsOwner} disabled={busy}>
                          <ExternalLink className="h-4 w-4" /> View as Owner
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={resetOwnerPassword} disabled={busy}>
                          <KeyRound className="h-4 w-4" /> Reset owner password
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => setEmailOpen((v) => !v)}>
                          <Mail className="h-4 w-4" /> Email business
                        </Button>
                        {emailOpen && (
                          <div className="space-y-2 rounded-lg border border-[#E5E7EB] p-3">
                            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-md border border-[#E5E7EB] px-3 py-1.5 text-sm" />
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" rows={4} className="w-full rounded-md border border-[#E5E7EB] px-3 py-1.5 text-sm" />
                            <Button size="sm" onClick={sendEmail} disabled={busy}>Send</Button>
                          </div>
                        )}
                        <Button variant="outline" className="w-full justify-start" onClick={giveFreeMonth} disabled={payBusy}>
                          <Gift className="h-4 w-4" /> Give free month
                        </Button>
                        {(data.business.status === "SUSPENDED" || data.business.status === "HOLD") ? (
                          <Button variant="secondary" className="w-full justify-start" onClick={toggleStatus} disabled={busy}>
                            <PlayCircle className="h-4 w-4" /> Reactivate account
                          </Button>
                        ) : (
                          <Button variant="danger" className="w-full justify-start" onClick={toggleStatus} disabled={busy}>
                            <Ban className="h-4 w-4" /> Suspend business
                          </Button>
                        )}
                        {data.business.status !== "CLOSED" && (
                          <Button variant="danger" className="w-full justify-start" onClick={closeAccount} disabled={payBusy}>
                            <XCircle className="h-4 w-4" /> Close account
                          </Button>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-3 text-center">
      <p className="text-lg font-bold text-[#1F2937]">{value}</p>
      <p className="text-[11px] text-[#9CA3AF]">{label}</p>
    </div>
  );
}
