"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Wrench,
  Image as ImageIcon,
  Compass,
  Palette,
  History,
  ShieldAlert,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/world", label: "3D World & Portals", icon: Compass },
  { href: "/admin/theme", label: "Theme & Tokens", icon: Palette },
  { href: "/admin/revisions", label: "Revisions", icon: History },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ShieldAlert },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  // Do not render sidebar on login screen
  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <aside className="w-64 border-r border-[var(--realm-border)] bg-[var(--realm-bg-surface)] flex flex-col min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--realm-border)] justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--realm-bg-card)] border border-[var(--realm-amber)] text-[var(--realm-amber)] font-mono text-xs font-bold">
            ⚔
          </div>
          <span className="font-semibold text-sm tracking-wider text-[var(--realm-text-primary)]">
            SANCTUARY CMS
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[var(--realm-text-muted)]">
          Content & World Management
        </div>
        {adminNavItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                isActive
                  ? "bg-[var(--realm-bg-card)] text-[var(--realm-amber)] border border-[var(--realm-border)] shadow-sm font-semibold"
                  : "text-[var(--realm-text-secondary)] hover:bg-[var(--realm-bg-card)] hover:text-[var(--realm-text-primary)]"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-[var(--realm-amber)]" : "text-[var(--realm-text-muted)]"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions: View Live Site & Logout */}
      <div className="p-3 border-t border-[var(--realm-border)] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[var(--realm-text-secondary)] hover:bg-[var(--realm-bg-card)] hover:text-[var(--realm-text-primary)] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
            <span>Open Public Realm</span>
          </span>
          <span className="text-[10px] font-mono text-[var(--realm-text-muted)]">↗</span>
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--realm-clay)] hover:bg-[var(--realm-clay)]/10 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit Sanctuary</span>
        </Link>
      </div>
    </aside>
  );
}
