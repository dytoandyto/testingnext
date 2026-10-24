import { Skeleton } from "@/components/ui/skeleton";
import { Compass } from "lucide-react";

export default function LocaleLoading() {
  return (
    <div className="animate-in fade-in mx-auto max-w-7xl space-y-12 px-4 py-16 duration-300 sm:px-6 lg:px-8">
      {/* Loading Emblem */}
      <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--realm-amber)]/40 bg-[var(--realm-bg-card)] shadow-xl">
            <Compass className="h-8 w-8 animate-spin text-[var(--realm-amber)] [animation-duration:8s]" />
          </div>
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-[var(--realm-amber)]/20 blur-md" />
        </div>
        <div className="space-y-1 font-mono">
          <div className="text-xs font-bold tracking-widest text-[var(--realm-amber)] uppercase">
            CONJURING REALM...
          </div>
          <div className="text-[10px] text-[var(--realm-text-muted)]">
            Synchronizing astral telemetry & cache
          </div>
        </div>
      </div>

      {/* Skeletons */}
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
