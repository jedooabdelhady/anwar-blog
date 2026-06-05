/** Patch the live siteSettings doc with the latest copy:
 *   - card bodies use **bold** for emphasized phrases
 *   - blogSection back to الواردّ العلميِ + the four-word maxim */
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
  cardPublic: {
    _type: "object",
    title: "بوابة الرؤى العامة",
    body:  "مساحة تُروى فيها **الرؤى العامة** بتفاصيلها ودلالاتها، لفهم الرموز والإشارات والمعاني الكامنة خلفها.",
    cta:   "قدّم رؤياك",
  },
  cardPrivate: {
    _type: "object",
    title: "بوابة الرؤى الشخصية",
    body:  "مساحة خاصة بكَ، **شارك رؤياك الخاصة** لتُفسَّر رموزها في مساحة آمنة وهادئة بما تحمله من أثر ومعنى.",
    cta:   "قدّم رؤياك",
  },
  cardInquiry: {
    _type: "object",
    title: "بوابة تساؤل واستعلام",
    body:  "نافذة **للتساؤلات والاستفسارات العامة**، تُطرح فيها الأفكار والرموز والمعاني المختلفة للبحث والتأمل.",
    cta:   "ابدأ استعلامك",
  },
  blogSection: {
    _type: "object",
    title:    "الواردّ العلميِ",
    subtitle: "بحرْ العلمْ بوابةّ العالمْ فارتّق نْ",
  },
};

// Patch both the published doc and the editor's draft so a refresh
// of Studio doesn't immediately revert the changes.
for (const id of ["siteSettings", "drafts.siteSettings"]) {
  try {
    const doc = await client.getDocument(id);
    if (!doc) {
      console.log(`  · ${id}: not present (ok)`);
      continue;
    }
    await client.patch(id).set(patch).commit();
    console.log(`  ✓ ${id}: patched`);
  } catch (err) {
    console.error(`  ✗ ${id}:`, err.message);
  }
}
