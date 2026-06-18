/**
 * Sends a short "your account is ready" email to every member whose
 * verification mail landed in spam, so they don't need to dig through
 * their inbox or wait for us to mention it on social.
 *
 * Pairs with verify-stranded-users.mjs:
 *   1) verify-stranded-users.mjs flips emailVerified=true
 *   2) notify-stranded-users.mjs tells them they can log in now
 *
 * Usage:
 *   # Dry-run — lists who would be emailed
 *   node scripts/notify-stranded-users.mjs
 *
 *   # Actually send
 *   node scripts/notify-stranded-users.mjs --yes
 *
 *   # Limit to specific usernames or emails
 *   node scripts/notify-stranded-users.mjs --yes Noon mvsri
 */

import { createClient } from "next-sanity";
import { Resend } from "resend";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = {};
for (const line of readFileSync(resolve(__dirname, "..", ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2];
}

// Allow CLI/process env to override the FROM so we always send with
// the verified production sender, even from a dev shell.
for (const k of ["CONTACT_EMAIL_FROM", "NEXT_PUBLIC_SITE_URL"]) {
  if (process.env[k]) env[k] = process.env[k];
}

const SITE_URL = (() => {
  let raw = (env.NEXT_PUBLIC_SITE_URL || "https://sahaarr299.com").trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  return raw;
})();

const args = process.argv.slice(2);
const apply = args.includes("--yes");
const selectors = args.filter((a) => !a.startsWith("--"));

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: env.SANITY_WRITE_TOKEN,
});

const query =
  selectors.length > 0
    ? `*[_type == "user" && (username in $sel || email in $sel)]{_id, username, email, displayName}`
    : `*[_type == "user" && emailVerified == true]{_id, username, email, displayName}`;

const users = await client.fetch(query, { sel: selectors });

if (users.length === 0) {
  console.log("لا يوجد أعضاء لإرسال البريد إليهم.");
  process.exit(0);
}

console.log(`\nسيتم إرسال رسالة لـ ${users.length} عضو:\n`);
for (const u of users) {
  console.log(`  • ${u.username.padEnd(20)} <${u.email}>`);
}

if (!apply) {
  console.log(`\n— تجربة جافة. أضف --yes لتنفيذ الإرسال فعلاً.`);
  process.exit(0);
}

const fromRaw = env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";
const from = fromRaw.includes("<") ? fromRaw : `علم تأويل الرؤى <${fromRaw}>`;
const replyTo = env.CONTACT_EMAIL_TO || "sahaarr299@gmail.com";

if (!env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY غير موجود.");
  process.exit(1);
}
const resend = new Resend(env.RESEND_API_KEY);

function emailFor(u) {
  const name = u.displayName || u.username;
  const subject = `أهلاً بك في علم تأويل الرؤى — حسابك جاهز`;
  const text = [
    `أهلاً ${name}،`,
    ``,
    `حسابك على موقع علم تأويل الرؤى جاهز للاستعمال.`,
    `اسم المستخدم: ${u.username}`,
    `كلمة المرور: نفس التي اخترتها عند التسجيل.`,
    ``,
    `للدخول: ${SITE_URL}/auth/login`,
    ``,
    `لو نسيت كلمة المرور، اضغط "نسيت كلمة المرور؟" في نفس الصفحة وسيصلك رابط استرداد.`,
    ``,
    `بالتوفيق،`,
    `علم تأويل الرؤى`,
    SITE_URL,
  ].join("\n");
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
  <body style="margin:0;padding:0;background:#f5efe8;color:#2b1d15;font-family:-apple-system,'Segoe UI',Tahoma,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5efe8">
      <tr><td align="center" style="padding:24px 12px">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e6dccf;border-radius:12px">
          <tr><td style="padding:28px 32px 8px 32px;text-align:right" dir="rtl">
            <p style="margin:0;color:#8c7d72;font-size:13px">علم تأويل الرؤى</p>
            <h1 style="margin:6px 0 0 0;color:#38261C;font-size:22px;line-height:1.4">أهلاً ${name} — حسابك جاهز</h1>
          </td></tr>
          <tr><td style="padding:16px 32px 8px 32px;text-align:right;color:#2b1d15;font-size:15px;line-height:1.9" dir="rtl">
            <p style="margin:0 0 10px 0">حسابك على موقع <strong>علم تأويل الرؤى</strong> جاهز للاستعمال.</p>
            <p style="margin:0 0 6px 0">اسم المستخدم: <strong>${u.username}</strong></p>
            <p style="margin:0">كلمة المرور: نفس التي اخترتها عند التسجيل.</p>
          </td></tr>
          <tr><td style="padding:20px 32px" align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="background:#6B3F23;border-radius:999px">
                <a href="${SITE_URL}/auth/login" style="display:inline-block;color:#ffffff;text-decoration:none;padding:13px 32px;font-size:15px;font-weight:700">الدخول للحساب</a>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:8px 32px 24px 32px;text-align:right;color:#6b5b50;font-size:13px;line-height:1.7" dir="rtl">
            لو نسيت كلمة المرور، اضغط "نسيت كلمة المرور؟" في صفحة الدخول وسيصلك رابط استرداد.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
  return { subject, text, html };
}

console.log(`\nالإرسال...`);
let ok = 0, fail = 0;
for (const u of users) {
  const { subject, text, html } = emailFor(u);
  try {
    const r = await resend.emails.send({
      from, to: u.email, replyTo, subject, text, html,
    });
    if (r.error) {
      console.log(`  ✗ ${u.username}: ${r.error.message || r.error}`);
      fail++;
    } else {
      console.log(`  ✓ ${u.username}`);
      ok++;
    }
  } catch (err) {
    console.log(`  ✗ ${u.username}: ${err.message}`);
    fail++;
  }
  // Stagger: Resend's free tier allows 2 requests/second.
  await new Promise((r) => setTimeout(r, 600));
}
console.log(`\n✅ نجح: ${ok}    ❌ فشل: ${fail}`);
