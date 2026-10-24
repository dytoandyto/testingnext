import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-[var(--radius-tactile)] border p-4 text-xs [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--realm-bg-card)] border-[var(--realm-border)] text-[var(--realm-text-primary)] shadow-md",
        amber:
          "bg-[var(--realm-amber)]/10 border-[var(--realm-amber)]/40 text-[var(--realm-amber-glow)] [&>svg]:text-[var(--realm-amber)]",
        moss: "bg-[var(--realm-moss)]/20 border-[var(--realm-moss-bright)]/40 text-[#7ec7a2] [&>svg]:text-[var(--realm-moss-bright)]",
        destructive:
          "bg-[var(--realm-clay)]/15 border-[var(--realm-clay)]/40 text-[#f3987f] [&>svg]:text-[var(--realm-clay)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 text-sm leading-none font-semibold tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs leading-relaxed text-[var(--realm-text-secondary)]", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";
