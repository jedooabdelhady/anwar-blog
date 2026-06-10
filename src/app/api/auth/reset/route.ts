import { NextRequest, NextResponse } from "next/server";
import {
  ensureWritable,
  findByResetTokenHash,
  patchUser,
  unsetUserFields,
} from "@/lib/auth/users";
import { hashPassword, isStrongEnough } from "@/lib/auth/password";
import { hashToken, isExpired } from "@/lib/auth/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { token?: string; password?: string };

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "صيغة غير صحيحة." }, { status: 400 });
  }

  const ready = ensureWritable();
  if (!ready.ok)
    return NextResponse.json({ ok: false, error: ready.error }, { status: 503 });

  const token = (body.token || "").trim();
  const password = body.password || "";
  if (!token)
    return NextResponse.json({ ok: false, error: "الرابط غير صالح." }, { status: 400 });

  const strong = isStrongEnough(password);
  if (!strong.ok)
    return NextResponse.json({ ok: false, error: strong.reason }, { status: 400 });

  const user = await findByResetTokenHash(hashToken(token));
  if (!user || isExpired(user.resetExpiresAt))
    return NextResponse.json(
      { ok: false, error: "الرابط منتهي أو غير صالح. اطلب رابطاً جديداً." },
      { status: 400 }
    );

  const passwordHash = await hashPassword(password);
  // Bumping sessionVersion invalidates every cookie issued before this point —
  // a stolen session can't survive a password reset.
  await patchUser(user._id, {
    passwordHash,
    sessionVersion: (user.sessionVersion ?? 1) + 1,
  });
  await unsetUserFields(user._id, [
    "resetToken",
    "resetExpiresAt",
    "failedLoginCount",
    "lockedUntil",
  ]);

  return NextResponse.json({ ok: true });
}
