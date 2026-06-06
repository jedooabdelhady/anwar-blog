import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogGrid from "@/components/BlogGrid";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";
import { getAllPosts, getAllCategories } from "@/sanity/lib/fetch";

export const metadata = {
  title: "ٱلْمَكْتَبَةُ",
  description:
    "مكتبة علم تأويل الرؤى — مقالات ودراسات في تفسير الأحلام والمعرفة.",
};

export const revalidate = 60;

type Search = { category?: string };

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { category } = await searchParams;
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  const filtered = category
    ? posts.filter((p) => p.category?.slug === category)
    : posts;

  const activeLabel =
    category && categories.find((c) => c.slug === category)?.label;

  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active="/blog" />
      <main>
        <section className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12 pt-6 pb-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-pepper mb-5">
            {activeLabel || "ٱلْمَكْتَبَةُ"}
          </h1>
          {!activeLabel && (
            <blockquote
              className="text-base sm:text-lg leading-loose font-semibold"
              style={{ color: "#2d5a3d" }}
            >
              <span style={{ fontSize: "1.25em", margin: "0 0.15em" }}>﴿</span>
              {"۞"}رَبِّ قَدۡ ءَاتَيۡتَنِي مِنَ ٱلۡمُلۡكِ وَعَلَّمۡتَنِي
              مِن تَأۡوِيلِ ٱلۡأَحَادِيثِۚ فَاطِرَ ٱلسَّمَٰوَٰتِ وَٱلۡأَرۡضِ
              أَنتَ وَلِيِّۦ فِي ٱلدُّنۡيَا وَٱلۡأٓخِرَةِۖ تَوَفَّنِي مُسۡلِمٗا
              وَأَلۡحِقۡنِي بِٱلصَّٰلِحِينَ
              <span style={{ fontSize: "1.25em", margin: "0 0.15em" }}>﴾</span>
            </blockquote>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-2 pb-4">
          <ul className="flex flex-wrap justify-center gap-2">
            <li>
              <a
                href="/blog"
                className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm border transition-colors ${
                  !category
                    ? "bg-sienna text-white border-sienna"
                    : "bg-card text-pepper border-line hover:border-sienna"
                }`}
              >
                الكل
              </a>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <a
                  href={`/blog?category=${c.slug}`}
                  className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm border transition-colors ${
                    category === c.slug
                      ? "bg-sienna text-white border-sienna"
                      : "bg-card text-pepper border-line hover:border-sienna"
                  }`}
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {filtered.length > 0 ? (
          <BlogGrid posts={filtered} title="" subtitle="" />
        ) : (
          <section className="mx-auto max-w-2xl px-5 sm:px-8 py-16 text-center">
            <div className="rounded-3xl border border-line bg-card p-10">
              <p className="text-pepper text-lg font-bold mb-2">
                لا توجد مقالات في هذا التصنيف بعد
              </p>
              <p className="text-pepper/70 text-sm">
                نعمل على إضافة محتوى جديد قريباً — تابعنا.
              </p>
              <a
                href="/blog"
                className="inline-block mt-6 rounded-full px-6 py-2 bg-sienna text-white text-sm font-medium hover:bg-pepper transition-colors"
              >
                عرض كل المقالات
              </a>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <BottomWaves />
    </div>
  );
}
