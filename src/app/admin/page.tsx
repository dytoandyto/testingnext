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
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    { label: "Published Creations", count: "3", icon: FolderGit2, color: "text-[var(--realm-amber)]", badge: "Live" },
    { label: "Active 3D Portals", count: "5", icon: Compass, color: "text-[var(--realm-moss-bright)]", badge: "Online" },
    { label: "Pending Drafts", count: "1", icon: FileEdit, color: "text-[#e07a5f]", badge: "Unpublished" },
    { label: "Content Revisions", count: "14", icon: History, color: "text-[#9bb0be]", badge: "Restorable" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Sanctuary Control Center"
        description="Monitor system telemetry, manage bilingual publications, and configure 3D portals."
      />

      <main className="p-6 sm:p-8 space-y-8 flex-1">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--realm-text-muted)]">
                    {stat.label}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {stat.badge}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold font-mono text-[var(--realm-text-primary)]">
                      {stat.count}
                    </span>
                    <div className="p-2.5 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)]">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Directives & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Quick Content Actions</span>
                  <Activity className="h-4 w-4 text-[var(--realm-amber)]" />
                </CardTitle>
                <CardDescription>
                  Instant authoring shortcuts for newly forged projects and timeline records.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/admin/projects">
                  <div className="p-4 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] hover:border-[var(--realm-amber)] transition-colors group cursor-pointer space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--realm-text-primary)] group-hover:text-[var(--realm-amber)] transition-colors">
                        <FolderGit2 className="h-4 w-4 text-[var(--realm-amber)]" />
                        <span>Forge New Project</span>
                      </div>
                      <Plus className="h-4 w-4 text-[var(--realm-text-muted)] group-hover:text-[var(--realm-amber)]" />
                    </div>
                    <p className="text-xs text-[var(--realm-text-muted)]">
                      Create a project with bilingual case studies, stack tags, and media gallery.
                    </p>
                  </div>
                </Link>

                <Link href="/admin/media">
                  <div className="p-4 rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg-surface)] hover:border-[var(--realm-amber)] transition-colors group cursor-pointer space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--realm-text-primary)] group-hover:text-[var(--realm-amber)] transition-colors">
                        <CloudUpload className="h-4 w-4 text-[var(--realm-moss-bright)]" />
                        <span>Upload Signed Media</span>
                      </div>
                      <Plus className="h-4 w-4 text-[var(--realm-text-muted)] group-hover:text-[var(--realm-amber)]" />
                    </div>
                    <p className="text-xs text-[var(--realm-text-muted)]">
                      Secure server-signed direct Cloudinary upload with automated optimization.
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Infrastructure Health */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4 text-[var(--realm-moss-bright)]" />
                  <span>Infrastructure Status</span>
                </CardTitle>
                <CardDescription>Live connection telemetry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-[var(--realm-border)]/50">
                  <span className="text-[var(--realm-text-muted)]">POSTGRES ENGINE:</span>
                  <span className="text-[var(--realm-moss-bright)]">NEON POOLED</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--realm-border)]/50">
                  <span className="text-[var(--realm-text-muted)]">ORM LAYER:</span>
                  <span className="text-[var(--realm-text-primary)]">PRISMA V6</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--realm-border)]/50">
                  <span className="text-[var(--realm-text-muted)]">LOCALES:</span>
                  <span className="text-[var(--realm-amber)]">EN • ID (PARITY)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--realm-border)]/50">
                  <span className="text-[var(--realm-text-muted)]">MEDIA STORAGE:</span>
                  <span className="text-[var(--realm-text-primary)]">CLOUDINARY CDN</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
