import { Resend } from "resend";

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://sahaarr299.com"
  );
}

function fromAddress(): string {
  const raw = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";
  return raw.includes("<") ? raw : `علم تأويل الرؤى <${raw}>`;
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

export async function sendVerifyEmail(to: string, token: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Resend غير مهيّأ على الخادم." };
  const url = `${siteUrl()}/auth/verify/${token}`;
  const html = shell(
    "تفعيل بريدك الإلكتروني",
    "<p>أهلاً بك في <strong>علم تأويل الرؤى</strong>.</p><p>لتفعيل حسابك واستكمال التسجيل، اضغط على الزر أدناه. الرابط صالح لمدة 24 ساعة.</p>",
    button(url, "تفعيل الحساب")
  );
  try {
    const r = await new Resend(key).emails.send({
      from: fromAddress(),
      to,
      subject: "تفعيل حسابك على علم تأويل الرؤى",
      html,
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
  const html = shell(
    "استرداد كلمة المرور",
    "<p>وردنا طلب لإعادة تعيين كلمة مرورك.</p><p>اضغط على الزر أدناه لتعيين كلمة مرور جديدة. الرابط صالح لمدة 30 دقيقة.</p>",
    button(url, "تعيين كلمة مرور جديدة")
  );
  try {
    const r = await new Resend(key).emails.send({
      from: fromAddress(),
      to,
      subject: "استرداد كلمة المرور — علم تأويل الرؤى",
      html,
    });
    if (r.error) return { ok: false, error: String(r.error?.message || r.error) };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "فشل الإرسال." };
  }
}
