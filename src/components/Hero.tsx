"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import type { HeroQuote, SlideColor } from "@/sanity/lib/settings";

type Props = {
  /** Visually-hidden site title (kept for SEO/screen readers). */
  title: string;
  quotes: HeroQuote[];
};

/** Background gradients per palette slot (extracted from the brand board). */
const GRADIENT: Record<SlideColor, string> = {
  sienna: "linear-gradient(135deg, #8B6849 0%, #966F4F 50%, #8B6849 100%)",
  oak:    "linear-gradient(135deg, #B0997D 0%, #BDA48A 50%, #9B856B 100%)",
  pepper: "linear-gradient(135deg, #4D372A 0%, #5A4232 50%, #38261C 100%)",
  gum:    "linear-gradient(135deg, #8F8C78 0%, #9D9A86 50%, #75725F 100%)",
};

const AUTO_ROTATE_MS = 6000;

export default function Hero({ title, quotes }: Props) {
  const safeQuotes = quotes.length > 0 ? quotes : [{ text: title }];
  const [idx, setIdx] = useState(0);

  // Auto-rotate, pausing reset on manual navigation.
  useEffect(() => {
    if (safeQuotes.length < 2) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % safeQuotes.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [safeQuotes.length, idx]);

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-2 pb-4">
      <h1 className="sr-only">{title}</h1>

      {/* Carousel viewport */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] h-[220px] sm:h-[280px]">
        {safeQuotes.map((q, i) => {
          const bg = GRADIENT[q.color ?? "sienna"] ?? GRADIENT.sienna;
          const active = i === idx;
          return (
            <div
              key={i}
              aria-hidden={!active}
              className={`absolute inset-0 flex items-center justify-between px-7 sm:px-14 transition-opacity duration-700 ease-in-out ${
                active ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{ background: bg }}
            >
              {/* Quote text (right-aligned in RTL) */}
              <div className="relative z-10 max-w-[60%] text-right text-clay">
                <p className="text-xl sm:text-3xl font-bold leading-snug mb-3">
                  {`"${q.text}"`}
                </p>
                {q.source && (
                  <p className="text-sm sm:text-base text-clay/85">
                    — {q.source}
                  </p>
                )}
              </div>

              {/* Faded watermark logo on the LEFT side of the slide */}
              <div
                className="opacity-30 sm:opacity-40 shrink-0"
                aria-hidden
              >
                <Logo size={140} variant="clay" className="sm:!w-[200px] sm:!h-[200px]" />
              </div>

              {/* Soft top-right highlight */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(120% 80% at 80% 20%, rgba(255,255,255,0.10), transparent 60%)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Dots indicator */}
      {safeQuotes.length > 1 && (
        <div
          className="mt-4 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="شرائح البانر"
        >
          {safeQuotes.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === idx}
              aria-label={`الشريحة ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-6 bg-sienna" : "w-2 bg-pepper/30 hover:bg-pepper/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
