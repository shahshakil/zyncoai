"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Tag, Trash2 } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label, Select } from "@/components/dashboard/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { formatCents } from "./format";

interface Discount {
  id: string; type: "PERCENTAGE" | "FIXED_AMOUNT" | "CREDIT"; valuePercent: number | null; valueCents: number | null;
  reason: string; source: string; recurring: boolean; expiresAt: string | null;
}

const SOURCE_LABEL: Record<string, string> = { MANUAL: "manual", MULTI_LOCATION: "multi-location", REFERRAL: "referral", LOYALTY: "loyalty" };

function discountLabel(d: Discount): string {
  const value = d.type === "PERCENTAGE" ? `${d.valuePercent}%` : formatCents(d.valueCents || 0);
  const cadence = d.recurring ? (d.type === "PERCENTAGE" ? " off" : "/mo") : " (next invoice only)";
  return `${d.reason} — ${value}${cadence}`;
}

export function DiscountsPanel({ businessId }: { businessId: string }) {
  const { data, mutate } = useApi<{ discounts: Discount[] }>(`/api/admin/platform/businesses/${businessId}/discounts`);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"PERCENTAGE" | "FIXED_AMOUNT" | "CREDIT">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [recurring, setRecurring] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function addDiscount(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim() || !value) return;
    setSaving(true);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/discounts`, {
        type,
        valuePercent: type === "PERCENTAGE" ? Number(value) : undefined,
        valueCents: type !== "PERCENTAGE" ? Math.round(Number(value) * 100) : undefined,
        reason: reason.trim(),
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        recurring,
      });
      toast.success("Discount applied");
      setOpen(false);
      setValue(""); setReason(""); setExpiresAt(""); setRecurring(true); setType("PERCENTAGE");
      mutate();
    } catch {
      toast.error("Could not apply discount");
    } finally {
      setSaving(false);
    }
  }

  async function removeDiscount(id: string) {
    setRemovingId(id);
    try {
      await apiPost(`/api/admin/platform/businesses/${businessId}/discounts/${id}`, undefined, "DELETE");
      toast.success("Discount removed");
      mutate();
    } catch {
      toast.error("Could not remove discount");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="rounded-xl border border-[#E5E7EB] p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
          <Tag className="h-3.5 w-3.5" /> Active Discounts
        </h3>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>+ Add Discount</Button>
      </div>
      {!data?.discounts.length ? (
        <p className="text-xs text-[#9CA3AF]">No active discounts.</p>
      ) : (
        <div className="space-y-2">
          {data.discounts.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg bg-[#F8F9FA] px-3 py-2">
              <div>
                <p className="text-sm text-[#1F2937]">{discountLabel(d)}</p>
                <p className="text-[11px] text-[#9CA3AF]">
                  {SOURCE_LABEL[d.source] || d.source.toLowerCase()}
                  {d.expiresAt ? ` · expires ${new Date(d.expiresAt).toLocaleDateString()}` : " · permanent"}
                </p>
              </div>
              <Button size="sm" variant="ghost" disabled={removingId === d.id} onClick={() => removeDiscount(d.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Discount</DialogTitle></DialogHeader>
          <form onSubmit={addDiscount} className="space-y-3">
            <div>
              <Label>Type</Label>
              <Select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
                <option value="CREDIT">Credit</option>
              </Select>
            </div>
            <div>
              <Label>{type === "PERCENTAGE" ? "Value (%)" : "Value ($)"}</Label>
              <Input type="number" step={type === "PERCENTAGE" ? "1" : "0.01"} value={value} onChange={(e) => setValue(e.target.value)} required />
            </div>
            <div>
              <Label>Reason</Label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. VIP client, beta tester" required />
            </div>
            <div>
              <Label>Expiry</Label>
              <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} placeholder="Leave blank for permanent" />
            </div>
            <div>
              <Label>Apply to</Label>
              <Select value={recurring ? "recurring" : "once"} onChange={(e) => setRecurring(e.target.value === "recurring")}>
                <option value="recurring">Every invoice (recurring)</option>
                <option value="once">This month only</option>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : "Save Discount"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
