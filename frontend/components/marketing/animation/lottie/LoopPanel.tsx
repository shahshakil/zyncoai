"use client";

import Lottie from "lottie-react";

type Props = {
  animationData?: object;
  title: string;
  desc?: string;
};

export default function LoopPanel({ animationData, title, desc }: Props) {
  return (
    <div className="rounded-[26px] border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="rounded-[22px] bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),rgba(255,255,255,0.98)_70%)] p-4">
        <div className="flex aspect-[16/10] items-center justify-center rounded-[18px] border border-zinc-200 bg-[#fcfbf8]">
          {animationData ? (
            <Lottie animationData={animationData} loop />
          ) : (
            <div className="text-sm text-zinc-500">Lottie animation goes here</div>
          )}
        </div>
      </div>

      <h4 className="mt-4 text-lg font-semibold text-zinc-950">{title}</h4>
      {desc ? <p className="mt-1 text-sm text-zinc-600">{desc}</p> : null}
    </div>
  );
}
