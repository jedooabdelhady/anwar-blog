import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export default defineType({
  name: "post",
  title: "مقال",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "العنوان",
      type: "string",
      validation: (R) => R.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "الرابط (Slug)",
      type: "slug",
      options: { source: "title", maxLength: 120 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "excerpt",
      title: "نبذة مختصرة",
      type: "text",
      rows: 3,
      validation: (R) => R.max(280),
    }),
    defineField({
      name: "image",
      title: "صورة الغلاف",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "نص بديل (Alt)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "category",
      title: "التصنيف",
      type: "reference",
      to: [{ type: "category" }],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "author",
      title: "الكاتب",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      title: "تاريخ النشر",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (R) => R.required(),
    }),
    defineField({
      name: "body",
      title: "المحتوى",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "نص", value: "normal" },
            { title: "عنوان 2", value: "h2" },
            { title: "عنوان 3", value: "h3" },
            { title: "اقتباس", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "عريض", value: "strong" },
              { title: "مائل", value: "em" },
              { title: "تحته خط", value: "underline" },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "نص بديل (Alt)",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "تعليق على الصورة",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "تحسين محركات البحث (SEO)",
      type: "object",
      fields: [
        defineField({ name: "metaTitle",       title: "عنوان Meta",      type: "string" }),
        defineField({ name: "metaDescription", title: "وصف Meta",        type: "text", rows: 2 }),
      ],
    }),
  ],
  orderings: [
    {
      title: "الأحدث أولاً",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      category: "category.title",
      publishedAt: "publishedAt",
    },
    prepare({ title, media, category, publishedAt }) {
      const d = publishedAt ? new Date(publishedAt).toLocaleDateString("ar-EG") : "";
      return {
        title: title || "بدون عنوان",
        subtitle: [category, d].filter(Boolean).join(" • "),
        media,
      };
    },
  },
});
