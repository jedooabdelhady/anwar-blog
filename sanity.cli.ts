import { defineCliConfig } from "sanity/cli";

/**
 * Sanity CLI config — used by `npx sanity deploy` to publish the Studio
 * to Sanity's free hosting at https://sahaarr299.sanity.studio.
 *
 * We host the Studio separately (instead of embedding it at /studio in
 * the Next.js app) because the Sanity editor bundle is ~20 MB, which
 * blows past Cloudflare Workers' free 3 MB script limit. Hosting it on
 * Sanity keeps the public site's Worker tiny and the Studio free.
 */
export default defineCliConfig({
  api: {
    projectId: "oziuv7qc",
    dataset: "production",
  },
  studioHost: "sahaarr299",
  autoUpdates: true,
});
