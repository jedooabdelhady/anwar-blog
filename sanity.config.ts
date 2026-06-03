import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { anwarStudioTheme } from "./src/sanity/theme";
import { StudioLogo } from "./src/sanity/StudioLogo";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "لوحة أنوار",
  name: "anwar-studio",
  theme: anwarStudioTheme,
  icon: StudioLogo,
  studio: {
    components: {
      logo: StudioLogo,
    },
  },
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("المحتوى")
          .items([
            S.listItem()
              .title("المقالات")
              .child(S.documentTypeList("post").title("المقالات")),
            S.listItem()
              .title("التصنيفات")
              .child(S.documentTypeList("category").title("التصنيفات")),
            S.listItem()
              .title("الكتّاب")
              .child(S.documentTypeList("author").title("الكتّاب")),
            S.divider(),
            S.listItem()
              .title("📨 الرسائل الواردة")
              .child(
                S.documentTypeList("submission")
                  .title("النماذج المُرسلة")
                  .defaultOrdering([{ field: "createdAt", direction: "desc" }])
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
