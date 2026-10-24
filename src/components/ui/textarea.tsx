import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-[var(--radius-tactile)] border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] px-3 py-2 text-sm text-[var(--realm-text-primary)] placeholder:text-[var(--realm-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--realm-amber)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-inner resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
