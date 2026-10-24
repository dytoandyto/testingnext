import * as React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-tactile)] border border-[var(--realm-border)]/50 bg-[var(--realm-bg-elevated)]",
        className
      )}
      {...props}
    />
  );
}
