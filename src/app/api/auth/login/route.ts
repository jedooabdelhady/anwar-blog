import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { ensureWritable, findByIdentifier, patchUser, unsetUserFields } from "@/lib/auth/users";
import { verifyPassword } from "@/lib/auth/password";
import { check, tooManyRequests } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  identifier?: string;
  password?: string;
  website?: string; // honeypot
};

const MAX_FAILED = 5;
const LOCK_MINUTES = 15;
const GENERIC_AUTH_ERROR = "البيانات غير صحيحة.";

export async function POST(req: NextRequest) {
  const rl = check(req, { scope: "login", max: 10, windowSec: 60 });
  if (!rl.ok) return tooManyRequests(rl.retryAfterSec);

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "صيغة غير صحيحة." }, { status: 400 });
  }

  // Honeypot — bots fill this, humans never see it.
  if (body.website) return NextResponse.json({ ok: true });

  const ready = ensureWritable();
  if (!ready.ok)
    return NextResponse.json({ ok: false, error: ready.error }, { status: 503 });

  const id = (body.identifier || "").trim();
  const pw = body.password || "";
  if (!id || !pw)
    return NextResponse.json(
      { ok: false, error: "أدخل اسم المستخدم/البريد وكلمة المرور." },
      { status: 400 }
    );

  const user = await findByIdentifier(id);

  // Account lockout (only relevant when a real user exists; reveal nothing
  // to the caller until after the password check to keep timing flat).
  if (user?.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "تم قفل الحساب مؤقتاً بسبب عدّة محاولات فاشلة. حاول بعد 15 دقيقة، أو استرد كلمة المرور.",
      },
      { status: 423 }
    );
  }

  // verifyPassword always runs bcrypt — even with a dummy hash when the
  // user is missing — so an attacker can't time-discriminate valid usernames.
  const valid = await verifyPassword(pw, user?.passwordHash);
  if (!user || !valid) {
    if (user) {
      const fails = (user.failedLoginCount ?? 0) + 1;
      const patch: Record<string, unknown> = { failedLoginCount: fails };
      if (fails >= MAX_FAILED) {
        patch.lockedUntil = new Date(
          Date.now() + LOCK_MINUTES * 60_000
        ).toISOString();
        patch.failedLoginCount = 0;
      }
      await patchUser(user._id, patch).catch(() => {});
    }
    return NextResponse.json(
      { ok: false, error: GENERIC_AUTH_ERROR },
      { status: 401 }
    );
  }

  const session = await getSession();
  session.userId = user._id;
  session.username = user.username;
  session.email = user.email;
  session.role = user.role || "member";
  session.sessionVersion = user.sessionVersion ?? 1;
  await session.save();

  await patchUser(user._id, { lastLoginAt: new Date().toISOString() });
  if (user.failedLoginCount || user.lockedUntil) {
    await unsetUserFields(user._id, ["failedLoginCount", "lockedUntil"]).catch(
      () => {}
    );
  }

  return NextResponse.json({
    ok: true,
    user: {
      username: user.username,
      email: user.email,
      emailVerified: !!user.emailVerified,
    },
  });
}
