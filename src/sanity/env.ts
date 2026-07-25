/**
 * Sanity environment.
 *
 * If env vars are missing we fall back to safe placeholders so the rest of the
 * Next.js app (the marketing pages, blog placeholder data) keeps building.
 * Once you create a Sanity project, fill these in .env.local — the placeholder
 * client will then be replaced automatically and live data will flow through.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Fallback to the real (public) project ID so build-time module
// evaluation on hosts that don't yet have env vars in scope (e.g.
// Cloudflare Pages during OpenNext's page-data collection) doesn't
// crash inside createClient with "projectId can only contain…".
// The project ID is not a secret — it shows up in every asset URL.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "oziuv7qc";

export const writeToken = process.env.SANITY_WRITE_TOKEN || "";

/**
 * True once the user has wired a real Sanity project.
 * Now that the fallback is the real projectId, sanity is always "configured"
 * in production — the write token check downstream still gates mutations.
 */
export const sanityConfigured = Boolean(projectId);
