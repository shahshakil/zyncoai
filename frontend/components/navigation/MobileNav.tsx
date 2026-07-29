"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import type { NavItem } from "./navData";

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={`transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      ▾
    </span>
  );
}

export default function MobileNav({
  open,
  onClose,
  nav,
}: {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const topLevel = useMemo(() => nav, [nav]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* blur backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* right drawer */}
      <div className="absolute right-0 top-0 h-full w-[92%] max-w-sm overflow-hidden border-l border-[#e2e8f0] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-4">
          <div className="text-sm font-semibold text-[#0f172a]">ZyncoAI</div>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-[#475569] hover:bg-slate-100 hover:text-[#0f172a]"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="h-[calc(100%-140px)] overflow-y-auto px-3 py-3">
          {topLevel.map((item) => {
            const hasMega = !!item.mega;
            const isOpen = expanded === item.key;

            return (
              <div key={item.key} className="border-b border-[#e2e8f0]">
                {!hasMega ? (
                  <Link
                    href={item.href || "#"}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-4 text-[17px] font-semibold text-[#0f172a]"
                  >
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setExpanded(isOpen ? null : item.key)}
                      className="flex w-full items-center justify-between px-3 py-4 text-left text-[17px] font-semibold text-[#0f172a]"
                    >
                      <span>{item.label}</span>
                      <Chevron open={isOpen} />
                    </button>

                    <div
                      className={`grid gap-2 overflow-hidden px-3 pb-4 transition-[max-height,opacity] duration-200 ${
                        isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.mega?.columns.flatMap((c) =>
                        c.items.map((it) => (
                          <Link
                            key={it.href}
                            href={it.href}
                            onClick={onClose}
                            className="rounded-xl border border-[#e2e8f0] bg-slate-50 px-3 py-3"
                          >
                            <div className="text-sm font-semibold text-[#0f172a]">
                              {it.label}
                            </div>
                            {it.description ? (
                              <div className="mt-1 text-xs text-[#94a3b8]">
                                {it.description}
                              </div>
                            ) : null}
                          </Link>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <div className="mt-4 grid gap-2 px-2">
            <Link
              href="/login"
              onClick={onClose}
              className="rounded-xl border border-[#e2e8f0] bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-[#0f172a]"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* sticky bottom CTA */}
        <div className="border-t border-[#e2e8f0] p-4">
          <Link
            href="/signup"
            onClick={onClose}
            className="block w-full rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-4 py-3 text-center text-sm font-extrabold text-white"
          >
            Start free trial
          </Link>
          <Link
            href="/demo"
            onClick={onClose}
            className="mt-2 block w-full rounded-xl bg-[#10b981] px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Try Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
