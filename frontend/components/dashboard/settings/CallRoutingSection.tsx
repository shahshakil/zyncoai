"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Phone, PhoneForwarded, UserCheck } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input, Label } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

type StatusResponse = {
  phoneNumber: string;
  realPhoneNumber: string | null;
  transferNumber: string | null;
  routingOption: string;
  forwardingVerified: boolean;
};

function CopyableCode({ value }: { value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <code className="text-sm font-medium text-slate-800">{value}</code>
      <button type="button" onClick={() => { navigator.clipboard.writeText(value); toast.success("Copied"); }}>
        <Copy className="h-4 w-4 text-slate-400" />
      </button>
    </div>
  );
}

export function CallRoutingSection() {
  const { data, isLoading, mutate } = useApi<StatusResponse>("/api/business/call-routing/status");
  const [realPhoneNumber, setRealPhoneNumber] = useState("");
  const [transferNumber, setTransferNumber] = useState("");
  const [savingReal, setSavingReal] = useState(false);
  const [savingTransfer, setSavingTransfer] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"pass" | "fail" | null>(null);
  const [tab, setTab] = useState("telstra");

  const zyncoNumber = data?.phoneNumber || "";

  async function saveField(field: "realPhoneNumber" | "transferNumber", value: string) {
    if (!value) return;
    const setSaving = field === "realPhoneNumber" ? setSavingReal : setSavingTransfer;
    setSaving(true);
    try {
      await apiPost("/api/business/call-routing", { [field]: value }, "PUT");
      mutate();
    } catch (e: any) {
      toast.error(e?.message === "invalid_input" ? "Enter a valid phone number" : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function runTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await apiPost<{ forwardingVerified: boolean }>("/api/business/call-routing/test");
      setTestResult(res.forwardingVerified ? "pass" : "fail");
      mutate();
    } catch (e: any) {
      toast.error(e?.message === "real_phone_number_required" ? "Save your clinic's phone number first" : "Test call failed — try again");
    } finally {
      setTesting(false);
    }
  }

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <Card className="mt-6">
      <CardHeader>
        <div>
          <CardTitle>Call routing</CardTitle>
          <p className="mt-1 text-xs text-slate-400">AI answers every call. Patients who want a person transfer instantly to your team.</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-slate-400" /> Patients call your existing number — nothing changes for them</p>
          <p className="mt-2 flex items-center gap-2">🤖 AI answers every call instantly — bookings, FAQs, insurance questions</p>
          <p className="mt-2 flex items-center gap-2"><UserCheck className="h-4 w-4 shrink-0 text-slate-400" /> Patient says transfer → AI connects them to your team in seconds</p>
          <p className="mt-2 flex items-center gap-2">✅ Zero missed calls. Your team handles only what AI can&apos;t.</p>
        </div>

        <div>
          <Label>Your clinic&apos;s existing phone number</Label>
          <div className="flex gap-2">
            <Input
              value={realPhoneNumber || data?.realPhoneNumber || ""}
              onChange={(e) => setRealPhoneNumber(e.target.value)}
              placeholder="Your current clinic number"
            />
            <Button variant="secondary" size="sm" disabled={savingReal} onClick={() => saveField("realPhoneNumber", realPhoneNumber)}>
              {savingReal ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        <div>
          <Label>Your ZyncoAI line</Label>
          <CopyableCode value={zyncoNumber} />

          <div className="mt-3">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="telstra">Telstra landline</TabsTrigger>
                <TabsTrigger value="optus">Optus</TabsTrigger>
                <TabsTrigger value="tpg">TPG / VoIP</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                <TabsTrigger value="pabx">Office PABX</TabsTrigger>
              </TabsList>

              <TabsContent value="telstra" className="space-y-2 text-sm text-slate-600">
                <p>From your clinic phone dial:</p>
                <CopyableCode value={`*21*${zyncoNumber}#`} />
                <p className="text-xs text-slate-400">Press Call. Confirmation tone plays. Done forever.</p>
              </TabsContent>

              <TabsContent value="optus" className="space-y-2 text-sm text-slate-600">
                <ol className="list-decimal space-y-1 pl-4">
                  <li>Go to my.optus.com.au</li>
                  <li>My Account → Services → Call Forwarding → Always Forward</li>
                  <li>Enter: {zyncoNumber}</li>
                  <li>Save</li>
                </ol>
                <CopyableCode value={zyncoNumber} />
              </TabsContent>

              <TabsContent value="tpg" className="space-y-2 text-sm text-slate-600">
                <p>Admin panel → Phone → Call Forwarding → Always →</p>
                <CopyableCode value={zyncoNumber} />
              </TabsContent>

              <TabsContent value="mobile" className="space-y-2 text-sm text-slate-600">
                <CopyableCode value={`**21*${zyncoNumber}#`} />
              </TabsContent>

              <TabsContent value="pabx" className="space-y-2 text-sm text-slate-600">
                <p>Phone system → Extensions → Unconditional forward →</p>
                <CopyableCode value={zyncoNumber} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div>
          <Label>Human transfer number</Label>
          <div className="flex gap-2">
            <Input
              value={transferNumber || data?.transferNumber || ""}
              onChange={(e) => setTransferNumber(e.target.value)}
              placeholder="Your receptionist or team direct line"
            />
            <Button variant="secondary" size="sm" disabled={savingTransfer} onClick={() => saveField("transferNumber", transferNumber)}>
              {savingTransfer ? "Saving…" : "Save"}
            </Button>
          </div>
          <p className="mt-1 text-xs text-slate-400">This is where AI transfers callers who ask for a human.</p>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <Button variant="outline" onClick={runTest} disabled={testing}>
            <PhoneForwarded className="h-4 w-4" />
            {testing ? "Testing…" : "Test my setup"}
          </Button>
          {testResult === "pass" && <p className="mt-2 text-sm font-medium text-emerald-600">Forwarding active ✓</p>}
          {testResult === "fail" && <p className="mt-2 text-sm font-medium text-red-600">Not forwarding yet — check your settings</p>}
          {!testResult && data?.forwardingVerified && <p className="mt-2 text-xs text-slate-400">Last check: forwarding active ✓</p>}
        </div>
      </CardContent>
    </Card>
  );
}
