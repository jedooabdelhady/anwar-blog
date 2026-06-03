/**
 * Embedded Sanity Studio — lives at `/studio` (and any sub-route).
 * Acts as the admin dashboard for posts, categories, authors, submissions.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
