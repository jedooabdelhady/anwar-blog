"use client";

import Logo from "@/components/Logo";

export function StudioLogo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "4px 8px",
        fontFamily: "var(--font-tajawal, system-ui)",
      }}
    >
      <Logo size={28} variant="sienna" />
      <span
        style={{
          fontWeight: 700,
          fontSize: "15px",
          color: "#38261C",
          letterSpacing: "0.5px",
        }}
      >
        تأويل الرؤى
      </span>
    </div>
  );
}
