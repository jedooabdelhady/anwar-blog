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
    default: "أنوار — مدونة احترافية",
    template: "%s | أنوار",
  },
  description:
    "مدونة عربية تقدم محتوى متخصصاً في إدارة الأعمال، التسويق الرقمي، نصائح ريادية، تطوير الذات، أفكار ملهمة وأحدث الأخبار.",
  keywords: [
    "مدونة عربية",
    "إدارة الأعمال",
    "التسويق الرقمي",
    "ريادة الأعمال",
    "تطوير الذات",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "أنوار",
  },
  robots: { index: true, follow: true },
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
