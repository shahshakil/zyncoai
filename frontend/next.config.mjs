/** @type {import('next').NextConfig} */
const nextConfig = {
  // Zero-downtime deploys (scripts/deploy.sh): a build normally always
  // writes to ./.next, which is also the directory the live `next start`
  // process is reading from — deleting/overwriting it mid-build is exactly
  // what caused real 500s during every deploy (confirmed in nginx access
  // logs, 2026-08-19). NEXT_BUILD_DIR lets a deploy build into an isolated
  // directory instead, leaving the live .next completely untouched until a
  // single atomic rename swaps it in. `next start` never sets this env var,
  // so it always falls back to the real ./.next.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    instrumentationHook: true,
    // recharts/lucide-react are the only heavy-import deps actually used
    // here — lodash/date-fns aren't dependencies of this project, adding
    // them would be a no-op.
    optimizePackageImports: ["recharts", "lucide-react"],
    // Inlines critical above-the-fold CSS per page instead of blocking
    // render on the full stylesheet — real Core Web Vitals (LCP) win.
    // Requires the `critters` package (added as a devDependency).
    optimizeCss: true,
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // optional: keep old /app links working after you remove basePath
      { source: "/app", destination: "/", permanent: false },
      { source: "/app/:path*", destination: "/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
