"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Kind = "public-vision" | "private-vision" | "inquiry";

type Props = {
  kind: Kind;
  /** label for the primary submit button */
  submitLabel: string;
  /** accent color for the submit button */
  accent: string;
  accentHover: string;
  /** Override placeholders or hide email/phone where it doesn't fit. */
  showSubject?: boolean;
  /** Prefilled from the signed-in user (server reads session). */
  prefillName?: string;
  prefillEmail?: string;
  prefillPhone?: string;
};

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; accessToken?: string }
  | { state: "error"; message: string };

export default function ContactForm({
  kind,
  submitLabel,
  accent,
  accentHover,
  showSubject = true,
  prefillName,
  prefillEmail,
  prefillPhone,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "submitting" });

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      kind,
      name:    String(fd.get("name")    || ""),
      email:   String(fd.get("email")   || ""),
      phone:   String(fd.get("phone")   || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""), // honeypot
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        // Session expired — bounce to login and come back here.
        const next = typeof window !== "undefined" ? window.location.pathname : "/";
        router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
        return;
      }
      const json = await res.json().catch(() => ({ ok: false, error: "خطأ غير متوقع." }));
      if (!res.ok || !json.ok) {
        setStatus({ state: "error", message: json.error || "تعذّر الإرسال. حاول مجدداً." });
        return;
      }
      setStatus({ state: "success", accessToken: json.accessToken });
      form.reset();
    } catch {
      setStatus({ state: "error", message: "تعذّر الاتصال بالخادم. تأكد من اتصالك بالإنترنت." });
    }
  }

  if (status.state === "success") {
    return (
      <div className="rounded-3xl border border-line bg-card p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto text-[#5e8a4f]" />
        <h3 className="mt-4 text-xl font-bold text-pepper">تم استلام رسالتك بنجاح</h3>
        <p className="mt-2 text-pepper/75">
          شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
        </p>
        <div className="mt-6 rounded-2xl border border-line bg-[#f7f1ea] p-5 text-right">
          <p className="text-sm font-bold text-pepper mb-2">
            متابعة رسائلك:
          </p>
          <p className="text-xs text-pepper/70 mb-3 leading-relaxed">
            تجد كل رسائلك ورؤاك في صفحة "رسائلي ورؤاي" داخل حسابك، مع حالة
            الرد على كل واحدة. ستصلك نسخة من الرد عبر البريد الإلكتروني أيضًا.
          </p>
          <a
            href="/account/inquiries"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-white text-sm font-medium transition-colors bg-[var(--btn)] hover:bg-[var(--btn-h)]"
            style={
              {
                ["--btn" as string]: accent,
                ["--btn-h" as string]: accentHover,
              } as React.CSSProperties
            }
          >
            عرض رسائلي
          </a>
        </div>
        <button
          onClick={() => setStatus({ state: "idle" })}
          className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-pepper text-sm font-medium border border-line hover:border-sienna transition-colors"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-line bg-card p-6 sm:p-8 space-y-5">
      {/* Honeypot — hidden from humans & screen readers */}
      <div aria-hidden className="hidden" style={{ position: "absolute", left: "-9999px" }}>
        <label>
          لا تملأ هذا الحقل
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field name="name"  label="• الاسم (اللقب)"        required maxLength={120} autoComplete="name" defaultValue={prefillName} />
        <Field name="email" label="• البريد الإلكتروني"    type="email" autoComplete="email" defaultValue={prefillEmail} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field name="phone" label="• رقم الجوال (اختياري)" type="tel" autoComplete="tel" dir="ltr" defaultValue={prefillPhone} />
        {showSubject && <Field name="subject" label="• الموضوع (اختياري)" />}
      </div>

      <div>
        <label className="block text-sm font-medium text-pepper mb-1.5">
          • الرسالة <span className="text-sienna">*</span>
        </label>
        <textarea
          name="message"
          required
          minLength={3}
          maxLength={5000}
          rows={6}
          className="w-full rounded-2xl border border-line bg-bg px-4 py-3 text-pepper placeholder:text-pepper/40 focus:border-sienna focus:outline-none focus:ring-2 focus:ring-sienna/30 resize-y"
          placeholder="اكتب رسالتك هنا..."
        />
      </div>

      {status.state === "error" && (
        <div className="flex items-start gap-2 rounded-xl border border-[#c98a8a] bg-[#fbecec] px-4 py-3 text-sm text-[#7a2b2b]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status.state === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-white text-[15px] font-medium transition-colors bg-[var(--btn)] hover:bg-[var(--btn-h)] disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ ["--btn" as string]: accent, ["--btn-h" as string]: accentHover } as React.CSSProperties}
        >
          {status.state === "submitting" ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  maxLength,
  autoComplete,
  dir,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
  dir?: "ltr" | "rtl";
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-pepper mb-1.5">
        {label} {required && <span className="text-sienna">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        dir={dir}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-line bg-bg px-4 py-2.5 text-pepper placeholder:text-pepper/40 focus:border-sienna focus:outline-none focus:ring-2 focus:ring-sienna/30"
      />
    </div>
  );
}
