"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, KeyRound, Lock, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth-actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await loginAction(formData);

      if (!result.success) {
        setError(result.error || "Authentication failed");
        setIsPending(false);
        return;
      }

      router.push(result.redirectTo || "/admin");
      router.refresh();
    } catch {
      setError("An unexpected network anomaly occurred.");
      setIsPending(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--realm-bg)] p-4">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--realm-amber)]/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--realm-text-muted)] transition-colors hover:text-[var(--realm-amber)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Public Realm</span>
        </Link>

        <Card className="border-[var(--realm-border-light)] shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--realm-amber)]/50 bg-[var(--realm-bg-surface)] shadow-md">
              <Shield className="h-6 w-6 text-[var(--realm-amber)]" />
            </div>
            <CardTitle className="text-xl tracking-wide">Sanctuary Gate</CardTitle>
            <CardDescription className="text-xs">
              Authenticate with administrative credentials to access CMS controls.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email"
                  className="font-mono text-xs tracking-wider text-[var(--realm-text-primary)] uppercase"
                >
                  Admin Identifier
                </label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="admin@indie-realm.io"
                  required
                  defaultValue="admin@indie-realm.io"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="admin-password"
                  className="font-mono text-xs tracking-wider text-[var(--realm-text-primary)] uppercase"
                >
                  Master Cipher
                </label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  required
                  disabled={isPending}
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isPending}
                className="mt-4 w-full gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Cipher...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    <span>Enter Sanctuary</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 border-t border-[var(--realm-border)]/50 pt-4 text-center font-mono text-[11px] text-[var(--realm-text-muted)]">
            <div className="flex items-center justify-center gap-1.5 text-[var(--realm-amber)]">
              <Lock className="h-3 w-3" />
              <span>STRICT SESSION RESTRICTION</span>
            </div>
            <p>
              Public registration is disabled. Unauthorized intrusion attempts are permanently
              logged.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
