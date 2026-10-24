import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";

export default function AdminRevisionsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Content Revisions & Rollback Engine"
        description="Inspect point-in-time entity snapshots and restore previous revisions with one click."
      />

      <main className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[var(--realm-amber)]" />
          <span className="text-sm font-semibold">Snapshot History</span>
        </div>

        <Card className="p-6 space-y-4">
          <p className="text-xs text-[var(--realm-text-secondary)]">
            Every update to projects, experiences, and scene configurations generates a Zod-validated JSON snapshot in the `ContentRevision` table, allowing safe and lossless rollbacks.
          </p>
        </Card>
      </main>
    </div>
  );
}
