import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus } from "lucide-react";

export default function AdminExperiencePage() {
  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Expeditions & Career Manager"
        description="Maintain verifiable professional roles, leadership achievements, and education history."
      />

      <main className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[var(--realm-amber)]" />
            <span className="text-sm font-semibold">Timeline Entries</span>
          </div>
          <Button variant="primary" size="sm" className="gap-1.5 font-mono text-xs">
            <Plus className="h-4 w-4" />
            <span>Add Career Epoch</span>
          </Button>
        </div>

        <Card className="p-6">
          <p className="text-xs text-[var(--realm-text-secondary)]">
            Experience management module initialized. Full CRUD actions and drag-and-drop chronological sorting will connect with Prisma in Phase 3.
          </p>
        </Card>
      </main>
    </div>
  );
}
