/**
 * Single source of truth for the site's canonical origin.
 *
 * We can't trust NEXT_PUBLIC_SITE_URL to be perfectly shaped: editors
 * paste either "sahaarr299.com" (no scheme) or "https://sahaarr299.com/"
 * (with trailing slash). Both forms break things downstream — Next will
 * happily emit `<link rel="canonical" href="sahaarr299.com">` which
 * Google then interprets as a relative URL, and email link generators
 * will produce invalid hrefs.
 *
 * Normalise once, here, and use the result everywhere that needs the
 * site URL.
 */
const DEFAULT_ORIGIN = "https://sahaarr299.com";

export function canonicalSiteUrl(): string {
  let raw = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_ORIGIN).trim();
  raw = raw.replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  return raw;
}
