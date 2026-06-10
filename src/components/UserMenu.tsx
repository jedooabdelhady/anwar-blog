"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, ChevronDown, LogOut, MessageSquare, Settings, LogIn, UserPlus } from "lucide-react";
import clsx from "clsx";

type Me = {
  username: string;
  displayName?: string;
  email: string;
  emailVerified: boolean;
} | null;

export default function UserMenu({ stacked = false }: { stacked?: boolean }) {
  const router = useRouter();
  const [me, setMe] = useState<Me | "loading">("loading");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/auth/me", { cache: "no-store" });
        const j = await r.json();
        if (cancelled) return;
        setMe(j.user || null);
      } catch {
        if (!cancelled) setMe(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    setOpen(false);
    router.replace("/");
    router.refresh();
  }

  if (me === "loading") {
    return (
      <div className={clsx(stacked ? "" : "hidden md:block", "w-24 h-9 rounded-full bg-clay/60 animate-pulse")} />
    );
  }

  if (!me) {
    return (
      <div className={clsx("flex items-center gap-2", stacked && "flex-col items-stretch")}>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-card px-4 py-1.5 text-sm font-medium text-pepper hover:border-sienna hover:text-sienna transition-colors"
        >
          <LogIn size={14} />
          دخول
        </Link>
        <Link
          href="/auth/register"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-sienna px-4 py-1.5 text-sm font-medium text-white hover:bg-pepper transition-colors"
        >
          <UserPlus size={14} />
          إنشاء حساب
        </Link>
      </div>
    );
  }

  const label = me.displayName || me.username;

  return (
    <div ref={wrapRef} className={clsx("relative", stacked && "w-full")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={clsx(
          "inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-sm font-medium text-pepper hover:border-sienna transition-colors",
          stacked && "w-full justify-center"
        )}
      >
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sienna text-white">
          <User size={14} />
        </span>
        <span className="max-w-[8rem] truncate">{label}</span>
        <ChevronDown size={14} className={clsx("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className={clsx(
            "absolute top-full mt-2 rounded-2xl border border-line bg-card p-2 shadow-[0_18px_32px_-16px_rgba(56,38,28,0.25)] min-w-[14rem] z-40",
            stacked ? "left-1/2 -translate-x-1/2" : "left-0"
          )}
        >
          <div className="px-3 py-2 border-b border-line mb-1">
            <p className="text-sm font-bold text-pepper truncate">{label}</p>
            <p className="text-xs text-pepper/60 truncate" dir="ltr" style={{ textAlign: "right" }}>
              {me.email}
            </p>
            {!me.emailVerified && (
              <p className="text-[11px] text-[#a14b3a] mt-0.5">البريد غير مفعّل</p>
            )}
          </div>
          <MenuLink href="/account" icon={<User size={14} />} onClick={() => setOpen(false)}>
            حسابي
          </MenuLink>
          <MenuLink href="/account/inquiries" icon={<MessageSquare size={14} />} onClick={() => setOpen(false)}>
            رسائلي ورؤاي
          </MenuLink>
          <MenuLink href="/account/settings" icon={<Settings size={14} />} onClick={() => setOpen(false)}>
            الإعدادات
          </MenuLink>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#a14b3a] hover:bg-[#fbecec] transition-colors"
          >
            <LogOut size={14} />
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-pepper hover:bg-clay/60 transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}
