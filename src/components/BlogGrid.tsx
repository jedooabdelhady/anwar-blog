import BlogCard from "./BlogCard";
import type { PublicPost } from "@/sanity/lib/fetch";

type Props = {
  posts: PublicPost[];
};

export default function BlogGrid({ posts }: Props) {
  return (
    <section
      aria-labelledby="blog-heading"
      className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-12 sm:py-16"
    >
      <header className="text-center mb-12">
        <h2
          id="blog-heading"
          className="text-2xl sm:text-3xl font-bold text-pepper inline-flex items-center justify-center"
        >
          <span className="section-title-deco">
            <span className="section-title-deco-dot" />
            <span>مدونتنا</span>
            <span className="section-title-deco-dot" />
          </span>
        </h2>
        <p className="mt-2 text-pepper/70 text-sm sm:text-base">
          مواضيع ومقالات تهمك
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 sm:gap-y-14">
        {posts.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
