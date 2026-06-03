import { ImageResponse } from "next/og";

export const alt = "علم تأويل الرؤى — مساحة عربية للتفسير والمعرفة";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Fetch Tajawal Bold from Google Fonts at build time so Arabic glyphs
 * actually render. Without a custom font, Satori (next/og engine) falls
 * back to Inter, which renders Arabic text as empty tofu boxes.
 */
async function loadTajawal(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(
      "https://fonts.gstatic.com/s/tajawal/v9/Iurf6YBj_oCad4k1nzWBC45J_w.ttf",
      { cache: "force-cache" }
    );
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OGImage() {
  const tajawal = await loadTajawal();

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
          padding: "60px",
          fontFamily: tajawal ? "Tajawal" : "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 700,
            lineHeight: 1.1,
            textAlign: "center",
            marginBottom: 28,
            color: "#fff",
          }}
        >
          علم تأويل الرؤى
        </div>
        <div
          style={{
            fontSize: 42,
            lineHeight: 1.4,
            textAlign: "center",
            opacity: 0.92,
          }}
        >
          مساحة عربية للتأمّل والتفسير
        </div>
      </div>
    ),
    {
      ...size,
      fonts: tajawal
        ? [
            {
              name: "Tajawal",
              data: tajawal,
              weight: 700,
              style: "normal",
            },
          ]
        : undefined,
    }
  );
}
