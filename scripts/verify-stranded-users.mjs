/**
 * One-shot rescue for members whose verification email landed in spam:
 * flips emailVerified=true so they can use the site immediately,
 * without waiting for them to dig through their spam folder.
 *
 * Usage:
 *   # Mark every unverified user as verified
 *   node scripts/verify-stranded-users.mjs --all
 *
 *   # Or pick specific usernames / emails
 *   node scripts/verify-stranded-users.mjs mvsri Noon shalaah511@gmail.com
 *
 * The script lists what it would do first, then asks for confirmation
 * by re-running with --yes. Designed to be safe to leave in the repo —
 * it only ever writes emailVerified, never reads or modifies passwords.
 */

import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = {};
for (const line of readFileSync(resolve(__dirname, "..", ".env.local"), "utf8").split("\n")) {
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

const args = process.argv.slice(2);
const apply = args.includes("--yes");
const all = args.includes("--all");
const selectors = args.filter((a) => !a.startsWith("--"));

let users;
if (all) {
  users = await client.fetch(
    `*[_type == "user" && emailVerified != true]{_id, username, email}`
  );
} else if (selectors.length > 0) {
  users = await client.fetch(
    `*[_type == "user" && (username in $sel || email in $sel)]{_id, username, email, emailVerified}`,
    { sel: selectors }
  );
} else {
  console.log("الاستخدام:");
  console.log("  node scripts/verify-stranded-users.mjs --all          # كل غير المفعّلين");
  console.log("  node scripts/verify-stranded-users.mjs user1 user2…   # محددين");
  console.log("أضف --yes في النهاية لتنفيذ التعديل فعلاً.");
  process.exit(0);
}

if (users.length === 0) {
  console.log("لا يوجد مستخدمون مطابقون.");
  process.exit(0);
}

console.log(`\nسيتم تفعيل ${users.length} عضو:\n`);
for (const u of users) {
  console.log(`  ✓ ${u.username.padEnd(20)} <${u.email}>${u.emailVerified ? "  (مفعّل أصلاً)" : ""}`);
}

if (!apply) {
  console.log(`\n— تجربة جافة. أضف --yes لتنفيذ التغيير فعلاً.`);
  process.exit(0);
}

console.log(`\nتنفيذ التعديل...`);
let done = 0;
for (const u of users) {
  await client
    .patch(u._id)
    .set({ emailVerified: true })
    .unset(["verifyToken", "verifyExpiresAt", "lastEmailError"])
    .commit();
  done++;
  console.log(`  ✓ ${u.username}`);
}
console.log(`\n✅ تم تفعيل ${done} عضو.`);
