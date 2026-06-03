import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "تأويل الرؤى — مساحة عربية للتفسير والمعرفة",
    template: "%s | تأويل الرؤى",
  },
  description:
    "مدونة عربية متخصصة في تأويل الرؤى والأحلام، مع محتوى ثري في التطوير الذاتي والمعرفة والإلهام.",
  keywords: [
    "تأويل الرؤى",
    "تفسير الأحلام",
    "تطوير الذات",
    "محتوى عربي",
    "إلهام",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "تأويل الرؤى",
  },
  robots: { index: true, follow: true },
};

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
