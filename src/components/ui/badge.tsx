import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-[var(--realm-border)] bg-[var(--realm-bg-elevated)] text-[var(--realm-text-primary)]",
        amber:
          "border-[var(--realm-amber)]/40 bg-[var(--realm-amber)]/10 text-[var(--realm-amber)]",
        moss:
          "border-[var(--realm-moss-bright)]/40 bg-[var(--realm-moss)]/20 text-[#7ec7a2]",
        clay:
          "border-[var(--realm-clay)]/40 bg-[var(--realm-clay)]/10 text-[#f3987f]",
        outline:
          "border-[var(--realm-border)] text-[var(--realm-text-secondary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
