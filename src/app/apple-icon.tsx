import { ImageResponse } from "next/og";

/** Next.js generates a 180x180 PNG from this component at build time. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#6B3F23",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 200 200" width="160" height="160">
          {/* Crescent on the left */}
          <path
            d="M 100 28 C 60 28 32 60 32 100 C 32 140 60 172 100 172"
            fill="none"
            stroke="#EDE5DE"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Yaz human figure */}
          <g
            stroke="#EDE5DE"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <circle cx="100" cy="58" r="5.5" fill="#EDE5DE" stroke="none" />
            <path d="M 76 56 L 100 80 L 124 56" />
            <path d="M 100 80 L 100 96" />
            <path d="M 100 96 L 109 106 L 100 116 L 91 106 Z" fill="#EDE5DE" />
            <path d="M 100 116 L 100 132" />
            <path d="M 74 168 L 74 144 Q 100 122 126 144 L 126 168" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
