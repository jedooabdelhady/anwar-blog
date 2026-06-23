"use client";

import { useCallback, useEffect, useState } from "react";
import { Film, Play, X } from "lucide-react";
import type { VideoEntry } from "@/sanity/lib/settings";

/**
 * Parses any of the YouTube URL shapes the editor might paste and
 * returns the 11-char video ID. Returns null when the URL isn't a
 * recognisable YouTube link so we can skip the card cleanly.
 */
function youtubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1).split("/")[0] || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = u.pathname.match(/^\/(embed|shorts|v)\/([^/?]+)/);
      if (m) return m[2];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Manuscript palette variants. Each one tunes ink, sub-ink, ornament
 * colour, and play-badge contrast against its own background so text
 * stays legible on every variant.
 */
const VARIANTS = [
  // Light beige paper
  { bg: "#EDDFD2", ink: "#38261C", sub: "rgba(56,38,28,0.72)", ornament: "rgba(107,63,35,0.55)", line: "rgba(56,38,28,0.32)", badge: "#6B3F23", badgeInk: "#fff", number: "rgba(56,38,28,0.55)" },
  // Sage olive
  { bg: "#8F8C78", ink: "#FAF5EC", sub: "rgba(250,245,236,0.85)", ornament: "rgba(250,245,236,0.6)", line: "rgba(250,245,236,0.35)", badge: "#FAF5EC", badgeInk: "#3A382E", number: "rgba(250,245,236,0.6)" },
  // Deep walnut
  { bg: "#4D372A", ink: "#EDE5DE", sub: "rgba(237,229,222,0.78)", ornament: "rgba(237,229,222,0.55)", line: "rgba(237,229,222,0.3)", badge: "#EDE5DE", badgeInk: "#4D372A", number: "rgba(237,229,222,0.55)" },
  // Warm linen
  { bg: "#E8DDD0", ink: "#38261C", sub: "rgba(56,38,28,0.72)", ornament: "rgba(107,63,35,0.55)", line: "rgba(56,38,28,0.32)", badge: "#6B3F23", badgeInk: "#fff", number: "rgba(56,38,28,0.55)" },
  // Brick / terracotta
  { bg: "#A04D2B", ink: "#FAF5EC", sub: "rgba(250,245,236,0.85)", ornament: "rgba(250,245,236,0.55)", line: "rgba(250,245,236,0.32)", badge: "#FAF5EC", badgeInk: "#7a3b21", number: "rgba(250,245,236,0.55)" },
] as const;

/**
 * Hand-torn paper silhouettes — two variants alternating so a row
 * doesn't look mechanically uniform.
 */
const TORN_A =
  "polygon(2% 1%, 9% 0%, 17% 2%, 26% 0%, 35% 2%, 44% 0%, 53% 2%, 62% 0%, 71% 2%, 80% 0%, 89% 2%, 98% 0%, 100% 6%, 99% 14%, 100% 22%, 98% 31%, 100% 40%, 99% 49%, 100% 58%, 98% 67%, 100% 76%, 99% 85%, 100% 94%, 97% 100%, 88% 99%, 79% 100%, 70% 98%, 61% 100%, 52% 98%, 43% 100%, 34% 98%, 25% 100%, 16% 98%, 7% 100%, 0% 95%, 2% 86%, 0% 77%, 2% 68%, 0% 59%, 2% 50%, 0% 41%, 2% 32%, 0% 23%, 2% 14%, 0% 5%)";
const TORN_B =
  "polygon(0% 4%, 6% 1%, 14% 0%, 22% 2%, 31% 0%, 40% 2%, 49% 1%, 58% 2%, 67% 0%, 76% 2%, 85% 0%, 94% 1%, 100% 7%, 98% 16%, 100% 25%, 99% 34%, 100% 43%, 98% 52%, 100% 61%, 99% 70%, 100% 79%, 98% 88%, 100% 96%, 94% 99%, 85% 100%, 76% 98%, 67% 100%, 58% 98%, 49% 100%, 40% 99%, 31% 100%, 22% 98%, 13% 100%, 5% 99%, 0% 92%, 2% 83%, 0% 74%, 1% 65%, 0% 56%, 2% 47%, 0% 38%, 1% 29%, 0% 20%, 2% 11%)";

/** Fixed Thamudic glyph strings used on every card (per editor brief).
 *  Stays consistent across cards so the section reads as a single
 *  inscription rather than a row of unrelated tablets. */
const TOP_BANNER = "𐩧 𐩱 𐩺 𐩱 𐩫";
const BOTTOM_BANNER = "𐩱 𐩡 𐩨 𐩦 𐩧 𐩱";

