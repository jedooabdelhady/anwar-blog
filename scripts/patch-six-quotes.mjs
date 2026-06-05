/** Replace the carousel with 6 alternating smoke/gum/pepper slides. */
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

const heroQuotes = [
  { _type: "quote", _key: "q1", text: "الحكمة هي نور العقل.",                            source: "مثل عربي",   color: "smoke"  },
  { _type: "quote", _key: "q2", text: "الرؤيا الصالحة من الله، والحُلم من الشيطان.",      source: "حديث شريف", color: "gum"    },
  { _type: "quote", _key: "q3", text: "أصدقُ الرؤى ما كان عند الأسحار.",                 source: "أثر",       color: "pepper" },
  { _type: "quote", _key: "q4", text: "العلمُ في الصغرِ كالنقشِ في الحجرِ.",              source: "مثل عربي",   color: "smoke"  },
  { _type: "quote", _key: "q5", text: "خيرُ جليسٍ في الزمانِ كتابُ.",                     source: "المتنبي",   color: "gum"    },
  { _type: "quote", _key: "q6", text: "لكلِّ رؤيا تأويلٌ، ولكلِّ تأويلٍ مفتاحٌ.",          source: "مأثور",     color: "pepper" },
];

try {
  await client.patch("siteSettings").set({ heroQuotes }).commit();
  console.log("✓ patched 6 hero slides (smoke / gum / pepper × 2)");
} catch (err) {
  console.error("✗ patch failed:", err.message);
  process.exit(1);
}
