import { defineField, defineType, defineArrayMember } from "sanity";
import { CogIcon } from "@sanity/icons";

const SLIDE_COLORS = [
  { title: "🟫 بني محمر (Sienna)",     value: "sienna" },
  { title: "🟤 بني فاتح (Oak)",         value: "oak" },
  { title: "⬛ بني داكن (Pepper)",      value: "pepper" },
  { title: "🫒 زيتي (Gum)",             value: "gum" },
  { title: "📜 مخطوط فاتح (Smoke)",    value: "smoke" },
] as const;

const COLOR_LABEL: Record<string, string> = {
  sienna: "🟫 بني محمر",
  oak: "🟤 بني فاتح",
  pepper: "⬛ بني داكن",
  gum: "🫒 زيتي",
  smoke: "📜 مخطوط",
};

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
      title: "🎠 شرائح البانر المتحرك",
      description:
        "هذه الاقتباسات تظهر في أعلى الصفحة الرئيسية وتتبدّل كل 6 ثواني. اسحب الشرائح بزر ⋮⋮ لتغيير ترتيبها. كل شريحة لها 3 حقول فقط: النص + المصدر (اختياري) + اللون.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "quote",
          title: "شريحة",
          fields: [
            defineField({
              name: "text",
              title: "✍️ نص الاقتباس (مطلوب)",
              description:
                'اكتبي الاقتباس هنا. لتغميق كلمة احطّيها بين نجمتين، مثل: **الحكمة**. مثال كامل: "صدقُ الرؤى ما كان عند **الأسحار**".',
              type: "text",
              rows: 3,
              validation: (R) => R.required().min(3).max(300),
            }),
            defineField({
              name: "source",
              title: "📚 المصدر (اختياري)",
              description:
                'مَن قائل الاقتباس أو من أين؟ مثل: "حديث شريف"، "مثل عربي"، "ابن سيرين".',
              type: "string",
              validation: (R) => R.max(80),
            }),
            defineField({
              name: "color",
              title: "🎨 لون خلفية الشريحة",
              description: "اختاري لوناً مناسباً للاقتباس.",
              type: "string",
              options: { list: [...SLIDE_COLORS], layout: "radio" },
              initialValue: "sienna",
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: { text: "text", source: "source", color: "color" },
            prepare: ({ text, source, color }) => {
              const safeText = (text || "").trim();
              const title = safeText
                ? safeText.length > 60
                  ? safeText.slice(0, 60) + "…"
                  : safeText
                : "⚠️ شريحة فارغة — اضغطي لكتابة النص";
              const colorPart = COLOR_LABEL[color || ""] || "🎨";
              const subtitle = source
                ? `${colorPart} • ${source}`
                : colorPart;
              return { title, subtitle };
            },
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
      title: "🫒 البطاقة 1 — بوابة الرؤى العامة",
      description: "البطاقة الأولى من الثلاث الظاهرة وسط الصفحة الرئيسية.",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "عنوان البطاقة",
          type: "string",
          initialValue: "بوابة الرؤى العامة",
          validation: (R) => R.required().max(40),
        }),
        defineField({
          name: "body",
          title: "نص البطاقة",
          description: "وصف قصير يظهر تحت العنوان (سطران تقريباً).",
          type: "text",
          rows: 3,
          initialValue:
            "مساحة تُروى فيها الرؤى العامة بتفاصيلها ودلالاتها، لفهم الرموز والإشارات والمعاني الكامنة خلفها.",
          validation: (R) => R.required().max(220),
        }),
        defineField({
          name: "cta",
          title: "نص الزر",
          type: "string",
          initialValue: "قدّم رؤياك",
          validation: (R) => R.required().max(24),
        }),
      ],
      preview: {
        select: { title: "title", subtitle: "body" },
        prepare: ({ title, subtitle }) => ({
          title: title || "بوابة الرؤى العامة",
          subtitle: subtitle?.slice(0, 80),
        }),
      },
    }),
    defineField({
      name: "cardPrivate",
      title: "🟫 البطاقة 2 — بوابة الرؤى الشخصية",
      description: "البطاقة الوسطى — اللون البني المحمر.",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "عنوان البطاقة",
          type: "string",
          initialValue: "بوابة الرؤى الشخصية",
          validation: (R) => R.required().max(40),
        }),
        defineField({
          name: "body",
          title: "نص البطاقة",
          type: "text",
          rows: 3,
          initialValue:
            "مساحة خاصة بكَ، شارك رؤياك الخاصة لتُفسَّر رموزها في مساحة آمنة وهادئة بما تحمله من أثر ومعنى.",
          validation: (R) => R.required().max(220),
        }),
        defineField({
          name: "cta",
          title: "نص الزر",
          type: "string",
          initialValue: "قدّم رؤياك",
          validation: (R) => R.required().max(24),
        }),
      ],
      preview: {
        select: { title: "title", subtitle: "body" },
        prepare: ({ title, subtitle }) => ({
          title: title || "بوابة الرؤى الشخصية",
          subtitle: subtitle?.slice(0, 80),
        }),
      },
    }),
    defineField({
      name: "cardInquiry",
      title: "🟤 البطاقة 3 — بوابة تساؤل واستعلام",
      description: "البطاقة الثالثة — اللون البني الفاتح.",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "عنوان البطاقة",
          type: "string",
          initialValue: "بوابة تساؤل واستعلام",
          validation: (R) => R.required().max(40),
        }),
        defineField({
          name: "body",
          title: "نص البطاقة",
          type: "text",
          rows: 3,
          initialValue:
            "نافذة للتساؤلات والاستفسارات العامة، تُطرح فيها الأفكار والرموز والمعاني المختلفة للبحث والتأمل.",
          validation: (R) => R.required().max(220),
        }),
        defineField({
          name: "cta",
          title: "نص الزر",
          type: "string",
          initialValue: "ابدأ استعلامك",
          validation: (R) => R.required().max(24),
        }),
      ],
      preview: {
        select: { title: "title", subtitle: "body" },
        prepare: ({ title, subtitle }) => ({
          title: title || "بوابة تساؤل واستعلام",
          subtitle: subtitle?.slice(0, 80),
        }),
      },
    }),

    /* ─────────────── Videos section ─────────────── */
    defineField({
      name: "videos",
      title: "🎬 مقاطع الفيديو",
      description:
        "تظهر بين البطاقات والمكتبة في الصفحة الرئيسية. الصق رابط يوتيوب لكل مقطع — الصورة المصغّرة تُجلب تلقائياً. اسحبي بزر ⋮⋮ لإعادة الترتيب، واضغطي ⋯ → Remove للحذف.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "video",
          title: "مقطع فيديو",
          fields: [
            defineField({
              name: "title",
              title: "✍️ عنوان المقطع (مطلوب)",
              description: "نص قصير يظهر تحت الصورة المصغّرة.",
              type: "string",
              validation: (R) => R.required().min(3).max(120),
            }),
            defineField({
              name: "url",
              title: "🔗 رابط يوتيوب (مطلوب)",
              description:
                'الصق الرابط الكامل من يوتيوب. أمثلة مقبولة: "https://youtu.be/XXXXXXXXXXX" أو "https://www.youtube.com/watch?v=XXXXXXXXXXX".',
              type: "url",
              validation: (R) =>
                R.required().uri({ scheme: ["http", "https"] }).custom((value) => {
                  if (!value) return true;
                  const ok = /(youtube\.com\/(watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)[A-Za-z0-9_-]{6,}/.test(
                    value
                  );
                  return ok || "الرابط يجب أن يكون من يوتيوب.";
                }),
            }),
            defineField({
              name: "description",
              title: "📝 وصف مختصر (اختياري)",
              description: "سطر قصير يظهر تحت العنوان.",
              type: "text",
              rows: 2,
              validation: (R) => R.max(160),
            }),
          ],
          preview: {
            select: { title: "title", url: "url" },
            prepare: ({ title, url }) => ({
              title: title || "⚠️ مقطع بدون عنوان",
              subtitle: url || "🔗 لم يُضف رابط",
            }),
          },
        }),
      ],
    }),

    /* ─────────────── Blog section ─────────────── */
    defineField({
      name: "blogSection",
      title: "📚 قسم المكتبة",
      description: "العنوان والوصف الذي يظهر فوق قائمة المقالات في الصفحة الرئيسية.",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "العنوان",
          type: "string",
          initialValue: "الوارد العلمي",
          validation: (R) => R.max(40),
        }),
        defineField({
          name: "subtitle",
          title: "النص الفرعي",
          type: "string",
          initialValue: "بحر العلم بوابة العالم فارتق",
          validation: (R) => R.max(140),
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "إعدادات الموقع — النصوص الرئيسية" }),
  },
});
