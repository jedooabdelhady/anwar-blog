import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  ensureWritable,
  findByEmail,
  findByUsername,
  createUser,
  patchUser,
} from "@/lib/auth/users";
import { hashPassword, isStrongEnough } from "@/lib/auth/password";
import { newToken, hashToken, expiresIn } from "@/lib/auth/tokens";
import { sendVerifyEmail } from "@/lib/auth/emails";
import { check, tooManyRequests } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  username?: string;
  email?: string;
  password?: string;
  displayName?: string;
  phone?: string;
  website?: string; // honeypot
};

const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{6,20}$/;
const GENERIC_ERROR = "تعذّر إنشاء الحساب — راجع البيانات وحاول مجدّداً.";

export async function POST(req: NextRequest) {
  const rl = check(req, { scope: "register", max: 5, windowSec: 60 });
  if (!rl.ok) return tooManyRequests(rl.retryAfterSec);

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "صيغة غير صحيحة." }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ ok: true });

  const ready = ensureWritable();
  if (!ready.ok)
    return NextResponse.json({ ok: false, error: ready.error }, { status: 503 });

  const username = (body.username || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  const displayName = (body.displayName || "").trim() || username;
  const phone = (body.phone || "").trim() || undefined;

  if (!USERNAME_RE.test(username))
    return NextResponse.json(
      { ok: false, error: "اسم المستخدم يجب أن يكون 3-32 حرفاً (إنجليزية وأرقام و _ فقط)." },
      { status: 400 }
    );
  if (!EMAIL_RE.test(email))
    return NextResponse.json(
      { ok: false, error: "البريد الإلكتروني غير صالح." },
      { status: 400 }
    );
  if (phone && !PHONE_RE.test(phone))
    return NextResponse.json(
      { ok: false, error: "رقم الجوال غير صالح." },
      { status: 400 }
    );
  const strong = isStrongEnough(password);
  if (!strong.ok)
    return NextResponse.json({ ok: false, error: strong.reason }, { status: 400 });

  // Single generic error for both "username taken" and "email taken" so an
  // attacker can't probe to enumerate which accounts exist.
  const [byU, byE] = await Promise.all([findByUsername(username), findByEmail(email)]);
  if (byU || byE)
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const verifyTokenPlain = newToken();
  const verifyExpiresAt = expiresIn(60 * 24); // 24h

  const user = await createUser({
    username,
    email,
    displayName,
    phone,
    passwordHash,
    emailVerified: false,
    verifyToken: hashToken(verifyTokenPlain),
    verifyExpiresAt,
    role: "member",
    sessionVersion: 1,
  });

  // Best-effort verification email — don't block the signup on email failure.
  const sent = await sendVerifyEmail(email, verifyTokenPlain);
  if (!sent.ok) {
    console.warn("[register] verify email failed:", sent.error);
  }

  const session = await getSession();
  session.userId = user._id;
  session.username = user.username;
  session.email = user.email;
  session.role = user.role || "member";
  session.sessionVersion = 1;
  await session.save();

  await patchUser(user._id, { lastLoginAt: new Date().toISOString() });

  return NextResponse.json({
    ok: true,
    user: { username: user.username, email: user.email, emailVerified: false },
  });
}
