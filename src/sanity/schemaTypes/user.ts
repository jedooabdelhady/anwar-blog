import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export default defineType({
  name: "user",
  title: "الأعضاء",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "username",
      title: "اسم المستخدم",
      type: "string",
      description: "فريد، أحرف لاتينية وأرقام و _ فقط، 3-32 حرفاً.",
      validation: (R) =>
        R.required().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/, {
          name: "username",
          invert: false,
        }),
    }),
    defineField({
      name: "email",
      title: "البريد الإلكتروني",
      type: "string",
      description: "يُحفظ بحروف صغيرة.",
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: "emailVerified",
      title: "تم التحقق من البريد",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "displayName",
      title: "الاسم الظاهر",
      type: "string",
      description: "الاسم الذي يظهر على الرسائل والتعليقات.",
    }),
    defineField({
      name: "phone",
      title: "الجوال (اختياري)",
      type: "string",
    }),
    defineField({
      name: "passwordHash",
      title: "كلمة المرور (مشفّرة)",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "role",
      title: "الدور",
      type: "string",
      options: {
        list: [
          { title: "عضو", value: "member" },
          { title: "مسؤول", value: "admin" },
        ],
      },
      initialValue: "member",
    }),
    defineField({
      name: "verifyToken",
      title: "رمز تفعيل البريد",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "verifyExpiresAt",
      title: "صلاحية رمز التفعيل",
      type: "datetime",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "resetToken",
      title: "رمز استرداد كلمة المرور",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "resetExpiresAt",
      title: "صلاحية رمز الاسترداد",
      type: "datetime",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "createdAt",
      title: "تاريخ التسجيل",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "lastLoginAt",
      title: "آخر دخول",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "sessionVersion",
      title: "إصدار الجلسة",
      type: "number",
      readOnly: true,
      hidden: true,
      description:
        "يُزاد عند تغيير كلمة المرور — يُبطل الجلسات القديمة تلقائياً.",
      initialValue: 1,
    }),
    defineField({
      name: "failedLoginCount",
      title: "محاولات دخول فاشلة",
      type: "number",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "lockedUntil",
      title: "مقفول حتى",
      type: "datetime",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: { title: "username", subtitle: "email", verified: "emailVerified" },
    prepare({ title, subtitle, verified }) {
      return {
        title: title || "بدون اسم",
        subtitle: `${subtitle || ""}${verified ? " • مفعّل" : " • غير مفعّل"}`,
      };
    },
  },
  orderings: [
    {
      title: "الأحدث تسجيلاً",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
