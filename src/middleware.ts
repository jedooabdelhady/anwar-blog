import { NextResponse, type NextRequest } from "next/server";

/**
 * Site-wide security headers.
 *
 * Most of these can also be set in next.config.ts, but putting them in
 * middleware means they apply uniformly to API routes, static pages, and
 * dynamic pages without separate declarations.
 *
 * Notably skipped:
 * - Content-Security-Policy: Sanity Studio injects inline scripts at
 *   runtime, so a strict CSP would break /studio. Adding a tightly-
 *   scoped CSP for the non-studio routes is a future hardening step.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Block embedding in iframes except by same origin — defends against
  // clickjacking on auth and account pages.
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  // Disable browser features we don't use.
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  // HSTS only in production where HTTPS is actually enforced.
  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  return res;
}

export const config = {
  // Apply to everything except Next.js internals, the favicon, and static
  // assets — those don't benefit from these headers and shaving the
  // middleware off them keeps cold-start fast.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|opengraph-image.png|manifest.webmanifest|robots.txt|sitemap.xml).*)",
  ],
};
