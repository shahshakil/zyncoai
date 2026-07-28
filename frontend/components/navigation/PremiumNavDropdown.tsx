"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
  label: string;
  href: string;
  desc?: string;
};

type Props = {
  open: boolean;
  title: string;
  items: NavItem[];
};

export default function PremiumNavDropdown({ open, title, items }: Props) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="absolute left-1/2 top-full z-50 mt-4 w-[460px] -translate-x-1/2 overflow-hidden rounded-[28px] border border-zinc-200 bg-white/95 p-3 shadow-[0_30px_90px_rgba(15,23,42,0.16)] backdrop-blur-2xl"
        >
          <div className="rounded-[22px] bg-[linear-gradient(180deg,#ffffff,#fbfbfd)] p-3">
            <div className="px-3 pb-3 pt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">
              {title}
            </div>
            <div className="grid gap-2">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group rounded-[20px] border border-transparent px-4 py-3 transition hover:border-zinc-200 hover:bg-zinc-50"
                >
                  <div className="text-sm font-semibold text-zinc-950">{item.label}</div>
                  {item.desc ? (
                    <div className="mt-1 text-sm leading-6 text-zinc-600">{item.desc}</div>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
