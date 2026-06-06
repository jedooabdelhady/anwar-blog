import Link from "next/link";
import { ScrollText, MessageCircleQuestion, BookOpen, DoorOpen } from "lucide-react";
import PageShell from "@/components/PageShell";

export const metadata = {
  title: "بَوَّابَةُ التَّسَاؤُلِ",
  description:
    "نافذةٌ تُعنى باستقبالِ الاستفساراتِ والتساؤلاتِ العامَّةِ، وما يَرِدُ من مُشكلاتٍ أو ملاحظاتٍ متعلِّقةٍ بعِلمِ التَّعبيرِ والرُّؤى.",
};

const ITEMS = [
  {
    title: "الرُؤَى الخَاصَّة",
    body: "نستقبل الرؤى الخاصة بسرّية وعناية، مع مراعاة خصوصية السائل وأدب التعبير.",
    Icon: ScrollText,
  },
  {
    title: "الاسْتِفسارات العامَّة",
    body: "لطرح الأسئلة المتعلقة بمحتوى المنصة أو مسائل التعبير وما يتصل بها.",
    Icon: MessageCircleQuestion,
  },
  {
    title: "المَحتوى العِلميِ",
    body: "مقالات وفوائد وتأصيلات مختصرة في علم الرؤى والعبارة.",
    Icon: BookOpen,
  },
];

/** Small four-pointed star used as section ornament. */
function Sparkle({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={className} style={{ color: "#8B6849" }}>
      ✦
    </span>
  );
}

export default function ServicesPage() {
  return (
    <PageShell active="/services">
      <article className="mx-auto max-w-3xl px-5 sm:px-8 py-12">
        {/* Top decorative divider */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="h-px w-12 sm:w-16" style={{ background: "rgba(107,63,35,0.35)" }} />
          <Sparkle />
          <span className="h-px w-12 sm:w-16" style={{ background: "rgba(107,63,35,0.35)" }} />
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-pepper text-center mb-5 leading-tight">
          بَوَّابَةُ التَّسَاؤُلِ
        </h1>

        <p className="text-pepper/80 leading-loose text-center max-w-2xl mx-auto mb-12 text-[15px] sm:text-base">
          نافذةٌ تُعنى باستقبالِ الاستفساراتِ والتساؤلاتِ العامَّةِ، وما يَرِدُ من
          مُشكلاتٍ أو ملاحظاتٍ متعلِّقةٍ بعِلمِ التَّعبيرِ والرُّؤى، مع العنايةِ
          بالإيضاحِ والتوجيهِ بما يوافقُ الأصولَ والآدابَ العلميَّة.
        </p>

        {/* Three framed rows */}
        <div className="space-y-5">
          {ITEMS.map((item) => {
            const { Icon } = item;
            return (
              <div
                key={item.title}
                className="relative rounded-2xl border p-5 sm:p-7 flex items-center gap-5"
                style={{
                  background: "#F7F1EA",
                  borderColor: "rgba(139,104,73,0.30)",
                }}
              >
                {/* Tiny corner diamonds (decorative) */}
                <span aria-hidden className="absolute top-1.5 right-3 text-[10px]" style={{ color: "#8B6849", opacity: 0.5 }}>◆</span>
                <span aria-hidden className="absolute top-1.5 left-3 text-[10px]" style={{ color: "#8B6849", opacity: 0.5 }}>◆</span>
                <span aria-hidden className="absolute bottom-1.5 right-3 text-[10px]" style={{ color: "#8B6849", opacity: 0.5 }}>◆</span>
                <span aria-hidden className="absolute bottom-1.5 left-3 text-[10px]" style={{ color: "#8B6849", opacity: 0.5 }}>◆</span>

                {/* Text on the right (start of RTL) */}
                <div className="flex-1 text-right min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-pepper mb-2 flex items-center gap-2 justify-end">
                    <span>{item.title}</span>
                    <Sparkle className="text-base" />
                  </h2>
                  <p className="text-pepper/80 leading-relaxed text-[14.5px] sm:text-[15px]">
                    {item.body}
                  </p>
                </div>

                {/* Mihrab-arch icon frame on the left (end of RTL) */}
                <div
                  aria-hidden
                  className="shrink-0 flex items-center justify-center border-2"
                  style={{
                    width: "78px",
                    height: "94px",
                    borderColor: "rgba(107,63,35,0.45)",
                    background: "#fffaf2",
                    borderRadius: "50% 50% 8px 8px / 38% 38% 8px 8px",
                  }}
                >
                  <Icon size={30} style={{ color: "#6B3F23" }} strokeWidth={1.6} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mihrab-shaped CTA */}
        <div className="text-center mt-12">
          <Link
            href="/forms/inquiry"
            className="inline-flex items-center gap-3 px-8 py-3.5 text-white font-bold transition-colors hover:bg-pepper"
            style={{
              background: "#6B3F23",
              borderRadius: "50% 50% 14px 14px / 38% 38% 14px 14px",
            }}
          >
            <DoorOpen size={20} strokeWidth={1.8} />
            <span>الدُخول إلى البَوَّابة</span>
          </Link>
        </div>

        {/* Bottom ornament */}
        <div className="flex items-center justify-center mt-10">
          <Sparkle className="text-lg" />
        </div>
      </article>
    </PageShell>
  );
}
