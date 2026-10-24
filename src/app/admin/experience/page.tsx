import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getExperiencesAdminAction } from "@/actions/experience-actions";
import { ExperienceManager } from "@/components/admin/ExperienceManager";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await getExperiencesAdminAction();

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Expeditions & Career Manager"
        description="Maintain verifiable professional roles, leadership achievements, and education history."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <ExperienceManager initialExperiences={experiences as any} />
      </main>
    </div>
  );
}
