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
  title: "لوحة علم تأويل الرؤى",
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
    // Prevent creating duplicates of the singleton siteSettings doc.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((t) => t.templateId !== "siteSettings");
      }
      return prev;
    },
    // Hide the default `unpublish` action for non-technical safety;
    // additionally lock down siteSettings so it can't be deleted/duplicated.
    actions: (prev, { schemaType }) => {
      if (schemaType === "siteSettings") {
        return prev.filter(
          ({ action }) =>
            !["unpublish", "duplicate", "delete"].includes(action ?? "")
        );
      }
      return prev.filter((a) => !["unpublish"].includes(a.action ?? ""));
    },
  },

  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("المحتوى")
          .items([
            // Singleton settings document — pinned at top
            S.listItem()
              .title("⚙️ إعدادات الموقع")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("إعدادات الموقع")
              ),
            S.divider(),
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
            S.listItem()
              .title("👥 الأعضاء")
              .child(
                S.documentTypeList("user")
                  .title("الأعضاء المسجَّلون")
                  .defaultOrdering([{ field: "createdAt", direction: "desc" }])
              ),
          ]),
    }),
    // visionTool removed: developer-only feature, not relevant for editors.
  ],
});
