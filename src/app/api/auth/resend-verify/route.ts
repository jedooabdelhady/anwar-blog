import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { ensureWritable, findById, patchUser } from "@/lib/auth/users";
import { newToken, expiresIn } from "@/lib/auth/tokens";
import { sendVerifyEmail } from "@/lib/auth/emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const s = await getSession();
  if (!s.userId)
    return NextResponse.json({ ok: false, error: "غير مسجَّل." }, { status: 401 });

  const ready = ensureWritable();
  if (!ready.ok)
    return NextResponse.json({ ok: false, error: ready.error }, { status: 503 });

  const user = await findById(s.userId);
  if (!user)
    return NextResponse.json({ ok: false, error: "الحساب غير موجود." }, { status: 404 });
  if (user.emailVerified)
    return NextResponse.json({ ok: true, alreadyVerified: true });

  const token = newToken();
  await patchUser(user._id, {
    verifyToken: token,
    verifyExpiresAt: expiresIn(60 * 24),
  });
  const sent = await sendVerifyEmail(user.email, token);
  if (!sent.ok)
    return NextResponse.json({ ok: false, error: sent.error }, { status: 502 });

  return NextResponse.json({ ok: true });
}
