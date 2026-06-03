import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, writeToken } from "../env";

/** Read-only client (used by pages to fetch posts). */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Write-enabled client (server-only) — for form submissions.
 * Never import this into a client component.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken,
});
