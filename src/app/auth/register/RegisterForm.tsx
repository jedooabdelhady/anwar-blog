"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import AuthField from "@/components/auth/AuthField";

export default function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      username: String(fd.get("username") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      displayName: String(fd.get("displayName") || ""),
      phone: String(fd.get("phone") || ""),
      website: String(fd.get("website") || ""),
    };
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({ ok: false, error: "خطأ غير متوقع." }));
      if (!r.ok || !j.ok) {
        setError(j.error || "تعذّر إنشاء الحساب.");
        setBusy(false);
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("تعذّر الاتصال بالخادم.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div aria-hidden className="hidden" style={{ position: "absolute", left: "-9999px" }}>
        <label>
          لا تملأ
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <AuthField
        label="اسم المستخدم"
        name="username"
        type="text"
        required
        autoComplete="username"
        dir="ltr"
        placeholder="example_user"
        pattern="[a-zA-Z0-9_]{3,32}"
        hint="3-32 حرفاً، إنجليزية وأرقام و _ فقط."
      />
      <AuthField
        label="الاسم الظاهر"
        name="displayName"
        type="text"
        autoComplete="name"
        placeholder="الاسم الذي تحب أن نناديك به (اختياري)"
      />
      <AuthField
        label="البريد الإلكتروني"
        name="email"
        type="email"
        required
        autoComplete="email"
        dir="ltr"
        placeholder="you@example.com"
      />
      <AuthField
        label="رقم الجوال (اختياري)"
        name="phone"
        type="tel"
        autoComplete="tel"
        dir="ltr"
        placeholder="+966XXXXXXXXX"
      />
      <AuthField
        label="كلمة المرور"
        name="password"
        type="password"
        required
        autoComplete="new-password"
        minLength={8}
        hint="8 أحرف على الأقل."
      />

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-[#c98a8a] bg-[#fbecec] px-4 py-3 text-sm text-[#7a2b2b]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-sienna text-white font-medium hover:bg-pepper transition-colors disabled:opacity-70"
      >
        {busy ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            جارٍ إنشاء الحساب…
          </>
        ) : (
          "إنشاء الحساب"
        )}
      </button>

      <p className="text-xs text-pepper/60 leading-relaxed text-center">
        بإنشائك الحساب فإنك توافق على{" "}
        <a href="/terms" className="text-sienna hover:underline">الشروط</a> و{" "}
        <a href="/privacy" className="text-sienna hover:underline">سياسة الخصوصية</a>.
      </p>
    </form>
  );
}
