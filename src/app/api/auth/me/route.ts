import { NextResponse } from "next/server";
import { requireFreshUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireFreshUser();
  if (!user) return NextResponse.json({ ok: true, user: null });
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
