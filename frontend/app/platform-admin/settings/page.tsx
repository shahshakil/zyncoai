"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, AlertTriangle } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label } from "@/components/dashboard/ui/input";
import { VERTICAL_LABELS } from "@/components/platform-admin/format";
import { Topbar } from "@/components/platform-admin/Topbar";

interface PricingPlan { key: string; name: string; priceCents: number; callAllowance: number | null; overageCentsPerCall: number; isCustom: boolean }
interface Settings {
  pricingPlans: PricingPlan[];
  defaultOpenAiModel: string | null;
  defaultVoice: string | null;
  allowedVerticals: string[];
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  zyncoAbn?: string | null;
  bankAccountName?: string | null;
  bankBsb?: string | null;
  bankAccountNumber?: string | null;
  bankName?: string | null;
  bpayBillerCode?: string | null;
  payId?: string | null;
  stripeSecretKey?: string | null;
  openAiCostPerMinuteMicros?: number;
  twilioCostPerCallMicros?: number;
  smsCostMicros?: number;
  emailCostMicros?: number;
  twilioNumberMonthlyCostMicros?: number;
  invoiceDueDays?: number;
  suspensionGraceDays?: number;
  autoSuspendEnabled?: boolean;
  trialDays?: number;
}
interface FeatureFlag { id: string; key: string; enabled: boolean }
interface PricingPlanDrift {
  drift: { added: string[]; removed: string[]; changed: { key: string; fields: string[] }[] };
  hasDrift: boolean;
}

const VOICE_OPTIONS = ["shimmer", "alloy", "echo", "fable", "onyx", "nova"];

