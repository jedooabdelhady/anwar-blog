import { NextRequest, NextResponse } from "next/server";
import {
  ensureWritable,
  findByVerifyTokenHash,
  patchUser,
  unsetUserFields,
} from "@/lib/auth/users";
import { hashToken, isExpired } from "@/lib/auth/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { token?: string };

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
  if (!token)
    return NextResponse.json({ ok: false, error: "الرابط غير صالح." }, { status: 400 });

  const user = await findByVerifyTokenHash(hashToken(token));
  if (!user || isExpired(user.verifyExpiresAt))
    return NextResponse.json(
      { ok: false, error: "الرابط منتهي أو غير صالح. سجّل دخولك واطلب إعادة الإرسال." },
      { status: 400 }
    );

  await patchUser(user._id, { emailVerified: true });
  await unsetUserFields(user._id, ["verifyToken", "verifyExpiresAt"]);

  return NextResponse.json({ ok: true });
}
