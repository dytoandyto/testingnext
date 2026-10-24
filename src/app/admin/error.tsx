"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Sanctuary admin error caught:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg space-y-6 p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--realm-clay)]/50 bg-[var(--realm-bg-card)]">
        <ShieldAlert className="h-7 w-7 text-[var(--realm-clay)]" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-[var(--realm-text-primary)]">
          Sanctuary Gateway Exception
        </h2>
        <p className="text-xs text-[var(--realm-text-secondary)]">
          An error prevented processing the administrative request.
        </p>
      </div>

      {error.digest && (
        <div className="rounded border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-2 font-mono text-[10px] text-[var(--realm-text-muted)]">
          DIGEST: {error.digest}
        </div>
      )}

      <Button variant="primary" onClick={() => reset()} className="mx-auto gap-2">
        <RotateCcw className="h-4 w-4" />
        <span>Retry Directive</span>
      </Button>
    </div>
  );
}
