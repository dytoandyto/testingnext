import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full rounded-md border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] px-3 py-2 text-sm text-[var(--realm-text-primary)] shadow-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--realm-amber)] focus-visible:border-[var(--realm-amber)]",
            "disabled:cursor-not-allowed disabled:opacity-50 appearance-none font-sans",
            error && "border-[var(--realm-clay)] focus-visible:ring-[var(--realm-clay)]",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--realm-text-muted)]">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
