import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getSkillCategoriesAdminAction } from "@/actions/skill-actions";
import { SkillManager } from "@/components/admin/SkillManager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const categories = await getSkillCategoriesAdminAction();

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Arcane Mastery & Skills Manager"
        description="Organize skill categories, proficiency levels, and engineering toolkits."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <SkillManager initialCategories={categories as any} />
      </main>
    </div>
  );
}
