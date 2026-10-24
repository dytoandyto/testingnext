import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius-tactile)] border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] px-3 py-2 text-sm text-[var(--realm-text-primary)] placeholder:text-[var(--realm-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--realm-amber)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-inner",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
