"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import AuthField from "@/components/auth/AuthField";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      identifier: String(fd.get("identifier") || ""),
      password: String(fd.get("password") || ""),
    };
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({ ok: false, error: "خطأ غير متوقع." }));
      if (!r.ok || !j.ok) {
        setError(j.error || "تعذّر تسجيل الدخول.");
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
      <AuthField
        label="اسم المستخدم أو البريد"
        name="identifier"
        type="text"
        required
        autoComplete="username"
        dir="ltr"
        placeholder="username أو email@example.com"
      />
      <div>
        <AuthField
          label="كلمة المرور"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
        <div className="mt-1.5 text-left">
          <Link href="/auth/forgot" className="text-xs text-sienna hover:underline">
            نسيت كلمة المرور؟
          </Link>
        </div>
      </div>

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
            جارٍ الدخول…
          </>
        ) : (
          "دخول"
        )}
      </button>
    </form>
  );
}
