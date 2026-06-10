import { redirect } from "next/navigation";
import { requireFreshUser } from "@/lib/auth/session";
import type { UserDoc } from "@/lib/auth/users";

/**
 * Server-side guard for protected pages. Redirects to /auth/login with a
 * ?next= back to the current path if the visitor isn't signed in, OR if
 * their session was invalidated (password reset/change elsewhere).
 */
export async function requireAuth(currentPath: string): Promise<UserDoc> {
  const user = await requireFreshUser();
  if (!user) {
    const next = encodeURIComponent(currentPath);
    redirect(`/auth/login?next=${next}`);
  }
  return user;
}
