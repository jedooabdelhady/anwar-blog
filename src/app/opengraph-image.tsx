import { ImageResponse } from "next/og";

export const alt = "علم تأويل الرؤى";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph image — pure brand mark on a brown gradient.
 * No Arabic text is rendered (Satori cannot reliably shape Tajawal),
 * so the logo speaks for itself when the link is shared on
 * WhatsApp/Twitter/Facebook.
 */
export default function OGImage() {
  const STROKE = "#EDE5DE";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #8B6849 0%, #6B3F23 50%, #38261C 100%)",
        }}
      >
        <svg viewBox="0 0 240 240" width="500" height="500">
          {/* Crescent */}
          <path
            d="M 120 30 C 56 30 24 70 24 120 C 24 170 56 210 120 210"
            fill="none"
            stroke={STROKE}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 120 210 q 4 6 -2 14 q -2 4 4 6"
            fill="none"
            stroke={STROKE}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Sun rays */}
          <g fill={STROKE}>
            {[
              { a: -82, len: 50 },
              { a: -62, len: 60 },
              { a: -42, len: 66 },
              { a: -22, len: 70 },
              { a:  -2, len: 72 },
              { a:  18, len: 70 },
              { a:  38, len: 66 },
              { a:  58, len: 60 },
              { a:  78, len: 50 },
            ].map(({ a, len }, i) => (
              <g key={i} transform={`rotate(${a} 120 120) translate(120 32)`}>
                <path
                  d={`M 0 0 C -6 ${-len * 0.3} -6 ${-len * 0.7} 0 ${-len} C 6 ${-len * 0.7} 6 ${-len * 0.3} 0 0 Z`}
                />
              </g>
            ))}
          </g>
          {/* Yaz figure */}
          <g
            stroke={STROKE}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <circle cx="120" cy="65" r="8" fill={STROKE} stroke="none" />
            <path d="M 120 90 L 80 42" />
            <path d="M 120 90 L 160 42" />
            <path d="M 120 90 L 120 120" />
            <path d="M 120 120 L 134 142 L 120 166 L 106 142 Z" fill={STROKE} />
            <path d="M 120 166 L 120 180" />
            <path d="M 78 212 L 78 210 Q 120 172 162 210 L 162 212" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
