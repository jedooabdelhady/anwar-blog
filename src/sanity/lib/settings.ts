import { client } from "./client";
import { sanityConfigured } from "../env";

export type SlideColor = "sienna" | "oak" | "pepper" | "gum" | "smoke";

export type HeroQuote = {
  text: string;
  source?: string;
  color?: SlideColor;
};

export type CardCopy = {
  title: string;
  body: string;
  cta: string;
};

export type SiteSettings = {
  siteName: string;
  siteTagline: string;
  heroQuotes: HeroQuote[];
  cardPublic: CardCopy;
  cardPrivate: CardCopy;
  cardInquiry: CardCopy;
  blogSection: { title: string; subtitle: string };
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "علم تأويل الرؤى",
  siteTagline:
    "موقع عربي متخصص في علم تأويل الرؤى والأحلام، مع محتوى ثري في المعرفة والإلهام.",
  heroQuotes: [
    { text: "الحكمة هي نور العقل.",                          source: "مثل عربي",   color: "smoke"  },
    { text: "الرؤيا الصالحة من الله، والحُلم من الشيطان.",    source: "حديث شريف", color: "gum"    },
    { text: "أصدقُ الرؤى ما كان عند الأسحار.",               source: "أثر",       color: "pepper" },
    { text: "العلمُ في الصغرِ كالنقشِ في الحجرِ.",            source: "مثل عربي",   color: "smoke"  },
    { text: "خيرُ جليسٍ في الزمانِ كتابُ.",                   source: "المتنبي",   color: "gum"    },
    { text: "لكلِّ رؤيا تأويلٌ، ولكلِّ تأويلٍ مفتاحٌ.",        source: "مأثور",     color: "pepper" },
  ],
  cardPublic: {
    title: "بوابة الرؤى العامة",
    body:  "مساحة تُروى فيها الرؤى العامة بتفاصيلها ودلالاتها، لفهم الرموز والإشارات والمعاني الكامنة خلفها.",
    cta:   "قدّم رؤياك",
  },
  cardPrivate: {
    title: "بوابة الرؤى الشخصية",
    body:  "مساحة خاصة بكَ، شارك رؤياك الخاصة لتُفسَّر رموزها في مساحة آمنة وهادئة بما تحمله من أثر ومعنى.",
    cta:   "قدّم رؤياك",
  },
  cardInquiry: {
    title: "بوابة تساؤل واستعلام",
    body:  "نافذة للتساؤلات والاستفسارات العامة، تُطرح فيها الأفكار والرموز والمعاني المختلفة للبحث والتأمل.",
    cta:   "ابدأ استعلامك",
  },
  blogSection: {
    title:    "الواردّ العلميِ",
    subtitle: "بحرْ العلمْ بوابةّ العالمْ فارتّق نْ",
  },
};

const SETTINGS_QUERY = /* groq */ `*[_type == "siteSettings"][0]{
  siteName, siteTagline,
  heroQuotes[]{ text, source, color },
  cardPublic, cardPrivate, cardInquiry, blogSection
}`;

function withDefaults(raw: Partial<SiteSettings> | null): SiteSettings {
  if (!raw) return DEFAULT_SETTINGS;
  return {
    siteName:    raw.siteName    || DEFAULT_SETTINGS.siteName,
    siteTagline: raw.siteTagline || DEFAULT_SETTINGS.siteTagline,
    heroQuotes:  Array.isArray(raw.heroQuotes) && raw.heroQuotes.length > 0
      ? raw.heroQuotes
      : DEFAULT_SETTINGS.heroQuotes,
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
