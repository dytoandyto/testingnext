import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Plus } from "lucide-react";

export default function AdminSkillsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Arcane Mastery & Skills Manager"
        description="Organize skill categories, proficiency levels, and engineering toolkits."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-[var(--realm-amber)]" />
            <span className="text-sm font-semibold">Skill Matrix</span>
          </div>
          <Button variant="primary" size="sm" className="gap-1.5 font-mono text-xs">
            <Plus className="h-4 w-4" />
            <span>Add Skill Node</span>
          </Button>
        </div>

        <Card className="p-6">
          <p className="text-xs text-[var(--realm-text-secondary)]">
            Skills management module initialized. Ready for category classification, ranking, and
            visual icon binding in Phase 3.
          </p>
        </Card>
      </main>
    </div>
  );
}
