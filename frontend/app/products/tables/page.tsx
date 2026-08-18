// 2026-08-19 — see the matching comment on app/products/forms/page.tsx.
export const metadata = {
  title: "Tables | ZyncoAI",
  description: "Store automation data, run lookups, and power workflows with structured records.",
  robots: { index: false, follow: false },
};

export default function TablesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold">Tables</h1>
        <p className="mt-3 text-zinc-300">
          Store automation data, run lookups, and power workflows with structured records.
        </p>
      </div>
    </main>
  );
}
