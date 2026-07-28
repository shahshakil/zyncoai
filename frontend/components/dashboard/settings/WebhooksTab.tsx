"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Copy } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input, Label } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const EVENTS = ["booking.created", "booking.cancelled", "booking.completed", "call.completed"];

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secretPreview?: string;
  secret?: string;
}

export function WebhooksTab() {
  const { data, isLoading, mutate } = useApi<{ webhooks: WebhookConfig[] }>("/api/business/webhooks");
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiPost<{ webhook: WebhookConfig }>("/api/business/webhooks", { url, events });
      setNewSecret(res.webhook.secret || null);
      setUrl("");
      setEvents([]);
      mutate();
    } catch {
      toast.error("Could not create webhook");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      await apiPost(`/api/business/webhooks/${id}`, undefined, "DELETE");
      mutate();
    } catch {
      toast.error("Could not delete webhook");
    }
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhooks</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add webhook</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-slate-400">Get an HMAC-signed POST request whenever a booking or call event happens.</p>
        {data?.webhooks.map((w) => (
          <div key={w.id} className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-900">{w.url}</p>
              <div className="flex items-center gap-2">
                <Badge tone={w.active ? "success" : "default"}>{w.active ? "active" : "paused"}</Badge>
                <Button variant="ghost" size="sm" onClick={() => remove(w.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {(w.events.length ? w.events : ["all events"]).map((e) => <Badge key={e}>{e}</Badge>)}
            </div>
            <p className="mt-2 text-xs text-slate-400">Secret: {w.secretPreview}</p>
          </div>
        ))}
        {!data?.webhooks.length && <p className="text-sm text-slate-400">No webhooks configured yet.</p>}
      </CardContent>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setNewSecret(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{newSecret ? "Webhook created" : "Add webhook"}</DialogTitle></DialogHeader>
          {newSecret ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-500">Save this signing secret now — it won&apos;t be shown again.</p>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <code className="flex-1 truncate text-xs text-emerald-400">{newSecret}</code>
                <button onClick={() => { navigator.clipboard.writeText(newSecret); toast.success("Copied"); }}><Copy className="h-4 w-4 text-slate-400" /></button>
              </div>
              <Button className="w-full" onClick={() => { setOpen(false); setNewSecret(null); }}>Done</Button>
            </div>
          ) : (
            <form onSubmit={create} className="space-y-3">
              <div>
                <Label>URL</Label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-system.com/webhooks/zynco" required />
              </div>
              <div>
                <Label>Events (leave empty for all)</Label>
                <div className="space-y-1.5">
                  {EVENTS.map((ev) => (
                    <label key={ev} className="flex items-center gap-2 text-sm text-slate-500">
                      <input type="checkbox" checked={events.includes(ev)} onChange={(e) => setEvents((arr) => (e.target.checked ? [...arr, ev] : arr.filter((x) => x !== ev)))} />
                      {ev}
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Creating…" : "Create webhook"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
