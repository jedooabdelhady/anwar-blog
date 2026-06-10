import bcrypt from "bcryptjs";

const ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  if (!hashed) return false;
  return bcrypt.compare(plain, hashed);
}

/** Basic strength check — at least 8 chars, mix of letters + digits. */
export function isStrongEnough(password: string): {
  ok: boolean;
  reason?: string;
} {
  if (password.length < 8)
    return { ok: false, reason: "كلمة المرور يجب ألا تقل عن 8 أحرف." };
  if (password.length > 200)
    return { ok: false, reason: "كلمة المرور طويلة جداً." };
  return { ok: true };
}
