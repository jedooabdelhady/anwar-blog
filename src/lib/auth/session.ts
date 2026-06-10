import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export type SessionData = {
  userId?: string;
  username?: string;
  email?: string;
  role?: "member" | "admin";
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
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function getSession() {
  const store = await cookies();
  return getIronSession<SessionData>(store, sessionOptions);
}

export async function getCurrentUser() {
  const s = await getSession();
  if (!s.userId) return null;
  return {
    userId: s.userId,
    username: s.username || "",
    email: s.email || "",
    role: s.role || "member",
  };
}
