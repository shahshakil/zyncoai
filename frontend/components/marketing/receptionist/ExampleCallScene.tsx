"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";

type Beat = "caller" | "typing" | "ella";

// The "call-flow" motion for the Example Call block: the caller's line
// appears first, then a brief typing-indicator beat (Ella "responding"),
// then Ella's real scripted line — turn-taking, not both bubbles appearing
// at once. Runs once on scroll-into-view, never loops (a transcript replay
// would be distracting, not honest). CSS/framer-motion only, no video, no
// people — the content itself (callerLine/greeting) is unchanged, real,
// per-industry copy from ./data.
export function ExampleCallScene({ callerLine, greeting }: { callerLine: string; greeting: string }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [beat, setBeat] = useState<Beat>(reducedMotion ? "ella" : "caller");

  useEffect(() => {
    if (reducedMotion || !inView) return;
    const t1 = setTimeout(() => setBeat("typing"), 700);
    const t2 = setTimeout(() => setBeat("ella"), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reducedMotion, inView]);

  return (
    <div ref={ref} className="mt-4 space-y-3">
      <motion.div
        className="flex justify-end"
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={inView || reducedMotion ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="max-w-[80%] rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-[#0f172a]">
          <p className="mb-0.5 text-[10px] uppercase tracking-wide text-[#475569]">Caller</p>
          {callerLine}
        </div>
      </motion.div>

      <div className="flex justify-start">
        <AnimatePresence mode="wait">
          {beat === "typing" && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="flex items-center gap-1.5 rounded-2xl border border-[#c7d2fe] bg-[#eef2ff] px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[#6366f1]"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          {beat === "ella" && (
            <motion.div key="ella" initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>
              <div className="max-w-[80%] rounded-2xl border border-[#c7d2fe] bg-[#eef2ff] px-4 py-2.5 text-sm text-[#0f172a]">
                <p className="mb-0.5 text-[10px] uppercase tracking-wide text-[#4f46e5]">Ella</p>
                {greeting}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
