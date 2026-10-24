import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderGit2, Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminProjectsPage() {
  const projects = [
    {
      id: "proj_1",
      title: "Interactive 3D Indie Portfolio CMS",
      slug: "interactive-3d-indie-portfolio",
      status: "PUBLISHED",
      locales: ["EN", "ID"],
      updatedAt: "2026-10-24",
    },
    {
      id: "proj_2",
      title: "Event-Driven Telemetry Engine",
      slug: "event-driven-telemetry-engine",
      status: "PUBLISHED",
      locales: ["EN", "ID"],
      updatedAt: "2026-10-22",
    },
    {
      id: "proj_3",
      title: "Stylized Voxel Terrain Generator",
      slug: "stylized-voxel-terrain-generator",
      status: "DRAFT",
      locales: ["EN"],
      updatedAt: "2026-10-20",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Creations & Works Manager"
        description="Author, translate, and publish project case studies and technical architectures."
      />

      <main className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-[var(--realm-amber)]" />
            <span className="text-sm font-semibold">Active Repository Records</span>
            <Badge variant="outline" className="font-mono">{projects.length} Entries</Badge>
          </div>
          <Button variant="primary" size="sm" className="gap-1.5 font-mono text-xs">
            <Plus className="h-4 w-4" />
            <span>Create New Project</span>
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--realm-border)] bg-[var(--realm-bg-surface)] text-[var(--realm-text-muted)] font-mono uppercase tracking-wider">
                <tr>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Translations</th>
                  <th className="p-4">Last Modified</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--realm-border)]/50">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-[var(--realm-bg-surface)]/50 transition-colors">
                    <td className="p-4 font-semibold text-[var(--realm-text-primary)]">
                      {proj.title}
                    </td>
                    <td className="p-4 font-mono text-[var(--realm-text-secondary)]">
                      {proj.slug}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={proj.status === "PUBLISHED" ? "moss" : "clay"}
                        className="font-mono text-[10px]"
                      >
                        {proj.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 font-mono">
                        {proj.locales.map((loc) => (
                          <span
                            key={loc}
                            className="px-1.5 py-0.5 rounded bg-[var(--realm-bg-elevated)] border border-[var(--realm-border)] text-[10px]"
                          >
                            {loc}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[var(--realm-text-muted)]">
                      {proj.updatedAt}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/en/projects/${proj.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Preview Public Page">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--realm-amber)]" title="Edit Record">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--realm-clay)]" title="Archive / Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
