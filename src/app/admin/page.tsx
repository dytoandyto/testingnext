import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FolderGit2,
  Compass,
  FileEdit,
  History,
  Activity,
  Plus,
  Database,
  CloudUpload,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Direct database telemetry
  const [publishedProjects, activePortals, pendingDrafts, totalRevisions, recentAudits] =
    await Promise.all([
      db.project.count({ where: { status: "PUBLISHED" } }),
      db.worldPortal.count({ where: { active: true } }),
      db.project.count({ where: { status: "DRAFT" } }),
      db.contentRevision.count(),
      db.auditLog.findMany({
        take: 6,
        orderBy: { timestamp: "desc" },
        include: {
          actor: {
            select: { email: true, name: true },
          },
        },
      }),
    ]);

  const stats = [
    {
      label: "Published Creations",
      count: publishedProjects,
      icon: FolderGit2,
      color: "text-[var(--realm-amber)]",
      badge: "Live",
      href: "/admin/projects",
    },
    {
      label: "Active 3D Portals",
      count: activePortals,
      icon: Compass,
      color: "text-[var(--realm-moss-bright)]",
      badge: "Online",
      href: "/admin/world",
    },
    {
      label: "Pending Drafts",
      count: pendingDrafts,
      icon: FileEdit,
      color: "text-[#e07a5f]",
      badge: "Unpublished",
      href: "/admin/projects",
    },
    {
      label: "Content Revisions",
      count: totalRevisions,
      icon: History,
      color: "text-[#9bb0be]",
      badge: "Restorable",
      href: "/admin/revisions",
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Sanctuary Control Center"
        description="Monitor system telemetry, manage bilingual publications, and configure 3D portals."
      />

      <main className="flex-1 space-y-8 p-6 sm:p-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href}>
                <Card className="transition-all hover:border-[var(--realm-amber)]/60 cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <span className="font-mono text-xs tracking-wider text-[var(--realm-text-muted)] uppercase">
                      {stat.label}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {stat.badge}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-3xl font-bold text-[var(--realm-text-primary)]">
                        {stat.count}
                      </span>
                      <div className="rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-2.5">
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Directives & System Status */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Quick Content Actions</span>
                  <Activity className="h-4 w-4 text-[var(--realm-amber)]" />
                </CardTitle>
                <CardDescription>
                  Instant authoring shortcuts for newly forged projects and timeline records.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link href="/admin/projects">
                  <div className="group cursor-pointer space-y-2 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-4 transition-colors hover:border-[var(--realm-amber)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--realm-text-primary)] transition-colors group-hover:text-[var(--realm-amber)]">
                        <FolderGit2 className="h-4 w-4 text-[var(--realm-amber)]" />
                        <span>Manage Projects</span>
                      </div>
                      <Plus className="h-4 w-4 text-[var(--realm-text-muted)] group-hover:text-[var(--realm-amber)]" />
                    </div>
                    <p className="text-xs text-[var(--realm-text-muted)]">
                      Create, edit, publish, or archive bilingual project case studies and stack tags.
                    </p>
                  </div>
                </Link>

                <Link href="/admin/media">
                  <div className="group cursor-pointer space-y-2 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-4 transition-colors hover:border-[var(--realm-amber)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--realm-text-primary)] transition-colors group-hover:text-[var(--realm-amber)]">
                        <CloudUpload className="h-4 w-4 text-[var(--realm-moss-bright)]" />
                        <span>Media Vault</span>
                      </div>
                      <Plus className="h-4 w-4 text-[var(--realm-text-muted)] group-hover:text-[var(--realm-amber)]" />
                    </div>
                    <p className="text-xs text-[var(--realm-text-muted)]">
                      Upload signed media assets and inspect references across projects.
                    </p>
                  </div>
                </Link>

                <Link href="/admin/experience">
                  <div className="group cursor-pointer space-y-2 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-4 transition-colors hover:border-[var(--realm-amber)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--realm-text-primary)] transition-colors group-hover:text-[var(--realm-amber)]">
                        <Compass className="h-4 w-4 text-[#e07a5f]" />
                        <span>Career & Education</span>
                      </div>
                      <Plus className="h-4 w-4 text-[var(--realm-text-muted)] group-hover:text-[var(--realm-amber)]" />
                    </div>
                    <p className="text-xs text-[var(--realm-text-muted)]">
                      Maintain chronological expeditions and bilingual highlight achievements.
                    </p>
                  </div>
                </Link>

                <Link href="/admin/world">
                  <div className="group cursor-pointer space-y-2 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] p-4 transition-colors hover:border-[var(--realm-amber)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--realm-text-primary)] transition-colors group-hover:text-[var(--realm-amber)]">
                        <Compass className="h-4 w-4 text-[var(--realm-parchment)]" />
                        <span>3D World & Portals</span>
                      </div>
                      <Plus className="h-4 w-4 text-[var(--realm-text-muted)] group-hover:text-[var(--realm-amber)]" />
                    </div>
                    <p className="text-xs text-[var(--realm-text-muted)]">
                      Adjust lighting, atmospheric fog, and interactive diorama portal coordinates.
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Audit Feed */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-[var(--realm-amber)]" />
                    <span>Recent Administrative Activity</span>
                  </CardTitle>
                  <CardDescription>Immutable audit trail of recent modifications</CardDescription>
                </div>
                <Link
                  href="/admin/audit-logs"
                  className="font-mono text-xs text-[var(--realm-amber)] hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent>
                {recentAudits.length === 0 ? (
                  <p className="text-xs text-[var(--realm-text-muted)] py-4 text-center">
                    No administrative actions recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentAudits.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between border-b border-[var(--realm-border)]/50 pb-2 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-[10px]">
                              {log.action}
                            </Badge>
                            <span className="font-medium text-[var(--realm-text-primary)]">
                              {log.entityType}
                            </span>
                            {log.entityId && (
                              <span className="font-mono text-[10px] text-[var(--realm-text-muted)]">
                                ({log.entityId.slice(0, 8)})
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[var(--realm-text-muted)]">
                            By {log.actor?.email || "System"} • IP: {log.ipHash}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[var(--realm-text-muted)]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Infrastructure Health */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Database className="h-4 w-4 text-[var(--realm-moss-bright)]" />
                  <span>Infrastructure Status</span>
                </CardTitle>
                <CardDescription>Live connection telemetry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                  <span className="text-[var(--realm-text-muted)]">POSTGRES ENGINE:</span>
                  <span className="text-[var(--realm-moss-bright)]">NEON POOLED</span>
                </div>
                <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                  <span className="text-[var(--realm-text-muted)]">ORM LAYER:</span>
                  <span className="text-[var(--realm-text-primary)]">PRISMA V6</span>
                </div>
                <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                  <span className="text-[var(--realm-text-muted)]">LOCALES:</span>
                  <span className="text-[var(--realm-amber)]">EN • ID (PARITY)</span>
                </div>
                <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                  <span className="text-[var(--realm-text-muted)]">MEDIA VAULT:</span>
                  <span className="text-[var(--realm-text-primary)]">CLOUDINARY / S3</span>
                </div>
                <div className="flex justify-between border-b border-[var(--realm-border)]/50 py-1">
                  <span className="text-[var(--realm-text-muted)]">AUTH ENGINE:</span>
                  <span className="text-[var(--realm-moss-bright)]">NEXTAUTH V5</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
