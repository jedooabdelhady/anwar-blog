import bcrypt from "bcryptjs";

const ROUNDS = 10;

/**
 * Pre-computed hash of a placeholder password. Used by /login to keep the
 * timing of "user not found" identical to "wrong password" — without this,
 * an attacker can enumerate valid usernames by measuring response latency.
 */
const DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8vYqxh7Y3X1rO7L1m5kZGqGZbX8rA.";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hashed: string | undefined | null
): Promise<boolean> {
  // Always run bcrypt — even with a dummy hash — so timing is constant.
  const target = hashed && hashed.length > 0 ? hashed : DUMMY_HASH;
  const result = await bcrypt.compare(plain, target);
  return Boolean(hashed) && result;
}

/**
 * Strength check — minimum 10 characters, must mix letters and digits.
 * The mix requirement defends against the most common credential-stuffing
 * lists (pure-digit PINs, common dictionary words).
 */
export function isStrongEnough(password: string): {
  ok: boolean;
  reason?: string;
} {
  if (password.length < 10)
    return { ok: false, reason: "كلمة المرور يجب ألا تقل عن 10 أحرف." };
  if (password.length > 200)
    return { ok: false, reason: "كلمة المرور طويلة جداً." };
  if (!/[A-Za-z؀-ۿ]/.test(password))
    return {
      ok: false,
      reason: "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل.",
    };
  if (!/\d/.test(password))
    return {
      ok: false,
      reason: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.",
    };
  return { ok: true };
}
