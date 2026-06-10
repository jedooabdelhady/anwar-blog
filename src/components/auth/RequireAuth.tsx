import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { findById, type UserDoc } from "@/lib/auth/users";

/**
 * Server-side guard for protected pages. Redirects to /auth/login with a
 * ?next= back to the current path if the visitor isn't signed in.
 * Returns the fresh user doc so callers can prefill forms.
 */
export async function requireAuth(currentPath: string): Promise<UserDoc> {
  const s = await getCurrentUser();
  if (!s) {
    const next = encodeURIComponent(currentPath);
    redirect(`/auth/login?next=${next}`);
  }
  const user = await findById(s.userId);
  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(currentPath)}`);
  }
  return user;
}
