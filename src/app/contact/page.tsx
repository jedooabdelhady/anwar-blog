import Link from "next/link";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";

export const metadata = { title: "تواصل معنا" };

const OPTIONS = [
  {
    title: "الرؤى العامة",
    body: "أرسل آراءك ومقترحاتك لتحسين خدماتنا.",
    href: "/forms/public-vision",
    variant: "gum" as const,
    bg: "#F0EBE0",
    btn: "#8F8C78",
  },
  {
    title: "الرؤى الخاصة",
    body: "شاركنا مشروعك أو فكرتك لنناقشها معك.",
    href: "/forms/private-vision",
    variant: "sienna" as const,
    bg: "#EDDFD2",
    btn: "#6B3F23",
  },
  {
    title: "تساؤل واستعلام",
    body: "نحن هنا للإجابة على كل أسئلتكم.",
    href: "/forms/inquiry",
    variant: "oak" as const,
    bg: "#E8DDD0",
    btn: "#7a5c43",
  },
];

export default function ContactPage() {
  return (
    <PageShell active="/contact">
      <article className="mx-auto max-w-4xl px-5 sm:px-8 py-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-pepper">تواصل معنا</h1>
          <p className="mt-3 text-pepper/75">اختر القناة المناسبة لرسالتك.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {OPTIONS.map((o) => (
            <article
              key={o.title}
              className="rounded-3xl border border-line p-7 text-center flex flex-col items-center"
              style={{ background: o.bg }}
            >
              <Logo size={64} variant={o.variant} withRing={false} />
              <h2 className="text-lg font-bold text-pepper mt-4">{o.title}</h2>
              <p className="text-pepper/85 leading-relaxed mt-2 mb-5 flex-1">
                {o.body}
              </p>
              <Link
                href={o.href}
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-white text-sm font-medium transition-colors"
                style={{ background: o.btn }}
              >
                ابدأ الآن
              </Link>
            </article>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
