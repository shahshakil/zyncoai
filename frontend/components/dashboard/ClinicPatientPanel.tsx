"use client";
// Operations portal (MEDICAL/DENTAL/MECHANIC/RESTAURANT/LAW/BANK/UNIVERSITY/
// SALON) — Insurance/Extra-fields, Documents, and Claims tabs on the
// contact detail page. Only rendered when getVerticalOps(business.vertical)
// is non-null (checked by the caller); every other vertical's contact page
// is unchanged. MEDICAL/DENTAL keep their exact original dedicated
// InsuranceTab (Medicare/private-health/DVA, unchanged from before this
// vertical-aware pass) — every other vertical gets a generic extra-fields
// form driven by VerticalOpsConfig.extraFields, writing to Contact.metadata.
import { useState, Fragment } from "react";
import { toast } from "sonner";
import { Upload, Download, Send, Trash2, Plus, ShieldAlert, Star } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { getVerticalOps, claimStatusLabel, VerticalOpsConfig } from "@/lib/verticalOps";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Label, Select } from "@/components/dashboard/ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/dashboard/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";

interface ClinicContact {
  dob: string | null; address: string | null;
  emergencyContactName: string | null; emergencyContactPhone: string | null;
  medicareNumber: string | null; medicareRefNumber: number | null;
  privateHealthFund: string | null; privateHealthMemberNumber: string | null;
  dvaNumber: string | null; concessionCardNumber: string | null;
  isVip: boolean; isAtRisk?: boolean;
  metadata?: Record<string, any> | null;
}
interface PatientFlags { visit: "new" | "returning" | "regular"; isClaimant: boolean; isVip: boolean; isAtRisk?: boolean }

const DOC_TYPES = ["REFERRAL", "SPECIALIST_REPORT", "IMAGING_REPORT", "PATHOLOGY_REPORT", "INSURANCE_FORM", "CONSENT_FORM", "SCAN_RESULT", "OTHER"];
const CLAIM_STATUS_TONE: Record<string, "success" | "warning" | "danger" | "info"> = { APPROVED: "success", PENDING: "warning", LODGED: "info", REJECTED: "danger" };

function money(cents: number): string { return `$${(cents / 100).toFixed(2)}`; }

export function PatientFlagBadges({ flags, vertical }: { flags: PatientFlags; vertical?: string }) {
  const ops = getVerticalOps(vertical);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge tone={flags.visit === "regular" ? "success" : flags.visit === "returning" ? "info" : "default"}>{flags.visit}</Badge>
      {flags.isClaimant && ops?.claimsEnabled && <Badge tone="purple">{ops.claimsLabel.replace(/s$/, "")} on file</Badge>}
      {flags.isVip && ops?.vipLabel !== null && <Badge tone="vip"><Star className="mr-1 inline h-3 w-3" />{ops?.vipLabel || "VIP"}</Badge>}
      {flags.isAtRisk && ops?.atRiskLabel !== null && <Badge tone="danger"><ShieldAlert className="mr-1 inline h-3 w-3" />{(ops?.atRiskLabel || "At risk").replace(" (owner/admin only)", "")}</Badge>}
    </div>
  );
}

