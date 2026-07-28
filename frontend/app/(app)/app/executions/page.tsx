"use client";

import { useEffect, useState } from "react";

export default function ExecutionsPage() {
  const [runs, setRuns] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://api.zyncoai.com/executions", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRuns(data || []))
      .catch(() => setRuns([]));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Workflow Executions</h1>

      <div className="space-y-4">
        {runs.map((run, i) => (
          <div key={i} className="border rounded-xl p-4 bg-white">
            <div>ID: {run.id}</div>
            <div>Status: {run.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
