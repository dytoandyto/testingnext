import { auth } from "@/auth";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

export interface AuthenticatedUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string | null;
}

/**
 * Retrieves the current session user without throwing.
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }
    return session.user as AuthenticatedUser;
  } catch {
    // Catches execution outside active request stores (e.g. static prerendering)
    return null;
  }
}

/**
 * Enforces that the current request originates from an authenticated administrator.
 * Throws UnauthorizedError or ForbiddenError if unauthenticated.
 */
export async function requireAdminSession(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError("Authentication required to access Sanctuary CMS controls");
  }

  if (user.role !== "ADMIN") {
    throw new ForbiddenError("Administrative privileges required for this directive");
  }

  return user;
}

/**
 * Helper to guarantee that public queries strictly filter for PUBLISHED items only.
 */
export function requirePublishedOnly<T extends object>(
  whereClause?: T
): Omit<T, "status"> & { status: "PUBLISHED" } {
  const sanitized = { ...(whereClause || ({} as T)) };
  delete (sanitized as { status?: unknown }).status;
  return {
    ...sanitized,
    status: "PUBLISHED",
  };
}

/**
 * Higher-order guard for protected Server Actions.
 */
export function withAdminAction<TArgs, TResult>(
  action: (user: AuthenticatedUser, args: TArgs) => Promise<TResult>
): (args: TArgs) => Promise<TResult> {
  return async (args: TArgs) => {
    const user = await requireAdminSession();
    return action(user, args);
  };
}
