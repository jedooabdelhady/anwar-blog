import Image from "next/image";
import Link from "next/link";
import { DoorOpen } from "lucide-react";
import PageShell from "@/components/PageShell";

export const metadata = {
  title: "الِاسْتِفْسَارُ وَالتَّسَاؤُل",
  description:
    "الِاسْتِفْسَارُ وَالتَّسَاؤُل — رَمْزِيَّاتٌ مَنَامِيَّةٌ، وَمَسَائِلُ شَرْعِيَّةٌ، وَفَوَائِدُ وَشُرُوحٌ، وَغَيْرُهَا.",
};

export default function ServicesPage() {
  return (
    <PageShell active="/services">
      <article className="mx-auto max-w-md px-5 sm:px-8 py-10 sm:py-14">
        {/* sr-only h1 keeps SEO + screen readers; the mockup has no
            visible page title outside the card itself. */}
        <h1 className="sr-only">الِاسْتِفْسَارُ وَالتَّسَاؤُل</h1>

        {/* One tall mihrab-arched card. Same arch dimensions as the home
            gate cards (50% × 110px) so the silhouette feels native to the
            site, but stretched downward via min-height. */}
        <div
          className="relative border border-line flex flex-col items-center text-center pt-12 sm:pt-16 px-6 sm:px-8 pb-10 min-h-[600px] sm:min-h-[680px] shadow-[0_1px_0_rgba(56,38,28,0.04),0_18px_32px_-22px_rgba(56,38,28,0.22)]"
          style={{
            background: "#F0EBE0",
            borderRadius: "50% 50% 22px 22px / 110px 110px 22px 22px",
          }}
        >
          {/* ts.jpeg in place of the figure logo used on the home cards. */}
          <div className="mb-7 sm:mb-9">
            <Image
              src="/logos/ts.jpeg"
              alt=""
              width={140}
              height={140}
              priority
              className="rounded-2xl border border-line"
              style={{ background: "#fffaf2" }}
            />
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-pepper mb-5 leading-snug">
            الِاسْتِفْسَارُ وَالتَّسَاؤُل
            <span className="ms-1">:</span>
          </h2>

          {/* Body — the parenthetical list */}
          <p className="text-pepper/85 leading-loose text-[15.5px] sm:text-base max-w-sm">
            ( رَمْزِيَّاتٌ مَنَامِيَّةٌ، وَمَسَائِلُ شَرْعِيَّةٌ، وَفَوَائِدُ
            وَشُرُوحٌ، وَغَيْرُهَا )
          </p>

          {/* Decorative vertical line continuing down the body of the card. */}
          <div
            aria-hidden
            className="mt-10 w-px flex-1"
            style={{
              background:
                "linear-gradient(to bottom, rgba(107,63,35,0.45), rgba(107,63,35,0))",
              minHeight: "60px",
            }}
          />
        </div>

        {/* Entry CTA below the card */}
        <div className="text-center mt-8">
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
      </article>
    </PageShell>
  );
}
