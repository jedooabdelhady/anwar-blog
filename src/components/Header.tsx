"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import clsx from "clsx";

const NAV = [
  { href: "/",         label: "الرَّئيسيّة" },
  { href: "/about",    label: "حَوْلَ ٱلْمِنَصَّةِ" },
  { href: "/blog",     label: "ٱلْمَكْتَبَةُ" },
  { href: "/services", label: "بَوّابةُ التَّساؤُل" },
];

/** Client's actual social channels (June 2026). */
const SOCIALS = {
  youtube:  "https://youtube.com/@sahaarr299?si=K5zRBaF-pAPDaajB",
  telegram: "https://t.me/Fnon0",
  x:        "https://x.com/sahaarr299?s=21",
  tiktok:   "https://www.tiktok.com/@sahaarr299?_r=1&_t=ZS-96ukqXNqjAt",
} as const;

const SOCIAL_LABEL = {
  youtube:  "يوتيوب",
  telegram: "تيليجرام",
  x:        "إكس (تويتر)",
  tiktok:   "تيك توك",
} as const;

/** All socials sit on the smoke/oak palette so they blend with the
 *  earthy site (per client direction — no brand-color circles). */
const SOCIAL_BG    = "#DBD9CF";   // smoke
const SOCIAL_FG    = "#38261C";   // pepper
const SOCIAL_RING  = "#B0997D";   // oak hairline border

function SocialIcon({ kind }: { kind: keyof typeof SOCIALS }) {
  const common = { width: 20, height: 20, fill: "currentColor" as const };
  if (kind === "youtube") {
    return (
      <svg viewBox="0 0 24 24" {...common} aria-hidden>
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
      </svg>
    );
  }
  if (kind === "telegram") {
    return (
      <svg viewBox="0 0 24 24" {...common} aria-hidden>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    );
  }
  if (kind === "x") {
    return (
      <svg viewBox="0 0 24 24" {...common} aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.97 6.817H1.673l7.73-8.836L1.25 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
      </svg>
    );
  }
  // tiktok
  return (
    <svg viewBox="0 0 24 24" {...common} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
    </svg>
  );
}

function SocialStack({
  vertical = true,
  onItemClick,
}: {
  vertical?: boolean;
  onItemClick?: () => void;
}) {
  // Order chosen so that in RTL flow the visual reading (right→left) is
  // YouTube · Telegram · X · TikTok, matching the client's mock-up.
  const kinds = ["youtube", "telegram", "x", "tiktok"] as const;
  return (
    <div className={clsx("flex gap-3", vertical ? "flex-col items-center" : "items-center")}>
      {kinds.map((k) => (
        <a
          key={k}
          href={SOCIALS[k]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={SOCIAL_LABEL[k]}
          title={SOCIAL_LABEL[k]}
          onClick={onItemClick}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-110 shadow-[0_4px_10px_-4px_rgba(56,38,28,0.18)]"
          style={{
            background: SOCIAL_BG,
            color: SOCIAL_FG,
            border: `1px solid ${SOCIAL_RING}`,
          }}
        >
          <SocialIcon kind={k} />
        </a>
      ))}
    </div>
  );
}

export default function Header({ active = "/" }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const contactRef = useRef<HTMLLIElement | null>(null);

  // Close the desktop dropdown on outside-click or ESC.
  useEffect(() => {
    if (!contactOpen) return;
    function onClick(e: MouseEvent) {
      if (contactRef.current && !contactRef.current.contains(e.target as Node)) {
        setContactOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setContactOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [contactOpen]);

  return (
    <header className="relative z-30 w-full">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-5">
        <nav className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="علم تأويل الرؤى — الصفحة الرئيسية"
          >
            <Logo size={48} variant="pepper" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-9">
            {NAV.map((item) => {
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "text-[15px] lg:text-base font-medium transition-colors",
                      isActive ? "text-sienna" : "text-pepper/85 hover:text-sienna"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}

            {/* Contact dropdown */}
            <li ref={contactRef} className="relative">
              <button
                type="button"
                onClick={() => setContactOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={contactOpen}
                className={clsx(
                  "inline-flex items-center gap-1 text-[15px] lg:text-base font-medium transition-colors",
                  contactOpen ? "text-sienna" : "text-pepper/85 hover:text-sienna"
                )}
              >
                تَواصُل
                <ChevronDown
                  size={14}
                  className={clsx("transition-transform", contactOpen && "rotate-180")}
                />
              </button>

              {contactOpen && (
                <div
                  role="menu"
                  className="absolute top-full left-0 mt-3 rounded-2xl border border-line bg-card p-3 shadow-[0_18px_32px_-16px_rgba(56,38,28,0.25)]"
                >
                  <SocialStack vertical onItemClick={() => setContactOpen(false)} />
                </div>
              )}
            </li>
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            className="md:hidden p-2 rounded-lg text-pepper hover:bg-pepper/5"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-line bg-clay/70 backdrop-blur">
          <ul className="px-5 py-4 flex flex-col gap-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "block py-2 text-base font-medium",
                    active === item.href ? "text-sienna" : "text-pepper hover:text-sienna"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {/* Mobile contact = small heading + horizontal icons row */}
            <li className="pt-3 mt-2 border-t border-line">
              <p className="text-sm text-pepper/70 mb-3">تَواصُل</p>
              <SocialStack vertical={false} onItemClick={() => setOpen(false)} />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
