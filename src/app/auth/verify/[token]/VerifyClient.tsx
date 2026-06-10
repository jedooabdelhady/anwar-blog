"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type State = "busy" | "ok" | "error";

export default function VerifyClient({ token }: { token: string }) {
  const [state, setState] = useState<State>("busy");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const j = await r.json().catch(() => ({ ok: false, error: "خطأ غير متوقع." }));
        if (cancelled) return;
        if (!r.ok || !j.ok) {
          setState("error");
          setMsg(j.error || "تعذّر التفعيل.");
        } else {
          setState("ok");
        }
      } catch {
        if (cancelled) return;
        setState("error");
        setMsg("تعذّر الاتصال بالخادم.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="text-center py-6">
      {state === "busy" && (
        <>
          <Loader2 size={36} className="mx-auto animate-spin text-sienna" />
          <p className="mt-4 text-pepper/75">جارٍ التحقق…</p>
        </>
      )}
      {state === "ok" && (
        <>
          <CheckCircle2 size={48} className="mx-auto text-[#5e8a4f]" />
          <h3 className="mt-4 text-lg font-bold text-pepper">تم تفعيل بريدك بنجاح</h3>
          <p className="mt-2 text-pepper/75 text-sm">يمكنك الآن استخدام كل خدمات الموقع.</p>
          <Link
            href="/account"
            className="inline-block mt-5 rounded-full px-6 py-2.5 bg-sienna text-white text-sm font-medium hover:bg-pepper transition-colors"
          >
            الذهاب لحسابي
          </Link>
        </>
      )}
      {state === "error" && (
        <>
          <AlertCircle size={48} className="mx-auto text-[#a14b3a]" />
          <h3 className="mt-4 text-lg font-bold text-pepper">تعذّر التفعيل</h3>
          <p className="mt-2 text-pepper/75 text-sm">{msg}</p>
          <Link
            href="/account"
            className="inline-block mt-5 rounded-full px-6 py-2.5 bg-sienna text-white text-sm font-medium hover:bg-pepper transition-colors"
          >
            صفحة الحساب
          </Link>
        </>
      )}
    </div>
  );
}
