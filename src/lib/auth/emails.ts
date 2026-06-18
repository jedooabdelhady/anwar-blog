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

function fromAddress(): string {
  const raw = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";
  return raw.includes("<") ? raw : `علم تأويل الرؤى <${raw}>`;
}

/** A bare email address suitable for Reply-To headers. */
function replyToAddress(): string {
  return process.env.CONTACT_EMAIL_TO || "sahaarr299@gmail.com";
}

/** Plain-text alternative — Gmail treats HTML-only messages as more
 *  spam-like, so every send includes both formats. */
function plainText(title: string, summary: string, url: string): string {
  return `${title}\n\n${summary}\n\n${url}\n\n— علم تأويل الرؤى\n${siteUrl()}\n\nإذا لم تطلب هذا الإيميل فيمكنك تجاهله.`;
}

function shell(title: string, bodyHtml: string, ctaHtml: string): string {
  return `
    <div style="font-family:-apple-system,Tahoma,Arial,sans-serif;direction:rtl;text-align:right;max-width:600px;margin:0 auto;padding:24px;background:#f5efe8;color:#2b1d15">
      <h2 style="color:#38261C;border-bottom:2px solid #6B3F23;padding-bottom:8px;margin:0 0 16px">${title}</h2>
      <div style="background:#f7f1ea;border:1px solid #d9cdbe;border-radius:12px;padding:18px;line-height:1.9">${bodyHtml}</div>
      <div style="margin-top:24px;text-align:center">${ctaHtml}</div>
      <p style="margin-top:28px;color:#8c7d72;font-size:12px;text-align:center">إذا لم تطلب هذا الإيميل فيمكنك تجاهله بأمان.</p>
      <p style="margin-top:6px;color:#8c7d72;font-size:12px;text-align:center">علم تأويل الرؤى — ${siteUrl()}</p>
    </div>
  `;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#6B3F23;color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:bold">${label}</a>`;
}

/** Headers that consistently improve Gmail/Outlook deliverability for
 *  transactional mail without making the message look promotional. */
function deliverabilityHeaders() {
  return {
    // Identifies the message as a transactional notification (RFC 2076).
    "X-Entity-Ref-ID": `anwar-${Date.now()}`,
    // Lets the recipient mark the sender as one-click unsubscribable —
    // Gmail rewards senders that expose this and ignore the rest.
    "List-Unsubscribe": `<mailto:${replyToAddress()}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

export async function sendVerifyEmail(to: string, token: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Resend غير مهيّأ على الخادم." };
  const url = `${siteUrl()}/auth/verify/${token}`;
  const title = "تفعيل بريدك الإلكتروني";
  const summary =
    "أهلاً بك في علم تأويل الرؤى. لتفعيل حسابك واستكمال التسجيل، افتح الرابط أدناه. الرابط صالح لمدة 24 ساعة.";
  const html = shell(
    title,
    "<p>أهلاً بك في <strong>علم تأويل الرؤى</strong>.</p><p>لتفعيل حسابك واستكمال التسجيل، اضغط على الزر أدناه. الرابط صالح لمدة 24 ساعة.</p>",
    button(url, "تفعيل الحساب")
  );
  try {
    const r = await new Resend(key).emails.send({
      from: fromAddress(),
      to,
      replyTo: replyToAddress(),
      subject: "تفعيل حسابك على علم تأويل الرؤى",
      html,
      text: plainText(title, summary, url),
      headers: deliverabilityHeaders(),
    });
    if (r.error) return { ok: false, error: String(r.error?.message || r.error) };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "فشل الإرسال." };
  }
}

export async function sendResetEmail(to: string, token: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Resend غير مهيّأ على الخادم." };
  const url = `${siteUrl()}/auth/reset/${token}`;
  const title = "استرداد كلمة المرور";
  const summary =
    "وردنا طلب لإعادة تعيين كلمة مرورك. افتح الرابط أدناه لتعيين كلمة مرور جديدة. الرابط صالح لمدة 30 دقيقة.";
  const html = shell(
    title,
    "<p>وردنا طلب لإعادة تعيين كلمة مرورك.</p><p>اضغط على الزر أدناه لتعيين كلمة مرور جديدة. الرابط صالح لمدة 30 دقيقة.</p>",
    button(url, "تعيين كلمة مرور جديدة")
  );
  try {
    const r = await new Resend(key).emails.send({
      from: fromAddress(),
      to,
      replyTo: replyToAddress(),
      subject: "استرداد كلمة المرور — علم تأويل الرؤى",
      html,
      text: plainText(title, summary, url),
      headers: deliverabilityHeaders(),
    });
    if (r.error) return { ok: false, error: String(r.error?.message || r.error) };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "فشل الإرسال." };
  }
}
