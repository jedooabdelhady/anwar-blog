/**
 * Seeds the videos section on the home page with 3 placeholder cards so
 * Sahar can see the layout immediately, then swap in her real channel
 * links. Idempotent — re-running won't duplicate entries.
 *
 * Usage:
 *   node scripts/seed-videos.mjs        # only seeds if videos is empty
 *   node scripts/seed-videos.mjs --force  # always overwrites with the defaults
 */

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

const force = process.argv.includes("--force");

const SEED = [
  {
    title: "حلقة تعريفية بعلم تأويل الرؤى",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    description: "مدخل عام لعلم التأويل وأصوله الكلاسيكية.",
  },
  {
    title: "دلالات الرؤى الصالحة عند العلماء",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    description: "قراءة في علامات الرؤيا الصادقة وتمييزها عن غيرها.",
  },
  {
    title: "قواعد التأويل ومنهج العلماء",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    description: "أصول التعبير عند ابن سيرين ومن جاء بعده.",
  },
];

const existing = await client.fetch(`*[_id == "siteSettings"][0]{videos}`);
const currentCount = Array.isArray(existing?.videos) ? existing.videos.length : 0;

if (currentCount > 0 && !force) {
  console.log(`فيه ${currentCount} فيديو موجود في Sanity بالفعل — تخطي.`);
  console.log(`أضف --force لاستبدالهم بالمحتوى الافتراضي.`);
  process.exit(0);
}

const items = SEED.map((v, i) => ({
  _type: "video",
  _key: `v${i + 1}`,
  ...v,
}));

await client.patch("siteSettings").set({ videos: items }).commit();
console.log(`✅ تم زرع ${items.length} فيديو تجريبي في siteSettings.`);
console.log(`افتح /studio → إعدادات الموقع → 🎬 مقاطع الفيديو لتعديلها.`);
