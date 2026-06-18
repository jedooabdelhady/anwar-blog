import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Read-only diagnostic that shows what the production runtime actually
 * sees for the email-related env vars. We do NOT print API keys or the
 * SESSION_PASSWORD — only:
 *   - CONTACT_EMAIL_FROM (the address the emails claim to come from)
 *   - CONTACT_EMAIL_TO   (the inbox admin notifications land in)
 *   - NEXT_PUBLIC_SITE_URL (used to build links in emails)
 *   - boolean "isSet" for every secret, so you can confirm they exist
 *     without ever exposing the value.
 *
 * Visit /api/debug/email-config in any browser. Safe to keep deployed
 * because none of the printed values are secrets, but feel free to
 * remove the file once you've finished diagnosing.
 */
export async function GET() {
  const from = process.env.CONTACT_EMAIL_FROM || "";
  return NextResponse.json(
    {
      runtime: "production-or-preview",
      now: new Date().toISOString(),
      env: {
        CONTACT_EMAIL_FROM: from || "❌ NOT SET (will default to onboarding@resend.dev which only sends to the Resend account owner)",
        CONTACT_EMAIL_TO: process.env.CONTACT_EMAIL_TO || "❌ NOT SET",
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "❌ NOT SET",
        NEXT_PUBLIC_SANITY_PROJECT_ID:
          process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "❌ NOT SET",
      },
      secretsPresent: {
        RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
        SANITY_WRITE_TOKEN: Boolean(process.env.SANITY_WRITE_TOKEN),
        SANITY_WEBHOOK_SECRET: Boolean(process.env.SANITY_WEBHOOK_SECRET),
        SESSION_PASSWORD: Boolean(process.env.SESSION_PASSWORD),
      },
      diagnosis: {
        fromAddressEffective: from
          ? from.includes("<")
            ? from
            : `علم تأويل الرؤى <${from}>`
          : "علم تأويل الرؤى <onboarding@resend.dev>",
        isUsingSandbox:
          !from || from.includes("onboarding@resend.dev"),
        warning:
          !from || from.includes("onboarding@resend.dev")
            ? "Sandbox mode: Resend will reject any recipient other than the account owner."
            : null,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
