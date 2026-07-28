"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  title?: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function AnimationShell({
  title,
  eyebrow,
  description,
  children,
  className,
}: Props) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-[0_20px_60px_rgba(20,20,20,0.06)]",
        className
      )}
    >
      {(eyebrow || title || description) && (
        <div className="border-b border-zinc-200/80 px-6 py-5 md:px-8">
          {eyebrow ? (
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-600">
              {eyebrow}
            </div>
          ) : null}

          {title ? (
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
              {title}
            </h3>
          ) : null}

          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      )}

      <div className="relative">{children}</div>
    </section>
  );
}
