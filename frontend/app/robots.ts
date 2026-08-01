import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/platform-admin",
          "/platform-admin/",
          "/onboarding",
          "/app",
          "/app/",
          "/checkin/",
          "/api/",
          "/login",
          "/signup",
          "/forgot",
          "/reset-password",
          "/verify-email",
          "/verify-mfa",
          "/setup-mfa",
          "/accept-invite",
        ],
      },
    ],
    sitemap: "https://zyncoai.com/sitemap.xml",
  };
}
