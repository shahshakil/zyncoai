// 2026-08-19 — see the matching comment on app/products/forms/page.tsx.
export const metadata = {
  title: "Zyns",
  description: "Build multi-step automations with triggers, actions, approvals, retries, and logs.",
  robots: { index: false, follow: false },
};

export default function ZynsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold">Zyns</h1>
        <p className="mt-3 text-zinc-300">
          Your Zaps equivalent. Build multi-step automations with triggers, actions, approvals, retries, and logs.
        </p>
      </div>
    </main>
  );
}
