"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  name?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  id,
  className,
  name,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      name={name}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--realm-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--realm-bg-primary)]",
        checked ? "bg-[var(--realm-moss)]" : "bg-[var(--realm-border)]",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[var(--realm-parchment)] shadow-lg ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5 bg-white" : "translate-x-0"
        )}
      />
    </button>
  );
}
