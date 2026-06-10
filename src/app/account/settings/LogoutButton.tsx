"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/");
      router.refresh();
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={logout}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 border border-line text-pepper text-sm font-medium hover:border-[#a14b3a] hover:text-[#a14b3a] transition-colors"
    >
      {busy ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
      تسجيل الخروج
    </button>
  );
}
