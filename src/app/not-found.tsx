import Link from "next/link";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <PageShell>
      <section className="mx-auto max-w-md text-center px-5 py-20">
        <Logo size={88} variant="sienna" />
        <h1 className="text-6xl font-bold text-pepper mt-6">404</h1>
        <p className="text-pepper/80 mt-3 text-lg">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
        <Link
          href="/"
          className="inline-flex mt-8 items-center justify-center rounded-full px-7 py-2.5 text-white text-sm font-medium bg-sienna hover:bg-pepper transition-colors"
        >
          العودة إلى الرئيسية
        </Link>
      </section>
    </PageShell>
  );
}
