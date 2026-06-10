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
import { newToken, expiresIn } from "@/lib/auth/tokens";
import { sendVerifyEmail } from "@/lib/auth/emails";

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

export async function POST(req: NextRequest) {
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
  const strong = isStrongEnough(password);
  if (!strong.ok)
    return NextResponse.json({ ok: false, error: strong.reason }, { status: 400 });

  const [byU, byE] = await Promise.all([findByUsername(username), findByEmail(email)]);
  if (byU)
    return NextResponse.json(
      { ok: false, error: "اسم المستخدم هذا محجوز." },
      { status: 409 }
    );
  if (byE)
    return NextResponse.json(
      { ok: false, error: "هذا البريد مسجَّل سابقاً. يمكنك تسجيل الدخول." },
      { status: 409 }
    );

  const passwordHash = await hashPassword(password);
  const verifyToken = newToken();
  const verifyExpiresAt = expiresIn(60 * 24); // 24h

  const user = await createUser({
    username,
    email,
    displayName,
    phone,
    passwordHash,
    emailVerified: false,
    verifyToken,
    verifyExpiresAt,
    role: "member",
  });

  // Best-effort verification email — don't block the signup on email failure.
  const sent = await sendVerifyEmail(email, verifyToken);
  if (!sent.ok) {
    console.warn("[register] verify email failed:", sent.error);
  }

  // Auto-login the new user so they can use the site immediately. The
  // emailVerified flag stays false until they click the link, but they
  // can browse and post (we surface a banner on /account).
  const session = await getSession();
  session.userId = user._id;
  session.username = user.username;
  session.email = user.email;
  session.role = user.role || "member";
  await session.save();

  await patchUser(user._id, { lastLoginAt: new Date().toISOString() });

  return NextResponse.json({
    ok: true,
    user: { username: user.username, email: user.email, emailVerified: false },
  });
}
