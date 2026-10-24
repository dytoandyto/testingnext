import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";

export default function AdminRevisionsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Content Revisions & Rollback Engine"
        description="Inspect point-in-time entity snapshots and restore previous revisions with one click."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[var(--realm-amber)]" />
          <span className="text-sm font-semibold">Snapshot History</span>
        </div>

        <Card className="space-y-4 p-6">
          <p className="text-xs text-[var(--realm-text-secondary)]">
            Every update to projects, experiences, and scene configurations generates a
            Zod-validated JSON snapshot in the `ContentRevision` table, allowing safe and lossless
            rollbacks.
          </p>
        </Card>
      </main>
    </div>
  );
}
