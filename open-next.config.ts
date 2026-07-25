import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

/**
 * OpenNext Cloudflare configuration.
 *
 * We don't bind an R2 bucket in wrangler.jsonc yet, so the r2 cache
 * silently falls back to the runtime's in-memory cache — good enough
 * for the site's current traffic. Add an R2 binding named `NEXT_INC_CACHE_R2_BUCKET`
 * later if we start relying heavily on ISR.
 */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
