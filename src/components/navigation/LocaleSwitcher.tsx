"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();

  const toggleLocale = (nextLocale: "en" | "id") => {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-1 font-mono text-xs shadow-inner",
        className
      )}
      role="group"
      aria-label="Language Selector"
    >
      <div className="flex items-center px-1.5 text-[var(--realm-text-muted)]">
        <Globe className="h-3.5 w-3.5" />
      </div>
      <button
        onClick={() => toggleLocale("en")}
        disabled={isPending}
        className={cn(
          "cursor-pointer rounded px-2 py-1 transition-all",
          locale === "en"
            ? "bg-[var(--realm-amber)] font-bold text-[#0d131a] shadow-sm"
            : "text-[var(--realm-text-secondary)] hover:text-[var(--realm-text-primary)]"
        )}
      >
        EN
      </button>
      <button
        onClick={() => toggleLocale("id")}
        disabled={isPending}
        className={cn(
          "cursor-pointer rounded px-2 py-1 transition-all",
          locale === "id"
            ? "bg-[var(--realm-amber)] font-bold text-[#0d131a] shadow-sm"
            : "text-[var(--realm-text-secondary)] hover:text-[var(--realm-text-primary)]"
        )}
      >
        ID
      </button>
    </div>
  );
}
