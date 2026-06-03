import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/sanity/lib/settings";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

/**
 * Page metadata is driven by Sanity siteSettings — the editor can change
 * site name, tagline, and link-preview copy from /studio without redeploys.
 */
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();

  return {
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
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-clay text-pepper font-sans">
        {children}
      </body>
    </html>
  );
}
