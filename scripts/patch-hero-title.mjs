/**
 * One-shot patch: update the existing siteSettings.hero.title to
 * "أهلاً بكم في علم تأويل الرؤى" and clear subtitle, so the new Hero
 * design ships with the right copy without needing the editor to log in.
 */
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
const env = {};
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2];
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: env.SANITY_WRITE_TOKEN,
});

const newHero = {
  _type: "object",
  title: "أهلاً بكم في علم تأويل الرؤى",
  subtitle: "",
};

try {
  await client.patch("siteSettings").set({ hero: newHero }).commit();
  console.log("✓ patched siteSettings.hero");
} catch (err) {
  console.error("✗ patch failed:", err.message);
  process.exit(1);
}
