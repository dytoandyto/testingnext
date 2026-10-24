"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/routing";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";
import {
  Compass,
  Boxes,
  Scroll,
  Layers,
  Sparkles,
  Radio,
  Menu,
  X,
  Shield,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { href: "/", label: t("home"), icon: Compass },
    { href: "/projects", label: t("projects"), icon: Boxes },
    { href: "/about", label: t("about"), icon: Scroll },
    { href: "/experience", label: t("experience"), icon: Layers },
    { href: "/skills", label: t("skills"), icon: Sparkles },
    { href: "/contact", label: t("contact"), icon: Radio },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--realm-border)] bg-[var(--realm-bg)]/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Emblem */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group select-none cursor-pointer"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--realm-bg-card)] border border-[var(--realm-border)] shadow-[0_2px_0_#131b24] group-hover:border-[var(--realm-amber)] transition-colors">
            <span className="font-mono text-xs font-bold text-[var(--realm-amber)]">
              ◇
            </span>
            <div className="absolute -inset-0.5 rounded-lg bg-[var(--realm-amber)]/10 opacity-0 group-hover:opacity-100 transition-opacity blur-sm pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-wider text-sm text-[var(--realm-text-primary)] group-hover:text-[var(--realm-amber)] transition-colors">
              INDIE REALM
            </span>
            <span className="font-mono text-[10px] text-[var(--realm-text-muted)] tracking-tight">
              PORTFOLIO CMS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1 rounded-full border border-[var(--realm-border)] bg-[var(--realm-bg-surface)]/70 px-3 py-1 shadow-inner"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  active
                    ? "bg-[var(--realm-bg-card)] text-[var(--realm-amber)] border border-[var(--realm-border)] shadow-sm font-semibold"
                    : "text-[var(--realm-text-secondary)] hover:text-[var(--realm-text-primary)] hover:bg-[var(--realm-bg-card)]/50"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", active ? "text-[var(--realm-amber)]" : "text-[var(--realm-text-muted)]")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Mode Toggle, Locale Switcher, Admin Gateway, Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Quick 2D/3D status indicator */}
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-card)] px-2.5 py-1 text-xs font-mono text-[var(--realm-text-secondary)] hover:border-[var(--realm-amber)] hover:text-[var(--realm-amber)] transition-colors"
            title={t("world")}
          >
            <Eye className="h-3 w-3 text-[var(--realm-amber)]" />
            <span>3D WORLD</span>
          </Link>

          <LocaleSwitcher />

          {/* Admin Gateway */}
          <NextLink
            href="/admin"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] text-[var(--realm-text-muted)] hover:text-[var(--realm-amber)] hover:border-[var(--realm-amber)] transition-colors"
            title={t("admin")}
            aria-label={t("admin")}
          >
            <Shield className="h-3.5 w-3.5" />
          </NextLink>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] text-[var(--realm-text-primary)] hover:border-[var(--realm-border-light)]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--realm-border)] bg-[var(--realm-bg-card)] px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--realm-bg-surface)] text-[var(--realm-amber)] border border-[var(--realm-border)]"
                    : "text-[var(--realm-text-secondary)] hover:bg-[var(--realm-bg-surface)] hover:text-[var(--realm-text-primary)]"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-[var(--realm-amber)]" : "text-[var(--realm-text-muted)]")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
