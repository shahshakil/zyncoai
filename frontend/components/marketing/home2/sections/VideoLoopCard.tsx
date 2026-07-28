"use client";

type Props = {
  title: string;
  subtitle: string;
  src?: string;
  poster?: string;
};

export default function VideoLoopCard({ title, subtitle, src, poster }: Props) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a12] p-4 shadow-[0_30px_100px_rgba(76,29,149,0.20)]">
      <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#11111a,#090910)] p-4">
        <div className="mb-4">
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm text-zinc-400">{subtitle}</div>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0b0b12]">
          {src ? (
            <video
              className="h-[320px] w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={poster}
            >
              <source src={src} type="video/webm" />
            </video>
          ) : (
            <div className="relative h-[320px] w-full bg-[radial-gradient(circle_at_50%_30%,rgba(124,58,237,0.24),transparent_22%),linear-gradient(180deg,#12121b,#090910)]">
              <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-zinc-300">
                  Add WebM loop here
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
