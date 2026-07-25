import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;

// Wire the OpenNext Cloudflare dev shim so `next dev` still has the
// bindings it needs (KV/R2/Env) during local development. Guarded so
// we don't fail the build when the adapter isn't installed locally
// on a contributor's machine.
if (process.env.NODE_ENV !== "production") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@opennextjs/cloudflare");
    if (typeof mod?.initOpenNextCloudflareForDev === "function") {
      mod.initOpenNextCloudflareForDev();
    }
  } catch {
    // Adapter not installed — safe to ignore in vanilla `next dev`.
  }
}
