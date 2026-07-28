"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Connector = {
  id?: string;
  key?: string;
  name?: string;
};

export default function ConnectorsPage() {
  const [items, setItems] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch("/api/connectors");
        setItems(Array.isArray(data) ? data : data.connectors || []);
      } catch (e: any) {
        setError(e.message || "Failed to load connectors");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-6">Loading connectors...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Connectors</h1>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((c, i) => (
          <div key={c.id || c.key || i} className="border rounded-xl p-4">
            <div className="font-medium">{c.name || c.key || "Connector"}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
