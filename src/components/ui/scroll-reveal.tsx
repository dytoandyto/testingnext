"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  id?: string;
}

/**
 * ScrollReveal Component (adapted from Animate UI / Motion)
 * Smooth, restrained entrance animation for page sections and content cards.
 * Automatically disables motion translations under prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.45,
  direction = "up",
  className,
  id,
}: ScrollRevealProps) {
  const [shouldReduceMotion, setShouldReduceMotion] = React.useState(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handleChange = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  if (shouldReduceMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  const initialOffset =
    direction === "down"
      ? { opacity: 0, y: -14 }
      : direction === "left"
      ? { opacity: 0, x: 14 }
      : direction === "right"
      ? { opacity: 0, x: -14 }
      : { opacity: 0, y: 14 };

  return (
    <motion.div
      id={id}
      initial={initialOffset}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}
