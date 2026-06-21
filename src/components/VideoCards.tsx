"use client";

import { useCallback, useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import type { VideoEntry } from "@/sanity/lib/settings";

/**
 * Parses any of the YouTube URL shapes the editor might paste and
 * returns the 11-char video ID. Returns null when the URL isn't a
 * recognisable YouTube link so we can skip the card cleanly.
 *
 *   https://www.youtube.com/watch?v=ID
 *   https://youtu.be/ID
 *   https://www.youtube.com/embed/ID
 *   https://www.youtube.com/shorts/ID
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

function thumbnailFor(id: string): string {
  // hqdefault works for every video; maxresdefault 404s for unlisted
  // uploads. hqdefault is 480x360 — plenty for our card sizing.
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Same arched silhouette as ThreeCards but with the rounded base —
 * "manuscript medallion" feel that matches the rest of the site.
 * Five colour variants cycle so a row of 3 always looks intentional.
 */
const VARIANTS = [
  { bg: "#EDDFD2", overlay: "rgba(56,38,28,0.35)", ring: "rgba(107,63,35,0.18)" },
  { bg: "#E8DDD0", overlay: "rgba(56,38,28,0.35)", ring: "rgba(122,92,67,0.18)" },
  { bg: "#F0EBE0", overlay: "rgba(56,38,28,0.35)", ring: "rgba(143,140,120,0.18)" },
  { bg: "#E3D8C9", overlay: "rgba(56,38,28,0.35)", ring: "rgba(56,38,28,0.16)" },
  { bg: "#ECE2D6", overlay: "rgba(56,38,28,0.35)", ring: "rgba(176,153,125,0.18)" },
] as const;

type Props = {
  videos: VideoEntry[];
  /** When the editor leaves the section blank we render nothing — but
   *  if you want a soft placeholder during development pass false. */
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

  // Close on Escape; lock the body scroll while the modal is open.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {ready.map((v, i) => {
          const look = VARIANTS[i % VARIANTS.length];
          return (
            <article
              key={`${v.id}-${i}`}
              className="border border-line p-5 sm:p-6 flex flex-col shadow-[0_1px_0_rgba(56,38,28,0.04),0_18px_32px_-22px_rgba(56,38,28,0.22)] transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: look.bg,
                /* Manuscript silhouette: top corners domed (matches the
                   three-cards arch motif), bottom corners softly squared. */
                borderRadius: "22px 22px 22px 22px / 22px 22px 22px 22px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveId(v.id);
                  setActiveTitle(v.title);
                }}
                aria-label={`تشغيل: ${v.title}`}
                className="group relative block w-full aspect-video overflow-hidden rounded-2xl ring-1 ring-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sienna"
                style={{ background: "#000" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailFor(v.id)}
                  alt={v.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Brand-coloured wash so the thumbnail blends with the
                    site palette instead of clashing against the bright
                    red of YouTube previews. */}
                <span
                  aria-hidden
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                  style={{ background: look.overlay }}
                />
                {/* Play badge — circular sienna with white triangle.
                    Pulses gently on hover. */}
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_8px_20px_-8px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "#6B3F23" }}
                >
                  <Play size={22} fill="#fff" stroke="#fff" />
                </span>
              </button>

              <h3 className="mt-5 text-pepper font-bold text-base sm:text-lg leading-snug text-right">
                {v.title}
              </h3>
              {v.description && (
                <p className="mt-2 text-pepper/75 text-sm leading-relaxed text-right">
                  {v.description}
                </p>
              )}
            </article>
          );
        })}
      </div>

      {/* Lightbox — only mounted when something is playing. */}
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
