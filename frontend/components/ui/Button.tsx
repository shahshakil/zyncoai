import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
};

export default function Button({ href, children, variant = "solid", className = "" }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-zynco-400 focus:ring-offset-2";
  const styles =
    variant === "solid"
      ? "bg-zynco-600 text-white hover:bg-zynco-700"
      : variant === "outline"
      ? "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
      : "text-zinc-700 hover:bg-zinc-100";

  if (!href) return <span className={`${base} ${styles} ${className}`}>{children}</span>;
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
