import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { ensureWritable, findById, patchUser } from "@/lib/auth/users";
import { hashPassword, verifyPassword, isStrongEnough } from "@/lib/auth/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  displayName?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
};

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s.userId)
    return NextResponse.json({ ok: false, error: "غير مسجَّل." }, { status: 401 });

  const ready = ensureWritable();
  if (!ready.ok)
    return NextResponse.json({ ok: false, error: ready.error }, { status: 503 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "صيغة غير صحيحة." }, { status: 400 });
  }

  const user = await findById(s.userId);
  if (!user)
    return NextResponse.json({ ok: false, error: "الحساب غير موجود." }, { status: 404 });

  const patch: Record<string, unknown> = {};
  if (typeof body.displayName === "string") {
    const dn = body.displayName.trim();
    if (dn.length > 0 && dn.length <= 120) patch.displayName = dn;
  }
  if (typeof body.phone === "string") {
    patch.phone = body.phone.trim() || undefined;
  }

  // Optional password change.
  if (body.newPassword) {
    if (!body.currentPassword)
      return NextResponse.json(
        { ok: false, error: "أدخل كلمة المرور الحالية." },
        { status: 400 }
      );
    if (!user.passwordHash)
      return NextResponse.json(
        { ok: false, error: "تعذّر تغيير كلمة المرور." },
        { status: 400 }
      );
    const ok = await verifyPassword(body.currentPassword, user.passwordHash);
    if (!ok)
      return NextResponse.json(
        { ok: false, error: "كلمة المرور الحالية غير صحيحة." },
        { status: 400 }
      );
    const strong = isStrongEnough(body.newPassword);
    if (!strong.ok)
      return NextResponse.json({ ok: false, error: strong.reason }, { status: 400 });
    patch.passwordHash = await hashPassword(body.newPassword);
  }

  if (Object.keys(patch).length === 0)
    return NextResponse.json({ ok: true });

  await patchUser(user._id, patch);
  return NextResponse.json({ ok: true });
}
