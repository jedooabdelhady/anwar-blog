import { defineField, defineType, defineArrayMember } from "sanity";
import { CogIcon } from "@sanity/icons";

const SLIDE_COLORS = [
  { title: "بني محمر (Sienna)",       value: "sienna" },
  { title: "بني فاتح (Oak)",          value: "oak" },
  { title: "بني داكن (Pepper)",       value: "pepper" },
  { title: "زيتي (Gum)",              value: "gum" },
  { title: "مخطوط فاتح (Smoke) 📜",   value: "smoke" },
] as const;

/**
 * Singleton "إعدادات الموقع" — every editable string on the home page
 * lives here so the editor can rewrite without touching code.
 */
export default defineType({
  name: "siteSettings",
  title: "إعدادات الموقع",
  type: "document",
  icon: CogIcon,
  fields: [
    /* ─────────────── Brand ─────────────── */
    defineField({
      name: "siteName",
      title: "اسم الموقع",
      type: "string",
      initialValue: "علم تأويل الرؤى",
      validation: (R) => R.required().max(60),
    }),
    defineField({
      name: "siteTagline",
      title: "وصف مختصر للموقع (SEO)",
      type: "text",
      rows: 2,
      initialValue:
        "موقع عربي متخصص في علم تأويل الرؤى والأحلام، مع محتوى ثري في المعرفة والإلهام.",
      validation: (R) => R.max(200),
    }),

    /* ─────────────── Hero carousel ─────────────── */
    defineField({
      name: "heroQuotes",
      title: "شرائح البانر (اقتباسات متحركة)",
      description:
        "تتبدّل تلقائياً كل 6 ثواني. أضف/احذف بحرّية — الترتيب يحفظ كما هو.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "quote",
          fields: [
            defineField({
              name: "text",
              title: "نص الاقتباس",
              description:
                "لتغميق كلمة، ضعيها بين نجمتين هكذا: **الكلمة**. مثال: \"فلا ذنبَ لي أنْ كانتْ العين تحلمُ\" • م: **المخطوطُ**",
              type: "text",
              rows: 2,
              validation: (R) => R.required().max(300),
            }),
            defineField({
              name: "source",
              title: "المصدر (اختياري)",
              type: "string",
              validation: (R) => R.max(80),
            }),
            defineField({
              name: "color",
              title: "لون الخلفية",
              type: "string",
              options: { list: [...SLIDE_COLORS], layout: "radio" },
              initialValue: "sienna",
            }),
          ],
          preview: {
            select: { title: "text", subtitle: "source" },
            prepare: ({ title, subtitle }) => ({
              title: title?.length > 50 ? title.slice(0, 50) + "…" : title,
              subtitle,
            }),
          },
        }),
      ],
      initialValue: [
        { _type: "quote", _key: "q1", text: "الحكمة هي نور العقل.",                                source: "مثل عربي",   color: "sienna" },
        { _type: "quote", _key: "q2", text: "الرؤيا الصالحة من الله، والحُلم من الشيطان.",          source: "حديث شريف", color: "pepper" },
        { _type: "quote", _key: "q3", text: "أصدقُ الرؤى ما كان عند الأسحار.",                     source: "أثر",       color: "oak"    },
      ],
    }),

    /* ─────────────── Three gates (cards) ─────────────── */
    defineField({
      name: "cardPublic",
      title: "البطاقة 1 — بوابة الرؤى العامة (أخضر زيتي)",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "title",
          title: "العنوان",
          type: "string",
          initialValue: "بوابة الرؤى العامة",
        }),
        defineField({
          name: "body",
          title: "النص",
          type: "text",
          rows: 3,
          initialValue:
            "مساحة تُروى فيها الرؤى العامة بتفاصيلها ودلالاتها، لفهم الرموز والإشارات والمعاني الكامنة خلفها.",
        }),
        defineField({
          name: "cta",
          title: "نص الزر",
          type: "string",
          initialValue: "قدّم رؤياك",
        }),
      ],
    }),
    defineField({
      name: "cardPrivate",
      title: "البطاقة 2 — بوابة الرؤى الشخصية (بني محمر)",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "title",
          title: "العنوان",
          type: "string",
          initialValue: "بوابة الرؤى الشخصية",
        }),
        defineField({
          name: "body",
          title: "النص",
          type: "text",
          rows: 3,
          initialValue:
            "مساحة خاصة بكَ، شارك رؤياك الخاصة لتُفسَّر رموزها في مساحة آمنة وهادئة بما تحمله من أثر ومعنى.",
        }),
        defineField({
          name: "cta",
          title: "نص الزر",
          type: "string",
          initialValue: "قدّم رؤياك",
        }),
      ],
    }),
    defineField({
      name: "cardInquiry",
      title: "البطاقة 3 — بوابة تساؤل واستعلام (بني)",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "title",
          title: "العنوان",
          type: "string",
          initialValue: "بوابة تساؤل واستعلام",
        }),
        defineField({
          name: "body",
          title: "النص",
          type: "text",
          rows: 3,
          initialValue:
            "نافذة للتساؤلات والاستفسارات العامة، تُطرح فيها الأفكار والرموز والمعاني المختلفة للبحث والتأمل.",
        }),
        defineField({
          name: "cta",
          title: "نص الزر",
          type: "string",
          initialValue: "ابدأ استعلامك",
        }),
      ],
    }),

    /* ─────────────── Blog section ─────────────── */
    defineField({
      name: "blogSection",
      title: "قسم المدونة",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "title",    title: "العنوان",       type: "string", initialValue: "الواردّ العلميِ" }),
        defineField({ name: "subtitle", title: "النص الفرعي",   type: "string", initialValue: "بحرْ العلمْ بوابةّ العالمْ فارتّق نْ" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "إعدادات الموقع — النصوص الرئيسية" }),
  },
});
