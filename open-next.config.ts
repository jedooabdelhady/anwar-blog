import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext Cloudflare configuration.
 *
 * No incremental cache override is set, so OpenNext falls back to the
 * default in-memory cache. That's the right choice for this site's
 * traffic — an R2 bucket would add cost + a binding to configure, and
 * ISR here just re-fetches from Sanity on a 60s revalidate anyway.
 *
 * If we ever need cross-instance ISR persistence, add an R2 bucket
 * binding named NEXT_INC_CACHE_R2_BUCKET in wrangler.jsonc and switch
 * this back to r2IncrementalCache.
 */
export default defineCloudflareConfig();
