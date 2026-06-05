/** Inspect all posts (published + drafts) so we can see why the
 *  client's recent uploads aren't appearing on the site. */
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

const all = await client.fetch(
  `*[_type == "post"] | order(_createdAt desc) {
    _id, _createdAt, _updatedAt,
    title, "slug": slug.current,
    "isPublished": !(_id in path("drafts.**")),
    "hasImage": defined(image),
    "hasCategory": defined(category),
    "hasBody": defined(body) && length(body) > 0
  }`
);

console.log(`\nTotal documents of type 'post': ${all.length}\n`);
for (const p of all) {
  const status = p.isPublished ? "✓ PUBLISHED" : "⚠ DRAFT ONLY";
  console.log(`  ${status}  ${p._id}`);
  console.log(`     title:    ${p.title || "(none)"}`);
  console.log(`     slug:     ${p.slug || "(none)"}`);
  console.log(`     created:  ${p._createdAt}`);
  console.log(`     image:    ${p.hasImage ? "yes" : "MISSING"}`);
  console.log(`     category: ${p.hasCategory ? "yes" : "MISSING"}`);
  console.log(`     body:     ${p.hasBody ? "yes" : "MISSING"}`);
  console.log();
}

console.log(`Tip: items marked 'DRAFT ONLY' won't show on the site until they
are explicitly published (green Publish button in Studio).`);