/** Eastern Arabic numerals so the index reads as ٠١ ٠٢ ٠٣ — fits the
 *  manuscript voice better than 01 02 03. */
function arabicNumeral(n: number): string {
  return n
    .toString()
    .padStart(2, "0")
    .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

type Props = {
  videos: VideoEntry[];
  hideWhenEmpty?: boolean;
};

type Ready = VideoEntry & { id: string };

export default function VideoCards({ videos, hideWhenEmpty = true }: Props) {
  const ready: Ready[] = (videos || [])
    .map((v) => {
      const id = youtubeId(v.url);
      return id ? { ...v, id } : null;
    })
    .filter((v): v is Ready => v !== null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>("");

  const close = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeId, close]);

  if (ready.length === 0 && hideWhenEmpty) return null;

  return (
    <section
      aria-labelledby="videos-heading"
      className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
    >
      {/* Panel wrapper — a soft cream pad that visually lifts the
          videos out of the wallpaper backdrop above and the blog
          section below. No hard border (per editor request); the
          colour shift + rounded corners + subtle ring do the work. */}
      <div
        className="relative rounded-[28px] sm:rounded-[36px] px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
        style={{
          background: "rgba(243, 235, 224, 0.92)",
          boxShadow:
            "0 1px 0 rgba(56,38,28,0.04) inset, 0 24px 48px -28px rgba(56,38,28,0.28)",
        }}
      >
        <header className="text-center mb-8 sm:mb-10">
          <h2
            id="videos-heading"
            className="text-2xl sm:text-3xl font-bold text-pepper inline-flex items-center justify-center gap-3"
          >
            <span aria-hidden style={{ color: "#6B3F23", fontSize: "0.75em" }}>▴</span>
            <span>∴ شروحٌّ سمعيّة ∴</span>
            <span aria-hidden style={{ color: "#6B3F23", fontSize: "0.75em" }}>▴</span>
          </h2>
          {/* Divider directly under the title — a small ▲ flanked by
              two hairlines, echoing the manuscript rule used elsewhere
              but with the triangle motif the editor asked for. */}
          <span
            aria-hidden
            className="mt-3 inline-flex items-center gap-2"
            style={{ color: "#6B3F23", opacity: 0.7 }}
          >
            <span
              style={{
                display: "inline-block",
                width: "56px",
                height: "1px",
                background: "currentColor",
              }}
            />
            <span style={{ fontSize: "0.7em", lineHeight: 1 }}>▲</span>
            <span
              style={{
                display: "inline-block",
                width: "56px",
                height: "1px",
                background: "currentColor",
              }}
            />
          </span>
          <p className="mt-3 text-pepper/75 text-sm sm:text-base">
            مختارات من تأويل الرؤى — اضغط على المقطع للاستماع
          </p>
        </header>

        <div
          className="grid gap-5 sm:gap-6 lg:gap-7 justify-center"
          style={{
            /* Mobile: single column, capped width so the torn paper
               doesn't span edge-to-edge. Tablet+: 2 across, desktop
               3+. minmax with 100% fallback lets a single card center
               nicely on the narrowest phones. */
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(220px, 100%), 240px))",
          }}
        >
        {ready.map((v, i) => {
          const look = VARIANTS[i % VARIANTS.length];
          const clip = i % 2 === 0 ? TORN_A : TORN_B;
          return (
            <button
              key={`${v.id}-${i}`}
              type="button"
              onClick={() => {
                setActiveId(v.id);
                setActiveTitle(v.title);
              }}
              aria-label={`تشغيل: ${v.title}`}
              className="group relative block w-full text-right transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none"
              style={{ aspectRatio: "3 / 4" }}
            >
              {/* Paper surface with torn edges */}
              <span
                aria-hidden
                className="absolute inset-0 transition-shadow duration-300 group-hover:shadow-[0_22px_44px_-22px_rgba(56,38,28,0.5)] shadow-[0_10px_24px_-14px_rgba(56,38,28,0.35)]"
                style={{
                  background: look.bg,
                  clipPath: clip,
                  WebkitClipPath: clip,
                }}
              />

              {/* Faint Thamudic watermark wash across the paper — a
                  vertical column of repeated glyphs at 8% opacity, so
                  the card reads as if inscribed on an old tablet. */}
              <span
                aria-hidden
                className="absolute inset-0 overflow-hidden pointer-events-none select-none"
                style={{
                  clipPath: clip,
                  WebkitClipPath: clip,
                }}
              >
                <span
                  className="absolute inset-0 flex flex-col items-center justify-evenly leading-none"
                  style={{
                    color: look.ornament,
                    opacity: 0.12,
                    fontSize: "34px",
                    letterSpacing: "0.2em",
                  }}
                >
                  <span>𐩥</span>
                  <span>𐩰</span>
                  <span>𐩭</span>
                  <span>𐩪</span>
                  <span>𐩬</span>
                </span>
              </span>

              {/* Inner ink border — a thin offset frame that makes the
                  card feel hand-drawn on the paper, not printed. */}
              <span
                aria-hidden
                className="absolute inset-[10px] pointer-events-none"
                style={{
                  border: `1px solid ${look.line}`,
                  clipPath: clip,
                  WebkitClipPath: clip,
                  opacity: 0.55,
                }}
              />

              {/* Content layer */}
              <span className="relative flex flex-col items-center h-full px-5 sm:px-6 py-5 sm:py-6 text-center">
                {/* Top: Thamudic banner */}
                <span
                  aria-hidden
                  className="block text-[13px] tracking-[0.4em] leading-none"
                  style={{ color: look.ornament, opacity: 0.85 }}
                >
                  {TOP_BANNER}
                </span>

                {/* Film icon — circular, outlined */}
                <span
                  aria-hidden
                  className="mt-4 inline-flex items-center justify-center w-14 h-14 rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    color: look.ink,
                    border: `1.5px solid ${look.ink}`,
                    opacity: 0.9,
                  }}
                >
                  <Film size={22} />
                </span>

                {/* Title — flanked by ◐ ◑, the same ornament used in
                    section headings across the site. */}
                <span
                  className="mt-4 inline-flex items-center justify-center gap-1.5 font-bold leading-snug text-[15px] sm:text-base line-clamp-3"
                  style={{ color: look.ink }}
                >
                  <span aria-hidden style={{ color: look.ornament, fontSize: "0.7em", opacity: 0.85 }}>◐</span>
                  <span>{v.title}</span>
                  <span aria-hidden style={{ color: look.ornament, fontSize: "0.7em", opacity: 0.85 }}>◑</span>
                </span>

                {/* Manuscript divider — short rule with a small triangle
                    in the middle (▲), echoing the section-title rule. */}
                <span
                  aria-hidden
                  className="mt-3 inline-flex items-center gap-1.5"
                  style={{ color: look.line }}
                >
                  <span style={{ display: "inline-block", width: "32px", height: "1px", background: "currentColor" }} />
                  <span style={{ fontSize: "10px", lineHeight: 1, color: "currentColor" }}>▲</span>
                  <span style={{ display: "inline-block", width: "32px", height: "1px", background: "currentColor" }} />
                </span>

                {/* Optional description — keeps the card legible */}
                <span
                  className="mt-3 text-[12px] sm:text-[13px] leading-relaxed line-clamp-2 px-1"
                  style={{ color: look.sub }}
                >
                  {v.description || "اضغط للمشاهدة"}
                </span>

                {/* Spacer pushes the footer to the bottom */}
                <span className="flex-1" />

                {/* Footer: serial number + play badge */}
                <span className="w-full flex items-end justify-between">
                  <span
                    aria-hidden
                    className="font-bold text-[15px] sm:text-base leading-none tracking-wider"
                    style={{ color: look.number, fontFamily: "'Times New Roman', serif" }}
                  >
                    {arabicNumeral(i + 1)}
                  </span>
                  <span
                    aria-hidden
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-transform duration-300 group-hover:scale-110 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.35)]"
                    style={{ background: look.badge, color: look.badgeInk }}
                  >
                    <Play size={14} fill={look.badgeInk} stroke={look.badgeInk} />
                  </span>
                </span>

                {/* Bottom banner — closing inscription, different from top */}
                <span
                  aria-hidden
                  className="mt-3 block text-[13px] tracking-[0.4em] leading-none"
                  style={{ color: look.ornament, opacity: 0.85 }}
                >
                  {BOTTOM_BANNER}
                </span>
              </span>
            </button>
          );
        })}
        </div>
      </div>

      {/* Lightbox */}
      {activeId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeTitle}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          style={{ background: "rgba(43,29,21,0.86)" }}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="إغلاق"
            className="absolute top-4 right-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/95 text-pepper hover:bg-white transition-colors shadow-lg"
          >
            <X size={22} />
          </button>
          <div
            className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeId}?autoplay=1&rel=0&modestbranding=1`}
              title={activeTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </section>
  );
}
