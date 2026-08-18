"use client";
import { useState } from "react";
import { mutate as globalMutate } from "swr";
import { Inbox, Send, Loader2, FileText, Plus, Pencil, Trash2, X, Check, Mail, Sparkles, Languages, RefreshCw } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { EmptyState } from "@/components/dashboard/ui/table";
import { Topbar } from "@/components/platform-admin/Topbar";

type Status = "NEW" | "REPLIED" | "CLOSED";
type IntentTag = "sales" | "support" | "billing" | "urgent" | "spam-likely";

interface MessageListItem {
  id: string;
  reference: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  source: "contact_form" | "widget";
  status: Status;
  createdAt: string;
  updatedAt: string;
  _count: { replies: number };
  aiIntentTag: IntentTag | null;
}

interface Reply {
  id: string;
  body: string;
  createdAt: string;
  repliedByAdmin: { name: string | null; email: string } | null;
}

interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  dataUrl: string;
}

interface ThreadDetail extends MessageListItem {
  replies: Reply[];
  attachments: Attachment[];
  aiDraftReply: string | null;
  aiDraftReplyTranslated: string | null;
  aiDetectedLanguage: string | null;
  aiTranslatedMessage: string | null;
  aiProcessedAt: string | null;
}

interface Template {
  id: string;
  title: string;
  body: string;
}

const STATUS_STYLE: Record<Status, string> = {
  NEW: "bg-[#EEF2FF] text-[#4338CA]",
  REPLIED: "bg-[#ECFDF5] text-[#047857]",
  CLOSED: "bg-[#F3F4F6] text-[#6B7280]",
};

const INTENT_TAG_STYLE: Record<IntentTag, string> = {
  sales: "bg-[#EEF2FF] text-[#4338CA]",
  support: "bg-[#EFF6FF] text-[#1D4ED8]",
  billing: "bg-[#FFFBEB] text-[#B45309]",
  urgent: "bg-[#FEF2F2] text-[#B91C1C]",
  "spam-likely": "bg-[#F3F4F6] text-[#6B7280]",
};

function IntentTagBadge({ tag }: { tag: IntentTag | null }) {
  if (!tag) return null;
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${INTENT_TAG_STYLE[tag]}`}>{tag.toUpperCase()}</span>;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function ThreadList({
  filter,
  setFilter,
  selectedId,
  setSelectedId,
}: {
  filter: Status | "ALL";
  setFilter: (f: Status | "ALL") => void;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
}) {
  const { data } = useApi<{ messages: MessageListItem[] }>(`/api/admin/platform/support${filter === "ALL" ? "" : `?status=${filter}`}`, { refreshInterval: 20000 });
  const messages = data?.messages || [];

  return (
    <Card className="flex h-[70vh] flex-col overflow-hidden">
      <div className="flex gap-1 border-b border-slate-100 p-3">
        {(["ALL", "NEW", "REPLIED", "CLOSED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${filter === f ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#6B7280] hover:bg-[#F8F9FA]"}`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && <EmptyState title="No messages" />}
        {messages.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedId(m.id)}
            className={`block w-full border-b border-slate-50 px-4 py-3 text-left transition hover:bg-[#F8F9FA] ${selectedId === m.id ? "bg-[#EEF2FF]" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-[#1F2937]">{m.name}</span>
              <span className="flex shrink-0 items-center gap-1">
                <IntentTagBadge tag={m.aiIntentTag} />
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[m.status]}`}>{m.status}</span>
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-[#6B7280]">
              <span className="font-mono font-semibold text-[#9CA3AF]">{m.reference}</span> · {m.topic} · {m.source === "widget" ? "Help widget" : "Contact form"}
            </p>
            <p className="mt-1 truncate text-xs text-[#9CA3AF]">{m.message}</p>
            <p className="mt-1 text-[10px] text-[#9CA3AF]">{timeAgo(m.updatedAt)}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}

