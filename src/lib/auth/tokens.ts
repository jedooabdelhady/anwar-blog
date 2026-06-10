import crypto from "node:crypto";

/** A fresh, URL-safe random token (192 bits of entropy). */
export function newToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

/**
 * Hash a token with SHA-256 before persisting it. We compare hashes on
 * lookup, so a Sanity dataset leak doesn't hand the attacker live
 * verification/reset links.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Returns ISO timestamp `minutes` from now. */
export function expiresIn(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

export function isExpired(iso?: string): boolean {
  if (!iso) return true;
  return new Date(iso).getTime() < Date.now();
}
