import * as React from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  text?: string;
  className?: string;
}

/**
 * ShinyText Component (adapted from React Bits / 21st.dev)
 * Adds an ethereal, restrained shimmer across key text elements and badges.
 */
export function ShinyText({ children, text, className, ...props }: ShinyTextProps) {
  return (
    <span className={cn("shiny-text", className)} {...props}>
      {children ?? text}
    </span>
  );
}