export default function PlatformSettingsPage() {
  const { data, mutate } = useApi<{ settings: Settings }>("/api/admin/platform/settings/");
  const { data: flagsData, mutate: mutateFlags } = useApi<{ flags: FeatureFlag[] }>("/api/admin/platform/settings/flags");
  const { data: driftData } = useApi<PricingPlanDrift>("/api/admin/platform/settings/pricing-plans/drift");

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [model, setModel] = useState("");
  const [voice, setVoice] = useState("");
  const [allowedVerticals, setAllowedVerticals] = useState<string[]>([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [zyncoAbn, setZyncoAbn] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankBsb, setBankBsb] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bpayBillerCode, setBpayBillerCode] = useState("");
  const [payId, setPayId] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [openAiCostPerMinute, setOpenAiCostPerMinute] = useState("0.30");
  const [twilioCostPerCall, setTwilioCostPerCall] = useState("0.01");
  const [smsCost, setSmsCost] = useState("0.008");
  const [emailCost, setEmailCost] = useState("0.001");
  const [twilioNumberMonthlyCost, setTwilioNumberMonthlyCost] = useState("1.50");
  const [invoiceDueDays, setInvoiceDueDays] = useState("14");
  const [suspensionGraceDays, setSuspensionGraceDays] = useState("14");
  const [autoSuspendEnabled, setAutoSuspendEnabled] = useState(false);
  const [trialDays, setTrialDays] = useState("7");

  useEffect(() => {
    if (!data) return;
    setPlans(data.settings.pricingPlans);
    setModel(data.settings.defaultOpenAiModel || "");
    setVoice(data.settings.defaultVoice || "");
    setAllowedVerticals(data.settings.allowedVerticals.length ? data.settings.allowedVerticals : Object.keys(VERTICAL_LABELS));
    setMaintenanceMode(data.settings.maintenanceMode);
    setMaintenanceMessage(data.settings.maintenanceMessage || "");
    setZyncoAbn(data.settings.zyncoAbn || "");
    setBankAccountName(data.settings.bankAccountName || "");
    setBankBsb(data.settings.bankBsb || "");
    setBankAccountNumber(data.settings.bankAccountNumber || "");
    setBankName(data.settings.bankName || "");
    setBpayBillerCode(data.settings.bpayBillerCode || "");
    setPayId(data.settings.payId || "");
    setStripeSecretKey(data.settings.stripeSecretKey || "");
    if (typeof data.settings.openAiCostPerMinuteMicros === "number") setOpenAiCostPerMinute((data.settings.openAiCostPerMinuteMicros / 1_000_000).toString());
    if (typeof data.settings.twilioCostPerCallMicros === "number") setTwilioCostPerCall((data.settings.twilioCostPerCallMicros / 1_000_000).toString());
    if (typeof data.settings.smsCostMicros === "number") setSmsCost((data.settings.smsCostMicros / 1_000_000).toString());
    if (typeof data.settings.emailCostMicros === "number") setEmailCost((data.settings.emailCostMicros / 1_000_000).toString());
    if (typeof data.settings.twilioNumberMonthlyCostMicros === "number") setTwilioNumberMonthlyCost((data.settings.twilioNumberMonthlyCostMicros / 1_000_000).toString());
    if (typeof data.settings.invoiceDueDays === "number") setInvoiceDueDays(data.settings.invoiceDueDays.toString());
    if (typeof data.settings.suspensionGraceDays === "number") setSuspensionGraceDays(data.settings.suspensionGraceDays.toString());
    setAutoSuspendEnabled(!!data.settings.autoSuspendEnabled);
    if (typeof data.settings.trialDays === "number") setTrialDays(data.settings.trialDays.toString());
  }, [data]);

  function toggleVertical(v: string) {
    setAllowedVerticals((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }
  function updatePlan(i: number, patch: Partial<PricingPlan>) {
    setPlans((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function addPlan() {
    setPlans((prev) => [...prev, { key: `plan_${Date.now()}`, name: "New Plan", priceCents: 0, callAllowance: null, overageCentsPerCall: 0, isCustom: false }]);
  }
  function removePlan(i: number) {
    setPlans((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    try {
      await apiPost("/api/admin/platform/settings/", {
        pricingPlans: plans,
        defaultOpenAiModel: model || null,
        defaultVoice: voice || null,
        allowedVerticals,
        maintenanceMode,
        maintenanceMessage: maintenanceMessage || null,
        zyncoAbn: zyncoAbn || null,
        bankAccountName: bankAccountName || null,
        bankBsb: bankBsb || null,
        bankAccountNumber: bankAccountNumber || null,
        bankName: bankName || null,
        bpayBillerCode: bpayBillerCode || null,
        payId: payId || null,
        stripeSecretKey: stripeSecretKey || null,
        openAiCostPerMinute: Number(openAiCostPerMinute || 0),
        twilioCostPerCall: Number(twilioCostPerCall || 0),
        smsCost: Number(smsCost || 0),
        emailCost: Number(emailCost || 0),
        twilioNumberMonthlyCost: Number(twilioNumberMonthlyCost || 0),
        invoiceDueDays: Number(invoiceDueDays || 14),
        suspensionGraceDays: Number(suspensionGraceDays || 14),
        autoSuspendEnabled,
        trialDays: Number(trialDays || 7),
      }, "PUT");
      toast.success("Settings saved");
      mutate();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function toggleFlag(key: string, enabled: boolean) {
    try {
      await apiPost(`/api/admin/platform/settings/flags/${key}`, { enabled: !enabled }, "PUT");
      mutateFlags();
    } catch {
      toast.error("Failed to toggle flag");
    }
  }

  return (
    <div className="-m-6">
      <Topbar title="Platform Settings" />
      <div className="space-y-6 p-6">
        {driftData?.hasDrift && (
          <Card className="border-[#FCA5A5]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#991B1B]"><AlertTriangle className="h-4 w-4" /> Pricing plan drift detected</CardTitle>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">The live plans below (saved in the database) differ from the defaults defined in code (platformSettings.ts). This is informational only — an intentional price edit here is expected drift.</p>
            </CardHeader>
            <div className="space-y-1 p-4 text-xs text-[#7F1D1D]">
              {driftData.drift.changed.map((c) => <p key={c.key}>Changed: <strong>{c.key}</strong> ({c.fields.join(", ")})</p>)}
              {driftData.drift.removed.map((key) => <p key={key}>In code but not in the database: <strong>{key}</strong></p>)}
              {driftData.drift.added.map((key) => <p key={key}>In the database but not in code: <strong>{key}</strong></p>)}
            </div>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Pricing Plans</CardTitle>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">Manual plan tiers shown on the Revenue page — billed via ZyncoAI&apos;s own Square account (src/lib/squareBilling.ts), not Stripe.</p>
          </CardHeader>
          <div className="space-y-3 p-4">
            {plans.map((p, i) => (
              <div key={p.key} className="rounded-xl border border-[#E5E7EB] p-3">
                <div className="flex items-center gap-3">
                  <Input value={p.name} onChange={(e) => updatePlan(i, { name: e.target.value })} className="flex-1" placeholder="Plan name" />
                  <div className="relative w-32">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">$</span>
                    <Input
                      type="number" className="pl-6"
                      value={(p.priceCents / 100).toString()}
                      onChange={(e) => updatePlan(i, { priceCents: Math.round(Number(e.target.value || 0) * 100) })}
                    />
                  </div>
                  <span className="text-xs text-[#9CA3AF]">/month</span>
                  <button onClick={() => removePlan(i)} className="text-[#9CA3AF] hover:text-[#EF4444]"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 pl-1">
                  <label className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    Call allowance
                    <Input
                      type="number" className="w-24 h-8 text-xs" placeholder="Unlimited"
                      value={p.callAllowance === null ? "" : p.callAllowance.toString()}
                      onChange={(e) => updatePlan(i, { callAllowance: e.target.value === "" ? null : Math.round(Number(e.target.value)) })}
                    />
                    calls/mo
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    Overage
                    <span className="relative">
                      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]">$</span>
                      <Input
                        type="number" step="0.01" className="w-20 h-8 pl-5 text-xs"
                        value={(p.overageCentsPerCall / 100).toString()}
                        onChange={(e) => updatePlan(i, { overageCentsPerCall: Math.round(Number(e.target.value || 0) * 100) })}
                      />
                    </span>
                    /call over allowance
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <input type="checkbox" checked={p.isCustom} onChange={(e) => updatePlan(i, { isCustom: e.target.checked })} />
                    Custom / Enterprise (hidden from self-serve, override per business)
                  </label>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addPlan}><Plus className="h-4 w-4" /> Add plan</Button>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>AI Defaults</CardTitle></CardHeader>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <div>
              <Label>Default OpenAI model</Label>
              <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-4o-mini" />
              <p className="mt-1 text-xs text-[#9CA3AF]">Used by the REST voice pipeline. Falls back to VOICE_BRAIN_MODEL env var when blank.</p>
            </div>
            <div>
              <Label>Default voice</Label>
              <select value={voice} onChange={(e) => setVoice(e.target.value)} className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm">
                <option value="">(use env default)</option>
                {VOICE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Allowed Verticals</CardTitle></CardHeader>
          <div className="flex flex-wrap gap-2 p-4">
            {Object.entries(VERTICAL_LABELS).map(([k, label]) => (
              <button
                key={k}
                onClick={() => toggleVertical(k)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  allowedVerticals.includes(k) ? "border-[#6366F1] bg-[#EEF2FF] text-[#6366F1]" : "border-[#E5E7EB] text-[#9CA3AF]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Feature Flags</CardTitle></CardHeader>
          <div className="space-y-2 p-4">
            {flagsData?.flags.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-3 py-2">
                <span className="text-sm text-[#1F2937]">{f.key}</span>
                <button
                  onClick={() => toggleFlag(f.key, f.enabled)}
                  className={`h-6 w-11 rounded-full transition-colors ${f.enabled ? "bg-[#6366F1]" : "bg-[#E5E7EB]"}`}
                >
                  <span className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ${f.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
            {flagsData && !flagsData.flags.length && <p className="text-sm text-[#9CA3AF]">No feature flags defined yet.</p>}
          </div>
        </Card>

        <Card className={maintenanceMode ? "border-[#FCA5A5]" : undefined}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {maintenanceMode && <AlertTriangle className="h-4 w-4 text-[#EF4444]" />} Maintenance Mode
            </CardTitle>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">Takes the tenant dashboard/API offline with a custom message. Voice calls keep being answered even while this is on.</p>
          </CardHeader>
          <div className="space-y-3 p-4">
            <button
              onClick={() => setMaintenanceMode((v) => !v)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium ${
                maintenanceMode ? "border-[#EF4444] bg-[#FEF2F2] text-[#EF4444]" : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA]"
              }`}
            >
              {maintenanceMode ? "Maintenance mode is ON — click to turn off" : "Maintenance mode is off — click to enable"}
            </button>
            <Input value={maintenanceMessage} onChange={(e) => setMaintenanceMessage(e.target.value)} placeholder="Message shown to businesses while offline" />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Details</CardTitle>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">Printed on every invoice. Bank transfer + BPAY details shown here; PayPal client id/secret are set via backend env vars. Stripe key is a placeholder, not wired up.</p>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <div>
              <Label>ZyncoAI ABN</Label>
              <Input value={zyncoAbn} onChange={(e) => setZyncoAbn(e.target.value)} placeholder="12 345 678 901" />
            </div>
            <div>
              <Label>Bank name</Label>
              <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Commonwealth Bank" />
            </div>
            <div>
              <Label>Bank account name</Label>
              <Input value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} placeholder="ZyncoAI Pty Ltd" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>BSB</Label>
                <Input value={bankBsb} onChange={(e) => setBankBsb(e.target.value)} placeholder="062-000" />
              </div>
              <div>
                <Label>Account number</Label>
                <Input value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} placeholder="12345678" />
              </div>
            </div>
            <div>
              <Label>BPAY biller code</Label>
              <Input value={bpayBillerCode} onChange={(e) => setBpayBillerCode(e.target.value)} placeholder="123456" />
              <p className="mt-0.5 text-xs text-[#9CA3AF]">Reference is per-business (their account id) — shown automatically on their invoices and billing page.</p>
            </div>
            <div>
              <Label>PayID (optional)</Label>
              <Input value={payId} onChange={(e) => setPayId(e.target.value)} placeholder="billing@zyncoai.com or ABN" />
              <p className="mt-0.5 text-xs text-[#9CA3AF]">Shown alongside bank transfer details as an alternative to BSB + account number.</p>
            </div>
            <div>
              <Label>Invoice due (days)</Label>
              <Input type="number" value={invoiceDueDays} onChange={(e) => setInvoiceDueDays(e.target.value)} />
            </div>
            <div>
              <Label>Stripe secret key (placeholder, unused)</Label>
              <Input type="password" value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} placeholder="sk_live_…" />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Rates</CardTitle>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">Used to estimate costs for the legacy voice engine and SMS/email — real Vapi calls use Vapi&apos;s actual billed cost instead. See Cost Tracking for live figures.</p>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
            <div>
              <Label>OpenAI $/minute (estimate)</Label>
              <Input type="number" step="0.01" value={openAiCostPerMinute} onChange={(e) => setOpenAiCostPerMinute(e.target.value)} />
            </div>
            <div>
              <Label>Twilio $/call (estimate)</Label>
              <Input type="number" step="0.001" value={twilioCostPerCall} onChange={(e) => setTwilioCostPerCall(e.target.value)} />
            </div>
            <div>
              <Label>Twilio number $/month/business</Label>
              <Input type="number" step="0.01" value={twilioNumberMonthlyCost} onChange={(e) => setTwilioNumberMonthlyCost(e.target.value)} />
            </div>
            <div>
              <Label>SMS $/message</Label>
              <Input type="number" step="0.001" value={smsCost} onChange={(e) => setSmsCost(e.target.value)} />
            </div>
            <div>
              <Label>Email $/message</Label>
              <Input type="number" step="0.0001" value={emailCost} onChange={(e) => setEmailCost(e.target.value)} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Free Trial</CardTitle>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">
              Single source of truth for trial length — set once at signup (onboarding.ts), read by the day-5/6/7 reminder emails and the
              expiry sweep that moves an unconverted business to TRIAL_ENDED. Changing this only affects new signups going forward, not
              trials already in progress.
            </p>
          </CardHeader>
          <div className="w-40 p-4">
            <Label>Trial length (days)</Label>
            <Input type="number" min={1} value={trialDays} onChange={(e) => setTrialDays(e.target.value)} />
          </div>
        </Card>

        <Card className={autoSuspendEnabled ? "border-[#FCA5A5]" : undefined}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {autoSuspendEnabled && <AlertTriangle className="h-4 w-4 text-[#EF4444]" />} Auto-Suspend Overdue Businesses
            </CardTitle>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">
              When ON, a business whose invoice goes {suspensionGraceDays || 14} days overdue is automatically suspended — their AI receptionist stops
              answering calls until the invoice is paid. Off by default: reminder emails still go out, nothing gets suspended, until you&apos;ve watched a
              full billing cycle run correctly.
            </p>
          </CardHeader>
          <div className="space-y-3 p-4">
            <button
              onClick={() => setAutoSuspendEnabled((v) => !v)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium ${
                autoSuspendEnabled ? "border-[#EF4444] bg-[#FEF2F2] text-[#EF4444]" : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA]"
              }`}
            >
              {autoSuspendEnabled ? "Auto-suspend is ON — click to turn off" : "Auto-suspend is off — click to enable"}
            </button>
            <div className="w-40">
              <Label>Grace period (days)</Label>
              <Input type="number" value={suspensionGraceDays} onChange={(e) => setSuspensionGraceDays(e.target.value)} />
            </div>
          </div>
        </Card>

        <Button onClick={save} disabled={saving} className="w-full sm:w-auto">
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </div>
  );
}
