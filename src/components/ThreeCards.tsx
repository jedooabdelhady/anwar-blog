import Link from "next/link";
import Logo from "./Logo";

type CardData = {
  title: string;
  body: string;
  cta: string;
  href: string;
  iconVariant: "pepper" | "sienna" | "gum" | "oak";
  cardBg: string;
  btnBg: string;
  btnHover: string;
};

const CARDS: CardData[] = [
  {
    title: "الرؤى العامة",
    body: "نستقبل آرائكم ومقترحاتكم لتحسين خدماتنا",
    cta: "تقديم رؤيتي",
    href: "/forms/public-vision",
    iconVariant: "gum",
    cardBg: "#F0EBE0",
    btnBg: "#8F8C78",
    btnHover: "#75725f",
  },
  {
    title: "الرؤى الخاصة",
    body: "شاركنا رؤيتك الخاصة أو مشروعك لنناقشه معك",
    cta: "تقديم رؤيتي",
    href: "/forms/private-vision",
    iconVariant: "sienna",
    cardBg: "#EDDFD2",
    btnBg: "#6B3F23",
    btnHover: "#5a341c",
  },
  {
    title: "تساؤل واستعلام",
    body: "نحن هنا للإجابة على تساؤلاتكم واستفساراتكم",
    cta: "أرسل استفسارك",
    href: "/forms/inquiry",
    iconVariant: "oak",
    cardBg: "#E8DDD0",
    btnBg: "#7a5c43",
    btnHover: "#664a35",
  },
];

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-center text-lg sm:text-xl font-bold text-pepper">
      <span className="section-title-deco">
        <span className="section-title-deco-dot" />
        <span>{children}</span>
        <span className="section-title-deco-dot" />
      </span>
    </h3>
  );
}

export default function ThreeCards() {
  return (
    <section
      aria-labelledby="cards-heading"
      className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-12 sm:py-16"
    >
      <h2 id="cards-heading" className="sr-only">
        خيارات التواصل والمشاركة
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {CARDS.map((c) => (
          <article
            key={c.title}
            className="rounded-[28px] border border-line p-7 sm:p-8 flex flex-col items-center text-center shadow-[0_1px_0_rgba(56,38,28,0.04),0_18px_32px_-22px_rgba(56,38,28,0.22)] transition-transform duration-300 hover:-translate-y-1"
            style={{ background: c.cardBg }}
          >
            <CardTitle>{c.title}</CardTitle>

            <div className="my-6 sm:my-7">
              <Logo size={88} variant={c.iconVariant} withRing={false} />
            </div>

            <p className="text-pepper/85 text-[15px] sm:text-base leading-relaxed mb-7 min-h-[3.2em]">
              {c.body}
            </p>

            <Link
              href={c.href}
              className="inline-flex items-center justify-center rounded-full px-7 py-2.5 text-white text-sm sm:text-[15px] font-medium transition-colors bg-[var(--btn)] hover:bg-[var(--btn-h)]"
              style={
                {
                  ["--btn" as string]: c.btnBg,
                  ["--btn-h" as string]: c.btnHover,
                } as React.CSSProperties
              }
            >
              {c.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
