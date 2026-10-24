import * as React from "react";
import { Shield, Database } from "lucide-react";

export function AdminHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="h-16 border-b border-[var(--realm-border)] bg-[var(--realm-bg)] px-6 flex items-center justify-between">
      <div>
        <h1 className="text-base font-semibold text-[var(--realm-text-primary)] tracking-wide">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-[var(--realm-text-muted)]">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] text-xs font-mono text-[var(--realm-text-secondary)]">
          <Database className="h-3 w-3 text-[var(--realm-moss-bright)]" />
          <span>NEON: CONNECTED</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] text-xs font-mono text-[var(--realm-amber)]">
          <Shield className="h-3 w-3" />
          <span>SUPERADMIN</span>
        </div>
      </div>
    </header>
  );
}
