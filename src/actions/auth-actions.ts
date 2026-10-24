"use server";

import { signIn, signOut } from "@/auth";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkLoginRateLimit } from "@/lib/auth/rate-limit";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export interface AuthActionResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

/**
 * Server action to authenticate an administrator.
 */
export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid authentication parameters",
    };
  }

  const { email, password } = parsed.data;

  // Rate limit check
  const rateLimit = checkLoginRateLimit(email);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Security lockout active. Please wait ${rateLimit.retryAfterSeconds} seconds before re-attempting.`,
    };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        error: "Invalid admin identifier or master cipher.",
      };
    }

    // Record audit log asynchronously
    try {
      const user = await db.user.findUnique({ where: { email } });
      if (user) {
        await db.auditLog.create({
          data: {
            actorId: user.id,
            action: "ADMIN_LOGIN",
            entityType: "User",
            entityId: user.id,
            ipHash: "local-session",
            detailsJson: { timestamp: new Date().toISOString() },
          },
        });
      }
    } catch (auditError) {
      console.warn("Failed to write login audit log:", auditError);
    }

    return {
      success: true,
      redirectTo: "/admin",
    };
  } catch (error) {
    // NextAuth throws NEXT_REDIRECT or similar internal errors on redirects
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      return {
        success: true,
        redirectTo: "/admin",
      };
    }

    return {
      success: false,
      error: "Authentication failed. Check credentials and system telemetry.",
    };
  }
}

/**
 * Server action to safely sign out from the administrative sanctuary.
 */
export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/admin/login" });
}
