// 2026-08-19 — orphaned page, not linked from live nav/footer, same
// treatment as app/solutions/* (see sales-ops/page.tsx's comment) — real,
// non-fabricated content (matches the one real sentence below), deindexed
// rather than left with no metadata at all (was silently duplicating the
// homepage's title/description).
export const metadata = {
  title: "Forms | ZyncoAI",
  description: "Capture inputs that trigger workflows. Public form → workflow execution.",
  robots: { index: false, follow: false },
};

export default function FormsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold">Forms</h1>
        <p className="mt-3 text-zinc-300">
          Capture inputs that trigger workflows. Public form → workflow execution.
        </p>
      </div>
    </main>
  );
}
