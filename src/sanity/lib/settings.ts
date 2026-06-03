import { client } from "./client";
import { sanityConfigured } from "../env";

export type SiteSettings = {
  siteName: string;
  siteTagline: string;
  hero: { title: string; subtitle: string };
  cardPublic: { title: string; body: string; cta: string };
  cardPrivate: { title: string; body: string; cta: string };
  cardInquiry: { title: string; body: string; cta: string };
  blogSection: { title: string; subtitle: string };
};

/** Fallback values shown when Sanity is unreachable or the settings doc
 *  hasn't been created yet. Keep these in sync with the schema's
 *  `initialValue` fields so the seed flow stays consistent. */
export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "علم تأويل الرؤى",
  siteTagline:
    "موقع عربي متخصص في علم تأويل الرؤى والأحلام، مع محتوى ثري في المعرفة والإلهام.",
  hero: {
    title: "مرحباً بك في علم تأويل الرؤى",
    subtitle:
      "مساحة عربية للتأمّل والتفسير، ومحتوى متخصص يعينك على فهم رؤاك والاطلاع على ما ينير دربك. شاركنا، اقرأ، وكن جزءاً من المجتمع.",
  },
  cardPublic: {
    title: "الرؤى العامة",
    body: "نستقبل آرائكم ومقترحاتكم لتحسين خدماتنا",
    cta: "تقديم رؤيتي",
  },
  cardPrivate: {
    title: "الرؤى الخاصة",
    body: "شاركنا رؤيتك الخاصة أو مشروعك لنناقشه معك",
    cta: "تقديم رؤيتي",
  },
  cardInquiry: {
    title: "تساؤل واستعلام",
    body: "نحن هنا للإجابة على تساؤلاتكم واستفساراتكم",
    cta: "أرسل استفسارك",
  },
  blogSection: {
    title: "مدونتنا",
    subtitle: "مواضيع ومقالات تهمك",
  },
};

const SETTINGS_QUERY = /* groq */ `*[_type == "siteSettings"][0]{
  siteName, siteTagline, hero, cardPublic, cardPrivate, cardInquiry, blogSection
}`;

/**
 * Merge fetched data with defaults so partially-filled forms in Studio
 * never produce undefined fields on the public site.
 */
function withDefaults(raw: Partial<SiteSettings> | null): SiteSettings {
  if (!raw) return DEFAULT_SETTINGS;
  return {
    siteName:    raw.siteName    || DEFAULT_SETTINGS.siteName,
    siteTagline: raw.siteTagline || DEFAULT_SETTINGS.siteTagline,
    hero:        { ...DEFAULT_SETTINGS.hero,        ...(raw.hero        || {}) },
    cardPublic:  { ...DEFAULT_SETTINGS.cardPublic,  ...(raw.cardPublic  || {}) },
    cardPrivate: { ...DEFAULT_SETTINGS.cardPrivate, ...(raw.cardPrivate || {}) },
    cardInquiry: { ...DEFAULT_SETTINGS.cardInquiry, ...(raw.cardInquiry || {}) },
    blogSection: { ...DEFAULT_SETTINGS.blogSection, ...(raw.blogSection || {}) },
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!sanityConfigured) return DEFAULT_SETTINGS;
  try {
    const raw = await client.fetch<Partial<SiteSettings> | null>(
      SETTINGS_QUERY,
      {},
      { next: { revalidate: 60, tags: ["siteSettings"] } }
    );
    return withDefaults(raw);
  } catch (err) {
    console.warn("[sanity] getSiteSettings failed, using defaults:", err);
    return DEFAULT_SETTINGS;
  }
}
