import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, errors as joseErrors } from "jose";

/**
 * Public marketing routes (NO login)
 * Everything NOT listed here becomes login-protected.
 */
const PUBLIC_PATHS = [
  "/",
  "/features",
  "/pricing",
  "/addons",
  "/demo",
  "/login",
  "/signup",
  "/forgot",
  "/reset-password",
  "/verify-email",
  // Reached mid-login, before a real zyn_access cookie exists — must be
  // public or the getToken() check below redirect-loops these straight
  // back to /login.
  "/setup-mfa",
  "/verify-mfa",
  "/accept-invite",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/ai-transparency",
  "/product",
  "/faq",

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
  "/ai",
  "/executions",
  "/blog",
];

const PUBLIC_PREFIXES = [
  // Patient QR/link self check-in (frontend/app/checkin/[token]/page.tsx) —
  // unauthenticated, the token is the credential, same as /accept-invite.
  "/checkin/",
  "/legal/",
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
  "/capabilities/",
  "/blog/",
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

// Edge-layer fast path: verify the access token's signature + expiry (via
// jose, Edge-Runtime compatible — the backend's jsonwebtoken/HS256 signer
// can't run here) so an obviously expired/forged token gets redirected to
// /login immediately instead of rendering the dashboard shell first and
// only failing once DashboardGate's client-side fetches 401. This is
// strictly additive to the existing server-side auth chain (blacklist,
// session-inactivity, tenant resolution) — it never grants access on its
// own, and it fails OPEN (treats the token as "can't tell, let it through")
// on any ambiguous outcome: no secret configured, malformed token, or an
// unexpected verification error. Only a definite EXPIRED or BAD SIGNATURE
// result short-circuits to /login.
const accessSecretRaw = process.env.JWT_ACCESS_SECRET;
const accessSecretKey = accessSecretRaw ? new TextEncoder().encode(accessSecretRaw) : null;

async function isDefinitelyInvalid(token: string): Promise<boolean> {
  if (!accessSecretKey) return false;
  try {
    await jwtVerify(token, accessSecretKey);
    return false;
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) return true;
    if (err instanceof joseErrors.JWSSignatureVerificationFailed) return true;
    // Any other error (unexpected claims validation, transient issue,
    // token minted with a different algorithm, etc.) — don't guess.
    return false;
  }
}

export async function middleware(req: NextRequest) {
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
    pathname === "/llms.txt" ||
    pathname === "/blog/feed.xml" ||
    // Next.js file-convention route (app/opengraph-image.tsx) — framework
    // content, not user-facing pages, same bucket as robots.txt/sitemap.xml.
    pathname.startsWith("/opengraph-image") ||
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

  if (!token || (await isDefinitelyInvalid(token))) {
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
