import { NextRequest, NextResponse } from "next/server";
import { ensureWritable, findByIdentifier, patchUser, unsetUserFields } from "@/lib/auth/users";
import { newToken, hashToken, expiresIn } from "@/lib/auth/tokens";
import { sendResetEmail } from "@/lib/auth/emails";
import { check, tooManyRequests } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { identifier?: string };

export async function POST(req: NextRequest) {
  const rl = check(req, { scope: "forgot", max: 3, windowSec: 60 });
  if (!rl.ok) return tooManyRequests(rl.retryAfterSec);

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "صيغة غير صحيحة." }, { status: 400 });
  }

  const ready = ensureWritable();
  if (!ready.ok)
    return NextResponse.json({ ok: false, error: ready.error }, { status: 503 });

  const id = (body.identifier || "").trim();
  if (!id)
    return NextResponse.json(
      { ok: false, error: "أدخل البريد أو اسم المستخدم." },
      { status: 400 }
    );

  const user = await findByIdentifier(id);

  // Always return ok (don't leak which accounts exist).
  if (!user || !user.email) {
    return NextResponse.json({ ok: true });
  }

  const tokenPlain = newToken();
  await patchUser(user._id, {
    resetToken: hashToken(tokenPlain),
    resetExpiresAt: expiresIn(30),
  });

  const sent = await sendResetEmail(user.email, tokenPlain);
  if (!sent.ok) {
    console.warn("[forgot] reset email failed:", sent.error);
    await patchUser(user._id, {
      lastEmailError: `reset@forgot: ${sent.error}`,
    }).catch(() => {});
  } else {
    await unsetUserFields(user._id, ["lastEmailError"]).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
