/**
 * One-shot seed script: creates the 6 default Anwar categories in Sanity.
 * Safe to run multiple times — uses `createIfNotExists` (idempotent).
 *
 * Usage:  node scripts/seed-categories.mjs
 */
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// --- read .env.local manually (no dotenv dep) ---
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
const env = {};
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2];
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = env.NEXT_PUBLIC_SANITY_DATASET   || "production";
const token     = env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

const CATEGORIES = [
  { _id: "cat-business",         title: "إدارة الأعمال",  slug: "business",         description: "خطط ومنهجيات في إدارة الفرق والمشاريع." },
  { _id: "cat-marketing",        title: "التسويق الرقمي", slug: "marketing",        description: "أدوات وإستراتيجيات التسويق الرقمي الحديث." },
  { _id: "cat-entrepreneurship", title: "نصائح ريادية",   slug: "entrepreneurship", description: "دروس وقصص من واقع ريادة الأعمال." },
  { _id: "cat-self-development", title: "تطوير الذات",    slug: "self-development", description: "مهارات وعادات لتحسين النسخة الشخصية." },
  { _id: "cat-inspiration",      title: "أفكار ملهمة",    slug: "inspiration",      description: "محتوى يحفّز ويفتح آفاقاً جديدة." },
  { _id: "cat-news",             title: "أحدث الأخبار",   slug: "news",             description: "آخر أخبار وتطورات عالم الأعمال والتقنية." },
];

console.log(`→ Seeding ${CATEGORIES.length} categories into project '${projectId}/${dataset}'...`);

let created = 0;
let skipped = 0;

for (const c of CATEGORIES) {
  const doc = {
    _id: c._id,
    _type: "category",
    title: c.title,
    slug: { _type: "slug", current: c.slug },
    description: c.description,
  };
  try {
    const res = await client.createIfNotExists(doc);
    if (res._createdAt) {
      const wasNew = new Date(res._createdAt).getTime() > Date.now() - 5000;
      if (wasNew) {
        console.log(`  ✓ created  '${c.title}'`);
        created++;
      } else {
        console.log(`  • exists   '${c.title}' (skipped)`);
        skipped++;
      }
    }
  } catch (err) {
    console.error(`  ✗ failed   '${c.title}':`, err.message);
  }
}

console.log(`\nDone. ${created} created, ${skipped} already existed.`);
