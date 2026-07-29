"use client";

import { SITE_MAX_W, SITE_PX } from "@/components/ui/layout";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { NAV } from "./navData";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";

function ZLogo() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]">
      Z
    </span>
  );
}

export default function MainHeader() {
  const nav = useMemo(() => NAV, []);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;
    const applyScrollState = () => {
      setScrolled(window.scrollY > 50);
      ticking = false;
    };
    const onScroll = () => {
      setActiveKey(null);
      if (!ticking) {
        requestAnimationFrame(applyScrollState);
        ticking = true;
      }
    };
    applyScrollState();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveKey(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!activeKey) return;
      const el = headerRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setActiveKey(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [activeKey]);

  const activeItem = activeKey ? nav.find((n) => n.key === activeKey) : null;

  return (
    <>
      <div
        ref={headerRef}
        className={`fixed left-0 right-0 top-0 z-[60] border-b transition-[background-color,border-color] duration-200 ${
          scrolled ? "border-[#e2e8f0] bg-white/90 backdrop-blur-md" : "border-transparent bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className={`mx-auto flex h-16 w-full items-center justify-between ${SITE_MAX_W} ${SITE_PX}`}>
          <Link href="/" className="flex items-center gap-2">
            <ZLogo />
            <span className="text-base font-bold tracking-tight text-[#0f172a]">ZyncoAI</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const hasMega = !!item.mega;
              const isActive = activeKey === item.key;

              if (!hasMega) {
                return (
                  <Link
                    key={item.key}
                    href={item.href || "#"}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-[#475569] transition hover:bg-slate-100 hover:text-[#0f172a]"
                    onMouseEnter={() => setActiveKey(null)}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={item.key}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? "bg-slate-100 text-[#0f172a]" : "text-[#475569] hover:bg-slate-100 hover:text-[#0f172a]"}`}
                  onMouseEnter={() => setActiveKey(item.key)}
                  onClick={() => setActiveKey((k) => (k === item.key ? null : item.key))}
                >
                  {item.label}
                  <span className="ml-1 text-[#94a3b8]">▾</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/login" className="rounded-xl border border-[#e2e8f0] px-3.5 py-2 text-sm font-semibold text-[#0f172a] transition hover:bg-slate-50">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-1.5 rounded-xl bg-[image:linear-gradient(135deg,#6366f1,#06b6d4)] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition hover:opacity-90"
            >
              Start free trial <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/demo"
              className="relative inline-flex items-center gap-1.5 rounded-xl bg-[#10b981] px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <Phone className="h-3.5 w-3.5" /> Try Demo
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm font-semibold text-[#0f172a] hover:bg-slate-50"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>

        {activeItem?.mega ? <MegaMenu item={activeItem} onClose={() => setActiveKey(null)} /> : null}
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} nav={nav} />
    </>
  );
}
