import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";
import { getAllSlugs, getPostBySlug } from "@/sanity/lib/fetch";

type Params = { slug: string };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "غير موجود" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

const portableComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-loose">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl font-bold text-pepper mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl font-bold text-pepper mt-6 mb-3">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-r-4 border-sienna ps-5 my-6 text-pepper/85 italic">
        {children}
      </blockquote>
    ),
  },
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const dateFmt = new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.publishedAt));

  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active="/blog" />
      <main>
        <article className="mx-auto max-w-3xl px-5 sm:px-8 py-8">
          <nav className="mb-6 text-sm text-pepper/70 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-sienna">الرئيسية</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-sienna">المدونة</Link>
            <span>/</span>
            <span className="text-pepper">{post.title}</span>
          </nav>

          {post.image && (
            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden mb-8 ring-1 ring-line shadow-[0_14px_34px_-22px_rgba(56,38,28,0.35)]">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-pepper/75 mb-4">
            {post.category && (
              <span className="inline-flex items-center gap-1.5">
                <Tag size={14} />
                <Link
                  href={`/blog?category=${post.category.slug}`}
                  className="hover:text-sienna"
                >
                  {post.category.label}
                </Link>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} />
              {dateFmt}
            </span>
            {post.readingTime ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} />
                {post.readingTime} دقائق قراءة
              </span>
            ) : null}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-pepper leading-tight mb-6">
            {post.title}
          </h1>

          <div className="prose-anwar text-pepper/90 text-base sm:text-lg leading-loose">
            {post.excerpt && (
              <p className="text-lg text-pepper/80 mb-6 font-medium">
                {post.excerpt}
              </p>
            )}

            {Array.isArray(post.body) ? (
              <PortableText
                value={post.body as PortableTextBlock[]}
                components={portableComponents}
              />
            ) : typeof post.body === "string" ? (
              <p className="mb-4 leading-loose">{post.body}</p>
            ) : null}
          </div>

          {/* Share row — ONLY on a published article. */}
          <div className="mt-12 pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <ShareButtons title={post.title} path={`/blog/${post.slug}`} />

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-pepper/80 hover:text-sienna transition-colors"
            >
              العودة إلى المدونة
              <ArrowRight size={16} className="rotate-180" />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
      <BottomWaves />
    </div>
  );
}
