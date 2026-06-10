import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { ensureWritable, findByIdentifier, patchUser } from "@/lib/auth/users";
import { verifyPassword } from "@/lib/auth/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  identifier?: string;
  password?: string;
};

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

  const id = (body.identifier || "").trim();
  const pw = body.password || "";
  if (!id || !pw)
    return NextResponse.json(
      { ok: false, error: "أدخل اسم المستخدم/البريد وكلمة المرور." },
      { status: 400 }
    );

  const user = await findByIdentifier(id);
  if (!user || !user.passwordHash) {
    return NextResponse.json(
      { ok: false, error: "البيانات غير صحيحة." },
      { status: 401 }
    );
  }
  const valid = await verifyPassword(pw, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { ok: false, error: "البيانات غير صحيحة." },
      { status: 401 }
    );
  }

  const session = await getSession();
  session.userId = user._id;
  session.username = user.username;
  session.email = user.email;
  session.role = user.role || "member";
  await session.save();

  await patchUser(user._id, { lastLoginAt: new Date().toISOString() });

  return NextResponse.json({
    ok: true,
    user: {
      username: user.username,
      email: user.email,
      emailVerified: !!user.emailVerified,
    },
  });
}
