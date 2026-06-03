"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import clsx from "clsx";

const NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن الشركة" },
  { href: "/blog", label: "المدونة" },
  { href: "/services", label: "الخدمات" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Header({ active = "/" }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30 w-full">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-5">
        <nav className="flex items-center justify-between gap-4">
          {/* Logo on the right (RTL → flex-start is on the right) */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="أنوار — الصفحة الرئيسية"
          >
            <Logo size={48} variant="pepper" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-7 lg:gap-10">
            {NAV.map((item) => {
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "text-[15px] lg:text-base font-medium transition-colors",
                      isActive
                        ? "text-sienna"
                        : "text-pepper/85 hover:text-sienna"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            className="md:hidden p-2 rounded-lg text-pepper hover:bg-pepper/5"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-line bg-clay/70 backdrop-blur">
          <ul className="px-5 py-4 flex flex-col gap-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "block py-2 text-base font-medium",
                    active === item.href
                      ? "text-sienna"
                      : "text-pepper hover:text-sienna"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