function ThreadDetailPanel({ id, templates, onChanged }: { id: string; templates: Template[]; onChanged: () => void }) {
  const { data, mutate } = useApi<{ message: ThreadDetail }>(`/api/admin/platform/support/${id}`);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const message = data?.message;

  async function sendReply() {
    if (!body.trim()) return;
    setSending(true);
    setError(null);
    try {
      await apiPost(`/api/admin/platform/support/${id}/reply`, { body: body.trim() }, "POST");
      setBody("");
      await mutate();
      onChanged();
    } catch {
      setError("Couldn't send that email — nothing was recorded. Try again.");
    } finally {
      setSending(false);
    }
  }

  async function setStatus(status: Status) {
    await apiPost(`/api/admin/platform/support/${id}/status`, { status }, "PATCH");
    await mutate();
    onChanged();
  }

  function insertDraft(draft: string) {
    setBody((prev) => (prev ? `${prev}\n\n${draft}` : draft));
  }

  async function regenerateAssist() {
    setRegenerating(true);
    try {
      await apiPost(`/api/admin/platform/support/${id}/ai-assist`, undefined, "POST");
      await mutate();
    } finally {
      setRegenerating(false);
    }
  }

  if (!message) {
    return (
      <Card className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[#9CA3AF]" />
      </Card>
    );
  }

  return (
    <Card className="flex h-[70vh] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[#1F2937]">
            {message.name} <span className="font-normal text-[#9CA3AF]">&lt;{message.email}&gt;</span>
          </p>
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B7280]">
            <span className="font-mono font-semibold text-[#6B7280]">{message.reference}</span> · {message.topic} · {message.source === "widget" ? "Help widget" : "Contact form"} · {new Date(message.createdAt).toLocaleString("en-AU")}
            <IntentTagBadge tag={message.aiIntentTag} />
          </p>
        </div>
        <div className="flex gap-1.5">
          {(["NEW", "REPLIED", "CLOSED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${message.status === s ? STATUS_STYLE[s] : "text-[#9CA3AF] hover:bg-[#F8F9FA]"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <div className="rounded-xl border border-slate-100 bg-[#F8F9FA] p-4">
          <p className="whitespace-pre-wrap text-sm text-[#1F2937]">{message.message}</p>
          {message.aiTranslatedMessage && (
            <div className="mt-3 border-t border-slate-200 pt-3">
              <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]">
                <Languages className="h-3 w-3" /> English translation ({message.aiDetectedLanguage || "auto-detected"}, machine translated)
              </p>
              <p className="whitespace-pre-wrap text-sm text-[#1F2937]">{message.aiTranslatedMessage}</p>
            </div>
          )}
          {message.attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200 pt-3">
              {message.attachments.map((a) => (
                <a key={a.id} href={a.dataUrl} download={a.filename} className="group block" title={`${a.filename} (${Math.round(a.sizeBytes / 1024)}KB) — click to download`}>
                  <img src={a.dataUrl} alt={a.filename} className="h-20 w-20 rounded-lg border border-slate-200 object-cover transition group-hover:opacity-80" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#E9D5FF] bg-[#FAF5FF] p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-[#7E22CE]">
              <Sparkles className="h-3.5 w-3.5" /> AI suggested reply
            </p>
            <button
              onClick={regenerateAssist}
              disabled={regenerating}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#7E22CE] hover:bg-white disabled:opacity-40"
            >
              <RefreshCw className={`h-3 w-3 ${regenerating ? "animate-spin" : ""}`} /> {message.aiProcessedAt ? "Regenerate" : "Generate"}
            </button>
          </div>

          {!message.aiProcessedAt && !regenerating && <p className="text-xs text-[#9CA3AF]">Not generated yet — this thread works fine without it.</p>}
          {regenerating && !message.aiDraftReply && <p className="text-xs text-[#9CA3AF]">Generating…</p>}

          {message.aiDraftReply && (
            <div className="rounded-lg border border-[#E9D5FF] bg-white p-3">
              <p className="whitespace-pre-wrap text-sm text-[#1F2937]">{message.aiDraftReply}</p>
              <button
                onClick={() => insertDraft(message.aiDraftReply!)}
                className="mt-2 rounded-lg bg-[#7E22CE] px-2.5 py-1 text-[11px] font-semibold text-white hover:opacity-90"
              >
                Use this draft
              </button>
            </div>
          )}

          {message.aiDraftReplyTranslated && (
            <div className="mt-2 rounded-lg border border-[#E9D5FF] bg-white p-3">
              <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]">
                <Languages className="h-3 w-3" /> Machine translated ({message.aiDetectedLanguage}) — verify before sending
              </p>
              <p className="whitespace-pre-wrap text-sm text-[#1F2937]">{message.aiDraftReplyTranslated}</p>
              <button
                onClick={() => insertDraft(message.aiDraftReplyTranslated!)}
                className="mt-2 rounded-lg bg-[#7E22CE] px-2.5 py-1 text-[11px] font-semibold text-white hover:opacity-90"
              >
                Use this draft
              </button>
            </div>
          )}

          <p className="mt-2 text-[10px] text-[#9CA3AF]">Grounded only in our verified FAQ/Help content — never auto-sent. Review and edit before sending.</p>
        </div>

        {message.replies.map((r) => (
          <div key={r.id} className="rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
            <p className="mb-1.5 text-xs font-semibold text-[#1D4ED8]">
              Reply from {r.repliedByAdmin?.name || r.repliedByAdmin?.email || "ZyncoAI Support"} · {new Date(r.createdAt).toLocaleString("en-AU")}
            </p>
            <p className="whitespace-pre-wrap text-sm text-[#1F2937]">{r.body}</p>
          </div>
        ))}

        {message.replies.length > 0 && (
          <p className="text-xs italic text-[#9CA3AF]">
            Sent from support@zyncoai.com. Any reply the sender sends lands back in the support@ inbox (Zoho) — continued conversation from here lives in email, not this thread.
          </p>
        )}
      </div>

      <div className="border-t border-slate-100 p-4">
        {templates.length > 0 && (
          <select
            onChange={(e) => {
              const t = templates.find((t) => t.id === e.target.value);
              if (t) setBody((prev) => (prev ? `${prev}\n\n${t.body}` : t.body));
              e.target.value = "";
            }}
            defaultValue=""
            className="mb-2 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#6B7280] outline-none focus:border-[#6366F1]"
          >
            <option value="" disabled>
              Insert a saved reply template…
            </option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        )}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="Write a reply — sends from support@zyncoai.com"
          className="w-full rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
        />
        {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
        <div className="mt-2 flex justify-end">
          <button
            onClick={sendReply}
            disabled={sending || !body.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-[#0f172a] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Send reply
          </button>
        </div>
      </div>
    </Card>
  );
}

function TemplatesTab() {
  const { data, mutate } = useApi<{ templates: Template[] }>("/api/admin/platform/support-templates");
  const templates = data?.templates || [];
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit(t: Template) {
    setEditingId(t.id);
    setTitle(t.title);
    setBody(t.body);
  }
  function startNew() {
    setEditingId("new");
    setTitle("");
    setBody("");
  }
  function cancel() {
    setEditingId(null);
  }

  async function save() {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    try {
      if (editingId === "new") {
        await apiPost("/api/admin/platform/support-templates", { title: title.trim(), body: body.trim() }, "POST");
      } else if (editingId) {
        await apiPost(`/api/admin/platform/support-templates/${editingId}`, { title: title.trim(), body: body.trim() }, "PATCH");
      }
      mutate();
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    await apiPost(`/api/admin/platform/support-templates/${id}`, undefined, "DELETE");
    mutate();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#6366F1]" /> Saved reply templates
        </CardTitle>
        {editingId === null && (
          <button onClick={startNew} className="flex items-center gap-1.5 rounded-lg bg-[#0f172a] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
            <Plus className="h-3.5 w-3.5" /> New template
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {editingId !== null && (
          <div className="rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g. Pricing question)"
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#6366F1]"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Reply body"
              className="mt-2 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#6366F1]"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button onClick={cancel} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:bg-white">
                <X className="h-3.5 w-3.5" /> Cancel
              </button>
              <button onClick={save} disabled={saving} className="flex items-center gap-1 rounded-lg bg-[#0f172a] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save
              </button>
            </div>
          </div>
        )}

        {templates.length === 0 && editingId === null && <EmptyState title="No templates yet" />}
        {templates.map((t) => (
          <div key={t.id} className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1F2937]">{t.title}</p>
              <div className="flex gap-1">
                <button onClick={() => startEdit(t)} className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F8F9FA]">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => remove(t.id)} className="rounded-lg p-1.5 text-[#6B7280] hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-1.5 whitespace-pre-wrap text-xs text-[#6B7280]">{t.body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function SupportInboxPage() {
  const [tab, setTab] = useState<"inbox" | "templates">("inbox");
  const [filter, setFilter] = useState<Status | "ALL">("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: templatesData } = useApi<{ templates: Template[] }>("/api/admin/platform/support-templates");

  function refreshList() {
    (["", "?status=NEW", "?status=REPLIED", "?status=CLOSED"] as const).forEach((suffix) => globalMutate(`/api/admin/platform/support${suffix}`));
  }

  return (
    <div className="-m-6">
      <Topbar title="Support Inbox" />
      <div className="space-y-4 p-6">
        <div className="flex gap-1 rounded-xl border border-slate-100 bg-white p-1 w-fit">
          <button
            onClick={() => setTab("inbox")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${tab === "inbox" ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#6B7280]"}`}
          >
            <Inbox className="h-3.5 w-3.5" /> Inbox
          </button>
          <button
            onClick={() => setTab("templates")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${tab === "templates" ? "bg-[#EEF2FF] text-[#4338CA]" : "text-[#6B7280]"}`}
          >
            <FileText className="h-3.5 w-3.5" /> Templates
          </button>
        </div>

        {tab === "inbox" ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[22rem_1fr]">
            <ThreadList filter={filter} setFilter={setFilter} selectedId={selectedId} setSelectedId={setSelectedId} />
            {selectedId ? (
              <ThreadDetailPanel key={selectedId} id={selectedId} templates={templatesData?.templates || []} onChanged={refreshList} />
            ) : (
              <Card className="flex h-[70vh] items-center justify-center text-center">
                <div>
                  <Mail className="mx-auto h-8 w-8 text-[#D1D5DB]" />
                  <p className="mt-2 text-sm text-[#9CA3AF]">Select a message to view the thread</p>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <TemplatesTab />
        )}
      </div>
    </div>
  );
}
