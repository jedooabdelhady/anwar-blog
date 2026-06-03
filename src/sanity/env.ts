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

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";

export const writeToken = process.env.SANITY_WRITE_TOKEN || "";

/**
 * True once the user has wired a real Sanity project.
 * Used by pages/API routes to decide whether to query Sanity or fall back to
 * the seed `POSTS` array.
 */
export const sanityConfigured = projectId !== "placeholder";
