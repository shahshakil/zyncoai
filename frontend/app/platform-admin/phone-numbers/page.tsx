"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Phone, DollarSign, Loader2, AlertTriangle, RefreshCw, PhoneOff, Repeat, PhoneCall, RotateCw, PlusCircle } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Select, Label } from "@/components/dashboard/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { SkeletonRow } from "@/components/dashboard/ui/skeleton";
import { Badge } from "@/components/dashboard/ui/badge";
import { Topbar } from "@/components/platform-admin/Topbar";
import { StatCard } from "@/components/platform-admin/StatCard";
import { VerticalBadge } from "@/components/platform-admin/VerticalBadge";
import { formatCents, timeAgo } from "@/components/platform-admin/format";

interface NumberRow {
  businessId: string; businessName: string; vertical: string;
  phoneNumber: string | null; twilioNumberSid: string | null;
  status: "ACTIVE" | "SUSPENDED" | "PROVISIONING" | "FAILED";
  provisioningError: string | null;
  purchasedAt: string | null;
  monthlyCostCents: number;
  lastCallAt: string | null;
  totalCalls: number;
  staleNoCalls: boolean;
}
interface PhoneNumbersData {
  rows: NumberRow[];
  stats: { totalNumbersActive: number; totalMonthlyCostCents: number; provisioningNow: number; failedProvisioning: number };
  alerts: { failedProvisioning: NumberRow[]; staleNoCalls: NumberRow[]; suspendedStillPaying: NumberRow[] };
  stale: boolean;
}
interface SyncResult {
  orphaned: { sid: string; phoneNumber: string; friendlyName: string | null; voiceUrl: string | null }[];
  ghost: { businessId: string; businessName: string; phoneNumber: string; twilioNumberSid: string }[];
  matchedCount: number;
}
interface PurchasableBusiness {
  id: string; name: string; vertical: string; status: string; phoneNumber: string; provisioningStatus: string;
}

const STATUS_TONE: Record<NumberRow["status"], "success" | "warning" | "danger" | "default"> = {
  ACTIVE: "success", SUSPENDED: "default", PROVISIONING: "warning", FAILED: "danger",
};
const STATUS_LABEL: Record<NumberRow["status"], string> = {
  ACTIVE: "Active", SUSPENDED: "Suspended", PROVISIONING: "Provisioning", FAILED: "Failed",
};

