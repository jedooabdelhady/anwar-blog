/**
 * Sanity fetch helpers — gracefully fall back to the seed `POSTS` data when
 * Sanity isn't configured yet, so the site keeps working out of the box.
 */
import { client } from "./client";
import { sanityConfigured } from "../env";
import {
  ALL_POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  ALL_SLUGS_QUERY,
} from "./queries";
import { POSTS, CATEGORIES, type Post as SeedPost } from "@/data/posts";

export type PublicPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt?: string;
  category: { slug: string; label: string };
  author?: { name: string; avatar?: string; bio?: string } | null;
  publishedAt: string;
  readingTime: number;
  body?: unknown; // PortableText blocks when from Sanity, string when from seed
};

function seedToPublic(p: SeedPost): PublicPost {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    image: p.image,
    category: { slug: CATEGORIES[p.category].slug, label: CATEGORIES[p.category].label },
    publishedAt: p.publishedAt,
    readingTime: p.readingTime,
    body: p.body, // plain string fallback
  };
}

export async function getAllPosts(): Promise<PublicPost[]> {
  if (!sanityConfigured) return POSTS.map(seedToPublic);
  try {
    const posts = await client.fetch<PublicPost[]>(
      ALL_POSTS_QUERY,
      {},
      { next: { revalidate: 60, tags: ["posts"] } }
    );
    return posts?.length ? posts : POSTS.map(seedToPublic);
  } catch (err) {
    console.warn("[sanity] getAllPosts failed, using seed:", err);
    return POSTS.map(seedToPublic);
  }
}

export async function getPostBySlug(slug: string): Promise<PublicPost | null> {
  if (!sanityConfigured) {
    const p = POSTS.find((x) => x.slug === slug);
    return p ? seedToPublic(p) : null;
  }
  try {
    const post = await client.fetch<PublicPost | null>(
      POST_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60, tags: [`post:${slug}`] } }
    );
    if (post) return post;
    const p = POSTS.find((x) => x.slug === slug);
    return p ? seedToPublic(p) : null;
  } catch (err) {
    console.warn("[sanity] getPostBySlug failed, using seed:", err);
    const p = POSTS.find((x) => x.slug === slug);
    return p ? seedToPublic(p) : null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  if (!sanityConfigured) return POSTS.map((p) => p.slug);
  try {
    const slugs = await client.fetch<string[]>(ALL_SLUGS_QUERY);
    return slugs?.length ? slugs : POSTS.map((p) => p.slug);
  } catch {
    return POSTS.map((p) => p.slug);
  }
}
