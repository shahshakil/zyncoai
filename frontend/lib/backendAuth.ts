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
export const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.zyncoai.com").replace(/\/$/, "");

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

export function backendFetch(path: string, init: RequestInit & { refreshToken?: string } = {}) {
  const { refreshToken, ...rest } = init;
  const headers = new Headers(rest.headers);
  if (refreshToken) headers.set("cookie", `refresh_token=${refreshToken}`);
  return fetch(`${BACKEND_BASE}${path}`, { ...rest, headers, cache: "no-store" });
}

export const ACCESS_COOKIE_MAX_AGE = 14 * 60; // 15-min backend JWT, refreshed a minute early
export const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // matches backend REFRESH_TTL_MS default (30d)
