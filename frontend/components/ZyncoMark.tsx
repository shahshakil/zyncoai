import * as React from "react";

type Props = {
  className?: string;
  title?: string;
};

export default function ZyncoMark({ className, title = "ZyncoAI" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Outer glass */}
      <path
        d="M10 12.5c0-1.38 1.12-2.5 2.5-2.5h17.2c1.1 0 2.16.44 2.94 1.22l2.96 2.96A4.16 4.16 0 0 1 38.8 17v18.5c0 1.38-1.12 2.5-2.5 2.5H12.5A2.5 2.5 0 0 1 10 35.5v-23Z"
        stroke="rgba(255,255,255,.22)"
        strokeWidth="1.2"
      />

      {/* Gradient core */}
      <defs>
        <linearGradient id="zynco-g" x1="10" y1="10" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#D946EF" stopOpacity="0.90" />
          <stop offset="1" stopColor="#38BDF8" stopOpacity="0.90" />
        </linearGradient>

        <radialGradient id="zynco-r" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
          gradientTransform="translate(20 18) rotate(55) scale(28 22)">
          <stop stopColor="rgba(255,255,255,.25)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* "Z" lightning / flow mark */}
      <path
        d="M16.2 18.2h15.5c.7 0 1.05.85.5 1.3L22.6 29.1h9.2c.8 0 1.1 1 .42 1.45l-10.2 6.6c-.78.5-1.78-.2-1.52-1.1l1.9-6.1h-7.7c-.72 0-1.08-.88-.52-1.36l9.1-7.9h-7.1c-.9 0-1.22-1.2-.46-1.7l6.8-4.6c.75-.5 1.7.1 1.55.97l-.45 2.7h-7.5Z"
        fill="url(#zynco-g)"
      />

      {/* Gloss highlight */}
      <path
        d="M12 14.5c.2-1.1 1.15-2 2.3-2h12.2c.95 0 1.4 1.15.7 1.8l-3.6 3.3c-.4.35-.92.55-1.45.55H13.1c-.75 0-1.25-.75-1.1-1.6Z"
        fill="url(#zynco-r)"
      />
    </svg>
  );
}
