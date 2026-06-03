"use client";

import { useEffect, useState } from "react";

type Props = {
  title: string;
  /**
   * Absolute URL when known (server-side), otherwise just the path —
   * we'll prepend window.location.origin on the client.
   */
  url: string;
};

const ICONS = {
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.05 4.92A9.93 9.93 0 0 0 12.01 2C6.5 2 2.02 6.48 2.02 11.99c0 1.96.51 3.88 1.49 5.57L2 22l4.55-1.49a9.97 9.97 0 0 0 5.46 1.6h.01c5.51 0 9.99-4.48 9.99-9.99 0-2.67-1.04-5.18-2.96-7.2zM12.01 20.03h-.01a8.06 8.06 0 0 1-4.1-1.12l-.29-.17-2.7.88.9-2.63-.19-.31a8.04 8.04 0 0 1-1.24-4.3c0-4.43 3.61-8.04 8.05-8.04 2.15 0 4.17.84 5.7 2.37a8.02 8.02 0 0 1 2.36 5.69c-.01 4.43-3.62 8.03-8.07 8.03zm4.43-6.01c-.24-.12-1.43-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.1-.1.24-.27.36-.4.12-.13.16-.22.24-.37.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3s-.84.82-.84 2c0 1.18.86 2.32.98 2.48.12.16 1.7 2.59 4.12 3.63.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>
  ),
  x: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.97 6.817H1.673l7.73-8.836L1.25 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  ),
  telegram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
};

const NAMES = {
  whatsapp: "واتساب",
  x: "إكس (تويتر)",
  telegram: "تيليجرام",
} as const;

const COLORS = {
  whatsapp: "#25D366",
  x: "#000000",
  telegram: "#229ED9",
} as const;

function isAbsolute(u: string) {
  return /^https?:\/\//i.test(u);
}

export default function ShareButtons({ title, url }: Props) {
  const [absoluteUrl, setAbsoluteUrl] = useState(
    isAbsolute(url) ? url : url
  );

  useEffect(() => {
    if (!isAbsolute(url) && typeof window !== "undefined") {
      setAbsoluteUrl(window.location.origin + url);
    }
  }, [url]);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(absoluteUrl);

  const links = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  return (
    <div className="flex items-center gap-3" role="group" aria-label="مشاركة المقال">
      <span className="text-sm text-pepper/70 ms-1">شارك:</span>
      {(["whatsapp", "x", "telegram"] as const).map((k) => (
        <a
          key={k}
          href={links[k]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`مشاركة عبر ${NAMES[k]}`}
          title={`مشاركة عبر ${NAMES[k]}`}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white transition-transform hover:scale-110"
          style={{ background: COLORS[k] }}
        >
          {ICONS[k]}
        </a>
      ))}
    </div>
  );
}
