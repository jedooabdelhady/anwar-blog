import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata = { title: "الخدمات" };

const SERVICES = [
  {
    title: "محتوى متخصص",
    body: "مقالات ودراسات في علم تأويل الرؤى، تطوير الذات، والأفكار الملهمة من مصادر موثوقة.",
  },
  {
    title: "استشارات ورؤى",
    body: "ناقش رؤياك أو سؤالك الخاص معنا — نستقبل الرؤى الخاصة ونرد عليها بسرّية تامة.",
  },
  {
    title: "إجابة الاستفسارات",
    body: "اطرح سؤالك في أي مجال يخص محتوى الموقع وسنرد بأسرع وقت ممكن.",
  },
];

export default function ServicesPage() {
  return (
    <PageShell active="/services">
      <article className="mx-auto max-w-4xl px-5 sm:px-8 py-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-pepper">خدماتنا</h1>
          <p className="mt-3 text-pepper/75">
            مساحة متكاملة للمحتوى والتواصل والمشاركة.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="rounded-3xl border border-line bg-card p-7 text-center"
            >
              <h2 className="text-xl font-bold text-pepper mb-3">{s.title}</h2>
              <p className="text-pepper/80 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/forms/inquiry"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-white font-medium bg-sienna hover:bg-pepper transition-colors"
          >
            تواصل معنا
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
