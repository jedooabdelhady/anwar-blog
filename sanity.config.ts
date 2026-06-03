import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
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
  /**
   * Hide the Releases (content scheduling) tool from the navbar.
   * It is powerful but adds chrome a non-technical editor doesn't need.
   * Can be re-enabled by removing `releases.enabled: false`.
   */
  releases: { enabled: false },

  /**
   * Default to the Drafts perspective so the editor sees their work-in-progress
   * by default (instead of "Published" which feels confusing while drafting).
   */
  document: {
    // Hide the default action `unpublish` for non-technical safety — they can
    // still delete via Field actions if truly needed.
    actions: (prev) =>
      prev.filter((a) => !["unpublish"].includes(a.action ?? "")),
  },

  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("المحتوى")
          .items([
            S.listItem()
              .title("📝 المقالات")
              .child(
                S.documentTypeList("post")
                  .title("المقالات")
                  .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
              ),
            S.listItem()
              .title("🏷️ التصنيفات")
              .child(S.documentTypeList("category").title("التصنيفات")),
            S.listItem()
              .title("👤 الكتّاب")
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
    // visionTool removed: developer-only feature, not relevant for editors.
  ],
});
