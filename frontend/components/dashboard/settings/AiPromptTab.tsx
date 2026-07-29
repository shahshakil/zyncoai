"use client";
// Phase 9 — Prompt Version Control. OWNER/ADMIN only: this text is appended
// to the live AI's system prompt and reaches every caller from now on.
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { History, RotateCcw, Sparkles } from "lucide-react";
import { useApi, apiPost } from "@/lib/useApi";
import { useDashboard } from "@/components/dashboard/BusinessContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/ui/card";
import { Textarea, Label } from "@/components/dashboard/ui/input";
import { Button } from "@/components/dashboard/ui/button";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { EmptyState } from "@/components/dashboard/ui/table";
import { CallRecordingSection } from "./CallRecordingSection";

interface PromptVersionsPayload {
  ok: boolean;
  currentContent: string;
  versions: { version: number; content: string; editedBy: string | null; restoredFromVersion: number | null; createdAt: string }[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-AU", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export function AiPromptTab() {
  const { role } = useDashboard();
  const { data: resp, isLoading, mutate } = useApi<PromptVersionsPayload>("/api/business/prompt-versions");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [rollingBack, setRollingBack] = useState<number | null>(null);

  useEffect(() => {
    if (resp) setContent(resp.currentContent);
  }, [resp]);

  if (role !== "OWNER" && role !== "ADMIN") {
    return (
      <Card>
        <CardHeader><CardTitle>AI Prompt</CardTitle></CardHeader>
        <CardContent>
          <EmptyState title="Owner/Admin only" description="Ask an owner or admin to change what the AI receptionist says." />
        </CardContent>
      </Card>
    );
  }

  const dirty = resp ? content.trim() !== resp.currentContent.trim() : false;

  async function save() {
    setSaving(true);
    try {
      await apiPost("/api/business/prompt-versions", { content });
      toast.success("Saved — this now applies to new calls");
      mutate();
    } catch (e: any) {
      toast.error(e?.message === "no_changes" ? "No changes to save" : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function rollback(version: number) {
    setRollingBack(version);
    try {
      await apiPost(`/api/business/prompt-versions/${version}/rollback`);
      toast.success(`Restored version ${version}`);
      mutate();
    } catch {
      toast.error("Could not restore that version");
    } finally {
      setRollingBack(null);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[var(--accent,#4f46e5)]" />
            <CardTitle>AI Instructions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-500">
            Add anything you want the AI receptionist to always keep in mind — house policies, phrasing preferences, things to mention. This is added on top of the built-in behavior; it can never override safety rules (emergencies, no medical advice).
          </p>
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <div>
                <Label htmlFor="customInstructions">Custom instructions</Label>
                <Textarea
                  id="customInstructions"
                  rows={6}
                  maxLength={4000}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Always mention our free parking out back. Refer to the practice as 'the clinic', never 'the office'."
                />
                <p className="mt-1 text-xs text-slate-400">{content.length}/4000</p>
              </div>
              <Button onClick={save} disabled={saving || !dirty}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <History className="h-4 w-4 text-slate-500" />
            <CardTitle>Version History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : !resp?.versions.length ? (
            <EmptyState title="No changes yet" description="Every save creates a version you can come back to." />
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {resp.versions.map((v, i) => (
                <div key={v.version} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-medium text-slate-900">Version {v.version}</span>
                      {v.restoredFromVersion != null && (
                        <span className="ml-2 text-xs text-slate-400">(restored from v{v.restoredFromVersion})</span>
                      )}
                      <p className="text-xs text-slate-400">{formatDate(v.createdAt)}{v.editedBy ? ` · ${v.editedBy}` : ""}</p>
                    </div>
                    {i !== 0 && (
                      <Button size="sm" variant="outline" disabled={rollingBack === v.version} onClick={() => rollback(v.version)}>
                        <RotateCcw className="h-3.5 w-3.5" /> {rollingBack === v.version ? "Restoring…" : "Restore"}
                      </Button>
                    )}
                  </div>
                  {v.content && <p className="mt-2 whitespace-pre-wrap text-xs text-slate-600">{v.content}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CallRecordingSection />
    </div>
  );
}
