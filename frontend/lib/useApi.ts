"use client";
import useSWR, { SWRConfiguration } from "swr";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetcher(url: string) {
  const r = await fetch(url, { credentials: "include" });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(data?.error || "request_failed", r.status);
  return data;
}

export function useApi<T = any>(path: string | null, config?: SWRConfiguration) {
  return useSWR<T>(path, fetcher, { revalidateOnFocus: false, ...config });
}

export async function apiPost<T = any>(path: string, body?: unknown, method: "POST" | "PATCH" | "PUT" | "DELETE" = "POST"): Promise<T> {
  const r = await fetch(path, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(data?.error || "request_failed", r.status);
  return data;
}
