import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/sanity/lib/fetch";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "/", "/about", "/services", "/blog", "/contact",
    "/forms/public-vision", "/forms/private-vision", "/forms/inquiry",
    "/terms", "/privacy",
  ].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));

  const slugs = await getAllSlugs();
  const postRoutes: MetadataRoute.Sitemap = slugs.map((s) => ({
    url: `${SITE}/blog/${s}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
