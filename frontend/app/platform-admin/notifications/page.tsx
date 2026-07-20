"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Send, Mail, Bell, Megaphone, MousePointerClick, UserX, Plus, Pencil, Trash2, BookOpen, Printer } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input, Select, Label, Textarea } from "@/components/dashboard/ui/input";
import { Table, Thead, Th, Tbody, Tr, Td, EmptyState } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/dashboard/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dashboard/ui/dialog";
import { Topbar } from "@/components/platform-admin/Topbar";
import { VERTICAL_LABELS, timeAgo } from "@/components/platform-admin/format";
import { triggerPrint } from "@/lib/exportUtils";

interface Business { id: string; name: string }
interface PricingPlan { key: string; name: string }
interface Announcement {
  id: string; title: string; body: string; audience: string; vertical: string | null; planKey: string | null;
  channels: string[]; scheduledAt: string | null; sentAt: string | null; createdAt: string;
  recipientCount: number; readCount: number; clickCount: number;
}
interface Template { title: string; body: string }
interface PromoTemplate { id: string; key: string; title: string; subject: string; bodyHtml: string; category: string | null; updatedAt: string }
interface Unsubscribe { id: string; email: string; reason: string | null; unsubscribedAt: string }

const CHANNELS = [
  { key: "IN_APP", label: "In-app notification", icon: Bell },
  { key: "EMAIL", label: "Email to owner", icon: Mail },
  { key: "BANNER", label: "System announcement banner", icon: Megaphone },
];

