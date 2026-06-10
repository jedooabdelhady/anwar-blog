import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export type SessionData = {
  userId?: string;
  username?: string;
  email?: string;
  role?: "member" | "admin";
  /** Mirrors user.sessionVersion. Bumped on password change/reset so old
   *  cookies stop validating without needing a server-side session store. */
  sessionVersion?: number;
};

const password =
  process.env.SESSION_PASSWORD ||
  "dev-only-change-me-please-32-chars-minimum-xx";

if (process.env.NODE_ENV === "production" && password.startsWith("dev-only")) {
  console.warn(
    "[auth] SESSION_PASSWORD is not set in production — sessions are insecure."
  );
}

export const sessionOptions: SessionOptions = {
  password,
  cookieName: "anwar_session",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  },
};

export async function getSession() {
  const store = await cookies();
  return getIronSession<SessionData>(store, sessionOptions);
}

/**
 * Returns the current user *as identified by the session cookie alone*.
 * Does NOT validate session freshness against the DB — callers that need
 * authorization (every protected route + API) should use `requireFreshUser`
 * instead so revoked sessions actually fail.
 */
export async function getCurrentUser() {
  const s = await getSession();
  if (!s.userId) return null;
  return {
    userId: s.userId,
    username: s.username || "",
    email: s.email || "",
    role: s.role || "member",
    sessionVersion: s.sessionVersion ?? 1,
  };
}

/**
 * Reads the user from Sanity and confirms the session cookie's
 * sessionVersion still matches. If the cookie is stale (because the user
 * changed/reset their password elsewhere) the session is destroyed and we
 * return null. Returns a fresh user snapshot — role/emailVerified etc.
 * are always up to date.
 */
export async function requireFreshUser() {
  const { findById } = await import("./users");
  const s = await getSession();
  if (!s.userId) return null;
  const user = await findById(s.userId).catch(() => null);
  if (!user) {
    s.destroy();
    return null;
  }
  const dbVersion = user.sessionVersion ?? 1;
  const cookieVersion = s.sessionVersion ?? 1;
  if (dbVersion !== cookieVersion) {
    s.destroy();
    return null;
  }
  // Refresh cached fields in the cookie if they drift (role promotion, etc.).
  if (s.role !== (user.role || "member")) {
    s.role = user.role || "member";
    await s.save();
  }
  return user;
}