export function ClinicPatientPanel({ contactId, clinic, flags, onRefresh }: { contactId: string; clinic: ClinicContact; flags: PatientFlags; onRefresh: () => void }) {
  const { role, business } = useDashboard();
  const ops = getVerticalOps(business.vertical);
  if (!ops) return null;
  const canEditAtRisk = role === "OWNER" || role === "ADMIN";
  const isMedical = ops.vertical === "MEDICAL" || ops.vertical === "DENTAL";

  return (
    <Card className="no-print">
      <CardHeader><CardTitle>{isMedical ? "Clinic Record" : `${ops.contactLabel} Record`}</CardTitle></CardHeader>
      <CardContent>
        <Tabs defaultValue="insurance">
          <TabsList>
            <TabsTrigger value="insurance">{ops.insuranceTabLabel}</TabsTrigger>
            <TabsTrigger value="documents">{ops.documentsLabel}</TabsTrigger>
            {ops.claimsEnabled && <TabsTrigger value="claims">{ops.claimsLabel}</TabsTrigger>}
          </TabsList>
          <TabsContent value="insurance">
            {isMedical
              ? <InsuranceTab contactId={contactId} clinic={clinic} canEditAtRisk={canEditAtRisk} onSaved={onRefresh} />
              : <ExtraFieldsTab contactId={contactId} clinic={clinic} ops={ops} canEditAtRisk={canEditAtRisk} onSaved={onRefresh} />}
          </TabsContent>
          <TabsContent value="documents"><DocumentsTab contactId={contactId} ops={ops} /></TabsContent>
          {ops.claimsEnabled && <TabsContent value="claims"><ClaimsTab contactId={contactId} ops={ops} onSaved={onRefresh} /></TabsContent>}
        </Tabs>
      </CardContent>
    </Card>
  );
}

// --- MEDICAL/DENTAL — unchanged from before this vertical-aware pass ------
function InsuranceTab({ contactId, clinic, canEditAtRisk, onSaved }: { contactId: string; clinic: ClinicContact; canEditAtRisk: boolean; onSaved: () => void }) {
  const [form, setForm] = useState({
    dob: clinic.dob ? clinic.dob.slice(0, 10) : "",
    address: clinic.address || "",
    emergencyContactName: clinic.emergencyContactName || "",
    emergencyContactPhone: clinic.emergencyContactPhone || "",
    medicareNumber: clinic.medicareNumber || "",
    medicareRefNumber: clinic.medicareRefNumber?.toString() || "",
    privateHealthFund: clinic.privateHealthFund || "",
    privateHealthMemberNumber: clinic.privateHealthMemberNumber || "",
    dvaNumber: clinic.dvaNumber || "",
    concessionCardNumber: clinic.concessionCardNumber || "",
    isVip: clinic.isVip,
    isAtRisk: clinic.isAtRisk || false,
  });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      await apiPost(`/api/business/contacts/${contactId}`, {
        dob: form.dob ? new Date(form.dob).toISOString() : null,
        address: form.address || null,
        emergencyContactName: form.emergencyContactName || null,
        emergencyContactPhone: form.emergencyContactPhone || null,
        medicareNumber: form.medicareNumber || null,
        medicareRefNumber: form.medicareRefNumber ? Number(form.medicareRefNumber) : null,
        privateHealthFund: form.privateHealthFund || null,
        privateHealthMemberNumber: form.privateHealthMemberNumber || null,
        dvaNumber: form.dvaNumber || null,
        concessionCardNumber: form.concessionCardNumber || null,
        isVip: form.isVip,
        ...(canEditAtRisk ? { isAtRisk: form.isAtRisk } : {}),
      }, "PATCH");
      toast.success("Insurance details saved");
      onSaved();
    } catch {
      toast.error("Could not save — check the details and try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><Label>Date of birth</Label><Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} /></div>
        <div><Label>Address</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
        <div><Label>Emergency contact name</Label><Input value={form.emergencyContactName} onChange={(e) => set("emergencyContactName", e.target.value)} /></div>
        <div><Label>Emergency contact phone</Label><Input value={form.emergencyContactPhone} onChange={(e) => set("emergencyContactPhone", e.target.value)} /></div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">Medicare &amp; private health — encrypted at rest</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><Label>Medicare number</Label><Input value={form.medicareNumber} onChange={(e) => set("medicareNumber", e.target.value)} placeholder="e.g. 2950 12345 1" /></div>
          <div><Label>Medicare individual ref #</Label><Input type="number" min={1} max={9} value={form.medicareRefNumber} onChange={(e) => set("medicareRefNumber", e.target.value)} /></div>
          <div><Label>Private health fund</Label><Input value={form.privateHealthFund} onChange={(e) => set("privateHealthFund", e.target.value)} placeholder="e.g. Bupa, Medibank, HCF, NIB" /></div>
          <div><Label>Member number</Label><Input value={form.privateHealthMemberNumber} onChange={(e) => set("privateHealthMemberNumber", e.target.value)} /></div>
          <div><Label>DVA number</Label><Input value={form.dvaNumber} onChange={(e) => set("dvaNumber", e.target.value)} /></div>
          <div><Label>Concession card number</Label><Input value={form.concessionCardNumber} onChange={(e) => set("concessionCardNumber", e.target.value)} /></div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={form.isVip} onChange={(e) => set("isVip", e.target.checked)} /> VIP patient
        </label>
        {canEditAtRisk && (
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.isAtRisk} onChange={(e) => set("isAtRisk", e.target.checked)} /> At-risk flag (owner/admin only)
          </label>
        )}
      </div>

      <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save insurance details"}</Button>
    </div>
  );
}

