import { Resend } from "resend";

function siteUrl(): string {
  let raw = (process.env.NEXT_PUBLIC_SITE_URL || "https://sahaarr299.com").trim();
  raw = raw.replace(/\/+$/, "");
  // If the editor pasted "sahaarr299.com" without scheme into Vercel,
  // links inside emails would render as relative URLs and Gmail's spam
  // filter would flag the whole message. Force a scheme.
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  return raw;
}

/** Bare email (no display-name wrapper) — needed for List-Unsubscribe
 *  and tracking domains. */
function fromBare(): string {
  const raw = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";
  const m = raw.match(/<([^>]+)>/);
  return m ? m[1] : raw;
}

function fromAddress(): string {
  const raw = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";
  return raw.includes("<") ? raw : `علم تأويل الرؤى <${raw}>`;
}

function replyToAddress(): string {
  return process.env.CONTACT_EMAIL_TO || "sahaarr299@gmail.com";
}

/**
 * Plain-text alternative. Gmail and Outlook both downgrade HTML-only
 * transactional mail. The text version mirrors the HTML — same call
 * to action, same link — which is what spam filters compare.
 */
function plainText(title: string, summary: string, url: string): string {
  return [
    title,
    "",
    summary,
    "",
    url,
    "",
    "— علم تأويل الرؤى",
    siteUrl(),
    "",
    "إذا لم تطلب هذا الإيميل فيمكنك تجاهله بأمان.",
  ].join("\n");
}

/**
 * Table-based HTML wrapper. Table layout survives Outlook + dark-mode
 * inversions better than div/flex, and an explicit preheader gives
 * inbox clients (Gmail in particular) the preview text we want
 * instead of stripping random bytes from the body.
 */
