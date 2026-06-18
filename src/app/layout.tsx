import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings } from "@/sanity/lib/settings";
import { canonicalSiteUrl } from "@/lib/site-url";

/**
 * Page metadata is driven by Sanity siteSettings — the editor can change
 * site name, tagline, and link-preview copy from /studio without redeploys.
 */
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const origin = canonicalSiteUrl();

  return {
    metadataBase: new URL(origin),
    title: {
      default: `${s.siteName} — مساحة عربية للتفسير والمعرفة`,
      template: `%s | ${s.siteName}`,
    },
    description: s.siteTagline,
    keywords: [
      s.siteName,
      "تأويل الرؤى",
      "تفسير الأحلام",
      "تطوير الذات",
      "محتوى عربي",
    ],
    openGraph: {
      type: "website",
      locale: "ar_SA",
      siteName: s.siteName,
      title: s.siteName,
      description: s.siteTagline,
    },
    twitter: {
      card: "summary_large_image",
      title: s.siteName,
      description: s.siteTagline,
    },
    robots: { index: true, follow: true },
    // Search-engine ownership verification. Each value is the bare token
    // from the provider's UI (Google Search Console / Bing Webmaster) —
    // Next renders it as the right <meta> tag automatically. Leaving an
    // env var unset hides the tag, so this is safe to keep enabled.
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.YANDEX_VERIFICATION || undefined,
      other: process.env.BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
        : undefined,
    },
    alternates: {
      canonical: origin,
    },
  };
}

/** Apply brand color to mobile browser chrome (status bar / tab strip). */
export const viewport = {
  themeColor: "#6B3F23",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-clay text-pepper font-sans">
        {children}
      </body>
    </html>
  );
}
