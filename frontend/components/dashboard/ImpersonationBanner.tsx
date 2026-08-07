"use client";
// "View as business" — the persistent, unmissable banner required by the
// impersonation spec. Owns its own countdown/mode/exit state independent of
// DashboardContext (which only carries the initial mint-time snapshot) —
// mode can change mid-session (edit-mode upgrade) and the session can end
// server-side (expiry, admin-panel revoke) without this page ever
// reloading, so this polls /api/business/impersonation-status itself
// rather than trusting a value that could go stale.
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldAlert, LogOut, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input, Label } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

const POLL_MS = 20_000;

function formatRemaining(sec: number): string {
  if (sec <= 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function ImpersonationBanner({
  sessionId,
  initialMode,
  businessName,
}: {
  sessionId: string;
  initialMode: "read" | "edit";
  businessName: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);
  const endedRef = useRef(false);

  async function poll() {
    if (endedRef.current) return;
    try {
      const r = await fetch("/api/business/impersonation-status", { credentials: "include" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.impersonating) {
        endedRef.current = true;
        setEnded(true);
        return;
      }
      setMode(data.mode);
      setRemainingSec(data.remainingSec);
    } catch {
      // Transient network hiccup — the next poll or the local tick keeps
      // going, this must never itself end the session on a flaky request.
    }
  }

  useEffect(() => {
    poll();
    const pollTimer = setInterval(poll, POLL_MS);
    const tickTimer = setInterval(() => {
      setRemainingSec((s) => (s === null ? s : Math.max(0, s - 1)));
    }, 1000);
    return () => {
      clearInterval(pollTimer);
      clearInterval(tickTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (remainingSec === 0 && !endedRef.current) {
      endedRef.current = true;
      setEnded(true);
    }
  }, [remainingSec]);

  async function submitEditMode() {
    if (!password) return;
    setEditBusy(true);
    setEditError(null);
    try {
      const r = await fetch("/api/admin/platform/impersonation/upgrade-to-edit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId, password }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.ok) {
        setEditError(data?.error === "invalid_password" ? "Wrong password." : "Could not enable edit mode.");
        return;
      }
      setMode("edit");
      setEditOpen(false);
      setPassword("");
      toast.success("Edit mode enabled");
    } catch {
      setEditError("Could not enable edit mode.");
    } finally {
      setEditBusy(false);
    }
  }

  async function exit() {
    setExiting(true);
    endedRef.current = true;
    try {
      await fetch(`/api/admin/platform/impersonation/${sessionId}/end`, { method: "POST", credentials: "include" }).catch(() => {});
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    } finally {
      window.close();
      // window.close() only works on a script-opened tab (true here — this
      // tab was opened via window.open from the admin drawer); if it's
      // still open a beat later (e.g. the admin navigated this tab
      // directly instead), fall back to sending them back to the admin
      // panel instead of leaving them stranded on a dead session.
      setTimeout(() => router.replace("/platform-admin/businesses"), 200);
    }
  }

  if (ended) {
    return (
      <div className="sticky top-0 z-[100] flex items-center justify-center gap-3 bg-slate-900 px-4 py-2.5 text-sm text-white">
        <ShieldAlert className="h-4 w-4 text-amber-400" />
        <span>This impersonation session has ended.</span>
        <Button size="sm" variant="secondary" onClick={() => router.replace("/platform-admin/businesses")}>
          Back to admin
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-[100] flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 bg-amber-500 px-4 py-2.5 text-sm font-medium text-amber-950">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span>
          Viewing as <strong>{businessName}</strong> (admin, {mode === "edit" ? "edit mode" : "read-only"})
          {remainingSec !== null && <> — {formatRemaining(remainingSec)} left</>}
        </span>
        {mode === "read" && (
          <Button size="sm" variant="secondary" className="h-7 px-2.5 text-xs" onClick={() => setEditOpen(true)}>
            <Lock className="h-3 w-3" /> Enable edit mode
          </Button>
        )}
        <Button size="sm" variant="secondary" className="h-7 px-2.5 text-xs" onClick={exit} disabled={exiting}>
          <LogOut className="h-3 w-3" /> {exiting ? "Exiting…" : "Exit"}
        </Button>
      </div>

      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) { setPassword(""); setEditError(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable edit mode</DialogTitle>
            <DialogDescription>
              Confirm your admin password to make changes as {businessName}. Every edit-mode action is tagged
              admin-performed in the audit trail.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Admin password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitEditMode()}
                autoFocus
              />
              {editError && <p className="mt-1.5 text-xs text-rose-600">{editError}</p>}
            </div>
            <Button className="w-full" onClick={submitEditMode} disabled={editBusy || !password}>
              {editBusy ? "Confirming…" : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