export default function PhoneNumbersPage() {
  const { data, mutate, isLoading } = useApi<PhoneNumbersData>("/api/admin/platform/phone-numbers", { refreshInterval: 20000 });
  const [busy, setBusy] = useState<string | null>(null);
  const [reassignFrom, setReassignFrom] = useState<NumberRow | null>(null);
  const [reassignTo, setReassignTo] = useState("");
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchaseTarget, setPurchaseTarget] = useState("");
  const [purchasing, setPurchasing] = useState(false);
  const { data: purchasableData } = useApi<{ businesses: PurchasableBusiness[] }>(
    purchaseOpen ? "/api/admin/platform/phone-numbers/purchasable-businesses" : null
  );

  const targets = (data?.rows || []).filter((r) => r.status === "PROVISIONING" || r.status === "FAILED");

  async function purchaseNow(row: NumberRow) {
    setBusy(row.businessId);
    try {
      await apiPost(`/api/admin/platform/businesses/${row.businessId}/provision-number`);
      toast.success(`Provisioning queued for ${row.businessName}`);
      mutate();
    } catch (err: any) {
      toast.error(err?.message || "Failed to queue provisioning");
    } finally {
      setBusy(null);
    }
  }

  async function release(row: NumberRow) {
    if (!confirm(`Release ${row.phoneNumber} from ${row.businessName} back to Twilio and stop paying for it?`)) return;
    setBusy(row.businessId);
    try {
      await apiPost(`/api/admin/platform/businesses/${row.businessId}/release-number`);
      toast.success("Number released");
      mutate();
    } catch (err: any) {
      toast.error(err?.message || "Failed to release number");
    } finally {
      setBusy(null);
    }
  }

  async function testRouting(row: NumberRow) {
    setBusy(row.businessId);
    try {
      const res = await apiPost<{ result: { ok: boolean; reason?: string; voiceUrl?: string | null } }>(`/api/admin/platform/phone-numbers/${row.businessId}/test`);
      if (res.result.ok) toast.success(`Routing OK — voiceUrl matches (${row.phoneNumber})`);
      else toast.error(`Routing check failed: ${res.result.reason}`);
    } catch (err: any) {
      toast.error(err?.message || "Test failed");
    } finally {
      setBusy(null);
    }
  }

  async function submitReassign() {
    if (!reassignFrom || !reassignTo) return;
    setBusy(reassignFrom.businessId);
    try {
      await apiPost("/api/admin/platform/phone-numbers/reassign", { fromBusinessId: reassignFrom.businessId, toBusinessId: reassignTo });
      toast.success("Number reassigned");
      setReassignFrom(null);
      setReassignTo("");
      mutate();
    } catch (err: any) {
      toast.error(err?.message || "Reassign failed");
    } finally {
      setBusy(null);
    }
  }

  async function runSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await apiPost<SyncResult>("/api/admin/platform/phone-numbers/sync");
      setSyncResult(res);
    } catch (err: any) {
      toast.error(err?.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function fixGhost(businessId: string) {
    setBusy(businessId);
    try {
      await apiPost(`/api/admin/platform/phone-numbers/fix-ghost/${businessId}`);
      toast.success("Ghost record cleared — re-queued for provisioning");
      setSyncResult((r) => (r ? { ...r, ghost: r.ghost.filter((g) => g.businessId !== businessId) } : r));
      mutate();
    } catch (err: any) {
      toast.error(err?.message || "Fix failed");
    } finally {
      setBusy(null);
    }
  }

  async function submitPurchase() {
    if (!purchaseTarget) return;
    setPurchasing(true);
    try {
      await apiPost(`/api/admin/platform/phone-numbers/purchase/${purchaseTarget}`);
      toast.success("Purchase queued — number will be assigned shortly");
      setPurchaseOpen(false);
      setPurchaseTarget("");
      mutate();
    } catch (err: any) {
      toast.error(err?.message || "Purchase failed");
    } finally {
      setPurchasing(false);
    }
  }

  async function fixOrphan(sid: string) {
    if (!confirm("Release this orphaned Twilio number? It has no business owner in our database and is costing $1.50/mo for nothing.")) return;
    setBusy(sid);
    try {
      await apiPost("/api/admin/platform/phone-numbers/fix-orphan", { sid });
      toast.success("Orphaned number released");
      setSyncResult((r) => (r ? { ...r, orphaned: r.orphaned.filter((o) => o.sid !== sid) } : r));
    } catch (err: any) {
      toast.error(err?.message || "Release failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="-m-6">
      <Topbar title="Phone Numbers" refreshIntervalMs={20000} />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Numbers Active" loading={isLoading} value={String(data?.stats.totalNumbersActive ?? 0)} icon={Phone} gradient="linear-gradient(135deg,#10B981,#34D399)" />
          <StatCard label="Monthly Cost" loading={isLoading} value={formatCents(data?.stats.totalMonthlyCostCents || 0)} icon={DollarSign} gradient="linear-gradient(135deg,#6366F1,#818CF8)" sublabel="$1.50/mo per number" />
          <StatCard label="Provisioning Now" loading={isLoading} value={String(data?.stats.provisioningNow ?? 0)} icon={Loader2} gradient="linear-gradient(135deg,#F59E0B,#FBBF24)" />
          <StatCard
            label="Failed Provisioning" loading={isLoading} value={String(data?.stats.failedProvisioning ?? 0)} icon={AlertTriangle}
            gradient={data && data.stats.failedProvisioning > 0 ? "linear-gradient(135deg,#EF4444,#F87171)" : "linear-gradient(135deg,#94A3B8,#CBD5E1)"}
          />
        </div>

        {data && (data.alerts.failedProvisioning.length > 0 || data.alerts.staleNoCalls.length > 0 || data.alerts.suspendedStillPaying.length > 0) && (
          <Card>
            <CardHeader><CardTitle>Alerts</CardTitle></CardHeader>
            <div className="space-y-2 p-4">
              {data.alerts.failedProvisioning.map((r) => (
                <div key={r.businessId} className="flex items-center justify-between rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-[#B91C1C]">{r.businessName} — provisioning failed</p>
                    {r.provisioningError && <p className="text-xs text-[#B91C1C]/80">{r.provisioningError}</p>}
                  </div>
                  <Button size="sm" variant="outline" disabled={busy === r.businessId} onClick={() => purchaseNow(r)}>
                    <RefreshCw className="h-3.5 w-3.5" /> Retry
                  </Button>
                </div>
              ))}
              {data.alerts.staleNoCalls.map((r) => (
                <div key={r.businessId} className="flex items-center justify-between rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2">
                  <p className="text-sm text-[#92400E]">{r.businessName} ({r.phoneNumber}) hasn&apos;t received a call in 30+ days</p>
                </div>
              ))}
              {data.alerts.suspendedStillPaying.map((r) => (
                <div key={r.businessId} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] px-3 py-2">
                  <p className="text-sm text-[#6B7280]">{r.businessName} is suspended but still holds {r.phoneNumber} ($1.50/mo)</p>
                  <Button size="sm" variant="outline" disabled={busy === r.businessId} onClick={() => release(r)}>
                    <PhoneOff className="h-3.5 w-3.5" /> Release
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <div className="flex items-center justify-between p-4 pb-0">
            <CardTitle>Purchased Numbers</CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => { setPurchaseOpen(true); setPurchaseTarget(""); }}>
                <PlusCircle className="h-3.5 w-3.5" /> Purchase for business
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setSyncOpen(true); setSyncResult(null); }}>
                <RotateCw className="h-3.5 w-3.5" /> Sync from Twilio
              </Button>
            </div>
          </div>
          <Table>
            <Thead>
              <tr>
                <Th>Phone Number</Th><Th>Business</Th><Th>Vertical</Th><Th>Status</Th>
                <Th>Purchased</Th><Th>Monthly Cost</Th><Th>Last Call</Th><Th>Total Calls</Th><Th></Th>
              </tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={9} />)
              ) : data?.rows.length ? (
                data.rows.map((r) => (
                  <Tr key={r.businessId}>
                    <Td className="font-medium text-[#1F2937]">{r.phoneNumber || "—"}</Td>
                    <Td>
                      <Link href={`/platform-admin/businesses?open=${r.businessId}`} className="text-[#6366F1] hover:underline">{r.businessName}</Link>
                    </Td>
                    <Td><VerticalBadge vertical={r.vertical} /></Td>
                    <Td><Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge></Td>
                    <Td className="text-xs text-[#6B7280]">{r.purchasedAt ? new Date(r.purchasedAt).toLocaleDateString() : "—"}</Td>
                    <Td>{formatCents(r.monthlyCostCents)}</Td>
                    <Td className="text-xs text-[#6B7280]">{r.lastCallAt ? timeAgo(r.lastCallAt) : "Never"}</Td>
                    <Td>{r.totalCalls}</Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1">
                        {(r.status === "PROVISIONING" || r.status === "FAILED") && (
                          <Button size="sm" variant="outline" disabled={busy === r.businessId} onClick={() => purchaseNow(r)}>
                            <RefreshCw className="h-3.5 w-3.5" /> {r.status === "FAILED" ? "Retry" : "Purchase"}
                          </Button>
                        )}
                        {r.twilioNumberSid && (
                          <>
                            <Button size="sm" variant="outline" disabled={busy === r.businessId} onClick={() => testRouting(r)}>
                              <PhoneCall className="h-3.5 w-3.5" /> Test
                            </Button>
                            <Button size="sm" variant="outline" disabled={busy === r.businessId} onClick={() => setReassignFrom(r)}>
                              <Repeat className="h-3.5 w-3.5" /> Reassign
                            </Button>
                            <Button size="sm" variant="outline" className="text-[#B91C1C]" disabled={busy === r.businessId} onClick={() => release(r)}>
                              <PhoneOff className="h-3.5 w-3.5" /> Release
                            </Button>
                          </>
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))
              ) : null}
            </Tbody>
          </Table>
          {!isLoading && !data?.rows.length && <EmptyState title="No numbers yet" description="Numbers appear here once a business purchases or is assigned one." />}
        </Card>
      </div>

      <Dialog open={!!reassignFrom} onOpenChange={(v) => !v && setReassignFrom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Reassign {reassignFrom?.phoneNumber}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-[#6B7280]">Moves this number from <strong>{reassignFrom?.businessName}</strong> to another business. The source business is left on a new placeholder number (re-provision it separately if it still needs one).</p>
            <div>
              <Label>Move to</Label>
              <Select value={reassignTo} onChange={(e) => setReassignTo(e.target.value)}>
                <option value="">Select a business…</option>
                {targets.filter((t) => t.businessId !== reassignFrom?.businessId).map((t) => (
                  <option key={t.businessId} value={t.businessId}>{t.businessName} ({STATUS_LABEL[t.status]})</option>
                ))}
              </Select>
              {!targets.length && <p className="mt-1 text-[11px] text-[#9CA3AF]">No businesses are currently waiting for a number (provisioning or failed).</p>}
            </div>
            <Button className="w-full" disabled={!reassignTo || busy === reassignFrom?.businessId} onClick={submitReassign}>
              {busy === reassignFrom?.businessId ? "Reassigning…" : "Reassign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={purchaseOpen} onOpenChange={setPurchaseOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Purchase a number for a business</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-[#6B7280]">
              Special-case only — every new signup already gets a number automatically at Activate. Use this for businesses
              that opted for bring-your-own-number at signup and now want a dedicated ZyncoAI line instead.
            </p>
            <div>
              <Label>Business</Label>
              <Select value={purchaseTarget} onChange={(e) => setPurchaseTarget(e.target.value)}>
                <option value="">Select a business…</option>
                {(purchasableData?.businesses || []).map((b) => (
                  <option key={b.id} value={b.id}>{b.name} — {b.phoneNumber || "no number"}</option>
                ))}
              </Select>
              {purchasableData && !purchasableData.businesses.length && (
                <p className="mt-1 text-[11px] text-[#9CA3AF]">Every business already has a real Twilio number.</p>
              )}
            </div>
            <Button className="w-full" disabled={!purchaseTarget || purchasing} onClick={submitPurchase}>
              {purchasing ? "Purchasing…" : "Purchase number"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Sync from Twilio</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {!syncResult ? (
              <Button className="w-full" disabled={syncing} onClick={runSync}>{syncing ? "Fetching from Twilio…" : "Fetch & reconcile"}</Button>
            ) : (
              <>
                <p className="text-xs text-[#6B7280]">{syncResult.matchedCount} number(s) matched correctly between Twilio and our database.</p>

                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Orphaned in Twilio ({syncResult.orphaned.length}) — real, billed numbers with no business owner here</p>
                  {syncResult.orphaned.length ? (
                    <div className="space-y-1.5">
                      {syncResult.orphaned.map((o) => (
                        <div key={o.sid} className="flex items-center justify-between rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-3 py-2 text-xs">
                          <span>{o.phoneNumber} <span className="text-[#9CA3AF]">({o.friendlyName || "no friendly name"})</span></span>
                          <Button size="sm" variant="outline" className="text-[#B91C1C]" disabled={busy === o.sid} onClick={() => fixOrphan(o.sid)}>Release</Button>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-[#9CA3AF]">None found.</p>}
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Ghost records ({syncResult.ghost.length}) — in our database but not in Twilio</p>
                  {syncResult.ghost.length ? (
                    <div className="space-y-1.5">
                      {syncResult.ghost.map((g) => (
                        <div key={g.businessId} className="flex items-center justify-between rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-xs">
                          <span>{g.businessName} — {g.phoneNumber}</span>
                          <Button size="sm" variant="outline" disabled={busy === g.businessId} onClick={() => fixGhost(g.businessId)}>Clear & re-provision</Button>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-[#9CA3AF]">None found.</p>}
                </div>

                <Button variant="outline" className="w-full" onClick={runSync} disabled={syncing}>{syncing ? "Re-fetching…" : "Re-run sync"}</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
