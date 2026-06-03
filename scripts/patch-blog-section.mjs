/** Patch siteSettings.blogSection with the client's new copy. */
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

try {
  await client
    .patch("siteSettings")
    .set({
      blogSection: {
        _type: "object",
        title:    "الواردّ العلميِ",
        subtitle: "بحرْ العلمْ بوابةّ العالمْ فارتّق نْ",
      },
    })
    .commit();
  console.log("✓ patched siteSettings.blogSection");
} catch (err) {
  console.error("✗ patch failed:", err.message);
  process.exit(1);
}
