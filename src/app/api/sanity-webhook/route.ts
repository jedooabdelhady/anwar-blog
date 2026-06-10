import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { Resend } from "resend";
import { writeClient } from "@/sanity/lib/client";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sahaarr299.com"
).replace(/\/$/, "");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  "public-vision":  "رؤية عامة",
  "private-vision": "رؤية خاصة",
  "inquiry":        "تساؤل واستعلام",
};

type SubmissionPayload = {
  _id?: string;
  _type?: string;
  email?: string;
  name?: string;
  kind?: string;
  subject?: string;
  message?: string;
  replyMessage?: string;
  replySentAt?: string;
  accessToken?: string;
};

/** Verify a Sanity webhook signature header.
 *  Header format: `t=<unix-ts>,v1=<base64url-sig>`
 *  v1 = HMAC-SHA256(secret, `${t}.${body}`) base64url-encoded. */
function isValidSignature(
  body: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const parts: Record<string, string> = {};
  for (const part of signature.split(",")) {
    const eq = part.indexOf("=");
    if (eq > 0) parts[part.slice(0, eq)] = part.slice(eq + 1);
  }
  if (!parts.t || !parts.v1) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${parts.t}.${body}`)
    .digest("base64url");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(parts.v1),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[sanity-webhook] SANITY_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { ok: false, error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get("sanity-webhook-signature");
  if (!isValidSignature(rawBody, signature, secret)) {
    return NextResponse.json(
      { ok: false, error: "Invalid signature" },
      { status: 401 }
    );
  }

  let doc: SubmissionPayload;
  try {
    doc = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // The webhook filter already prunes drafts and already-sent replies,
  // but we re-check here so manual replays of the payload stay safe.
  const realId = doc._id?.startsWith("drafts.")
    ? doc._id.slice("drafts.".length)
    : doc._id;

  if (!doc.replyMessage?.trim()) {
    return NextResponse.json({ ok: true, skipped: "no reply message" });
  }
  if (doc.replySentAt) {
    return NextResponse.json({ ok: true, skipped: "already sent" });
  }
  if (!doc.email) {
    if (realId) {
      await writeClient
        .patch(realId)
        .set({ replyError: "العميل لم يترك بريدًا إلكترونيًا للرد." })
        .commit()
        .catch(() => {});
    }
    return NextResponse.json(
      { ok: false, error: "No customer email on submission" },
      { status: 400 }
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { ok: false, error: "Resend not configured" },
      { status: 500 }
    );
  }

  const fromRaw = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";
  const from = fromRaw.includes("<")
    ? fromRaw
    : `علم تأويل الرؤى <${fromRaw}>`;
  const adminCopy = process.env.CONTACT_EMAIL_TO;

  const subjectLine = doc.subject
    ? `ردّ: ${doc.subject}`
    : `ردّ على رسالتك — ${KIND_LABEL[doc.kind || ""] || "علم تأويل الرؤى"}`;

  // Resolve accessToken for the email link. Order of preference:
  //   1. webhook projection (fastest, no extra round-trip)
  //   2. live read from Sanity (in case projection isn't updated yet)
  //   3. backfill — only for genuine legacy docs with no token at all
  // The live read is CRITICAL: an outdated projection used to make this
  // branch overwrite a newly-issued token with a fresh UUID, which
  // invalidated the link the customer was already holding.
  let accessToken = doc.accessToken;
  if (!accessToken && realId) {
    try {
      const fresh = await (
        writeClient.fetch.bind(writeClient) as (
          q: string,
          p: Record<string, string>
        ) => Promise<{ accessToken?: string } | null>
      )(`*[_id == $id][0]{accessToken}`, { id: realId });
      accessToken = fresh?.accessToken;
    } catch (err) {
      console.warn("[sanity-webhook] accessToken lookup failed:", err);
    }
  }
  if (!accessToken && realId) {
    accessToken = crypto.randomUUID();
    await writeClient
      .patch(realId)
      .set({ accessToken })
      .commit()
      .catch((err) => {
        console.warn("[sanity-webhook] accessToken backfill failed:", err);
        accessToken = undefined;
      });
  }
  const conversationUrl = accessToken
    ? `${SITE_URL}/inquiry/${accessToken}`
    : null;

  const html = `
    <div style="font-family: -apple-system, Tahoma, Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto;">
      <p style="color:#2b1d15;font-size:15px">السلام عليكم ${esc(doc.name || "")},</p>
      <p style="color:#2b1d15;font-size:15px;line-height:1.8">شكرًا لتواصلك مع <strong>علم تأويل الرؤى</strong>. تجدون أدناه الرد على رسالتكم:</p>
      <div style="background:#f7f1ea;border:1px solid #d9cdbe;border-radius:12px;padding:16px;white-space:pre-wrap;line-height:1.9;color:#2b1d15;margin:16px 0">${esc(doc.replyMessage.trim())}</div>
      ${conversationUrl ? `
      <p style="text-align:center;margin:24px 0">
        <a href="${conversationUrl}" style="display:inline-block;background:#6B3F23;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:bold">عرض المحادثة على الموقع</a>
      </p>` : ""}
      ${doc.message ? `
      <details style="margin-top:24px;color:#6b5b50;font-size:13px">
        <summary style="cursor:pointer;color:#8c7d72">رسالتك الأصلية</summary>
        <div style="background:#ece2d6;border-radius:8px;padding:12px;margin-top:8px;white-space:pre-wrap;color:#6b5b50">${esc(doc.message)}</div>
      </details>` : ""}
      <p style="margin-top:32px;color:#8c7d72;font-size:13px;border-top:1px solid #d9cdbe;padding-top:12px">ودمتم بخير،<br/><strong>علم تأويل الرؤى</strong></p>
    </div>
  `;

  // Resend SDK returns { data, error } on response failures (e.g. domain
  // not verified, recipient not allowed in onboarding mode) instead of
  // throwing — we MUST inspect `error` or those failures silently look
  // like a successful send.
  let sendError: string | null = null;
  try {
    const resend = new Resend(resendKey);
    const result = await resend.emails.send({
      from,
      to: doc.email,
      bcc: adminCopy || undefined,
      replyTo: adminCopy || undefined,
      subject: subjectLine,
      html,
    });
    if (result.error) {
      sendError =
        `${result.error.name || "ResendError"}: ${result.error.message || JSON.stringify(result.error)}`;
    } else {
      console.info(
        "[sanity-webhook] Resend accepted email id=",
        result.data?.id
      );
    }
  } catch (err) {
    sendError = err instanceof Error ? err.message : String(err);
  }

  if (sendError) {
    console.error("[sanity-webhook] Resend send failed:", sendError);
    if (realId) {
      await writeClient
        .patch(realId)
        .set({ replyError: sendError.slice(0, 500) })
        .commit()
        .catch(() => {});
    }
    return NextResponse.json(
      { ok: false, error: sendError },
      { status: 500 }
    );
  }

  if (realId) {
    await writeClient
      .patch(realId)
      .set({
        replySentAt: new Date().toISOString(),
        replyError: "",
        status: "answered",
      })
      .commit()
      .catch((err) => {
        console.error("[sanity-webhook] post-send patch failed:", err);
      });
  }

  return NextResponse.json({ ok: true });
}

function esc(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      } as Record<string, string>)[c]!
  );
}
