import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { Resend } from "resend";
import { writeClient } from "@/sanity/lib/client";
import { sanityConfigured, writeToken } from "@/sanity/env";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_KINDS = ["public-vision", "private-vision", "inquiry"] as const;
type Kind = (typeof VALID_KINDS)[number];

const KIND_LABEL: Record<Kind, string> = {
  "public-vision":  "رؤية عامة (آراء ومقترحات)",
  "private-vision": "رؤية خاصة (مشروع / نقاش)",
  "inquiry":        "تساؤل واستعلام",
};

type Payload = {
  kind?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  /** honeypot — bots fill this; humans never see it */
  website?: string;
};

function validate(p: Payload): { ok: true; data: Required<Omit<Payload, "website" | "phone" | "email" | "subject">> & Payload } | { ok: false; error: string } {
  if (p.website) return { ok: false, error: "spam" };
  if (!p.kind || !VALID_KINDS.includes(p.kind as Kind))
    return { ok: false, error: "نوع النموذج غير صحيح." };
  if (!p.name || p.name.trim().length < 2)
    return { ok: false, error: "الاسم مطلوب (حرفان على الأقل)." };
  if (!p.message || p.message.trim().length < 3)
    return { ok: false, error: "الرسالة مطلوبة (3 أحرف على الأقل)." };
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
    return { ok: false, error: "البريد الإلكتروني غير صالح." };
  if (p.name.length > 120 || p.message.length > 5000)
    return { ok: false, error: "النص طويل جداً." };
  return { ok: true, data: { ...p, name: p.name, message: p.message } as never };
}

export async function POST(req: NextRequest) {
  // Auth required — anonymous submissions are no longer allowed. The website
  // gates the forms behind /auth/login, but the server enforces the same rule
  // in case someone hits the API directly.
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "auth-required", message: "يلزم تسجيل الدخول لإرسال الرسائل." },
      { status: 401 }
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "صيغة غير صحيحة." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    if (result.error === "spam") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  const kind = body.kind as Kind;
  const data = {
    kind,
    name: body.name!.trim(),
    email: body.email?.trim() || undefined,
    phone: body.phone?.trim() || undefined,
    subject: body.subject?.trim() || undefined,
    message: body.message!.trim(),
  };

  // 1) Persist to Sanity (if configured)
  // accessToken lets the visitor view this conversation (and the admin's
  // reply) at /inquiry/{token} without an account.
  const accessToken = crypto.randomUUID();
  let savedId: string | undefined;
  if (sanityConfigured && writeToken) {
    try {
      const created = await writeClient.create({
        _type: "submission",
        ...data,
        createdAt: new Date().toISOString(),
        status: "new",
        accessToken,
        user: { _type: "reference", _ref: session.userId },
      });
      savedId = created._id;
    } catch (err) {
      console.error("[submission] Sanity write failed:", err);
    }
  } else {
    const reason = !sanityConfigured
      ? "Sanity project ID not set"
      : "SANITY_WRITE_TOKEN missing";
    console.info(
      `[submission] ${reason} — submission received but NOT persisted:`,
      data
    );
  }

  // 2) Notify by email (if Resend configured)
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const fromRaw = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";
  // Display a friendly brand name in the inbox: "تأويل الرؤى <addr>"
  const from = fromRaw.includes("<") ? fromRaw : `علم تأويل الرؤى <${fromRaw}>`;

  if (resendKey && to) {
    try {
      const resend = new Resend(resendKey);
      const html = `
        <div style="font-family: -apple-system, Tahoma, Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto;">
          <h2 style="color:#38261C;border-bottom:2px solid #6B3F23;padding-bottom:8px">رسالة جديدة — ${KIND_LABEL[kind]}</h2>
          <table style="width:100%;border-collapse:collapse;font-size:15px">
            <tr><td style="padding:6px 0;color:#6b5b50;width:120px">الاسم:</td><td style="padding:6px 0;color:#2b1d15"><strong>${esc(data.name)}</strong></td></tr>
            ${data.email   ? `<tr><td style="padding:6px 0;color:#6b5b50">البريد:</td><td style="padding:6px 0"><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>` : ""}
            ${data.phone   ? `<tr><td style="padding:6px 0;color:#6b5b50">الجوال:</td><td style="padding:6px 0">${esc(data.phone)}</td></tr>` : ""}
            ${data.subject ? `<tr><td style="padding:6px 0;color:#6b5b50">الموضوع:</td><td style="padding:6px 0">${esc(data.subject)}</td></tr>` : ""}
          </table>
          <h3 style="color:#38261C;margin-top:24px">الرسالة:</h3>
          <div style="background:#f7f1ea;border:1px solid #d9cdbe;border-radius:12px;padding:16px;white-space:pre-wrap;line-height:1.8">${esc(data.message)}</div>
          <p style="margin-top:24px;color:#8c7d72;font-size:13px">وصلت في: ${new Date().toLocaleString("ar-EG")}</p>
        </div>
      `;
      const result = await resend.emails.send({
        from,
        to,
        replyTo: data.email || undefined,
        subject: `[${KIND_LABEL[kind]}] رسالة جديدة من ${data.name}`,
        html,
      });
      // Resend returns response-level errors via { error }, not by throwing.
      if (result.error) {
        console.error("[submission] Resend rejected notification:", result.error);
      } else {
        console.info("[submission] Resend accepted notification id=", result.data?.id);
      }
    } catch (err) {
      console.error("[submission] Resend email failed:", err);
    }
  } else {
    console.info(
      "[submission] Resend not configured — email notification skipped"
    );
  }

  return NextResponse.json({ ok: true, id: savedId, accessToken });
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as Record<string, string>)[c]!
  );
}
