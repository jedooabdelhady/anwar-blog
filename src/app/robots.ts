import type { MetadataRoute } from "next";
import { canonicalSiteUrl } from "@/lib/site-url";

const SITE = canonicalSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api"] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
