export default async function CompliancePage() {
  const res = await fetch("/api/compliance/evidence", { cache: "no-store" });
  const data = await res.json();

  return (
    <div>
      <h1>Compliance Evidence Center</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
