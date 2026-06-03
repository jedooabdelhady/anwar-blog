import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogGrid from "@/components/BlogGrid";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";
import { getAllPosts } from "@/sanity/lib/fetch";
import { CATEGORIES } from "@/data/posts";

export const metadata = {
  title: "المدونة",
  description:
    "مواضيع ومقالات تهمك — إدارة الأعمال، التسويق الرقمي، تطوير الذات والمزيد.",
};

export const revalidate = 60;

type Search = { category?: string };

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { category } = await searchParams;
  const posts = await getAllPosts();

  const filtered = category
    ? posts.filter((p) => p.category?.slug === category)
    : posts;

  const activeLabel =
    category && Object.values(CATEGORIES).find((c) => c.slug === category)?.label;

  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active="/blog" />
      <main>
        <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-6 pb-2 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-pepper">
            {activeLabel || "المدونة"}
          </h1>
          <p className="mt-2 text-pepper/70">مواضيع ومقالات تهمك</p>
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
            {Object.values(CATEGORIES).map((c) => (
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

        <BlogGrid posts={filtered} />
      </main>
      <Footer />
      <BottomWaves />
    </div>
  );
}
