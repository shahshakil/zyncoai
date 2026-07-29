"use client";
import { useCallback, useRef, useState } from "react";
import { Lock, X } from "lucide-react";

// Reusable "step-up" password confirmation for sensitive actions (remove
// staff, bulk PII export, etc). Usage:
//
//   const { requestReauth, modal } = useReauth();
//   ...
//   const token = await requestReauth();
//   if (!token) return; // user cancelled
//   await fetch(url, { headers: { "X-Reauth-Token": token } });
//   ...
//   return <>{modal}{/* rest of page */}</>;
//
// Calls POST /api/auth/reauth (existing endpoint — verifies the password,
// issues a 5-minute step:"reauth" token) and hands that token back to the
// caller to attach as X-Reauth-Token on the actual sensitive request.
export function useReauth() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const resolveRef = useRef<((token: string | null) => void) | null>(null);

  const requestReauth = useCallback((): Promise<string | null> => {
    setPassword("");
    setError(null);
    setOpen(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  function close(result: string | null) {
    setOpen(false);
    resolveRef.current?.(result);
    resolveRef.current = null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/auth/reauth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        setError("Incorrect password. Please try again.");
        setLoading(false);
        return;
      }
      close(data.reauth_token);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const modal = open ? (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0f172a]/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm your password"
      onClick={() => close(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)]"
      >
        <button
          onClick={() => close(null)}
          aria-label="Cancel"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#94a3b8] hover:bg-slate-100 hover:text-[#0f172a]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4f46e5]/10">
          <Lock className="h-5 w-5 text-[#4f46e5]" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-[#0f172a]">Please confirm your password to continue</h3>
        <p className="mt-1 text-sm text-[#475569]">This is a sensitive action — we need to make sure it&apos;s really you.</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm text-[#0f172a] outline-none focus:border-[#4f46e5]/50 focus:ring-4 focus:ring-[#4f46e5]/10"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => close(null)}
              className="flex-1 rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm font-semibold text-[#0f172a] hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !password}
              className="flex-1 rounded-xl bg-[image:linear-gradient(135deg,#4f46e5,#06b6d4)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Confirming…" : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return { requestReauth, modal };
}
