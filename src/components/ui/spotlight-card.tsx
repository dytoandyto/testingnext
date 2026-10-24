"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

/**
 * Spotlight Card Component (adapted from 21st.dev / React Bits)
 * Renders an atmospheric cursor-following radial light beam across borders and surfaces.
 * Built purely with CSS variables and standard mouse events; completely accessible.
 */
export function SpotlightCard({
  children,
  spotlightColor = "rgba(217, 155, 56, 0.15)",
  className,
  ...props
}: SpotlightCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--spotlight-x", `${x}px`);
    cardRef.current.style.setProperty("--spotlight-y", `${y}px`);
    cardRef.current.style.setProperty("--spotlight-opacity", "1");
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.setProperty("--spotlight-opacity", "0");
    }
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] transition-colors hover:border-[var(--realm-border-light)]",
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Beam */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at var(--spotlight-x, 0px) var(--spotlight-y, 0px), ${spotlightColor}, transparent 45%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
