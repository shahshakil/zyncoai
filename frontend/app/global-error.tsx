"use client";

import { useEffect } from "react";

// Catches errors that occur in the ROOT layout itself (app/error.tsx can't
// — a regular error.tsx renders INSIDE the root layout, so it can't
// recover from a failure in that layout's own render). Must render its own
// <html>/<body> since it fully replaces the root layout when active — kept
// deliberately dependency-free (no font import, no shared components) so
// it can't itself fail to render for the same reason the root layout did.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app/global-error.tsx] caught a root-layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: "#0f172a" }}>Something went wrong</h1>
            <p style={{ marginTop: 12, fontSize: 16, color: "#475569" }}>
              Reloading almost always fixes this.
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  borderRadius: 12,
                  background: "#4f46e5",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "12px 20px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Reload page
              </button>
              <button
                onClick={() => reset()}
                style={{
                  borderRadius: 12,
                  background: "white",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "12px 20px",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
