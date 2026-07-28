import { redirect } from "next/navigation";

type MeResponse = {
  ok?: boolean;
  user?: { id: string; email: string; role: "USER" | "ADMIN" };
};

async function getMe(): Promise<MeResponse | null> {
  try {
    // Your backend should be proxied via Next API or directly accessible.
    // Option A (recommended): call your Next API route /api/auth/me
    const r = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL ?? ""}/api/auth/me`, {
      cache: "no-store",
      credentials: "include",
    });

    if (!r.ok) return null;
    return (await r.json()) as MeResponse;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const me = await getMe();

  if (!me?.user) redirect("/login");
  if (me.user.role !== "ADMIN") redirect("/dashboard"); // not allowed

  return (
    <main className="min-h-screen bg-black text-slate-900 p-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-slate-600 mt-2">Welcome, {me.user.email}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-sm text-slate-500">Users</div>
          <div className="mt-2 text-3xl font-semibold">—</div>
          <div className="mt-2 text-xs text-slate-500">Connect real metrics later</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-sm text-slate-500">Workflows</div>
          <div className="mt-2 text-3xl font-semibold">—</div>
          <div className="mt-2 text-xs text-slate-500">Connect real metrics later</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-sm text-slate-500">Runs (24h)</div>
          <div className="mt-2 text-3xl font-semibold">—</div>
          <div className="mt-2 text-xs text-slate-500">Connect real metrics later</div>
        </div>
      </div>
    </main>
  );
}
