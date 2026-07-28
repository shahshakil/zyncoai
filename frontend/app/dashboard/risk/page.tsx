export default async function RiskPage() {
  const res = await fetch("/api/risk/summary", { cache: "no-store" });
  const data = await res.json();

  return (
    <div>
      <h1>AI Risk Monitoring</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
