// Server-only helpers used by every route handler under src/app/api/auth/**
// and the src/app/api/business/[...path] / src/app/api/admin/[...path]
// proxies. The backend (api.zyncoai.com) sets its refresh_token cookie
// host-only with no explicit Domain — since these calls are server-to-server
// (this Next.js server calling the backend, not the browser calling it
// directly), that cookie never reaches the browser on our own domain. So we
// don't try to relay the backend's Set-Cookie verbatim: we extract the raw
// token value server-side and re-issue it as our own httpOnly cookie scoped
// to this frontend's domain, then send it back to the backend as an
// explicit `Cookie: refresh_token=...` header on every refresh call.
//
// INTERNAL_API_BASE_URL (plain env var, deliberately NOT NEXT_PUBLIC_-
// prefixed so it's never inlined into client bundles) lets this
// server-to-server call go straight to the api process's local port
// instead of round-tripping through the public domain. That round-trip is
// a real, confirmed-live outage on this host: api.zyncoai.com resolves to
// this same box's own public IP, and the box cannot connect back to its
// own public IP (ECONNREFUSED — no hairpin NAT), so every server-side
// backendFetch() call here was failing outright. NEXT_PUBLIC_API_BASE_URL
// stays the fallback for any client-side callers elsewhere, which don't
// hit this self-connect problem since real browsers aren't on this box.
export const BACKEND_BASE = (
  process.env.INTERNAL_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.zyncoai.com"
).replace(/\/$/, "");

export const ACCESS_COOKIE = "zyn_access";
export const REFRESH_COOKIE = "zyn_refresh";
export const ADMIN_ACCESS_COOKIE = "zyn_admin_access";

export function extractSetCookieValue(res: Response, cookieName: string): string | null {
  const raw = (res.headers as any).getSetCookie?.() as string[] | undefined;
  const all = raw && raw.length ? raw : res.headers.get("set-cookie") ? [res.headers.get("set-cookie") as string] : [];
  for (const line of all) {
    const match = line.match(new RegExp(`^${cookieName}=([^;]+)`));
    if (match) return decodeURIComponent(match[1]);
  }
  return null;
}

// backendFetch() connects straight to INTERNAL_API_BASE_URL — a server-to-
// server call that never touches nginx, so nginx's own X-Forwarded-For
// setup (which IS correct on the incoming request to this Next.js server)
// never reaches the backend. Without this, every proxied request looks
// like it came from 127.0.0.1 (the loopback address both processes share
// on this host) to the Express backend's `trust proxy: "loopback"` config
// — which is itself correctly set up, it just never receives anything
// real. getClientIp() reads the ALREADY-correct header nginx set on the
// incoming request; every backendFetch() call site below forwards it.
export function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip");
}

export function backendFetch(path: string, init: RequestInit & { refreshToken?: string; clientIp?: string | null } = {}) {
  const { refreshToken, clientIp, ...rest } = init;
  const headers = new Headers(rest.headers);
  if (refreshToken) headers.set("cookie", `refresh_token=${refreshToken}`);
  if (clientIp) {
    headers.set("x-forwarded-for", clientIp);
    headers.set("x-real-ip", clientIp);
  }
  return fetch(`${BACKEND_BASE}${path}`, { ...rest, headers, cache: "no-store" });
}

export const ACCESS_COOKIE_MAX_AGE = 14 * 60; // 15-min backend JWT, refreshed a minute early
export const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // matches backend REFRESH_TTL_MS default (30d)
