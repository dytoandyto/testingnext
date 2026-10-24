import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getProjectsAdminAction } from "@/actions/project-actions";
import { ProjectManager } from "@/components/admin/ProjectManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjectsAdminAction();

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Creations & Works Manager"
        description="Author, translate, and publish project case studies and technical architectures."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <ProjectManager initialProjects={projects as any} />
      </main>
    </div>
  );
}
