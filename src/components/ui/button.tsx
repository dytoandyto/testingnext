import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-tactile)] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--realm-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--realm-bg)] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--realm-amber)] text-[#0d131a] font-semibold border border-[#eab75c] shadow-[0_2px_0_#9f6c18,0_4px_12px_rgba(217,155,56,0.25)] hover:bg-[var(--realm-amber-glow)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#9f6c18]",
        secondary:
          "bg-[var(--realm-bg-elevated)] text-[var(--realm-text-primary)] border border-[var(--realm-border)] shadow-[0_2px_0_#131b24] hover:bg-[#27374a] hover:border-[var(--realm-border-light)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none",
        outline:
          "border border-[var(--realm-border)] bg-transparent text-[var(--realm-text-primary)] hover:bg-[var(--realm-bg-surface)] hover:border-[var(--realm-border-light)]",
        ghost:
          "text-[var(--realm-text-secondary)] hover:bg-[var(--realm-bg-surface)] hover:text-[var(--realm-text-primary)]",
        destructive:
          "bg-[var(--realm-clay)] text-white border border-[#dd6748] shadow-[0_2px_0_#8c361e] hover:bg-[#d66849] active:translate-y-0.5 active:shadow-none",
        link:
          "text-[var(--realm-amber)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
