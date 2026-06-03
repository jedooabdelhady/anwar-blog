import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export default defineType({
  name: "category",
  title: "تصنيف",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "اسم التصنيف",
      type: "string",
      validation: (R) => R.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "المعرّف (Slug)",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "وصف مختصر",
      type: "text",
      rows: 2,
    }),
  ],
});
