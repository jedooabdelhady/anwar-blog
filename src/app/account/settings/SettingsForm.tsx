"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import AuthField from "@/components/auth/AuthField";

type Props = {
  initialDisplayName: string;
  initialPhone: string;
  username: string;
  email: string;
};

type State =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export default function SettingsForm({
  initialDisplayName,
  initialPhone,
  username,
  email,
}: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState<State>({ kind: "idle" });
  const [pw, setPw] = useState<State>({ kind: "idle" });

  async function saveProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfile({ kind: "busy" });
    const fd = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: String(fd.get("displayName") || ""),
          phone: String(fd.get("phone") || ""),
        }),
      });
      const j = await r.json().catch(() => ({ ok: false }));
      if (!r.ok || !j.ok) {
        setProfile({ kind: "error", message: j.error || "تعذّر الحفظ." });
        return;
      }
      setProfile({ kind: "ok" });
      router.refresh();
    } catch {
      setProfile({ kind: "error", message: "تعذّر الاتصال بالخادم." });
    }
  }

  async function changePw(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPw({ kind: "busy" });
    const fd = new FormData(e.currentTarget);
    const newP = String(fd.get("newPassword") || "");
    const conf = String(fd.get("confirmPassword") || "");
    if (newP !== conf) {
      setPw({ kind: "error", message: "كلمتا المرور غير متطابقتين." });
      return;
    }
    try {
      const r = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: String(fd.get("currentPassword") || ""),
          newPassword: newP,
        }),
      });
      const j = await r.json().catch(() => ({ ok: false }));
      if (!r.ok || !j.ok) {
        setPw({ kind: "error", message: j.error || "تعذّر التغيير." });
        return;
      }
      setPw({ kind: "ok" });
      (e.target as HTMLFormElement).reset();
    } catch {
      setPw({ kind: "error", message: "تعذّر الاتصال بالخادم." });
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-line bg-card p-6 sm:p-8">
        <h2 className="text-lg font-bold text-pepper mb-4">البيانات الشخصية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-sm">
          <ReadOnly label="اسم المستخدم" value={username} />
          <ReadOnly label="البريد الإلكتروني" value={email} />
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <AuthField
            label="الاسم الظاهر"
            name="displayName"
            type="text"
            defaultValue={initialDisplayName}
            maxLength={120}
          />
          <AuthField
            label="رقم الجوال"
            name="phone"
            type="tel"
            defaultValue={initialPhone}
            dir="ltr"
            placeholder="+966XXXXXXXXX"
          />
          {profile.kind === "error" && (
            <Alert message={profile.message} />
          )}
          {profile.kind === "ok" && (
            <Ok message="تم حفظ التعديلات." />
          )}
          <button
            type="submit"
            disabled={profile.kind === "busy"}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 bg-sienna text-white text-sm font-medium hover:bg-pepper transition-colors disabled:opacity-70"
          >
            {profile.kind === "busy" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> جارٍ الحفظ…
              </>
            ) : (
              "حفظ التعديلات"
            )}
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-line bg-card p-6 sm:p-8">
        <h2 className="text-lg font-bold text-pepper mb-4">تغيير كلمة المرور</h2>
        <form onSubmit={changePw} className="space-y-4">
          <AuthField
            label="كلمة المرور الحالية"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
          />
          <AuthField
            label="كلمة المرور الجديدة"
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            hint="8 أحرف على الأقل."
          />
          <AuthField
            label="تأكيد كلمة المرور"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          {pw.kind === "error" && <Alert message={pw.message} />}
          {pw.kind === "ok" && <Ok message="تم تغيير كلمة المرور." />}
          <button
            type="submit"
            disabled={pw.kind === "busy"}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 bg-sienna text-white text-sm font-medium hover:bg-pepper transition-colors disabled:opacity-70"
          >
            {pw.kind === "busy" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> جارٍ التغيير…
              </>
            ) : (
              "تغيير كلمة المرور"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-pepper/60 mb-1">{label}</p>
      <p className="text-pepper font-medium break-all" dir="ltr" style={{ textAlign: "right" }}>
        {value}
      </p>
    </div>
  );
}

function Alert({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-[#c98a8a] bg-[#fbecec] px-4 py-3 text-sm text-[#7a2b2b]">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function Ok({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-[#c5d8b9] bg-[#ecf3e6] px-4 py-3 text-sm text-[#3f6a2f]">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
