import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export default defineType({
  name: "author",
  title: "كاتب",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "الاسم",
      type: "string",
      validation: (R) => R.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "المعرّف",
      type: "slug",
      options: { source: "name" },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "avatar",
      title: "الصورة الشخصية",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "نبذة",
      type: "text",
      rows: 3,
    }),
  ],
});
