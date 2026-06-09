/**
 * Sanity fetch helpers — gracefully fall back to the seed `POSTS` data when
 * Sanity isn't configured yet, so the site keeps working out of the box.
 */
import { client, writeClient } from "./client";
import { sanityConfigured } from "../env";
import {
  ALL_POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  ALL_SLUGS_QUERY,
  ALL_CATEGORIES_QUERY,
  SUBMISSION_BY_TOKEN_QUERY,
} from "./queries";
import { POSTS, CATEGORIES, type Post as SeedPost } from "@/data/posts";

export type PublicCategory = { slug: string; label: string };

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

export async function getAllCategories(): Promise<PublicCategory[]> {
  const seed: PublicCategory[] = Object.values(CATEGORIES).map((c) => ({
    slug: c.slug,
    label: c.label,
  }));
  if (!sanityConfigured) return seed;
  try {
    const cats = await client.fetch<PublicCategory[]>(
      ALL_CATEGORIES_QUERY,
      {},
      { next: { revalidate: 60, tags: ["categories"] } }
    );
    return cats?.length ? cats : seed;
  } catch (err) {
    console.warn("[sanity] getAllCategories failed, using seed:", err);
    return seed;
  }
}

export type PublicSubmission = {
  _id: string;
  name?: string;
  kind?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
  replyMessage?: string;
  replySentAt?: string;
  status?: string;
};

export async function getSubmissionByToken(
  token: string
): Promise<PublicSubmission | null> {
  if (!sanityConfigured) return null;
  if (!/^[a-f0-9-]{20,60}$/i.test(token)) return null;
  try {
    // Sanity v7's typed fetch overloads reject ad-hoc params unless the
    // query is a tagged `groq` literal; cast + bind at the boundary so
    // the raw groq string keeps working like POST_BY_SLUG_QUERY does at
    // runtime AND `this` stays attached for the private #httpRequest.
    // Use writeClient (no CDN) so a just-submitted inquiry shows up
    // immediately — the public CDN can lag a few seconds.
    const fetchByToken = writeClient.fetch.bind(writeClient) as (
      query: string,
      params: Record<string, string>
    ) => Promise<PublicSubmission | null>;
    const sub = await fetchByToken(SUBMISSION_BY_TOKEN_QUERY, { token });
    return sub ?? null;
  } catch (err) {
    console.warn("[sanity] getSubmissionByToken failed:", err);
    return null;
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
