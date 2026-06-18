import { NextResponse } from "next/server";
import { sendVerifyEmail } from "@/lib/auth/emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Production-side email probe.
 *
 * Calls sendVerifyEmail() with the same code path /api/auth/register
 * uses, but always sends to CONTACT_EMAIL_TO (Sahar's inbox) — never
 * to a caller-supplied address — so this endpoint can't be abused to
 * spam third parties.
 *
 * Returns the raw outcome so we see exactly what Resend says when the
 * production runtime makes the call. If this returns { ok: true } and
 * Sahar's inbox still doesn't get it, the failure is downstream of
 * Resend (Gmail spam, etc.). If it returns { ok: false }, the message
 * field is the actual reason production has been failing.
 */
export async function GET() {
  const to = process.env.CONTACT_EMAIL_TO;
  if (!to) {
    return NextResponse.json(
      { ok: false, error: "CONTACT_EMAIL_TO not configured on the server." },
      { status: 500 }
    );
  }

  // Use an obviously-fake token so Sahar can spot this probe in her
  // inbox and isn't tempted to click a real-looking verify link.
  const result = await sendVerifyEmail(to, "PROBE-FAKE-TOKEN-IGNORE-ME");

  return NextResponse.json(
    {
      to,
      from:
        process.env.CONTACT_EMAIL_FROM
          ? process.env.CONTACT_EMAIL_FROM.includes("<")
            ? process.env.CONTACT_EMAIL_FROM
            : `علم تأويل الرؤى <${process.env.CONTACT_EMAIL_FROM}>`
          : "علم تأويل الرؤى <onboarding@resend.dev>",
      siteUrlUsedInLink: process.env.NEXT_PUBLIC_SITE_URL || "https://sahaarr299.com",
      result,
      hint: result.ok
        ? `Resend قبل الرسالة. لو لم تصلك خلال دقيقة → الـ spam folder، أو فحص resend.com/emails`
        : `Resend رفض الرسالة. السبب أعلاه في result.error هو ما يحدث لكل register/forgot.`,
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}
