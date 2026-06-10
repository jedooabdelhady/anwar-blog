"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

type State = "idle" | "busy" | "sent" | "error";

export default function VerifyBanner() {
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState<string>("");

  async function send() {
    setState("busy");
    try {
      const r = await fetch("/api/auth/resend-verify", { method: "POST" });
      const j = await r.json().catch(() => ({ ok: false }));
      if (!r.ok || !j.ok) {
        setState("error");
        setMsg(j.error || "تعذّر الإرسال.");
        return;
      }
      setState("sent");
    } catch {
      setState("error");
      setMsg("تعذّر الاتصال بالخادم.");
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-[#d9b87a] bg-[#fbf3df] px-4 py-3 flex items-start gap-3">
      <Mail size={18} className="mt-0.5 shrink-0 text-[#8a6a1c]" />
      <div className="flex-1 text-sm text-[#5f4b14] leading-relaxed">
        <p className="font-bold mb-0.5">بريدك لم يُفعَّل بعد.</p>
        <p className="text-[13px]">
          ساعدنا نتأكد منك — افتح رسالة التفعيل التي أرسلناها لبريدك. لم تجدها؟{" "}
          {state === "sent" ? (
            <span className="inline-flex items-center gap-1 text-[#3f6a2f] font-medium">
              <CheckCircle2 size={14} /> تم الإرسال
            </span>
          ) : (
            <button
              onClick={send}
              disabled={state === "busy"}
              className="text-sienna font-medium hover:underline disabled:opacity-60"
            >
              {state === "busy" ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> جارٍ الإرسال…
                </span>
              ) : (
                "إعادة الإرسال"
              )}
            </button>
          )}
          {state === "error" && (
            <span className="block mt-1 text-[#7a2b2b]">{msg}</span>
          )}
        </p>
      </div>
    </div>
  );
}
