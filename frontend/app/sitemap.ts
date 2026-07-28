import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zyncoai.com";
  const now = new Date();

  const routes = [
    "/app",
    "/app/brain",
    "/pricing",
    "/docs",
    "/integrations",
    "/security",
    "/terms",
  ];

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/app" ? 1 : 0.7,
  }));
}
