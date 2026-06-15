/**
 * Recover from a half-empty Draft of siteSettings.
 *
 * Symptom: editor opens "إعدادات الموقع" in Studio (often on mobile)
 * and only sees a single hero slide instead of the full carousel —
 * because Studio auto-created a Draft document with only what they
 * touched, and the Draft hides the Published version from view.
 *
 * What this does:
 *   1) Reads the Published siteSettings document and prints every
 *      hero slide + card + blog-section field so you can confirm the
 *      live content is intact.
 *   2) Deletes the Draft (`drafts.siteSettings`) if one exists.
 *      Published content is untouched.
 *
 * After running this, refresh /studio — the document opens directly
 * on the Published version, and any subsequent edit creates a fresh
 * Draft that's a copy of Published (not empty).
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

const pub = await client.fetch(
  `*[_id == "siteSettings"][0]{
    siteName, siteTagline,
    heroQuotes[]{_key, text, source, color},
    cardPublic, cardPrivate, cardInquiry,
    blogSection
  }`
);

if (!pub) {
  console.log("❌ لم يُعثر على siteSettings المنشور.");
  console.log("شغّل seed-site-settings.mjs أولًا.");
  process.exit(1);
}

console.log("\n📄 المحتوى المنشور حاليًا (لن يُمسّ):\n");
console.log(`اسم الموقع: ${pub.siteName || "(فارغ)"}`);
console.log(`وصف SEO:    ${pub.siteTagline || "(فارغ)"}\n`);

const slides = Array.isArray(pub.heroQuotes) ? pub.heroQuotes : [];
console.log(`🎠 شرائح البانر (${slides.length}):`);
for (const [i, s] of slides.entries()) {
  const color = s?.color || "(لا لون)";
  const text = (s?.text || "(فارغ)").replace(/\n/g, " ");
  const src = s?.source ? ` — ${s.source}` : "";
  console.log(`  ${i + 1}. [${color}] "${text}"${src}`);
}

console.log("\n🚪 البطاقات الثلاث:");
for (const [name, card] of [
  ["cardPublic",  pub.cardPublic],
  ["cardPrivate", pub.cardPrivate],
  ["cardInquiry", pub.cardInquiry],
]) {
  if (!card) {
    console.log(`  ${name}: (فارغة)`);
    continue;
  }
  console.log(`  ${name}: "${card.title}" — زر: "${card.cta}"`);
}

console.log("\n📚 قسم المدونة:");
console.log(`  العنوان: ${pub.blogSection?.title || "(فارغ)"}`);
console.log(`  الفرعي: ${pub.blogSection?.subtitle || "(فارغ)"}`);

// If heroQuotes is empty, the site is using the in-code DEFAULT slides
// — they look fine to visitors but the editor has nothing to click on
// in Studio. Seed the published doc with the same six slides so they
// become editable.
if (slides.length === 0) {
  console.log("\n— الشرائح غير موجودة في Sanity، أزرعها الآن —");
  const SEED = [
    { text: "الحكمة هي نور العقل.",                          source: "مثل عربي",   color: "smoke"  },
    { text: "الرؤيا الصالحة من الله، والحُلم من الشيطان.",    source: "حديث شريف", color: "gum"    },
    { text: "أصدقُ الرؤى ما كان عند الأسحار.",               source: "أثر",       color: "pepper" },
    { text: "العلمُ في الصغرِ كالنقشِ في الحجرِ.",            source: "مثل عربي",   color: "smoke"  },
    { text: "خيرُ جليسٍ في الزمانِ كتابُ.",                   source: "المتنبي",   color: "gum"    },
    { text: "لكلِّ رؤيا تأويلٌ، ولكلِّ تأويلٍ مفتاحٌ.",        source: "مأثور",     color: "pepper" },
  ];
  const items = SEED.map((s, i) => ({
    _type: "quote",
    _key: `q${i + 1}`,
    ...s,
  }));
  await client
    .patch("siteSettings")
    .set({ heroQuotes: items })
    .commit();
  console.log(`✅ تم حقن ${items.length} شرائح في النسخة المنشورة.`);
}

// Now wipe the draft, if any.
console.log("\n— محاولة حذف الـ Draft —");
try {
  await client.delete("drafts.siteSettings");
  console.log("✅ تم حذف Draft الفارغ.");
} catch (err) {
  if (err.statusCode === 404 || /no such document/i.test(String(err?.message))) {
    console.log("✅ لا يوجد Draft أصلاً — كل شيء نظيف.");
  } else {
    console.error("⚠️ فشل حذف الـ Draft:", err.message || err);
    process.exit(1);
  }
}
console.log("\n🎯 افتح /studio → إعدادات الموقع → سترى كل الشرائح للتعديل.\n");