function shell({
  title,
  preheader,
  bodyHtml,
  ctaUrl,
  ctaLabel,
}: {
  title: string;
  preheader: string;
  bodyHtml: string;
  ctaUrl: string;
  ctaLabel: string;
}): string {
  const homeUrl = siteUrl();
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5efe8;color:#2b1d15;font-family:-apple-system,'Segoe UI',Tahoma,Arial,sans-serif">
    <!-- Preheader: shown in the inbox preview line, hidden from the body -->
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;visibility:hidden;opacity:0;color:transparent;height:0;width:0;font-size:0;line-height:0">${preheader}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5efe8">
      <tr>
        <td align="center" style="padding:24px 12px">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e6dccf;border-radius:12px">
            <tr>
              <td style="padding:28px 32px 8px 32px;text-align:right" dir="rtl">
                <p style="margin:0;color:#8c7d72;font-size:13px;letter-spacing:0.04em">علم تأويل الرؤى</p>
                <h1 style="margin:6px 0 0 0;color:#38261C;font-size:22px;line-height:1.4;font-weight:700">${title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 8px 32px;text-align:right;color:#2b1d15;font-size:15px;line-height:1.9" dir="rtl">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px" align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background:#6B3F23;border-radius:999px">
                      <a href="${ctaUrl}" style="display:inline-block;color:#ffffff;text-decoration:none;padding:13px 32px;font-size:15px;font-weight:700;font-family:-apple-system,'Segoe UI',Tahoma,Arial,sans-serif">${ctaLabel}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 20px 32px;text-align:right;color:#6b5b50;font-size:13px;line-height:1.7" dir="rtl">
                <p style="margin:0">لو لم يعمل الزر، انسخ الرابط التالي والصقه في المتصفح:</p>
                <p style="margin:6px 0 0 0;direction:ltr;text-align:left;word-break:break-all;color:#6B3F23;font-size:12px">${ctaUrl}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 24px 32px;border-top:1px solid #ece2d6;text-align:center;color:#8c7d72;font-size:12px;line-height:1.7">
                وصلك هذا الإيميل لأنك أنشأت حساباً على
                <a href="${homeUrl}" style="color:#6B3F23;text-decoration:none">علم تأويل الرؤى</a>.
                إذا لم تكن أنت، فيمكنك تجاهل الرسالة بأمان.
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0 0;color:#a89c8e;font-size:11px">© علم تأويل الرؤى</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Headers chosen specifically to lift transactional mail out of Gmail's
 * spam folder. The combination matters more than any single one —
 * Gmail's bulk-sender guidelines (2024+) reward senders that get all
 * three right.
 */
function deliverabilityHeaders() {
  const sender = fromBare();
  const id = `<anwar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@sahaarr299.com>`;
  return {
    "Message-ID": id,
    // Tells Gmail this is a one-off transactional notification.
    "X-Entity-Ref-ID": `anwar-${Date.now()}`,
    // RFC 8058 one-click unsubscribe — Gmail explicitly rewards this.
    "List-Unsubscribe": `<mailto:${sender}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    // Confirms this isn't bulk promotional mail.
    "Auto-Submitted": "auto-generated",
    "Precedence": "transactional",
  };
}

export async function sendVerifyEmail(
  to: string,
  token: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Resend غير مهيّأ على الخادم." };

  const url = `${siteUrl()}/auth/verify/${token}`;
  const title = "تأكيد بريدك الإلكتروني";
  const preheader = "خطوة أخيرة لإكمال تسجيلك — الرابط صالح لمدة 24 ساعة.";
  const summary =
    "أهلاً بك. لإكمال تسجيلك، يرجى تأكيد بريدك الإلكتروني عبر الرابط أدناه. الرابط صالح لمدة 24 ساعة.";

  try {
    const r = await new Resend(key).emails.send({
      from: fromAddress(),
      to,
      replyTo: replyToAddress(),
      // A neutral, human-style subject scores better than the imperative
      // "تفعيل حسابك" which trips Arabic spam dictionaries on Gmail.
      subject: "تأكيد بريدك — علم تأويل الرؤى",
      html: shell({
        title,
        preheader,
        bodyHtml:
          "<p style='margin:0 0 10px 0'>أهلاً بك في <strong>علم تأويل الرؤى</strong>.</p><p style='margin:0'>لإكمال تسجيلك، أكّد بريدك الإلكتروني بالضغط على الزر أدناه. الرابط صالح لمدة 24 ساعة.</p>",
        ctaUrl: url,
        ctaLabel: "تأكيد البريد",
      }),
      text: plainText(title, summary, url),
      headers: deliverabilityHeaders(),
    });
    if (r.error) return { ok: false, error: String(r.error?.message || r.error) };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "فشل الإرسال." };
  }
}

export async function sendResetEmail(
  to: string,
  token: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Resend غير مهيّأ على الخادم." };

  const url = `${siteUrl()}/auth/reset/${token}`;
  const title = "تعيين كلمة مرور جديدة";
  const preheader = "طلب إعادة تعيين كلمة المرور — الرابط صالح لمدة 30 دقيقة.";
  const summary =
    "وردنا طلب لإعادة تعيين كلمة مرورك. افتح الرابط أدناه لتعيين كلمة جديدة. الرابط صالح لمدة 30 دقيقة فقط.";

  try {
    const r = await new Resend(key).emails.send({
      from: fromAddress(),
      to,
      replyTo: replyToAddress(),
      subject: "طلب تعيين كلمة مرور — علم تأويل الرؤى",
      html: shell({
        title,
        preheader,
        bodyHtml:
          "<p style='margin:0 0 10px 0'>وردنا طلب لإعادة تعيين كلمة مرورك.</p><p style='margin:0'>افتح الزر أدناه لتعيين كلمة جديدة. الرابط صالح لمدة 30 دقيقة فقط. إذا لم تطلب هذا، تجاهل الرسالة وكلمة مرورك ستبقى كما هي.</p>",
        ctaUrl: url,
        ctaLabel: "تعيين كلمة مرور جديدة",
      }),
      text: plainText(title, summary, url),
      headers: deliverabilityHeaders(),
    });
    if (r.error) return { ok: false, error: String(r.error?.message || r.error) };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "فشل الإرسال." };
  }
}
