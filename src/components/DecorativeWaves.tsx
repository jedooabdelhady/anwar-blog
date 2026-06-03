/**
 * Decorative band at the top + bottom of the home page:
 *   1. Soft organic wave shape (existing).
 *   2. A faint line of stylised Tifinagh / Thamudic-inspired glyphs
 *      so the page has the same "archaeological" feel the client showed
 *      in her reference image.
 */

const GLYPHS = "ⵀ ⵙ ⴻ ⴽ ⵏ ⵎ ⵓ ⵣ ⵉ ⵜ ⵒ ⴹ ⴳ ⴱ ⴷ ⵟ ⵍ ⵕ ⵇ";

export function TopWaves() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden"
    >
      {/* Wave layer */}
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="w-full h-[180px] sm:h-[220px]"
      >
        <path
          d="M0,120 C220,40 420,200 720,120 C1020,40 1220,200 1440,120 L1440,0 L0,0 Z"
          fill="#B0997D"
          opacity="0.32"
        />
        <path
          d="M0,160 C260,90 480,220 760,160 C1040,100 1240,220 1440,160 L1440,0 L0,0 Z"
          fill="#8F8C78"
          opacity="0.18"
        />
      </svg>

      {/* Faint Tifinagh-style glyph row, just under the wave */}
      <div
        className="absolute inset-x-0 top-[150px] sm:top-[180px] text-center select-none whitespace-nowrap overflow-hidden"
        style={{
          color: "#6B3F23",
          opacity: 0.18,
          fontSize: "22px",
          letterSpacing: "0.6em",
        }}
      >
        {GLYPHS}
      </div>
    </div>
  );
}

export function BottomWaves() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 overflow-hidden"
    >
      {/* Glyph row sitting just above the bottom wave */}
      <div
        className="absolute inset-x-0 bottom-[150px] sm:bottom-[180px] text-center select-none whitespace-nowrap overflow-hidden"
        style={{
          color: "#6B3F23",
          opacity: 0.18,
          fontSize: "22px",
          letterSpacing: "0.6em",
        }}
      >
        {GLYPHS}
      </div>

      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="w-full h-[180px] sm:h-[220px]"
      >
        <path
          d="M0,100 C220,180 420,20 720,100 C1020,180 1220,20 1440,100 L1440,220 L0,220 Z"
          fill="#B0997D"
          opacity="0.32"
        />
        <path
          d="M0,60 C260,140 480,-20 760,60 C1040,140 1240,-20 1440,60 L1440,220 L0,220 Z"
          fill="#8F8C78"
          opacity="0.18"
        />
      </svg>
    </div>
  );
}
