"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AppDashboardPage() {
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch("/auth/me");
        setMe(data);
      } catch (e: any) {
        setError(e.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <pre className="rounded-xl border p-4 text-sm overflow-auto">
        {JSON.stringify(me, null, 2)}
      </pre>
    </main>
  );
}
