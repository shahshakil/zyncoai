// k-anonymity check against the HaveIBeenPwned Pwned Passwords range API.
// Only the first 5 hex chars of the password's SHA-1 hash ever leave the
// browser — the full password/hash is never sent anywhere. Designed for
// direct unauthenticated client-side use (no API key, CORS-enabled), so no
// backend proxy — a proxy would add a hop for no benefit, and risks someone
// later "simplifying" it into sending the full password server-side, which
// is the exact privacy regression k-anonymity exists to prevent.
export async function checkPwned(password: string): Promise<{ pwned: boolean; count: number }> {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(password));
  const hash = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { "Add-Padding": "true" },
  });
  if (!res.ok) throw new Error(`HIBP range lookup failed: ${res.status}`);

  const body = await res.text();
  for (const line of body.split("\n")) {
    const [lineSuffix, countStr] = line.trim().split(":");
    if (lineSuffix === suffix) {
      return { pwned: true, count: Number(countStr) || 0 };
    }
  }
  return { pwned: false, count: 0 };
}
