"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useApi } from "@/lib/useApi";
import { timeAgo } from "./format";

interface TranscriptTurn {
  id: string;
  role: "CALLER" | "ASSISTANT" | "SYSTEM";
  text: string;
  seq: number;
  toolName?: string | null;
}
interface TranscriptData {
  call: { id: string; startedAt: string; fromNumber: string; outcome: string | null; business: { name: string } };
  turns: TranscriptTurn[];
}

export function TranscriptModal({ callId, onClose }: { callId: string | null; onClose: () => void }) {
  const { data } = useApi<TranscriptData>(callId ? `/api/admin/platform/calls/${callId}/transcript` : null);

  return (
    <AnimatePresence>
      {callId && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E5E7EB] p-4">
              <div>
                <h2 className="text-sm font-semibold text-[#1F2937]">Call transcript</h2>
                {data && <p className="text-xs text-[#9CA3AF]">{data.call.business.name} · {data.call.fromNumber} · {timeAgo(data.call.startedAt)}</p>}
              </div>
              <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#1F2937]"><X className="h-5 w-5" /></button>
            </div>
            <div className="max-h-[60vh] space-y-3 overflow-y-auto p-4">
              {!data && <p className="text-sm text-[#9CA3AF]">Loading…</p>}
              {data?.turns.map((t) => (
                <div key={t.id} className={`flex ${t.role === "CALLER" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      t.role === "CALLER" ? "bg-[#F8F9FA] text-[#1F2937]" : "bg-[#EEF2FF] text-[#1F2937]"
                    }`}
                  >
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">{t.role === "CALLER" ? "Caller" : "AI Receptionist"}</p>
                    {t.text}
                    {t.toolName && <p className="mt-1 text-[10px] text-[#9CA3AF]">tool: {t.toolName}</p>}
                  </div>
                </div>
              ))}
              {data && !data.turns.length && <p className="text-sm text-[#9CA3AF]">No turns recorded for this call.</p>}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
