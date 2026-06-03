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
  smoke:  "linear-gradient(135deg, #E5E3D8 0%, #DBD9CF 50%, #CECABE 100%)",
};

/** Text color per slide — smoke is a parchment, the rest are dark/saturated. */
const TEXT_TONE: Record<SlideColor, { fg: string; sub: string; logo: "clay" | "pepper" }> = {
  sienna: { fg: "#EDE5DE", sub: "rgba(237,229,222,0.85)", logo: "clay"   },
  oak:    { fg: "#EDE5DE", sub: "rgba(237,229,222,0.85)", logo: "clay"   },
  pepper: { fg: "#EDE5DE", sub: "rgba(237,229,222,0.85)", logo: "clay"   },
  gum:    { fg: "#EDE5DE", sub: "rgba(237,229,222,0.85)", logo: "clay"   },
  smoke:  { fg: "#38261C", sub: "rgba(56,38,28,0.70)",    logo: "pepper" },
};

const AUTO_ROTATE_MS = 6000;

/**
 * Render quote text with **double-asterisk** bold support.
 * "م: **المخطوطُ**" → "م: <strong>المخطوطُ</strong>"
 */
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

      <div
        className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] h-[220px] sm:h-[280px]"
        style={{
          /* Lifted "carved" feel:
             — outer drop shadow gives the banner depth against the page
             — inset highlight at the top edge fakes a bevel
             — inset dark at the bottom mimics a chiseled edge          */
          boxShadow: [
            "0 22px 50px -22px rgba(56,38,28,0.55)",       // drop
            "inset 0 1px 0 rgba(255,255,255,0.18)",        // top highlight
            "inset 0 -2px 0 rgba(0,0,0,0.18)",             // bottom carve
            "inset 0 0 80px rgba(0,0,0,0.18)",             // inner vignette
          ].join(", "),
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
              className={`absolute inset-0 flex items-center justify-between px-7 sm:px-14 transition-opacity duration-700 ease-in-out ${
                active ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{ background: bg }}
            >
              {/* Soft paper-grain texture overlay */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)",
                  backgroundSize: "3px 3px, 5px 5px",
                  backgroundPosition: "0 0, 1.5px 1.5px",
                  opacity: 0.6,
                }}
              />

              {/* Quote text (right-aligned in RTL) */}
              <div
                className="relative z-10 max-w-[60%] text-right"
                style={{
                  color: tone.fg,
                  textShadow: "0 1px 1px rgba(0,0,0,0.15)",
                }}
              >
                <p className="text-xl sm:text-3xl font-bold leading-snug mb-3">
                  &quot;{renderQuote(q.text)}&quot;
                </p>
                {q.source && (
                  <p className="text-sm sm:text-base" style={{ color: tone.sub }}>
                    — {q.source}
                  </p>
                )}
              </div>

              {/* Watermark logo on the LEFT — colored to match the slide tone */}
              <div className="opacity-35 sm:opacity-45 shrink-0" aria-hidden>
                <Logo
                  size={140}
                  variant={tone.logo}
                  className="sm:!w-[200px] sm:!h-[200px]"
                />
              </div>

              {/* Soft top-right highlight (specular) */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(110% 70% at 80% 15%, rgba(255,255,255,0.16), transparent 55%)",
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
