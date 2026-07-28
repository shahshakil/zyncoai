"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Workflow = {
  id: string;
  name: string;
  status?: string;
  createdAt?: string;
};

export default function WorkflowsPage() {
  const [items, setItems] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch("/workflows");
        setItems(Array.isArray(data) ? data : data.workflows || []);
      } catch (e: any) {
        setError(e.message || "Failed to load workflows");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-6">Loading workflows...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Workflows</h1>

      <div className="space-y-3">
        {items.map((wf) => (
          <div key={wf.id} className="border rounded-xl p-4">
            <div className="font-medium">{wf.name}</div>
            <div className="text-sm text-gray-500">
              Status: {wf.status || "unknown"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
