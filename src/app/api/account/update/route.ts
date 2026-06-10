import { NextRequest, NextResponse } from "next/server";
import { requireFreshUser, getSession } from "@/lib/auth/session";
import { ensureWritable, patchUser } from "@/lib/auth/users";
import { hashPassword, verifyPassword, isStrongEnough } from "@/lib/auth/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  displayName?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
};

const PHONE_RE = /^\+?[\d\s()-]{6,20}$/;

export async function POST(req: NextRequest) {
  const user = await requireFreshUser();
  if (!user)
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

  const patch: Record<string, unknown> = {};
  if (typeof body.displayName === "string") {
    const dn = body.displayName.trim();
    if (dn.length > 0 && dn.length <= 120) patch.displayName = dn;
  }
  if (typeof body.phone === "string") {
    const p = body.phone.trim();
    if (p.length === 0) {
      patch.phone = undefined;
    } else if (PHONE_RE.test(p)) {
      patch.phone = p;
    } else {
      return NextResponse.json(
        { ok: false, error: "رقم الجوال غير صالح." },
        { status: 400 }
      );
    }
  }

  // Optional password change — bumps sessionVersion so existing cookies die.
  if (body.newPassword) {
    if (!body.currentPassword)
      return NextResponse.json(
        { ok: false, error: "أدخل كلمة المرور الحالية." },
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
    patch.sessionVersion = (user.sessionVersion ?? 1) + 1;
  }

  if (Object.keys(patch).length === 0)
    return NextResponse.json({ ok: true });

  await patchUser(user._id, patch);

  // If we bumped the version, refresh the current session so this device
  // stays logged in (other devices' cookies are now invalid).
  if (typeof patch.sessionVersion === "number") {
    const s = await getSession();
    s.sessionVersion = patch.sessionVersion as number;
    await s.save();
  }

  return NextResponse.json({ ok: true });
}
