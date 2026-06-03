/**
 * Studio uses its own layout — no header/footer, full-height, LTR for the
 * Studio chrome (Sanity's UI is English-internationalized, not RTL-aware).
 */
export const metadata = {
  title: "لوحة التحكم — علم تأويل الرؤى",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
