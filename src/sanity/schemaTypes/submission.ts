import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export default defineType({
  name: "submission",
  title: "النماذج المُرسلة",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "kind",
      title: "نوع النموذج",
      type: "string",
      options: {
        list: [
          { title: "رؤية عامة (آراء ومقترحات)", value: "public-vision" },
          { title: "رؤية خاصة (مشروع / نقاش)",   value: "private-vision" },
          { title: "تساؤل واستعلام",              value: "inquiry" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({ name: "name",    title: "الاسم",   type: "string",  validation: (R) => R.required().max(120) }),
    defineField({ name: "email",   title: "البريد",  type: "string",  validation: (R) => R.email() }),
    defineField({ name: "phone",   title: "الجوال",  type: "string" }),
    defineField({ name: "subject", title: "الموضوع", type: "string" }),
    defineField({
      name: "message",
      title: "الرسالة",
      type: "text",
      rows: 6,
      validation: (R) => R.required().min(3),
    }),
    defineField({
      name: "createdAt",
      title: "وصلت في",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "جديدة",   value: "new" },
          { title: "قيد المراجعة", value: "review" },
          { title: "تم الرد",  value: "answered" },
          { title: "أُرشفت",   value: "archived" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "replyMessage",
      title: "ردّ المسؤول",
      type: "text",
      rows: 8,
      description:
        "اكتب الرد هنا ثم انشر المستند — سيُرسَل تلقائيًا للعميل عبر البريد. يتطلب وجود بريد العميل بالأعلى.",
    }),
    defineField({
      name: "replySentAt",
      title: "أُرسل الرد في",
      type: "datetime",
      readOnly: true,
      description:
        "يُحدَّث تلقائيًا بعد إرسال الرد. لو فاضي معناه أن الرد لم يُرسَل بعد.",
    }),
    defineField({
      name: "replyError",
      title: "خطأ في إرسال الرد",
      type: "string",
      readOnly: true,
      hidden: ({ document }) => !document?.replyError,
    }),
    defineField({
      name: "accessToken",
      title: "رابط العميل (Access Token)",
      type: "string",
      readOnly: true,
      description:
        "معرّف فريد لرابط المحادثة العامة. للوصول: https://sahaarr299.com/inquiry/{accessToken}",
    }),
  ],
  orderings: [
    {
      title: "الأحدث أولاً",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", kind: "kind", createdAt: "createdAt", status: "status" },
    prepare({ title, kind, createdAt, status }) {
      const KIND: Record<string, string> = {
        "public-vision":  "رؤية عامة",
        "private-vision": "رؤية خاصة",
        "inquiry":        "استعلام",
      };
      const d = createdAt ? new Date(createdAt).toLocaleDateString("ar-EG") : "";
      return {
        title: title || "بدون اسم",
        subtitle: [KIND[kind || ""] || kind, status, d].filter(Boolean).join(" • "),
      };
    },
  },
});
