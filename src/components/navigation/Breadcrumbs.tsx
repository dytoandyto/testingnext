"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { ChevronRight, Compass } from "lucide-react";
import { useTranslations } from "next-intl";

export function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  // Filter out empty segments
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 py-3 text-xs font-mono text-[var(--realm-text-muted)]"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-[var(--realm-amber)] transition-colors"
      >
        <Compass className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
        <span>{t("home")}</span>
      </Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const label =
          segment === "about"
            ? t("about")
            : segment === "projects"
            ? t("projects")
            : segment === "experience"
            ? t("experience")
            : segment === "skills"
            ? t("skills")
            : segment === "contact"
            ? t("contact")
            : segment;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3 w-3 text-[var(--realm-border-light)]" />
            {isLast ? (
              <span className="text-[var(--realm-text-primary)] font-semibold truncate max-w-[200px]">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-[var(--realm-amber)] transition-colors"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
