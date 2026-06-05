import Link from "next/link";
import { Fragment } from "react";
import PageShell from "@/components/PageShell";

export const metadata = { title: "خدماتنا" };

const SERVICES = [
  {
    title: "محتوى متخصص",
    body:
      "**مقالات ودراسات** في علم تأويل الرؤى وما يتّصل به من معارف، مُستقاة من مصادر موثوقة.",
  },
  {
    title: "استشارات ورؤى",
    body:
      "ناقش رؤياك أو سؤالك الخاص معنا — **نستقبل الرؤى الخاصة** ونرد عليها بسرّية تامة.",
  },
  {
    title: "إجابة الاستفسارات",
    body:
      "**اطرح سؤالك** في أي مجال يخص محتوى الموقع وسنرد عليك بأقرب وقت ممكن.",
  },
];

/** Bold phrases inside **double asterisks** — same convention as home. */
function renderRich(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-pepper">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{p}</Fragment>;
  });
}

/** Slim Najdi-band strip used as a decorative top/bottom flourish on
 *  each card. References the same SVG used on the hero carousel. */
function NajdiStrip({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-x-5 sm:inset-x-7 h-3 sm:h-4 pointer-events-none ${
        position === "top" ? "top-3" : "bottom-3"
      }`}
      style={{
        color: "#8B6849",
        backgroundImage: "url(/najdi-band.svg)",
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
        opacity: 0.35,
      }}
    />
  );
}

export default function ServicesPage() {
  return (
    <PageShell active="/services">
      <article className="mx-auto max-w-4xl px-5 sm:px-8 py-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-pepper">خدماتنا</h1>
          <p className="mt-3 text-pepper/75 max-w-xl mx-auto leading-relaxed">
            مساحة متكاملة للمحتوى والتواصل والمشاركة.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="relative rounded-3xl border border-line p-7 pt-12 pb-12 text-center overflow-hidden"
              style={{ background: "#F0EBE0" }}
            >
              <NajdiStrip position="top" />
              <NajdiStrip position="bottom" />

              <h2 className="text-xl font-bold text-pepper mb-4 flex items-center justify-center gap-2">
                <span aria-hidden style={{ color: "#b03a2e" }}>◌</span>
                <span>{s.title}</span>
              </h2>
              <p className="text-pepper/85 leading-relaxed">
                {renderRich(s.body)}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
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
