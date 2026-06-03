/**
 * Patch the existing siteSettings doc with the new "بوابة..." copy,
 * the new CTA labels, and a fresh `heroQuotes` array (replaces the
 * defunct hero.title/subtitle fields).
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

const patch = {
  heroQuotes: [
    { _type: "quote", _key: "q1", text: "الحكمة هي نور العقل.",                            source: "مثل عربي",   color: "sienna" },
    { _type: "quote", _key: "q2", text: "الرؤيا الصالحة من الله، والحُلم من الشيطان.",      source: "حديث شريف", color: "pepper" },
    { _type: "quote", _key: "q3", text: "أصدقُ الرؤى ما كان عند الأسحار.",                 source: "أثر",       color: "oak"    },
  ],
  cardPublic: {
    _type: "object",
    title: "بوابة الرؤى العامة",
    body:  "مساحة تُروى فيها الرؤى العامة بتفاصيلها ودلالاتها، لفهم الرموز والإشارات والمعاني الكامنة خلفها.",
    cta:   "قدّم رؤياك",
  },
  cardPrivate: {
    _type: "object",
    title: "بوابة الرؤى الشخصية",
    body:  "مساحة خاصة بكَ، شارك رؤياك الخاصة لتُفسَّر رموزها في مساحة آمنة وهادئة بما تحمله من أثر ومعنى.",
    cta:   "قدّم رؤياك",
  },
  cardInquiry: {
    _type: "object",
    title: "بوابة تساؤل واستعلام",
    body:  "نافذة للتساؤلات والاستفسارات العامة، تُطرح فيها الأفكار والرموز والمعاني المختلفة للبحث والتأمل.",
    cta:   "ابدأ استعلامك",
  },
};

try {
  await client
    .patch("siteSettings")
    .set(patch)
    .unset(["hero"])           // remove the old hero.title/subtitle object
    .commit();
  console.log("✓ patched siteSettings (quotes + 3 cards + cleared old hero)");
} catch (err) {
  console.error("✗ patch failed:", err.message);
  process.exit(1);
}
