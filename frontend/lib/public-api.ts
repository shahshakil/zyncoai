export function getPublicApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://api.zyncoai.com"
  ).replace(/\/+$/, "");
}

export async function safeGetJson<T = any>(path: string): Promise<T | null> {
  try {
    const base = getPublicApiBase();
    const res = await fetch(`${base}${path}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function safePostJson<T = any>(
  path: string,
  body: Record<string, any>
): Promise<T | null> {
  try {
    const base = getPublicApiBase();
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
