import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { findById } from "@/lib/auth/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSession();
  if (!s.userId) return NextResponse.json({ ok: true, user: null });
  const user = await findById(s.userId).catch(() => null);
  if (!user) {
    s.destroy();
    return NextResponse.json({ ok: true, user: null });
  }
  return NextResponse.json({
    ok: true,
    user: {
      username: user.username,
      email: user.email,
      displayName: user.displayName || user.username,
      phone: user.phone || "",
      emailVerified: !!user.emailVerified,
      role: user.role || "member",
    },
  });
}
