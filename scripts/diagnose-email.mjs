/**
 * Diagnose why verification / reset / notification emails stopped
 * arriving. Prints:
 *   - How many users exist (proves /api/auth/register is reaching Sanity)
 *   - The last user's verifyToken/expiry status (proves token-hash flow)
 *   - Last 5 submissions (proves /api/submissions is reaching Sanity)
 *   - Sends a probe email via Resend to confirm credentials + domain
 *     are still valid; surfaces the exact Resend error if not.
 *
 * Usage:
 *   node scripts/diagnose-email.mjs [optional@test-email.com]
 *
 * If you pass an email, the probe goes there; otherwise it goes to
 * CONTACT_EMAIL_TO from .env.local so you can confirm receipt.
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

const probeTo = process.argv[2] || env.CONTACT_EMAIL_TO;
console.log("\n=== Email Pipeline Diagnostic ===\n");

console.log("📋 Environment (from .env.local):");
console.log(`  NEXT_PUBLIC_SITE_URL = ${env.NEXT_PUBLIC_SITE_URL || "(not set)"}`);
console.log(`  RESEND_API_KEY       = ${env.RESEND_API_KEY ? "set (" + env.RESEND_API_KEY.slice(0, 8) + "…)" : "❌ NOT SET"}`);
console.log(`  CONTACT_EMAIL_FROM   = ${env.CONTACT_EMAIL_FROM || "(default: onboarding@resend.dev)"}`);
console.log(`  CONTACT_EMAIL_TO     = ${env.CONTACT_EMAIL_TO || "(not set)"}`);
console.log(`  SANITY_WRITE_TOKEN   = ${env.SANITY_WRITE_TOKEN ? "set" : "❌ NOT SET"}`);
console.log();

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: env.SANITY_WRITE_TOKEN,
});

// 1) Users
const users = await client.fetch(
  `*[_type == "user"] | order(_createdAt desc)[0...5]{
    _id, username, email, emailVerified, createdAt, lastLoginAt,
    "hasVerifyToken": defined(verifyToken),
    verifyExpiresAt,
    "isVerifyExpired": defined(verifyExpiresAt) && dateTime(verifyExpiresAt) < dateTime(now())
  }`
);
const totalUsers = await client.fetch(`count(*[_type == "user"])`);
console.log(`👥 المستخدمون (إجمالي: ${totalUsers}):`);
for (const u of users) {
  const stamp = u.createdAt ? new Date(u.createdAt).toLocaleString("ar-EG") : "(لا تاريخ)";
  console.log(`  ${u.emailVerified ? "✅" : "⚠️"} ${u.username} <${u.email}> — سُجل ${stamp}`);
  if (u.hasVerifyToken) {
    console.log(`     verifyToken موجود، الصلاحية ${u.verifyExpiresAt} ${u.isVerifyExpired ? "(منتهي)" : "(لازال صالحاً)"}`);
  }
}
console.log();

// 2) Submissions
const subs = await client.fetch(
  `*[_type == "submission"] | order(createdAt desc)[0...5]{
    _id, name, email, kind, createdAt, status,
    "hasReply": defined(replyMessage),
    replySentAt, replyError
  }`
);
console.log(`📨 آخر 5 رسائل واردة:`);
for (const s of subs) {
  const stamp = s.createdAt ? new Date(s.createdAt).toLocaleString("ar-EG") : "(لا تاريخ)";
  console.log(`  [${s.status}] ${s.name} <${s.email || "بلا بريد"}> — ${stamp}`);
  if (s.hasReply) {
    console.log(`     reply: ${s.replySentAt ? "أُرسل " + s.replySentAt : "❌ كُتب لكن لم يُرسل"}`);
    if (s.replyError) console.log(`     replyError: ${s.replyError}`);
  }
}
console.log();

// 3) Probe Resend
if (!env.RESEND_API_KEY) {
  console.log("❌ تخطّي اختبار Resend — RESEND_API_KEY غير موجود.");
  process.exit(1);
}
if (!probeTo) {
  console.log("⚠️ لا يوجد بريد probe (لا CONTACT_EMAIL_TO ولا argv).");
  process.exit(1);
}

const fromRaw = env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";
const from = fromRaw.includes("<") ? fromRaw : `علم تأويل الرؤى <${fromRaw}>`;

console.log(`📮 إرسال probe email...`);
console.log(`  من: ${from}`);
console.log(`  إلى: ${probeTo}`);

const resend = new Resend(env.RESEND_API_KEY);
const result = await resend.emails.send({
  from,
  to: probeTo,
  subject: "[probe] فحص أنبوب البريد — علم تأويل الرؤى",
  html: `<div dir="rtl" style="font-family:Tahoma">
    <h2>هذا probe من سكربت التشخيص</h2>
    <p>إذا وصلتك هذه الرسالة، فأنبوب Resend شغّال.</p>
    <p>الوقت: ${new Date().toLocaleString("ar-EG")}</p>
  </div>`,
});

if (result.error) {
  console.log(`\n❌ Resend رفض الإرسال:`);
  console.log(`   name: ${result.error.name}`);
  console.log(`   message: ${result.error.message}`);
  console.log(`   كامل: ${JSON.stringify(result.error)}`);
  console.log(`\nراجع الخطأ أعلاه — هذا هو السبب الفعلي لعدم وصول الإيميلات.`);
  process.exit(1);
} else {
  console.log(`\n✅ Resend قبل الإرسال — id: ${result.data?.id}`);
  console.log(`   افحص الـ inbox (والـ spam) في ${probeTo} خلال 60 ثانية.`);
  console.log(`   إذا لم تصل: المشكلة عند مقدم البريد (Gmail/Outlook).`);
  console.log(`   راجع أيضاً https://resend.com/emails للتحقق من حالة التسليم النهائية.`);
}
console.log();
