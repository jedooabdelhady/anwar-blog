"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import AuthField from "@/components/auth/AuthField";

type State =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export default function ForgotForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: "busy" });
    const fd = new FormData(e.currentTarget);
    const payload = { identifier: String(fd.get("identifier") || "") };
    try {
      const r = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({ ok: false, error: "خطأ غير متوقع." }));
      if (!r.ok || !j.ok) {
        setState({ kind: "error", message: j.error || "تعذّر الإرسال." });
        return;
      }
      setState({ kind: "sent" });
    } catch {
      setState({ kind: "error", message: "تعذّر الاتصال بالخادم." });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className="text-center py-6">
        <CheckCircle2 size={48} className="mx-auto text-[#5e8a4f]" />
        <h3 className="mt-4 text-lg font-bold text-pepper">تم الإرسال</h3>
        <p className="mt-2 text-pepper/75 text-sm leading-relaxed">
          إذا كان البريد مسجَّلاً عندنا، فسيصلك رابط لإعادة تعيين كلمة المرور.
          راجع البريد الوارد وخانة الـ Spam. الرابط صالح لمدة 30 دقيقة.
        </p>
        <p className="mt-4 text-xs text-pepper/55 leading-relaxed">
          لم يصلك شيء؟ تواصل مع الدعم عبر صفحة{" "}
          <a href="/contact" className="text-sienna hover:underline">
            تواصل
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <AuthField
        label="البريد أو اسم المستخدم"
        name="identifier"
        type="text"
        required
        dir="ltr"
        placeholder="email@example.com أو username"
      />
      {state.kind === "error" && (
        <div className="flex items-start gap-2 rounded-xl border border-[#c98a8a] bg-[#fbecec] px-4 py-3 text-sm text-[#7a2b2b]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}
      <button
        type="submit"
        disabled={state.kind === "busy"}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-sienna text-white font-medium hover:bg-pepper transition-colors disabled:opacity-70"
      >
        {state.kind === "busy" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            جارٍ الإرسال…
          </>
        ) : (
          "إرسال رابط الاسترداد"
        )}
      </button>
    </form>
  );
}
