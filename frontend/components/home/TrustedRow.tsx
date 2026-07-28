export default function TrustedRow() {
  const logos = ["Slack", "Google", "Microsoft", "Salesforce", "HubSpot", "Okta"];
  return (
    <section className="border-y border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Built for modern teams
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {logos.map((l) => (
            <div
              key={l}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-sm font-semibold text-zinc-700"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