// --- Every other vertical — generic form driven by ops.extraFields --------
function ExtraFieldsTab({ contactId, clinic, ops, canEditAtRisk, onSaved }: { contactId: string; clinic: ClinicContact; ops: VerticalOpsConfig; canEditAtRisk: boolean; onSaved: () => void }) {
  const meta = clinic.metadata || {};
  const [values, setValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    for (const f of ops.extraFields) init[f.key] = meta[f.key] ?? (f.type === "checkbox" ? false : "");
    return init;
  });
  const [isVip, setIsVip] = useState(clinic.isVip);
  const [isAtRisk, setIsAtRisk] = useState(clinic.isAtRisk || false);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const metadata: Record<string, any> = {};
      for (const f of ops.extraFields) {
        const v = values[f.key];
        metadata[f.key] = f.type === "number" ? (v === "" ? null : Number(v)) : v === "" ? null : v;
      }
      await apiPost(`/api/business/contacts/${contactId}`, {
        metadata,
        ...(ops.vipLabel !== null ? { isVip } : {}),
        ...(ops.atRiskLabel !== null && canEditAtRisk ? { isAtRisk } : {}),
      }, "PATCH");
      toast.success("Details saved");
      onSaved();
    } catch {
      toast.error("Could not save — check the details and try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 pt-2">
      {ops.extraFields.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ops.extraFields.map((f) => (
            <div key={f.key} className={f.type === "checkbox" ? "flex items-center gap-2 pt-6" : undefined}>
              {f.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={!!values[f.key]} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.checked }))} /> {f.label}
                </label>
              ) : f.type === "select" ? (
                <>
                  <Label>{f.label}</Label>
                  <Select value={values[f.key] || ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}>
                    <option value="">—</option>
                    {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </>
              ) : (
                <>
                  <Label>{f.label}</Label>
                  <Input type={f.type} value={values[f.key] || ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {(ops.vipLabel !== null || ops.atRiskLabel !== null) && (
        <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4">
          {ops.vipLabel !== null && (
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={isVip} onChange={(e) => setIsVip(e.target.checked)} /> {ops.vipLabel}
            </label>
          )}
          {ops.atRiskLabel !== null && canEditAtRisk && (
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={isAtRisk} onChange={(e) => setIsAtRisk(e.target.checked)} /> {ops.atRiskLabel}
            </label>
          )}
        </div>
      )}
      {ops.extraFields.length === 0 && ops.vipLabel === null && ops.atRiskLabel === null && (
        <p className="text-sm text-slate-400">No extra details tracked for this vertical.</p>
      )}
      <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save details"}</Button>
    </div>
  );
}

interface ClinicDocumentRow {
  id: string; docType: string; scanType: string | null; filename: string; resultStatus: string | null;
  expiresAt: string | null; createdAt: string; sendLogs: { sentToEmail: string; sentAt: string }[];
}

function DocumentsTab({ contactId, ops }: { contactId: string; ops: VerticalOpsConfig }) {
  const { data, mutate } = useApi<{ ok: boolean; documents: ClinicDocumentRow[] }>(`/api/business/documents?contactId=${contactId}`);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [sendDoc, setSendDoc] = useState<ClinicDocumentRow | null>(null);

  async function download(doc: ClinicDocumentRow) {
    try {
      const res = await fetch(`/api/business/documents/${doc.id}/download`, { credentials: "include" });
      const json = await res.json();
      if (!json.ok) { toast.error("Could not generate download link"); return; }
      window.open(json.url, "_blank");
    } catch {
      toast.error("Download failed");
    }
  }

  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setUploadOpen(true)}><Upload className="h-4 w-4" /> Upload document</Button>
      </div>
      <Table>
        <Thead><tr><Th>Type</Th><Th>Filename</Th><Th>Result status</Th><Th>Uploaded</Th><Th>Last sent</Th><Th></Th></tr></Thead>
        <Tbody>
          {data?.documents.map((d) => (
            <Tr key={d.id}>
              <Td>{d.scanType || d.docType.replace(/_/g, " ")}</Td>
              <Td className="font-medium text-slate-700">{d.filename}</Td>
              <Td>{d.resultStatus ? <Badge tone={d.resultStatus === "REVIEWED" ? "success" : d.resultStatus === "RECEIVED" ? "info" : "warning"}>{d.resultStatus}</Badge> : "—"}</Td>
              <Td className="text-xs text-slate-400">{new Date(d.createdAt).toLocaleDateString("en-AU")}</Td>
              <Td className="text-xs text-slate-400">{d.sendLogs[0] ? `${d.sendLogs[0].sentToEmail} · ${new Date(d.sendLogs[0].sentAt).toLocaleDateString("en-AU")}` : "—"}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <button title="Download" onClick={() => download(d)} className="text-slate-400 hover:text-slate-900"><Download className="h-4 w-4" /></button>
                  <button title="Send" onClick={() => setSendDoc(d)} className="text-slate-400 hover:text-slate-900"><Send className="h-4 w-4" /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {data && !data.documents.length && <EmptyState title="No documents on file" description={`Upload ${ops.docLabelSuggestions.length ? ops.docLabelSuggestions.slice(0, 3).join(", ").toLowerCase() : "documents"} for this ${ops.contactLabel.toLowerCase()}.`} />}

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} contactId={contactId} ops={ops} onUploaded={() => mutate()} />
      <SendDialog document={sendDoc} onClose={() => setSendDoc(null)} onSent={() => mutate()} />
    </div>
  );
}

function UploadDialog({ open, onClose, contactId, ops, onUploaded }: { open: boolean; onClose: () => void; contactId: string; ops: VerticalOpsConfig; onUploaded: () => void }) {
  const isMedical = ops.vertical === "MEDICAL" || ops.vertical === "DENTAL";
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("REFERRAL");
  const [scanType, setScanType] = useState("");
  const [uploading, setUploading] = useState(false);

  async function upload() {
    if (!file) { toast.error("Choose a file first"); return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("contactId", contactId);
      form.append("docType", isMedical ? docType : "OTHER");
      if (isMedical ? scanType : scanType.trim()) form.append("scanType", scanType);
      const res = await fetch("/api/business/documents", { method: "POST", body: form, credentials: "include" });
      const json = await res.json();
      if (!json.ok) { toast.error(json.error === "storage_upload_failed" ? "Storage is temporarily unavailable — try again shortly" : "Upload failed"); return; }
      toast.success("Document uploaded");
      onUploaded();
      onClose();
      setFile(null);
      setScanType("");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Upload document</DialogTitle></DialogHeader>
        <div className="space-y-4">
          {isMedical ? (
            <>
              <div>
                <Label>Document type</Label>
                <Select value={docType} onChange={(e) => setDocType(e.target.value)}>
                  {DOC_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                </Select>
              </div>
              {(docType === "SCAN_RESULT" || docType === "IMAGING_REPORT" || docType === "PATHOLOGY_REPORT") && (
                <div><Label>Scan / test type</Label><Input value={scanType} onChange={(e) => setScanType(e.target.value)} placeholder="e.g. MRI, X-ray, FBC, HbA1c" /></div>
              )}
            </>
          ) : (
            <div>
              <Label>Document label</Label>
              <Input list="doc-label-suggestions" value={scanType} onChange={(e) => setScanType(e.target.value)} placeholder={ops.docLabelSuggestions[0] || "e.g. Invoice"} />
              <datalist id="doc-label-suggestions">
                {ops.docLabelSuggestions.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
          )}
          <div><Label>File</Label><input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-slate-600" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={upload} disabled={uploading}>{uploading ? "Uploading…" : "Upload"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SendDialog({ document, onClose, onSent }: { document: ClinicDocumentRow | null; onClose: () => void; onSent: () => void }) {
  const [to, setTo] = useState("");
  const [recipientType, setRecipientType] = useState("PATIENT");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!document || !to.trim()) { toast.error("Enter a recipient email"); return; }
    setSending(true);
    try {
      await apiPost(`/api/business/documents/${document.id}/send`, { to: to.trim(), recipientType }, "POST");
      toast.success("Document sent");
      onSent();
      onClose();
      setTo("");
    } catch {
      toast.error("Send failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={!!document} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Send document</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Recipient</Label>
            <Select value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
              <option value="PATIENT">Customer / client</option>
              <option value="INSURER">Insurance company</option>
              <option value="REFERRING_DOCTOR">Referring doctor</option>
              <option value="MEDICARE">Medicare</option>
              <option value="OTHER">Other</option>
            </Select>
          </div>
          <div><Label>Email address</Label><Input type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="name@example.com" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={send} disabled={sending}>{sending ? "Sending…" : "Send"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ClaimRow {
  id: string; claimType: string; insurerName: string | null; billedAmountCents: number;
  approvedAmountCents: number | null; paidAmountCents: number | null; outstandingAmountCents: number; status: string;
  metadata?: { trustEntries?: TrustEntry[]; timeEntries?: TimeEntry[] } | null;
}
interface TrustEntry { date: string; type: "deposit" | "disbursement"; amountCents: number; note: string }
interface TimeEntry { date: string; hours: number; description: string }

function ClaimsTab({ contactId, ops, onSaved }: { contactId: string; ops: VerticalOpsConfig; onSaved: () => void }) {
  const { data, mutate } = useApi<{ ok: boolean; claims: ClaimRow[] }>(`/api/business/claims?contactId=${contactId}`);
  const [createOpen, setCreateOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New {ops.claimTypes[0]?.label.split(" ")[0] || "record"}</Button>
      </div>
      <Table>
        <Thead><tr><Th>Type</Th><Th>{ops.claimFieldLabels.insurerName}</Th><Th>{ops.claimFieldLabels.billedAmountCents}</Th><Th>{ops.claimFieldLabels.approvedAmountCents}</Th><Th>Outstanding</Th><Th>Status</Th></tr></Thead>
        <Tbody>
          {data?.claims.map((c) => (
            <Fragment key={c.id}>
              <Tr className={ops.trustLedgerEnabled || ops.timeRecordingEnabled ? "cursor-pointer" : undefined} onClick={() => (ops.trustLedgerEnabled || ops.timeRecordingEnabled) && setExpanded(expanded === c.id ? null : c.id)}>
                <Td>{ops.claimTypes.find((t) => t.value === c.claimType)?.label || c.claimType.replace(/_/g, " ")}</Td>
                <Td>{c.insurerName || "—"}</Td>
                <Td>{money(c.billedAmountCents)}</Td>
                <Td>{c.approvedAmountCents != null ? money(c.approvedAmountCents) : "—"}</Td>
                <Td>{money(c.outstandingAmountCents)}</Td>
                <Td><Badge tone={CLAIM_STATUS_TONE[c.status] || "default"}>{claimStatusLabel(ops, c.status)}</Badge></Td>
              </Tr>
              {expanded === c.id && (ops.trustLedgerEnabled || ops.timeRecordingEnabled) && (
                <tr>
                  <td colSpan={6} className="bg-slate-50 p-4">
                    <MatterDetail claim={c} ops={ops} onSaved={() => { mutate(); onSaved(); }} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </Tbody>
      </Table>
      {data && !data.claims.length && <EmptyState title={`No ${ops.claimsLabel.toLowerCase()} on file`} description={`Add a ${ops.claimTypes.map((t) => t.label).join(", ").toLowerCase()} record for this ${ops.contactLabel.toLowerCase()}.`} />}

      <CreateClaimDialog open={createOpen} onClose={() => setCreateOpen(false)} contactId={contactId} ops={ops} onCreated={() => { mutate(); onSaved(); }} />
    </div>
  );
}

// LAW-only: lightweight trust-ledger + billable-time tracker, both stored
// in Claim.metadata. Deliberately informational, not certified — see the
// disclaimer text — this does not replace compliant trust accounting
// software, same "tracker not a lodgment tool" boundary as the BAS helper.
function MatterDetail({ claim, ops, onSaved }: { claim: ClaimRow; ops: VerticalOpsConfig; onSaved: () => void }) {
  const trustEntries = claim.metadata?.trustEntries || [];
  const timeEntries = claim.metadata?.timeEntries || [];
  const [trustDate, setTrustDate] = useState(new Date().toISOString().slice(0, 10));
  const [trustType, setTrustType] = useState<"deposit" | "disbursement">("deposit");
  const [trustAmount, setTrustAmount] = useState("");
  const [trustNote, setTrustNote] = useState("");
  const [timeDate, setTimeDate] = useState(new Date().toISOString().slice(0, 10));
  const [timeHours, setTimeHours] = useState("");
  const [timeDesc, setTimeDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const balanceCents = trustEntries.reduce((sum, e) => sum + (e.type === "deposit" ? e.amountCents : -e.amountCents), 0);
  const totalHours = timeEntries.reduce((sum, e) => sum + e.hours, 0);

  async function addTrustEntry() {
    const amountCents = Math.round(parseFloat(trustAmount || "0") * 100);
    if (!amountCents) { toast.error("Enter an amount"); return; }
    setSaving(true);
    try {
      await apiPost(`/api/business/claims/${claim.id}`, {
        metadata: { trustEntries: [...trustEntries, { date: trustDate, type: trustType, amountCents, note: trustNote }] },
      }, "PATCH");
      toast.success("Trust entry added");
      setTrustAmount(""); setTrustNote("");
      onSaved();
    } catch {
      toast.error("Could not add entry");
    } finally {
      setSaving(false);
    }
  }

  async function addTimeEntry() {
    const hours = parseFloat(timeHours || "0");
    if (!hours) { toast.error("Enter hours"); return; }
    setSaving(true);
    try {
      await apiPost(`/api/business/claims/${claim.id}`, {
        metadata: { timeEntries: [...timeEntries, { date: timeDate, hours, description: timeDesc }] },
      }, "PATCH");
      toast.success("Time entry added");
      setTimeHours(""); setTimeDesc("");
      onSaved();
    } catch {
      toast.error("Could not add entry");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      {ops.trustLedgerEnabled && (
        <div>
          <p className="mb-1 text-sm font-semibold text-slate-700">Trust Ledger — running balance: {money(balanceCents)}</p>
          <p className="mb-3 text-xs text-amber-600">Internal tracker only — not a substitute for compliant trust accounting software. Does not itself satisfy Legal Profession Uniform Law trust record-keeping requirements.</p>
          {trustEntries.length > 0 && (
            <Table>
              <Thead><tr><Th>Date</Th><Th>Type</Th><Th>Amount</Th><Th>Note</Th></tr></Thead>
              <Tbody>
                {trustEntries.map((e, i) => (
                  <Tr key={i}><Td>{e.date}</Td><Td className="capitalize">{e.type}</Td><Td>{money(e.amountCents)}</Td><Td>{e.note}</Td></Tr>
                ))}
              </Tbody>
            </Table>
          )}
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <div><Label>Date</Label><Input type="date" value={trustDate} onChange={(e) => setTrustDate(e.target.value)} /></div>
            <div><Label>Type</Label><Select value={trustType} onChange={(e) => setTrustType(e.target.value as any)}><option value="deposit">Deposit</option><option value="disbursement">Disbursement</option></Select></div>
            <div><Label>Amount ($)</Label><Input type="number" min="0" step="0.01" value={trustAmount} onChange={(e) => setTrustAmount(e.target.value)} /></div>
            <div className="flex-1 min-w-[150px]"><Label>Note</Label><Input value={trustNote} onChange={(e) => setTrustNote(e.target.value)} placeholder="e.g. Court filing fee" /></div>
            <Button size="sm" onClick={addTrustEntry} disabled={saving}>Add entry</Button>
          </div>
        </div>
      )}
      {ops.timeRecordingEnabled && (
        <div className="border-t border-slate-200 pt-4">
          <p className="mb-3 text-sm font-semibold text-slate-700">Time Recording — total: {totalHours.toFixed(1)}h</p>
          {timeEntries.length > 0 && (
            <Table>
              <Thead><tr><Th>Date</Th><Th>Hours</Th><Th>Description</Th></tr></Thead>
              <Tbody>
                {timeEntries.map((e, i) => (
                  <Tr key={i}><Td>{e.date}</Td><Td>{e.hours}</Td><Td>{e.description}</Td></Tr>
                ))}
              </Tbody>
            </Table>
          )}
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <div><Label>Date</Label><Input type="date" value={timeDate} onChange={(e) => setTimeDate(e.target.value)} /></div>
            <div><Label>Hours</Label><Input type="number" min="0" step="0.1" value={timeHours} onChange={(e) => setTimeHours(e.target.value)} /></div>
            <div className="flex-1 min-w-[150px]"><Label>Description</Label><Input value={timeDesc} onChange={(e) => setTimeDesc(e.target.value)} placeholder="e.g. Drafting affidavit" /></div>
            <Button size="sm" onClick={addTimeEntry} disabled={saving}>Add entry</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateClaimDialog({ open, onClose, contactId, ops, onCreated }: { open: boolean; onClose: () => void; contactId: string; ops: VerticalOpsConfig; onCreated: () => void }) {
  const [claimType, setClaimType] = useState(ops.claimTypes[0]?.value || "OTHER");
  const [insurerName, setInsurerName] = useState("");
  const [billedAmount, setBilledAmount] = useState("");
  const [saving, setSaving] = useState(false);

  async function create() {
    const billedAmountCents = Math.round(parseFloat(billedAmount || "0") * 100);
    if (!billedAmountCents || billedAmountCents <= 0) { toast.error(`Enter a ${ops.claimFieldLabels.billedAmountCents.toLowerCase()} amount`); return; }
    setSaving(true);
    try {
      await apiPost("/api/business/claims", { contactId, claimType, insurerName: insurerName || undefined, billedAmountCents }, "POST");
      toast.success("Saved");
      onCreated();
      onClose();
      setInsurerName(""); setBilledAmount("");
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>New {ops.claimsLabel.replace(/s$/, "").toLowerCase()}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          {ops.claimTypes.length > 1 && (
            <div>
              <Label>Type</Label>
              <Select value={claimType} onChange={(e) => setClaimType(e.target.value)}>
                {ops.claimTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </div>
          )}
          <div><Label>{ops.claimFieldLabels.insurerName}</Label><Input value={insurerName} onChange={(e) => setInsurerName(e.target.value)} /></div>
          <div><Label>{ops.claimFieldLabels.billedAmountCents} ($)</Label><Input type="number" min="0" step="0.01" value={billedAmount} onChange={(e) => setBilledAmount(e.target.value)} /></div>
          <p className="text-xs text-slate-400">Tracks status/amounts only — this does not submit to an insurer, Medicare, WorkCover, or any external system.</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={create} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
