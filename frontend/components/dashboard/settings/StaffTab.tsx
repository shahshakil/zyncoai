"use client";
import { useState } from "react";
import { toast } from "sonner";
import posthog from "posthog-js";
import { Plus, Calendar, CloudCog, Trash2, CheckCircle2, Mail, X, Clock } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "../BusinessContext";
import { ExportMenu } from "../ExportMenu";
import { PrintLetterhead, PrintFooter } from "../PrintLetterhead";
import { slugFilename, type ExportSheet, type ExportColumn } from "@/lib/exportUtils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input, Label, Select } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const STAFF_COLUMNS: ExportColumn[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "workingHours", label: "Working Hours" },
  { key: "joinedDate", label: "Joined Date", format: (v) => (v ? new Date(v).toLocaleDateString("en-AU") : "—") },
];

interface Provider {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  active: boolean;
  googleCalendarConnected: boolean;
  appleCalendarConnected: boolean;
}

interface Member {
  id: string;
  role: "OWNER" | "ADMIN" | "STAFF" | "DOCTOR";
  user: { id: string; email: string; name: string | null };
  provider: { id: string; name: string } | null;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  providerId: string | null;
  expiresAt: string;
  expired: boolean;
}

const ROLE_LABEL: Record<string, string> = { OWNER: "Owner", ADMIN: "Admin", STAFF: "Staff", DOCTOR: "Doctor" };

