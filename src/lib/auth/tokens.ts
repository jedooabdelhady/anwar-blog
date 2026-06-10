import crypto from "node:crypto";

export function newToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

/** Returns ISO timestamp `minutes` from now. */
export function expiresIn(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

export function isExpired(iso?: string): boolean {
  if (!iso) return true;
  return new Date(iso).getTime() < Date.now();
}
