import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  thickness?: number; // px (1 = super thin)
  speedSec?: number; // seconds (lower = faster)
};

export default function NeonBorder({
  children,
  className = "",
  thickness = 1,
  speedSec = 6,
}: Props) {
  const t = Math.max(1, Math.floor(thickness));
  const d = Math.max(1, speedSec);

  return (
    <div
      className={`relative rounded-3xl ${className}`}
      style={
        {
          // CSS variables
          ["--nb-t" as any]: `${t}px`,
          ["--nb-d" as any]: `${d}s`,
        } as React.CSSProperties
      }
    >
      {/* base thin border */}
      <div className="absolute inset-0 rounded-3xl border border-white/10" />

      {/* moving thin neon line */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden">
        <div className="nb-line absolute w-[140px] bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
      </div>

      {/* content */}
      <div className="relative rounded-3xl bg-[#0A0E1A]/85 backdrop-blur-xl">
        {children}
      </div>

      <style jsx>{`
        .nb-line {
          height: var(--nb-t);
          top: 0;
          left: -140px;
          animation: nbMove var(--nb-d) linear infinite;
        }

        @keyframes nbMove {
          0% {
            top: 0;
            left: -140px;
          }
          25% {
            top: 0;
            left: calc(100% - 70px);
          }
          50% {
            top: calc(100% - var(--nb-t));
            left: calc(100% - 140px);
          }
          75% {
            top: calc(100% - var(--nb-t));
            left: -70px;
          }
          100% {
            top: 0;
            left: -140px;
          }
        }
      `}</style>
    </div>
  );
}