function TeamAccessCard({ providers }: { providers: Provider[] }) {
  const { data, isLoading, mutate } = useApi<{ members: Member[]; pendingInvites: PendingInvite[] }>("/api/business/staff/invitations");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", role: "STAFF", providerId: "", payType: "", rate: "" });
  const [sending, setSending] = useState(false);

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await apiPost("/api/business/staff/invitations", {
        email: form.email,
        role: form.role,
        providerId: form.role === "DOCTOR" && form.providerId ? form.providerId : undefined,
        ...(form.payType && form.rate ? { payType: form.payType, rateCents: Math.round(parseFloat(form.rate) * 100) } : {}),
      });
      toast.success(`Invitation sent to ${form.email}`);
      posthog.capture("staff_invited", { role: form.role });
      setOpen(false);
      setForm({ email: "", role: "STAFF", providerId: "", payType: "", rate: "" });
      mutate();
    } catch (err: any) {
      toast.error(err?.message === "already_a_member" ? "That person already has access" : "Could not send invitation");
    } finally {
      setSending(false);
    }
  }

  async function revokeInvite(id: string) {
    try {
      await apiPost(`/api/business/staff/invitations/${id}`, undefined, "DELETE");
      mutate();
    } catch {
      toast.error("Could not revoke invitation");
    }
  }

  async function removeMember(memberId: string) {
    try {
      await apiPost(`/api/business/staff/invitations/members/${memberId}`, undefined, "DELETE");
      mutate();
    } catch {
      toast.error("Could not remove team member");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team access</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}><Mail className="h-4 w-4" /> Invite team member</Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <>
            <div className="space-y-2">
              {data?.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{m.user.name || m.user.email}</p>
                    <p className="text-xs text-slate-400">{m.user.email}{m.provider ? ` · ${m.provider.name}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="purple">{ROLE_LABEL[m.role]}</Badge>
                    {m.role !== "OWNER" && (
                      <Button variant="ghost" size="sm" onClick={() => removeMember(m.id)}><Trash2 className="h-4 w-4" /></Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!!data?.pendingInvites.length && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pending invitations</p>
                {data.pendingInvites.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-300" />
                      <div>
                        <p className="text-sm text-slate-700">{inv.email}</p>
                        <p className="text-xs text-slate-400">{ROLE_LABEL[inv.role]} · {inv.expired ? "expired" : `expires ${new Date(inv.expiresAt).toLocaleDateString()}`}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => revokeInvite(inv.id)}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite team member</DialogTitle></DialogHeader>
          <form onSubmit={sendInvite} className="space-y-3">
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                <option value="ADMIN">Admin — full access, all data</option>
                <option value="STAFF">Staff — bookings & patients, no financials</option>
                <option value="DOCTOR">Doctor — own schedule & patients only</option>
              </Select>
            </div>
            {form.role === "DOCTOR" && (
              <div>
                <Label>Link to staff record</Label>
                <Select value={form.providerId} onChange={(e) => setForm((f) => ({ ...f, providerId: e.target.value }))}>
                  <option value="">Select which staff record is theirs…</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}{p.title ? ` — ${p.title}` : ""}</option>
                  ))}
                </Select>
                <p className="mt-1 text-xs text-slate-400">Scopes their dashboard to only this staff record&apos;s appointments and patients.</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Pay type (optional)</Label>
                <Select value={form.payType} onChange={(e) => setForm((f) => ({ ...f, payType: e.target.value }))}>
                  <option value="">Not set yet</option>
                  <option value="HOURLY">Hourly rate</option>
                  <option value="SALARY">Annual salary</option>
                  <option value="PERCENTAGE_OF_BILLINGS">% of billings</option>
                </Select>
              </div>
              {form.payType && (
                <div>
                  <Label>{form.payType === "PERCENTAGE_OF_BILLINGS" ? "Percentage (%)" : form.payType === "SALARY" ? "Annual salary ($)" : "Hourly rate ($)"}</Label>
                  <Input type="number" min="0" step="0.01" value={form.rate} onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))} />
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400">
              An email will be sent from support@zyncoai.com with a link to set a password. It expires in 48 hours.
            </p>
            <Button type="submit" className="w-full" disabled={sending}>{sending ? "Sending…" : "Send invitation"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export function StaffTab() {
  const { business } = useDashboard();
  const { data, isLoading, mutate } = useApi<{ providers: Provider[] }>("/api/business/providers");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", title: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [calendarConsentFor, setCalendarConsentFor] = useState<string | null>(null);
  const [appleConnectFor, setAppleConnectFor] = useState<string | null>(null);
  const [appleForm, setAppleForm] = useState({ appleId: "", appPassword: "" });
  const [connectingApple, setConnectingApple] = useState(false);
  const [printRows, setPrintRows] = useState<any[]>([]);

  async function loadStaffSheets(): Promise<ExportSheet[]> {
    const r = await fetch("/api/business/export/staff", { credentials: "include" });
    const json = await r.json();
    if (!json.ok) throw new Error("export_failed");
    return [{ name: "Staff", columns: STAFF_COLUMNS, rows: json.rows }];
  }

  async function addStaff(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPost("/api/business/providers", { name: form.name, title: form.title || undefined, email: form.email || undefined });
      toast.success("Staff member added");
      setOpen(false);
      setForm({ name: "", title: "", email: "" });
      mutate();
    } catch {
      toast.error("Could not add staff member");
    } finally {
      setSaving(false);
    }
  }

  async function removeStaff(id: string) {
    try {
      await apiPost(`/api/business/providers/${id}`, undefined, "DELETE");
      mutate();
    } catch {
      toast.error("Could not remove staff member");
    }
  }

  async function connectCalendar(id: string) {
    try {
      const res = await fetch(`/api/business/providers/${id}/google-calendar/connect`, { credentials: "include" });
      const data = await res.json();
      if (data.authUrl) window.location.href = data.authUrl;
      else toast.error("Google Calendar isn't configured yet");
    } catch {
      toast.error("Could not start Google Calendar connection");
    } finally {
      setCalendarConsentFor(null);
    }
  }

  async function connectApple(e: React.FormEvent) {
    e.preventDefault();
    if (!appleConnectFor) return;
    setConnectingApple(true);
    try {
      const r = await fetch("/api/business/staff-sync/apple/connect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ providerId: appleConnectFor, appleId: appleForm.appleId, appPassword: appleForm.appPassword }),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error);
      toast.success(`Connected — found ${data.calendarCount} calendar(s)`);
      setAppleConnectFor(null);
      setAppleForm({ appleId: "", appPassword: "" });
      mutate();
    } catch {
      toast.error("Could not connect — check the Apple ID and app-specific password");
    } finally {
      setConnectingApple(false);
    }
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <div className="no-print"><TeamAccessCard providers={data?.providers || []} /></div>

      <Card className="no-print">
        <CardHeader>
          <CardTitle>Staff directory</CardTitle>
          <div className="flex items-center gap-2">
            <ExportMenu
              section="staff"
              filename={slugFilename(business.name, "Staff")}
              meta={{ businessName: business.name, reportTitle: "Staff Directory" }}
              loadSheets={loadStaffSheets}
              onRowsReady={(sheets) => setPrintRows(sheets[0].rows)}
            />
            <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add staff</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {data?.providers.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{p.name}</p>
                <p className="text-xs text-slate-400">{p.title || "Staff"}{p.email ? ` · ${p.email}` : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                {p.googleCalendarConnected ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Google connected</span>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setCalendarConsentFor(p.id)}><Calendar className="h-4 w-4" /> Connect Google</Button>
                )}
                {p.appleCalendarConnected ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> iCloud connected</span>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setAppleConnectFor(p.id)}><CloudCog className="h-4 w-4" /> Connect iCloud</Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => removeStaff(p.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {!data?.providers.length && <p className="text-sm text-slate-400">No staff members yet.</p>}
        </CardContent>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add staff member</DialogTitle></DialogHeader>
            <form onSubmit={addStaff} className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : "Add staff member"}</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!calendarConsentFor} onOpenChange={(v) => !v && setCalendarConsentFor(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Connect Google Calendar</DialogTitle></DialogHeader>
            <div className="space-y-3 text-sm text-slate-500">
              <p>By connecting your account you agree to our <a href="/privacy" target="_blank" rel="noreferrer" className="text-[var(--accent,#4f46e5)] underline">Privacy Policy</a> and consent to importing calendar availability for this staff member.</p>
              <p><span className="text-emerald-600">We will import:</span> calendar free/busy availability, for booking purposes only.</p>
              <p><span className="text-rose-600">We will NOT import:</span> patient records, clinical data, Medicare numbers, health identifiers, or event details/descriptions.</p>
              <Button className="w-full" onClick={() => calendarConsentFor && connectCalendar(calendarConsentFor)}>I agree — connect calendar</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!appleConnectFor} onOpenChange={(v) => !v && setAppleConnectFor(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Connect iCloud Calendar</DialogTitle></DialogHeader>
            <form onSubmit={connectApple} className="space-y-3">
              <p className="text-xs text-slate-400">
                Use an{" "}
                <a href="https://support.apple.com/en-us/102654" target="_blank" rel="noreferrer" className="text-[var(--accent,#4f46e5)] underline">
                  app-specific password
                </a>{" "}
                — not your regular Apple ID password.
              </p>
              <div><Label>Apple ID</Label><Input type="email" value={appleForm.appleId} onChange={(e) => setAppleForm((f) => ({ ...f, appleId: e.target.value }))} required /></div>
              <div><Label>App-specific password</Label><Input type="password" value={appleForm.appPassword} onChange={(e) => setAppleForm((f) => ({ ...f, appPassword: e.target.value }))} required /></div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
                <p><span className="text-emerald-600">We will import:</span> calendar free/busy availability, for booking purposes only.</p>
                <p className="mt-1"><span className="text-rose-600">We will NOT import:</span> patient records, clinical data, Medicare numbers, health identifiers, or event details/descriptions.</p>
              </div>
              <Button type="submit" className="w-full" disabled={connectingApple}>{connectingApple ? "Connecting…" : "Connect"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </Card>

      <div className="print-only">
        <PrintLetterhead reportTitle="Staff Directory" />
        <table className="print-table">
          <thead><tr>{STAFF_COLUMNS.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead>
          <tbody>
            {printRows.map((row, i) => (
              <tr key={i}>{STAFF_COLUMNS.map((c) => <td key={c.key}>{c.format ? c.format((row as any)[c.key], row) : String((row as any)[c.key] ?? "")}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <PrintFooter />
      </div>
    </div>
  );
}
