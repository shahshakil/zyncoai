import React from "react";
import Link from "next/link";
import NeonBorder from "./NeonBorder";

type Props = {
  title: string;
  subtitle: string;
  sideTitle: string;
  sideSubtitle: string;
  children: React.ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  sideTitle,
  sideSubtitle,
  children,
}: Props) {
  return (
    <div className="min-h-screen w-full bg-[#070A12] text-white">
      {/* background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-40 bg-fuchsia-600/30" />
        <div className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full blur-3xl opacity-35 bg-cyan-400/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent,rgba(0,0,0,0.25))]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-stretch px-4 py-10">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl lg:grid-cols-2">
          {/* LEFT: form */}
          <div className="relative p-6 sm:p-10">
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
              >
                <span className="text-lg leading-none">←</span>
                 Back to home
                </Link>
                </div>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-2 text-sm text-white/60">{subtitle}</p>
            </div>

            {/* THIN moving border lives here */}
            <NeonBorder thickness={1} speedSec={6} className="rounded-3xl">
              <div className="p-6 sm:p-8">{children}</div>
            </NeonBorder>

            <p className="mt-6 text-xs text-white/40">
              Protected by rate limits, secure cookies, and audit-friendly logs.
            </p>
          </div>

          {/* RIGHT: marketing (clean, no boxes, no “Secure Workspace” badge) */}
          <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c1022] via-[#11183a] to-[#0a0f1f]" />
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_30%_10%,rgba(217,70,239,0.25),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.20),transparent_45%)]" />

            {/* top-right brand */}
            <div className="absolute top-8 right-10 text-lg font-semibold tracking-wide">
              <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                ZyncoAI
              </span>
            </div>

            <div className="relative max-w-lg px-12">
              <h2 className="text-4xl font-semibold leading-tight">
                {sideTitle}
              </h2>

              <p className="mt-6 text-white/60 text-sm leading-relaxed">
                {sideSubtitle}
              </p>

              <div className="mt-10 text-xs text-white/40">
                Built for reliability: retries, observability, and secure automation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
