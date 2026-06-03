/**
 * Build the static Open Graph image (1200×630) by compositing the
 * client's full logo onto a warm brand-coloured background.
 *
 * Output: src/app/opengraph-image.png
 * (Next.js auto-detects this path and serves it as the OG image for /.)
 *
 * Re-run after the source logo changes:
 *   node scripts/build-og-image.mjs
 */
import sharp from "sharp";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SOURCE = resolve(ROOT, "public/logos/full.png");
const OUT    = resolve(ROOT, "src/app/opengraph-image.png");

const W = 1200;
const H = 630;
const LOGO_SIZE = 460;

// Solid earthy beige; matches the live site's `--bg`.
const BG = { r: 245, g: 239, b: 232 };

const logo = await sharp(SOURCE)
  .resize(LOGO_SIZE, LOGO_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();

await sharp({
  create: { width: W, height: H, channels: 4, background: BG },
})
  .composite([
    { input: logo, left: Math.round((W - LOGO_SIZE) / 2), top: Math.round((H - LOGO_SIZE) / 2) },
  ])
  .png()
  .toFile(OUT);

console.log(`✓ wrote ${OUT}`);
