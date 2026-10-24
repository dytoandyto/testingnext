import * as React from "react";
import { Shield, Database } from "lucide-react";

export function AdminHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--realm-border)] bg-[var(--realm-bg)] px-6">
      <div>
        <h1 className="text-base font-semibold tracking-wide text-[var(--realm-text-primary)]">
          {title}
        </h1>
        {description && <p className="text-xs text-[var(--realm-text-muted)]">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-md border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] px-2.5 py-1 font-mono text-xs text-[var(--realm-text-secondary)]">
          <Database className="h-3 w-3 text-[var(--realm-moss-bright)]" />
          <span>NEON: CONNECTED</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] px-2.5 py-1 font-mono text-xs text-[var(--realm-amber)]">
          <Shield className="h-3 w-3" />
          <span>SUPERADMIN</span>
        </div>
      </div>
    </header>
  );
}
