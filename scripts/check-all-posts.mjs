/** Verify every post slug resolves on the live site. */
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

const SITE = "https://sahaarr299.vercel.app";

const slugs = await client.fetch(
  `*[_type == "post" && !(_id in path("drafts.**"))] | order(_createdAt asc) { "slug": slug.current, title }`
);

console.log(`\nChecking ${slugs.length} published posts on ${SITE}\n`);

let ok = 0, bad = 0;
const failures = [];

for (const p of slugs) {
  const url = `${SITE}/blog/${p.slug}`;
  const res = await fetch(url, { method: "HEAD" });
  const mark = res.status === 200 ? "✓" : "✗";
  console.log(`${mark} ${res.status}  ${p.slug}`);
  if (res.status === 200) ok++;
  else { bad++; failures.push({ ...p, status: res.status, url }); }
}

console.log(`\n${ok} OK · ${bad} broken`);
if (failures.length) {
  console.log("\nBROKEN:");
  for (const f of failures) {
    console.log(`  • ${f.title}`);
    console.log(`    ${f.url}`);
  }
}
