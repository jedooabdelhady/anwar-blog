import BlogCard from "./BlogCard";
import type { PublicPost } from "@/sanity/lib/fetch";

type Props = {
  posts: PublicPost[];
  /** Section title — when empty, the header is hidden entirely. */
  title?: string;
  subtitle?: string;
};

/** Faint Thamudic / Tifinagh-style row used as a backdrop behind the
 *  section title, evoking the inscribed-stone look the client showed. */
const BACKDROP_GLYPHS = "ⵀⵙⴻⴽⵏⵎⵓⵣⵉⵜⵒⴹⴳⴱⴷⵟⵍⵕⵇⵖⵅ";

export default function BlogGrid({
  posts,
  title = "مدونتنا",
  subtitle = "مواضيع ومقالات تهمك",
}: Props) {
  return (
    <section
      aria-labelledby="blog-heading"
      className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-12 sm:py-16"
    >
      {title && (
        <header className="relative text-center mb-12 py-4">
          {/* Faded inscription backdrop — only behind the heading area */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden select-none"
          >
            <div
              className="max-w-full overflow-hidden text-center"
              style={{
                color: "#6B3F23",
                opacity: 0.10,
                fontSize: "clamp(36px, 7vw, 64px)",
                letterSpacing: "0.25em",
                lineHeight: 1.15,
                fontFamily: "'Times New Roman', serif",
              }}
            >
              <div>{BACKDROP_GLYPHS}</div>
              <div className="mt-2">{BACKDROP_GLYPHS}</div>
            </div>
          </div>

          {/* Title with ◐ / ◑ half-circle ornaments (no side dashes) */}
          <h2
            id="blog-heading"
            className="text-2xl sm:text-3xl font-bold text-pepper inline-flex items-center justify-center gap-3"
          >
            <span aria-hidden style={{ color: "#6B3F23", fontSize: "0.75em" }}>
              ◐
            </span>
            <span>{title}</span>
            <span aria-hidden style={{ color: "#6B3F23", fontSize: "0.75em" }}>
              ◑
            </span>
          </h2>

          {subtitle && (
            <p className="mt-2 text-pepper/75 text-sm sm:text-base">
              {subtitle}
            </p>
          )}
        </header>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 sm:gap-y-14">
        {posts.map((p, i) => (
          <BlogCard key={p.slug} post={p} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}
