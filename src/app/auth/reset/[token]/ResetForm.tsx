"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import AuthField from "@/components/auth/AuthField";

type State =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "done" }
  | { kind: "error"; message: string };

export default function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: "busy" });
    const fd = new FormData(e.currentTarget);
    const pw = String(fd.get("password") || "");
    const pw2 = String(fd.get("password2") || "");
    if (pw !== pw2) {
      setState({ kind: "error", message: "كلمتا المرور غير متطابقتين." });
      return;
    }
    try {
      const r = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: pw }),
      });
      const j = await r.json().catch(() => ({ ok: false, error: "خطأ غير متوقع." }));
      if (!r.ok || !j.ok) {
        setState({ kind: "error", message: j.error || "تعذّر إعادة التعيين." });
        return;
      }
      setState({ kind: "done" });
      setTimeout(() => router.replace("/auth/login"), 1500);
    } catch {
      setState({ kind: "error", message: "تعذّر الاتصال بالخادم." });
    }
  }

  if (state.kind === "done") {
    return (
      <div className="text-center py-6">
        <CheckCircle2 size={48} className="mx-auto text-[#5e8a4f]" />
        <h3 className="mt-4 text-lg font-bold text-pepper">تم تعيين كلمة المرور</h3>
        <p className="mt-2 text-pepper/75 text-sm">سننقلك لصفحة تسجيل الدخول…</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <AuthField
        label="كلمة المرور الجديدة"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        hint="8 أحرف على الأقل."
      />
      <AuthField
        label="تأكيد كلمة المرور"
        name="password2"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
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
            جارٍ التعيين…
          </>
        ) : (
          "تعيين كلمة المرور"
        )}
      </button>
    </form>
  );
}
