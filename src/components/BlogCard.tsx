import Image from "next/image";
import Link from "next/link";
import type { PublicPost } from "@/sanity/lib/fetch";

type Props = {
  post: PublicPost;
  /** Boost first-row cards: eager-load + high fetch priority for LCP. */
  priority?: boolean;
};

export default function BlogCard({ post, priority = false }: Props) {
  return (
    <article className="flex flex-col items-center text-center">
      <Link
        href={`/blog/${post.slug}`}
        className="block group focus-visible:outline-none"
        aria-label={post.title}
      >
        <div className="relative w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] rounded-full overflow-hidden border-4 border-clay shadow-[0_10px_24px_-12px_rgba(56,38,28,0.35)] ring-1 ring-line">
          <Image
            src={post.image}
            alt={post.imageAlt || post.title}
            fill
            sizes="170px"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <h3 className="mt-5 text-lg sm:text-xl font-bold text-pepper">
        <Link
          href={`/blog/${post.slug}`}
          className="hover:text-sienna transition-colors"
        >
          {post.title}
        </Link>
      </h3>

      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-flex items-center justify-center rounded-full px-6 py-2 text-white text-sm font-medium transition-colors"
        style={{ background: "#6B3F23" }}
      >
        اقرأ المزيد
      </Link>
    </article>
  );
}
