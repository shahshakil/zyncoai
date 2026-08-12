"use client";

import { apiFetch } from "@/lib/api";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold">ZyncoAI</h1>
        <p className="text-white/70">
          Enterprise AI Automation Platform
        </p>

        <button
          onClick={async () => {
            try {
              const res = await apiFetch("/auth/signup", {
                method: "POST",
                body: JSON.stringify({
                  email: "test@zyncoai.com",
                  password: "Test123!",
                }),
              });
              console.log("Signup success", res);
              alert("Signup success!");
            } catch (e) {
              console.error(e);
              alert("Signup failed");
            }
          }}
          className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:opacity-95"
        >
          Create your workspace
        </button>
      </div>
    </main>
  );
}
