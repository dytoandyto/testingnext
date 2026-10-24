import { Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="animate-in fade-in space-y-8 p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--realm-amber)]/40 bg-[var(--realm-bg-card)]">
          <Shield className="h-5 w-5 animate-pulse text-[var(--realm-amber)]" />
        </div>
        <div>
          <div className="font-mono text-xs font-bold text-[var(--realm-amber)]">
            ACCESSING SANCTUARY...
          </div>
          <div className="text-[10px] text-[var(--realm-text-muted)]">
            Verifying cryptographic credentials and telemetry
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>

      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}
