"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Compass } from "lucide-react";
import Link from "next/link";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Runtime realm error caught:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--realm-clay)]/50 bg-[var(--realm-bg-card)] shadow-xl">
        <AlertTriangle className="h-8 w-8 text-[var(--realm-clay)]" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--realm-text-primary)]">
          An Ethereal Anomaly Occurred
        </h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--realm-text-secondary)]">
          The connection to this realm sector was disrupted. Our astral relays have recorded the
          anomaly.
        </p>
      </div>

      {error.digest && (
        <div className="inline-block rounded-md border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] px-3 py-1 font-mono text-[11px] text-[var(--realm-text-muted)]">
          ERROR DIGEST: {error.digest}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Button variant="primary" onClick={() => reset()} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          <span>Attempt Reconnection</span>
        </Button>
        <Link href="/">
          <Button variant="secondary" className="gap-2">
            <Compass className="h-4 w-4" />
            <span>Return to Realm Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
