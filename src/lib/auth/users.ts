import { writeClient } from "@/sanity/lib/client";
import { sanityConfigured, writeToken } from "@/sanity/env";

export type UserDoc = {
  _id: string;
  _type: "user";
  username: string;
  email: string;
  emailVerified?: boolean;
  displayName?: string;
  phone?: string;
  passwordHash?: string;
  role?: "member" | "admin";
  verifyToken?: string;
  verifyExpiresAt?: string;
  resetToken?: string;
  resetExpiresAt?: string;
  createdAt?: string;
  lastLoginAt?: string;
  sessionVersion?: number;
  failedLoginCount?: number;
  lockedUntil?: string;
};

export function ensureWritable(): { ok: true } | { ok: false; error: string } {
  if (!sanityConfigured)
    return { ok: false, error: "إعدادات Sanity غير مكتملة على الخادم." };
  if (!writeToken)
    return { ok: false, error: "مفتاح Sanity للكتابة غير موجود." };
  return { ok: true };
}

const FIELDS = `_id, _type, username, email, emailVerified, displayName, phone, passwordHash, role, verifyToken, verifyExpiresAt, resetToken, resetExpiresAt, createdAt, lastLoginAt, sessionVersion, failedLoginCount, lockedUntil`;

type Fetcher = <T = unknown>(query: string, params?: Record<string, unknown>) => Promise<T>;

function fetchAs<T>(query: string, params: Record<string, unknown>): Promise<T> {
  const fetch = (writeClient as unknown as { fetch: Fetcher }).fetch.bind(
    writeClient
  );
  return fetch<T>(query, params);
}

export async function findByUsername(username: string): Promise<UserDoc | null> {
  return fetchAs<UserDoc | null>(
    `*[_type == "user" && username == $u][0]{${FIELDS}}`,
    { u: username }
  );
}

export async function findByEmail(email: string): Promise<UserDoc | null> {
  return fetchAs<UserDoc | null>(
    `*[_type == "user" && email == $e][0]{${FIELDS}}`,
    { e: email.toLowerCase() }
  );
}

export async function findById(id: string): Promise<UserDoc | null> {
  return fetchAs<UserDoc | null>(
    `*[_type == "user" && _id == $id][0]{${FIELDS}}`,
    { id }
  );
}

/** Looks up by a sha256-hashed token (verify and reset tokens are stored hashed). */
export async function findByVerifyTokenHash(hash: string): Promise<UserDoc | null> {
  return fetchAs<UserDoc | null>(
    `*[_type == "user" && verifyToken == $t][0]{${FIELDS}}`,
    { t: hash }
  );
}

export async function findByResetTokenHash(hash: string): Promise<UserDoc | null> {
  return fetchAs<UserDoc | null>(
    `*[_type == "user" && resetToken == $t][0]{${FIELDS}}`,
    { t: hash }
  );
}

/** "Identifier" can be either a username or an email — try both. */
export async function findByIdentifier(
  identifier: string
): Promise<UserDoc | null> {
  const trimmed = identifier.trim();
  if (!trimmed) return null;
  if (trimmed.includes("@")) return findByEmail(trimmed);
  return findByUsername(trimmed);
}

export async function createUser(
  data: Omit<UserDoc, "_id" | "_type">
): Promise<UserDoc> {
  const created = await writeClient.create({
    _type: "user",
    ...data,
    email: data.email.toLowerCase(),
    createdAt: data.createdAt || new Date().toISOString(),
    role: data.role || "member",
    emailVerified: data.emailVerified ?? false,
  });
  return created as unknown as UserDoc;
}

export async function patchUser(
  id: string,
  patch: Partial<UserDoc>
): Promise<void> {
  await writeClient
    .patch(id)
    .set(patch as Record<string, unknown>)
    .commit();
}

export async function unsetUserFields(
  id: string,
  fields: string[]
): Promise<void> {
  await writeClient.patch(id).unset(fields).commit();
}
