import { NextRequest, NextResponse } from "next/server";
import { requireFreshUser } from "@/lib/auth/session";
import { ensureWritable, patchUser } from "@/lib/auth/users";
import { newToken, hashToken, expiresIn } from "@/lib/auth/tokens";
import { sendVerifyEmail } from "@/lib/auth/emails";
import { check, tooManyRequests } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rl = check(req, { scope: "resend-verify", max: 3, windowSec: 300 });
  if (!rl.ok) return tooManyRequests(rl.retryAfterSec);

  const user = await requireFreshUser();
  if (!user)
    return NextResponse.json({ ok: false, error: "غير مسجَّل." }, { status: 401 });

  const ready = ensureWritable();
  if (!ready.ok)
    return NextResponse.json({ ok: false, error: ready.error }, { status: 503 });

  if (user.emailVerified)
    return NextResponse.json({ ok: true, alreadyVerified: true });

  const tokenPlain = newToken();
  await patchUser(user._id, {
    verifyToken: hashToken(tokenPlain),
    verifyExpiresAt: expiresIn(60 * 24),
  });
  const sent = await sendVerifyEmail(user.email, tokenPlain);
  if (!sent.ok)
    return NextResponse.json({ ok: false, error: sent.error }, { status: 502 });

  return NextResponse.json({ ok: true });
}
