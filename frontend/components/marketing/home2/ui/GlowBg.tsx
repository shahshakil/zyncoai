export default function GlowBg() {
  // Off-white base + subtle purple/pink glows (Zapier/HubSpot vibe but premium)
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#F7F5F2]" />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute left-[20%] top-[40%] h-[560px] w-[560px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-[10%] top-[60%] h-[520px] w-[520px] rounded-full bg-rose-500/10 blur-3xl" />
      </div>
    </>
  );
}
