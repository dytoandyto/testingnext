import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, KeyRound, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--realm-bg)] relative">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[var(--realm-amber)]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--realm-text-muted)] hover:text-[var(--realm-amber)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Public Realm</span>
        </Link>

        <Card className="border-[var(--realm-border-light)] shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--realm-bg-surface)] border border-[var(--realm-amber)]/50 shadow-md">
              <Shield className="h-6 w-6 text-[var(--realm-amber)]" />
            </div>
            <CardTitle className="text-xl tracking-wide">Sanctuary Gate</CardTitle>
            <CardDescription className="text-xs">
              Authenticate with administrative credentials to access CMS controls.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--realm-text-primary)]">
                  Admin Identifier
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="admin@indie-realm.io"
                    required
                    defaultValue="admin@indie-realm.io"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--realm-text-primary)]">
                  Master Cipher
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="w-full gap-2 mt-4"
              >
                <KeyRound className="h-4 w-4" />
                <span>Enter Sanctuary</span>
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 text-center text-[11px] font-mono text-[var(--realm-text-muted)] border-t border-[var(--realm-border)]/50 pt-4">
            <div className="flex items-center gap-1.5 justify-center text-[var(--realm-amber)]">
              <Lock className="h-3 w-3" />
              <span>STRICT SESSION RESTRICTION</span>
            </div>
            <p>Public registration is disabled. Unauthorized intrusion attempts are permanently logged.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
