/** @type {import('next').NextConfig} */
const nextConfig = {
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
