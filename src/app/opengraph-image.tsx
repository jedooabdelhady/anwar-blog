import { ImageResponse } from "next/og";

export const alt = "علم تأويل الرؤى — مساحة عربية للتفسير والمعرفة";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #8B6849 0%, #6B3F23 50%, #38261C 100%)",
          color: "#EDE5DE",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Decorative giant logo on the right */}
        <div
          style={{
            position: "absolute",
            right: "-80px",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.18,
            display: "flex",
          }}
        >
          <svg viewBox="0 0 200 200" width="600" height="600">
            <path
              d="M 100 28 C 60 28 32 60 32 100 C 32 140 60 172 100 172"
              fill="none"
              stroke="#EDE5DE"
              strokeWidth="4"
            />
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
              <path
                d="M 100 96 L 109 106 L 100 116 L 91 106 Z"
                fill="#EDE5DE"
              />
              <path d="M 100 116 L 100 132" />
              <path d="M 74 168 L 74 144 Q 100 122 126 144 L 126 168" />
            </g>
          </svg>
        </div>

        {/* Main text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            textAlign: "right",
            zIndex: 10,
            width: "100%",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              fontSize: "92px",
              fontWeight: 800,
              letterSpacing: "-1px",
              marginBottom: "20px",
              lineHeight: 1.1,
              color: "#fff",
            }}
          >
            علم تأويل الرؤى
          </div>
          <div
            style={{
              fontSize: "36px",
              opacity: 0.92,
              lineHeight: 1.4,
              maxWidth: "700px",
            }}
          >
            مساحة عربية للتأمّل والتفسير
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "60px",
            fontSize: "22px",
            opacity: 0.75,
            color: "#EDE5DE",
          }}
        >
          anwar-blog-phi.vercel.app
        </div>
      </div>
    ),
    size
  );
}
