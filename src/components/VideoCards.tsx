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
 * Five "torn manuscript" colour variants in the site palette. We cycle
 * through them so a row of any length looks intentional.
 * - bg: card background
 * - ink: title colour
 * - sub: description colour
 * - badge: small play badge background
 * - badgeInk: play badge icon colour
 */
const VARIANTS = [
  // Light beige paper
  { bg: "#EDDFD2", ink: "#38261C", sub: "rgba(56,38,28,0.72)", badge: "#6B3F23", badgeInk: "#fff" },
  // Sage olive
  { bg: "#8F8C78", ink: "#FAF5EC", sub: "rgba(250,245,236,0.85)", badge: "#FAF5EC", badgeInk: "#3A382E" },
  // Deep walnut
  { bg: "#4D372A", ink: "#EDE5DE", sub: "rgba(237,229,222,0.78)", badge: "#EDE5DE", badgeInk: "#4D372A" },
  // Warm linen
  { bg: "#E8DDD0", ink: "#38261C", sub: "rgba(56,38,28,0.72)", badge: "#6B3F23", badgeInk: "#fff" },
  // Brick / terracotta
  { bg: "#A04D2B", ink: "#FAF5EC", sub: "rgba(250,245,236,0.85)", badge: "#FAF5EC", badgeInk: "#7a3b21" },
] as const;

/**
 * Each card uses one of two clip-path "torn paper" silhouettes so a
 * row doesn't look mechanically identical — alternating between the
 * two keeps the artisanal feel without exploding into chaos.
 */
const TORN_A =
  "polygon(2% 1%, 9% 0%, 17% 2%, 26% 0%, 35% 2%, 44% 0%, 53% 2%, 62% 0%, 71% 2%, 80% 0%, 89% 2%, 98% 0%, 100% 6%, 99% 14%, 100% 22%, 98% 31%, 100% 40%, 99% 49%, 100% 58%, 98% 67%, 100% 76%, 99% 85%, 100% 94%, 97% 100%, 88% 99%, 79% 100%, 70% 98%, 61% 100%, 52% 98%, 43% 100%, 34% 98%, 25% 100%, 16% 98%, 7% 100%, 0% 95%, 2% 86%, 0% 77%, 2% 68%, 0% 59%, 2% 50%, 0% 41%, 2% 32%, 0% 23%, 2% 14%, 0% 5%)";
const TORN_B =
  "polygon(0% 4%, 6% 1%, 14% 0%, 22% 2%, 31% 0%, 40% 2%, 49% 1%, 58% 2%, 67% 0%, 76% 2%, 85% 0%, 94% 1%, 100% 7%, 98% 16%, 100% 25%, 99% 34%, 100% 43%, 98% 52%, 100% 61%, 99% 70%, 100% 79%, 98% 88%, 100% 96%, 94% 99%, 85% 100%, 76% 98%, 67% 100%, 58% 98%, 49% 100%, 40% 99%, 31% 100%, 22% 98%, 13% 100%, 5% 99%, 0% 92%, 2% 83%, 0% 74%, 1% 65%, 0% 56%, 2% 47%, 0% 38%, 1% 29%, 0% 20%, 2% 11%)";

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
      className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-12 sm:py-16"
    >
      <header className="text-center mb-10">
        <h2
          id="videos-heading"
          className="text-2xl sm:text-3xl font-bold text-pepper inline-flex items-center justify-center gap-3"
        >
          <span aria-hidden style={{ color: "#6B3F23", fontSize: "0.75em" }}>◐</span>
          <span>مَقاطِعُ مرئية</span>
          <span aria-hidden style={{ color: "#6B3F23", fontSize: "0.75em" }}>◑</span>
        </h2>
        <p className="mt-2 text-pepper/75 text-sm sm:text-base">
          مختارات من تأويل الرؤى — اضغط على المقطع للمشاهدة
        </p>
      </header>

      <div
        className="grid gap-5 sm:gap-6 justify-center"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 220px))",
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
              {/* Card surface — the torn-paper clip-path is what gives
                  the ragged manuscript edge. A thin inner stroke and a
                  drop shadow underneath sell the depth. */}
              <span
                aria-hidden
                className="absolute inset-0 transition-shadow duration-300 group-hover:shadow-[0_20px_40px_-20px_rgba(56,38,28,0.45)] shadow-[0_10px_24px_-14px_rgba(56,38,28,0.35)]"
                style={{
                  background: look.bg,
                  clipPath: clip,
                  WebkitClipPath: clip,
                }}
              />

              {/* Content layer — padded inward so text never reaches the
                  ragged edge. */}
              <span className="relative flex flex-col items-center justify-between h-full p-5 sm:p-6 text-center">
                {/* Top: outlined film icon, like the artefact icons in
                    the reference. */}
                <span
                  aria-hidden
                  className="mt-2 inline-flex items-center justify-center w-12 h-12 rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    color: look.ink,
                    border: `1.5px solid ${look.ink}`,
                    opacity: 0.85,
                  }}
                >
                  <Film size={22} />
                </span>

                {/* Title — the prominent line, manuscript-style. */}
                <span
                  className="font-bold leading-snug text-base sm:text-[17px] line-clamp-3"
                  style={{ color: look.ink }}
                >
                  {v.title}
                </span>

                {/* Optional subtitle (description). */}
                {v.description ? (
                  <span
                    className="text-[12px] sm:text-[13px] leading-relaxed line-clamp-2 px-1"
                    style={{ color: look.sub }}
                  >
                    {v.description}
                  </span>
                ) : (
                  <span className="text-[12px]" style={{ color: look.sub }}>
                    اضغط للمشاهدة
                  </span>
                )}

                {/* Tiny play badge in the corner — hint of interactivity. */}
                <span
                  aria-hidden
                  className="absolute bottom-4 left-4 inline-flex items-center justify-center w-9 h-9 rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: look.badge,
                    color: look.badgeInk,
                  }}
                >
                  <Play size={14} fill={look.badgeInk} stroke={look.badgeInk} />
                </span>
              </span>
            </button>
          );
        })}
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
