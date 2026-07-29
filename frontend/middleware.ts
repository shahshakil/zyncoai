import { NextRequest, NextResponse } from "next/server";

/**
 * Public marketing routes (NO login)
 * Everything NOT listed here becomes login-protected.
 */
const PUBLIC_PATHS = [
  "/",
  "/pricing",
  "/addons",
  "/demo",
  "/login",
  "/signup",
  "/forgot",
  "/verify-email",
  // Reached mid-login, before a real zyn_access cookie exists — must be
  // public or the getToken() check below redirect-loops these straight
  // back to /login.
  "/setup-mfa",
  "/verify-mfa",
  "/accept-invite",
  "/about",

  "/agentops",
  "/workflowops",
  "/platform",
  "/use-cases",
  "/resources",
  "/brain",
  "/ai-brain",

  "/enterprise",

  "/docs",
  "/templates",
  "/integrations",
  "/security",
  "/observability",
  "/governance",
  "/whats-new",
  "/products",
  "/solutions",
  "/platform-admin",
];

const PUBLIC_PREFIXES = [
  // Patient QR/link self check-in (frontend/app/checkin/[token]/page.tsx) —
  // unauthenticated, the token is the credential, same as /accept-invite.
  "/checkin/",
  "/products/",
  "/solutions/",
  "/resources/",
  "/docs/",
  "/whats-new/",
  "/platform/",
  "/workflowops/",
  "/use-cases/",
  "/ai-brain/",
  "/agentops/",
  // ZyncoAI super-admin panel uses its own 30-min admin JWT (zyn_admin_access
  // cookie), completely separate from the tenant zyn_access/zyn_refresh pair
  // this middleware checks below — it self-gates in
  // src/app/platform-admin/layout.tsx instead.
  "/platform-admin/",
];

/**
 * If you want marketing subpages like /enterprise/soc2 to be PUBLIC, keep this.
 * If you want them to require login, remove it.
 */
const PUBLIC_ENTERPRISE_PREFIX = true;

function stripTrailingSlash(p: string) {
  return p !== "/" ? p.replace(/\/+$/, "") : p;
}

function isPublic(pathname: string) {
  const p = stripTrailingSlash(pathname);

  if (PUBLIC_PATHS.includes(p)) return true;
  if (PUBLIC_PREFIXES.some((x) => pathname.startsWith(x))) return true;
  if (PUBLIC_ENTERPRISE_PREFIX && pathname.startsWith("/enterprise/")) return true;

  return false;
}

/**
 * Token resolver
 * Keep this aligned with your backend auth cookie.
 */
function getToken(req: NextRequest) {
  return (
    req.cookies.get("access_token")?.value ||
    req.cookies.get("token")?.value ||
    req.cookies.get("session")?.value ||
    req.cookies.get("zyn_access")?.value
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // legacy redirects
  if (pathname === "/status" || pathname.startsWith("/status/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/resources/status";
    return NextResponse.redirect(url);
  }

  if (pathname === "/brain") {
    const url = req.nextUrl.clone();
    url.pathname = "/ai-brain/live-voice-assistant";
    return NextResponse.redirect(url);
  }

  // always allow internals + static + api
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/videos") ||
    pathname.startsWith("/audio")
  ) {
    return NextResponse.next();
  }

  // allow marketing pages
  if (isPublic(pathname)) return NextResponse.next();

  // protect everything else
  const token = getToken(req);

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|videos).*)"],
};
