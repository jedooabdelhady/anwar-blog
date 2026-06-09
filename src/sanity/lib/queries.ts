/** GROQ queries used by the public site. */

export const ALL_POSTS_QUERY = /* groq */ `
*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  excerpt,
  "image": image.asset->url,
  "imageAlt": image.alt,
  "category": category->{ "slug": slug.current, "label": title },
  publishedAt,
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}
`;

export const POST_BY_SLUG_QUERY = /* groq */ `
*[_type == "post" && slug.current == $slug][0] {
  "slug": slug.current,
  title,
  excerpt,
  "image": image.asset->url,
  "imageAlt": image.alt,
  "category": category->{ "slug": slug.current, "label": title },
  "author": author->{ name, "avatar": avatar.asset->url, bio },
  publishedAt,
  body,
  seo,
  "readingTime": round(length(pt::text(body)) / 5 / 180)
}
`;

export const ALL_SLUGS_QUERY = /* groq */ `
*[_type == "post" && defined(slug.current)][].slug.current
`;

export const ALL_CATEGORIES_QUERY = /* groq */ `
*[_type == "category"] | order(title asc) { "slug": slug.current, "label": title }
`;

export const SUBMISSION_BY_TOKEN_QUERY = /* groq */ `
*[_type == "submission" && accessToken == $token][0]{
  _id, name, kind, subject, message, createdAt,
  replyMessage, replySentAt, status
}
`;
