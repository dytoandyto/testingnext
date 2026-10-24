import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-xs font-semibold tracking-wide uppercase font-mono text-[var(--realm-text-secondary)] flex items-center gap-1",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-[var(--realm-clay)]">*</span>}
    </label>
  );
}
