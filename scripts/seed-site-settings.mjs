/**
 * One-shot seed script: creates the singleton siteSettings document so the
 * editor sees a pre-filled "إعدادات الموقع" entry on first Studio visit.
 * Safe to re-run — uses createIfNotExists.
 *
 * Usage:  node scripts/seed-site-settings.mjs
 */
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
const env = {};
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2];
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token     = env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

const doc = {
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: "علم تأويل الرؤى",
  siteTagline:
    "موقع عربي متخصص في علم تأويل الرؤى والأحلام، مع محتوى ثري في المعرفة والإلهام.",
  hero: {
    _type: "object",
    title: "مرحباً بك في علم تأويل الرؤى",
    subtitle:
      "مساحة عربية للتأمّل والتفسير، ومحتوى متخصص يعينك على فهم رؤاك والاطلاع على ما ينير دربك. شاركنا، اقرأ، وكن جزءاً من المجتمع.",
  },
  cardPublic: {
    _type: "object",
    title: "الرؤى العامة",
    body: "نستقبل آرائكم ومقترحاتكم لتحسين خدماتنا",
    cta: "تقديم رؤيتي",
  },
  cardPrivate: {
    _type: "object",
    title: "الرؤى الخاصة",
    body: "شاركنا رؤيتك الخاصة أو مشروعك لنناقشه معك",
    cta: "تقديم رؤيتي",
  },
  cardInquiry: {
    _type: "object",
    title: "تساؤل واستعلام",
    body: "نحن هنا للإجابة على تساؤلاتكم واستفساراتكم",
    cta: "أرسل استفسارك",
  },
  blogSection: {
    _type: "object",
    title: "مدونتنا",
    subtitle: "مواضيع ومقالات تهمك",
  },
};

console.log(`→ Seeding siteSettings into '${projectId}/${dataset}'…`);

try {
  const res = await client.createIfNotExists(doc);
  const created =
    res._createdAt &&
    new Date(res._createdAt).getTime() > Date.now() - 5000;
  console.log(
    created
      ? "  ✓ created siteSettings"
      : "  • siteSettings already exists (skipped) — edit in Studio to change values"
  );
} catch (err) {
  console.error("  ✗ failed:", err.message);
  process.exit(1);
}