export default function NotificationsCentrePage() {
  const { data: businesses } = useApi<{ data: Business[] }>("/api/admin/platform/businesses?pageSize=50");
  const { data: settings } = useApi<{ settings: { pricingPlans: PricingPlan[] } }>("/api/admin/platform/settings/");
  const { data: templates } = useApi<{ templates: Record<string, Template> }>("/api/admin/platform/notifications/templates");
  const { data: list, mutate } = useApi<{ data: Announcement[] }>("/api/admin/platform/notifications", { refreshInterval: 30000 });
  const { data: unsubs } = useApi<{ data: Unsubscribe[]; total: number }>("/api/admin/platform/notifications/unsubscribes");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("ALL");
  const [vertical, setVertical] = useState("MEDICAL");
  const [businessId, setBusinessId] = useState("");
  const [planKey, setPlanKey] = useState("");
  const [channels, setChannels] = useState<string[]>(["IN_APP"]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [sending, setSending] = useState(false);

  function toggleChannel(key: string) {
    setChannels((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
  }
  function applyTemplate(key: string) {
    const t = templates?.templates[key];
    if (!t) return;
    setTitle(t.title);
    setBody(t.body);
  }
  function applyPromoTemplate(t: PromoTemplate) {
    setTitle(t.subject);
    setBody(t.bodyHtml.replace(/<[^>]+>/g, ""));
    if (!channels.includes("EMAIL")) setChannels((prev) => [...prev, "EMAIL"]);
    toast.success(`Loaded "${t.title}" into the composer`);
  }

  async function send() {
    if (!title.trim() || !body.trim()) return toast.error("Title and message are required");
    if (audience === "BUSINESS" && !businessId) return toast.error("Choose a business");
    if (audience === "PLAN_TIER" && !planKey) return toast.error("Choose a plan");
    if (!channels.length) return toast.error("Choose at least one channel");
    setSending(true);
    try {
      await apiPost("/api/admin/platform/notifications", {
        title, body, audience,
        vertical: audience === "VERTICAL" ? vertical : undefined,
        businessId: audience === "BUSINESS" ? businessId : undefined,
        planKey: audience === "PLAN_TIER" ? planKey : undefined,
        channels,
        scheduledAt: scheduledAt || undefined,
      });
      toast.success(scheduledAt ? "Announcement scheduled" : "Announcement sent");
      setTitle(""); setBody(""); setScheduledAt("");
      mutate();
    } catch {
      toast.error("Failed to send announcement");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="-m-6">
      <Topbar title="Notifications Centre" refreshIntervalMs={30000} />
      <div className="space-y-6 p-6">
        <div className="no-print flex justify-end">
          <Button variant="outline" size="sm" onClick={() => triggerPrint("print")}><Printer className="h-4 w-4" /> Print</Button>
        </div>
        <Tabs defaultValue="compose">
          <TabsList>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="templates">Template Library</TabsTrigger>
          </TabsList>

          <TabsContent value="compose">
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Compose Announcement</CardTitle></CardHeader>
                <div className="space-y-4 p-4">
                  {templates && (
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(templates.templates).map((key) => (
                        <button key={key} onClick={() => applyTemplate(key)} className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#6B7280] hover:bg-[#F8F9FA] capitalize">
                          {key} template
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <Label>Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Scheduled maintenance tonight" />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="What businesses need to know…" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <Label>Audience</Label>
                      <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
                        <option value="ALL">All businesses</option>
                        <option value="VERTICAL">By vertical</option>
                        <option value="BUSINESS">Single business</option>
                        <option value="PLAN_TIER">By plan tier</option>
                      </Select>
                    </div>
                    {audience === "VERTICAL" && (
                      <div>
                        <Label>Vertical</Label>
                        <Select value={vertical} onChange={(e) => setVertical(e.target.value)}>
                          {Object.entries(VERTICAL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </Select>
                      </div>
                    )}
                    {audience === "BUSINESS" && (
                      <div>
                        <Label>Business</Label>
                        <Select value={businessId} onChange={(e) => setBusinessId(e.target.value)}>
                          <option value="">Choose…</option>
                          {businesses?.data.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </Select>
                      </div>
                    )}
                    {audience === "PLAN_TIER" && (
                      <div>
                        <Label>Plan</Label>
                        <Select value={planKey} onChange={(e) => setPlanKey(e.target.value)}>
                          <option value="">Choose…</option>
                          {settings?.settings.pricingPlans.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label>Schedule for later (optional)</Label>
                      <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <Label>Channels</Label>
                    <div className="flex flex-wrap gap-3">
                      {CHANNELS.map((c) => (
                        <button
                          key={c.key}
                          onClick={() => toggleChannel(c.key)}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                            channels.includes(c.key) ? "border-[#6366F1] bg-[#EEF2FF] text-[#6366F1]" : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA]"
                          }`}
                        >
                          <c.icon className="h-4 w-4" /> {c.label}
                        </button>
                      ))}
                    </div>
                    {channels.includes("EMAIL") && (
                      <p className="mt-2 text-xs text-[#9CA3AF]">Emails automatically include a &quot;View in dashboard&quot; tracked link and an unsubscribe footer — recipients who&apos;ve unsubscribed are skipped.</p>
                    )}
                  </div>

                  <Button onClick={send} disabled={sending}>
                    <Send className="h-4 w-4" /> {sending ? "Sending…" : scheduledAt ? "Schedule announcement" : "Send now"}
                  </Button>
                </div>
              </Card>

              <Card>
                <CardHeader><CardTitle>Sent & Scheduled Announcements</CardTitle></CardHeader>
                <Table>
                  <Thead><tr><Th>Title</Th><Th>Audience</Th><Th>Channels</Th><Th>Recipients</Th><Th>Open Rate</Th><Th>Clicks</Th><Th>Status</Th></tr></Thead>
                  <Tbody>
                    {list?.data.map((a) => (
                      <Tr key={a.id}>
                        <Td className="font-medium text-[#1F2937]">{a.title}</Td>
                        <Td>{a.audience === "VERTICAL" ? VERTICAL_LABELS[a.vertical || ""] || a.vertical : a.audience === "BUSINESS" ? "1 business" : a.audience === "PLAN_TIER" ? `Plan: ${a.planKey}` : "All"}</Td>
                        <Td>{a.channels.join(", ")}</Td>
                        <Td>{a.recipientCount}</Td>
                        <Td>{a.recipientCount ? `${Math.round((a.readCount / a.recipientCount) * 100)}%` : "—"}</Td>
                        <Td>{a.channels.includes("EMAIL") ? <span className="inline-flex items-center gap-1"><MousePointerClick className="h-3 w-3 text-[#9CA3AF]" />{a.clickCount}</span> : "—"}</Td>
                        <Td>
                          {a.sentAt ? <Badge tone="success">Sent {timeAgo(a.sentAt)}</Badge> : a.scheduledAt ? <Badge tone="warning">Scheduled</Badge> : <Badge tone="default">Pending</Badge>}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                {list && !list.data.length && <EmptyState title="No announcements yet" description="Compose one above to notify businesses." />}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><UserX className="h-4 w-4 text-[#9CA3AF]" /> Unsubscribed ({unsubs?.total ?? 0})</CardTitle>
                  <p className="mt-0.5 text-xs text-[#9CA3AF]">These addresses are skipped on future promotional sends. Invoices and transactional emails are never affected.</p>
                </CardHeader>
                <Table>
                  <Thead><tr><Th>Email</Th><Th>Reason</Th><Th>Unsubscribed</Th></tr></Thead>
                  <Tbody>
                    {unsubs?.data.map((u) => (
                      <Tr key={u.id}><Td>{u.email}</Td><Td className="text-xs text-[#6B7280]">{u.reason || "—"}</Td><Td className="text-xs text-[#6B7280]">{timeAgo(u.unsubscribedAt)}</Td></Tr>
                    ))}
                  </Tbody>
                </Table>
                {unsubs && !unsubs.data.length && <EmptyState title="No unsubscribes yet" />}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <PromoTemplateLibrary onUse={applyPromoTemplate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PromoTemplateLibrary({ onUse }: { onUse: (t: PromoTemplate) => void }) {
  const { data, mutate } = useApi<{ templates: PromoTemplate[] }>("/api/admin/platform/promo-templates");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PromoTemplate | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this template?")) return;
    try {
      await apiPost(`/api/admin/platform/promo-templates/${id}`, {}, "DELETE");
      toast.success("Deleted");
      mutate();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <CardTitle className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#8B5CF6]" /> Promo Email Templates</CardTitle>
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4" /> New Template</Button>
      </div>
      <Table>
        <Thead><tr><Th>Title</Th><Th>Subject</Th><Th>Category</Th><Th></Th></tr></Thead>
        <Tbody>
          {data?.templates.map((t) => (
            <Tr key={t.id}>
              <Td className="font-medium text-[#1F2937]">{t.title}</Td>
              <Td className="text-xs text-[#6B7280]">{t.subject}</Td>
              <Td>{t.category ? <Badge tone="purple">{t.category}</Badge> : "—"}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <button onClick={() => onUse(t)} className="text-xs font-medium text-[#6366F1] hover:underline">Use</button>
                  <button onClick={() => { setEditing(t); setDialogOpen(true); }} className="text-[#9CA3AF] hover:text-[#1F2937]"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(t.id)} className="text-[#9CA3AF] hover:text-[#EF4444]"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {data && !data.templates.length && <EmptyState title="No promo templates yet" description="Save reusable subject/body content here to reuse across future announcements." />}

      <PromoTemplateDialog open={dialogOpen} onClose={() => setDialogOpen(false)} editing={editing} onSaved={() => mutate()} />
    </Card>
  );
}

function PromoTemplateDialog({ open, onClose, editing, onSaved }: { open: boolean; onClose: () => void; editing: PromoTemplate | null; onSaved: () => void }) {
  const [key, setKey] = useState(editing?.key || "");
  const [title, setTitle] = useState(editing?.title || "");
  const [subject, setSubject] = useState(editing?.subject || "");
  const [bodyHtml, setBodyHtml] = useState(editing?.bodyHtml || "");
  const [category, setCategory] = useState(editing?.category || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title.trim() || !subject.trim() || !bodyHtml.trim() || (!editing && !key.trim())) {
      toast.error("Key, title, subject and body are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await apiPost(`/api/admin/platform/promo-templates/${editing.id}`, { title, subject, bodyHtml, category: category || undefined }, "PUT");
      } else {
        await apiPost("/api/admin/platform/promo-templates", { key, title, subject, bodyHtml, category: category || undefined }, "POST");
      }
      toast.success("Saved");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to save template");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit Template" : "New Promo Template"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          {!editing && (
            <div>
              <Label>Key (unique, e.g. &quot;spring-promo&quot;)</Label>
              <Input value={key} onChange={(e) => setKey(e.target.value)} />
            </div>
          )}
          <div>
            <Label>Title (internal name)</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Subject line</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <Label>Body (HTML)</Label>
            <Textarea value={bodyHtml} onChange={(e) => setBodyHtml(e.target.value)} rows={6} />
          </div>
          <div>
            <Label>Category (optional)</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. feature, seasonal, upsell" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
