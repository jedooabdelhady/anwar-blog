import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

/**
 * Singleton document — the editor sees only ONE entry which contains all
 * the main editable text on the home page. No "create new" / no delete.
 */
export default defineType({
  name: "siteSettings",
  title: "إعدادات الموقع",
  type: "document",
  icon: CogIcon,
  fields: [
    /* ------------------ Brand ------------------ */
    defineField({
      name: "siteName",
      title: "اسم الموقع",
      description: "يظهر في تبويب المتصفح ومحركات البحث.",
      type: "string",
      initialValue: "علم تأويل الرؤى",
      validation: (R) => R.required().max(60),
    }),
    defineField({
      name: "siteTagline",
      title: "وصف مختصر للموقع (SEO)",
      description: "جملة قصيرة تصف الموقع في محركات البحث ووسائل التواصل.",
      type: "text",
      rows: 2,
      initialValue:
        "موقع عربي متخصص في علم تأويل الرؤى والأحلام، مع محتوى ثري في المعرفة والإلهام.",
      validation: (R) => R.max(200),
    }),

    /* ------------------ Hero banner ------------------ */
    defineField({
      name: "hero",
      title: "البانر الرئيسي",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "العنوان الكبير",
          type: "string",
          initialValue: "مرحباً بك في علم تأويل الرؤى",
          validation: (R) => R.required().max(80),
        }),
        defineField({
          name: "subtitle",
          title: "النص التحت العنوان",
          type: "text",
          rows: 3,
          initialValue:
            "مساحة عربية للتأمّل والتفسير، ومحتوى متخصص يعينك على فهم رؤاك والاطلاع على ما ينير دربك. شاركنا، اقرأ، وكن جزءاً من المجتمع.",
          validation: (R) => R.required().max(400),
        }),
      ],
    }),

    /* ------------------ The 3 cards ------------------ */
    defineField({
      name: "cardPublic",
      title: "البطاقة 1 — الرؤى العامة (أخضر زيتي)",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "title", title: "العنوان", type: "string", initialValue: "الرؤى العامة" }),
        defineField({
          name: "body",
          title: "النص",
          type: "text",
          rows: 2,
          initialValue: "نستقبل آرائكم ومقترحاتكم لتحسين خدماتنا",
        }),
        defineField({ name: "cta", title: "نص الزر", type: "string", initialValue: "تقديم رؤيتي" }),
      ],
    }),
    defineField({
      name: "cardPrivate",
      title: "البطاقة 2 — الرؤى الخاصة (بني محمر)",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "title", title: "العنوان", type: "string", initialValue: "الرؤى الخاصة" }),
        defineField({
          name: "body",
          title: "النص",
          type: "text",
          rows: 2,
          initialValue: "شاركنا رؤيتك الخاصة أو مشروعك لنناقشه معك",
        }),
        defineField({ name: "cta", title: "نص الزر", type: "string", initialValue: "تقديم رؤيتي" }),
      ],
    }),
    defineField({
      name: "cardInquiry",
      title: "البطاقة 3 — تساؤل واستعلام (بني)",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "title", title: "العنوان", type: "string", initialValue: "تساؤل واستعلام" }),
        defineField({
          name: "body",
          title: "النص",
          type: "text",
          rows: 2,
          initialValue: "نحن هنا للإجابة على تساؤلاتكم واستفساراتكم",
        }),
        defineField({ name: "cta", title: "نص الزر", type: "string", initialValue: "أرسل استفسارك" }),
      ],
    }),

    /* ------------------ Blog section header ------------------ */
    defineField({
      name: "blogSection",
      title: "قسم المدونة",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "title",
          title: "العنوان",
          type: "string",
          initialValue: "مدونتنا",
        }),
        defineField({
          name: "subtitle",
          title: "النص الفرعي",
          type: "string",
          initialValue: "مواضيع ومقالات تهمك",
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "إعدادات الموقع — النصوص الرئيسية" }),
  },
});
