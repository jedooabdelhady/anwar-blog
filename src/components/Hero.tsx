"use client";

import { useEffect, useState, Fragment } from "react";
import Logo from "./Logo";
import type { HeroQuote, SlideColor } from "@/sanity/lib/settings";

type Props = {
  /** Visually-hidden site title (kept for SEO/screen readers). */
  title: string;
  quotes: HeroQuote[];
};

/** Background gradients per palette slot. */
const GRADIENT: Record<SlideColor, string> = {
  sienna: "linear-gradient(135deg, #8B6849 0%, #966F4F 50%, #8B6849 100%)",
  oak:    "linear-gradient(135deg, #B0997D 0%, #BDA48A 50%, #9B856B 100%)",
  pepper: "linear-gradient(135deg, #4D372A 0%, #5A4232 50%, #38261C 100%)",
  gum:    "linear-gradient(135deg, #8F8C78 0%, #9D9A86 50%, #75725F 100%)",
  smoke:  "linear-gradient(135deg, #EFEDE3 0%, #E5E3D8 50%, #DBD9CF 100%)",
};

/** Foreground tones per slide + the color used for the Najdi pattern band. */
const TEXT_TONE: Record<
  SlideColor,
  { fg: string; sub: string; logo: "clay" | "pepper"; band: string }
> = {
  sienna: { fg: "#EDE5DE", sub: "rgba(237,229,222,0.85)", logo: "clay",   band: "#EDE5DE" },
  oak:    { fg: "#EDE5DE", sub: "rgba(237,229,222,0.85)", logo: "clay",   band: "#EDE5DE" },
  pepper: { fg: "#EDE5DE", sub: "rgba(237,229,222,0.85)", logo: "clay",   band: "#B0997D" },
  gum:    { fg: "#EDE5DE", sub: "rgba(237,229,222,0.85)", logo: "clay",   band: "#EDE5DE" },
  smoke:  { fg: "#38261C", sub: "rgba(56,38,28,0.70)",    logo: "pepper", band: "#8B6849" },
};

const AUTO_ROTATE_MS = 6000;

/** Render quote text with **double-asterisk** bold support. */
function renderQuote(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-extrabold">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{p}</Fragment>;
  });
}

export default function Hero({ title, quotes }: Props) {
  const safeQuotes = quotes.length > 0 ? quotes : [{ text: title }];
  const [idx, setIdx] = useState(0);

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

      {/* Slimmer rectangle carousel — wide-and-short aspect to match the
          client's mockup. Pattern band sits at the very top. */}
      <div
        className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] h-[180px] sm:h-[220px]"
        style={{
          boxShadow:
            "0 14px 32px -16px rgba(56,38,28,0.35), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        {safeQuotes.map((q, i) => {
          const color = q.color ?? "sienna";
          const bg = GRADIENT[color] ?? GRADIENT.sienna;
          const tone = TEXT_TONE[color] ?? TEXT_TONE.sienna;
          const active = i === idx;

          return (
            <div
              key={i}
              aria-hidden={!active}
              className={`absolute inset-0 flex items-center transition-opacity duration-700 ease-in-out ${
                active ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{ background: bg }}
            >
              {/* Najdi pattern band along the very top — tinted via CSS color. */}
              <div
                aria-hidden
                className="absolute top-0 inset-x-0 h-7 sm:h-9 pointer-events-none"
                style={{
                  color: tone.band,
                  backgroundImage: "url(/najdi-band.svg)",
                  backgroundRepeat: "repeat-x",
                  backgroundSize: "auto 100%",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, #000 70%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, #000 70%, transparent 100%)",
                  opacity: 0.85,
                }}
              />

              {/* Logo on the LEFT, vertically centered */}
              <div className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 shrink-0 opacity-70 sm:opacity-80" aria-hidden>
                <Logo
                  size={96}
                  variant={tone.logo}
                  className="sm:!w-[140px] sm:!h-[140px]"
                />
              </div>

              {/* Quote text on the RIGHT (RTL natural alignment) */}
              <div
                className="relative z-10 mr-auto pl-[110px] sm:pl-[170px] pr-5 sm:pr-10 pt-7 sm:pt-10 pb-3 text-right max-w-full"
                style={{
                  color: tone.fg,
                  textShadow:
                    color === "smoke"
                      ? "none"
                      : "0 1px 1px rgba(0,0,0,0.12)",
                }}
              >
                <p className="text-base sm:text-2xl font-bold leading-snug mb-1.5">
                  &quot;{renderQuote(q.text)}&quot;
                </p>
                {q.source && (
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: tone.sub }}
                  >
                    — {q.source}
                  </p>
                )}
              </div>
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
