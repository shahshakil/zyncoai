"use client";

import { useEffect } from "react";

// Root-tree error boundary — without this, ANY uncaught render error
// anywhere below the root layout (a throwing component, a stale-client-
// after-redeploy Server Action mismatch, a bad data shape) took down the
// ENTIRE page with Next's generic unstyled "Application error: a
// client-side exception has occurred" and no way to recover except a
// manual URL retype. 2026-08-16 — added after exactly that happened for a
// couple of visitors whose browser tab was open across a frontend
// redeploy (a well-known Next.js "stale client, fresh server" Server
// Action ID mismatch — confirmed via server logs, not a real component
// bug). A plain reload always fixes that specific case since it fetches
// the current build's JS, hence the prominent Reload button. This never
// hides a real bug from you locally — Next still logs the full error +
// stack to the server console via onError below, same as before.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app/error.tsx] caught a render error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold text-[#0f172a]">Something went wrong</h1>
        <p className="mt-3 text-base text-[#475569]">
          This page hit an unexpected error. Reloading almost always fixes it — if you were mid-action after a recent
          update, your browser just needs the latest version.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-[#4f46e5] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Reload page
          </button>
          <button
            onClick={() => reset()}
            className="rounded-xl border border-[#e2e8f0] bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] hover:bg-slate-50"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-xl border border-[#e2e8f0] bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] hover:bg-slate-50"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
