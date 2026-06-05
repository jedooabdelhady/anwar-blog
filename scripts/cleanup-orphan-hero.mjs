/** Force-remove the legacy `hero` object from siteSettings.
 *  An earlier schema kept hero.title/subtitle. We migrated to heroQuotes
 *  but the old field lingered in the live document, surfacing as an
 *  "Unknown field found" warning in Studio. This deletes it cleanly. */
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = {};
for (const line of readFileSync(resolve(__dirname, "..", ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2];
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: env.SANITY_WRITE_TOKEN,
});

// Look in both the published doc and the draft (Studio shows the draft).
const ids = ["siteSettings", "drafts.siteSettings"];

for (const id of ids) {
  try {
    const doc = await client.getDocument(id);
    if (!doc) {
      console.log(`  · ${id}: not found (ok)`);
      continue;
    }
    if (!("hero" in doc)) {
      console.log(`  · ${id}: no 'hero' field (already clean)`);
      continue;
    }
    await client.patch(id).unset(["hero"]).commit({ autoGenerateArrayKeys: true });
    console.log(`  ✓ ${id}: removed 'hero'`);
  } catch (err) {
    console.error(`  ✗ ${id}:`, err.message);
  }
}

console.log("\nDone. Refresh Studio (pull-to-refresh on phone) and the warning should be gone.");
