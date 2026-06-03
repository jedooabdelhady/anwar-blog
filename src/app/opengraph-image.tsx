import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "علم تأويل الرؤى";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph image: the client's `full.png` logo on the brand's light
 * earthy background, no Arabic text.
 *
 * We embed the PNG as a base64 data URI because Satori cannot resolve
 * app-relative URLs at render time inside Vercel functions.
 */
export default async function OGImage() {
  const logoBuf = await readFile(join(process.cwd(), "public/logos/full.png"));
  const logoDataUri = `data:image/png;base64,${logoBuf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5efe8",
          backgroundImage:
            "radial-gradient(120% 80% at 50% 50%, #ede5de 0%, #d9cdbe 100%)",
        }}
      >
        {/* The client's own PNG, rendered at native colors */}
        <img
          src={logoDataUri}
          alt=""
          width="460"
          height="460"
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    size
  );
}
