"use client";

import { SITE_MAX_W, SITE_PX } from "@/components/ui/layout";
import Link from "next/link";
import React from "react";
import type { NavItem } from "./navData";

export default function MegaMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  if (!item.mega) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-50" onMouseLeave={onClose}>
      <div className={`mx-auto w-full ${SITE_MAX_W} ${SITE_PX}`}>
        <div className="mt-3 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          <div className="grid gap-6 p-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <div className="text-xs uppercase tracking-wide text-[#94a3b8]">Explore</div>
              <div className="mt-2 text-2xl font-semibold text-[#0f172a]">{item.mega.title}</div>
              {item.mega.subtitle ? <p className="mt-2 text-sm leading-6 text-[#475569]">{item.mega.subtitle}</p> : null}
              {item.mega.cta ? (
                <Link
                  href={item.mega.cta.href}
                  onClick={onClose}
                  className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#10b981] px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                  {item.mega.cta.label}
                </Link>
              ) : null}
            </div>

            <div className="md:col-span-9">
              <div className="grid gap-8 md:grid-cols-3">
                {item.mega.columns.map((col) => (
                  <div key={col.heading}>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">{col.heading}</div>
                    <div className="mt-3 flex max-h-72 flex-col gap-0.5 overflow-y-auto pr-1">
                      {col.items.map((it) => (
                        <Link
                          key={it.href}
                          href={it.href}
                          onClick={onClose}
                          className="group rounded-lg border border-transparent p-2.5 transition hover:border-[#e2e8f0] hover:bg-slate-50"
                        >
                          <div className="text-sm font-medium text-[#0f172a]">{it.label}</div>
                          {it.description ? <div className="mt-0.5 text-xs leading-5 text-[#475569]">{it.description}</div> : null}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
    </div>
  );
}
